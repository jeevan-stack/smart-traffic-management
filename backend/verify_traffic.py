import urllib.request
import json

# GET /api/traffic (default limit=100)
r = urllib.request.urlopen("http://localhost:8000/api/traffic")
data = json.loads(r.read())
rec = data["records"][0]
print(f"[4] GET /api/traffic -> HTTP 200")
print(f"    total_matches  : {data['total_matches']}")
print(f"    records_returned: {len(data['records'])} (limit=100)")
print(f"    Sample record:")
print(f"      junction_name   : {rec['junction_name']}")
print(f"      congestion_status: {rec['congestion_status']}")
print(f"      average_speed   : {rec['average_speed']} km/h")
print(f"      vehicle_volume  : {rec['vehicle_volume']} veh/h")
print(f"      estimated_delay : {rec['estimated_delay']} mins")
print(f"      data_source     : {rec['data_source']}")
print(f"    Applied filters: {data['applied_filters']}")
