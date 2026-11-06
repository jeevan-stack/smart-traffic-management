"""
Live verification script for POST /api/routes/compare endpoint.
Run from PBL root with the FastAPI server already running on port 8000.
"""
import urllib.request
import json

BASE = "http://localhost:8000"

def post_json(path, payload):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        BASE + path,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())

def get_json(path):
    with urllib.request.urlopen(BASE + path) as resp:
        return resp.status, json.loads(resp.read())

# Test 1: Health
status, body = get_json("/api/health")
print(f"\n[1] GET /api/health -> {status}")
print(f"    status: {body['status']}, data_loaded: {body['data_loaded']}, record_count: {body['record_count']}")

# Test 2: Valid route comparison J-01 -> J-06
status, body = post_json("/api/routes/compare", {
    "source_junction_id": "J-01",
    "destination_junction_id": "J-06"
})
print(f"\n[2] POST /api/routes/compare (J-01 -> J-06) -> HTTP {status}")
print(f"    Source:      {body['source']['junction_name']}")
print(f"    Destination: {body['destination']['junction_name']}")
print(f"    Routes found: {len(body['routes'])}")
print(f"    Recommended: {body['recommended_route_id']}")
print(f"    Reason: {body['recommendation_reason'][:100]}...")
print(f"    Simulation notice present: {'simulation_notice' in body}")
for i, r in enumerate(body["routes"], 1):
    print(f"    Route {i}: {r['route_name']}")
    print(f"      Distance: {r['total_distance_km']} km | Time: {r['estimated_time_mins']} mins | Speed: {r['average_speed_kmh']} km/h | Status: {r['congestion_status']} | Recommended: {r['is_recommended']}")
    print(f"      Junctions: {' -> '.join(r['junction_names'])}")

# Test 3: Swap J-06 -> J-01 (should give same routes, possibly different order)
status, body2 = post_json("/api/routes/compare", {
    "source_junction_id": "J-06",
    "destination_junction_id": "J-01"
})
print(f"\n[3] POST /api/routes/compare (J-06 -> J-01 SWAP) -> HTTP {status}")
print(f"    Routes found: {len(body2['routes'])}")
print(f"    First route junctions: {' -> '.join(body2['routes'][0]['junction_names'])}")

# Test 4: Same source and destination -> 400
status, body3 = post_json("/api/routes/compare", {
    "source_junction_id": "J-01",
    "destination_junction_id": "J-01"
})
print(f"\n[4] POST /api/routes/compare (same junction J-01) -> HTTP {status}")
print(f"    Detail: {body3.get('detail', 'N/A')}")

# Test 5: Invalid junction ID -> 400
status, body4 = post_json("/api/routes/compare", {
    "source_junction_id": "J-99",
    "destination_junction_id": "J-01"
})
print(f"\n[5] POST /api/routes/compare (invalid J-99) -> HTTP {status}")
print(f"    Detail: {body4.get('detail', 'N/A')}")

# Test 6: Dashboard traffic summary (all filters)
status, body5 = get_json("/api/traffic/summary")
print(f"\n[6] GET /api/traffic/summary -> HTTP {status}")
print(f"    total_obs: {body5['total_observations']}, congested_count: {body5['congested_count']}")
print(f"    avg_speed: {body5['average_speed_kmh']} km/h, avg_delay: {body5['average_delay_mins']} mins")
print(f"    dist: Clear={body5['status_distribution']['Clear']} Moderate={body5['status_distribution']['Moderate']} Heavy={body5['status_distribution']['Heavy']}")
print(f"    peak_corridor: {body5['peak_corridor']['junction_name']} ({body5['peak_corridor']['peak_volume']} veh/h)")

# Test 7: Filter by J-01 only
status, body6 = get_json("/api/traffic/summary?junction_id=J-01")
print(f"\n[7] GET /api/traffic/summary?junction_id=J-01 -> HTTP {status}")
print(f"    total_obs: {body6['total_observations']}, avg_speed: {body6['average_speed_kmh']} km/h")

print("\n=== ALL LIVE API VERIFICATION COMPLETE ===")
