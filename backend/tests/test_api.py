"""
Automated Test Suite for Smart Traffic Management System API
Team RouteX • pytest suite
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_root_endpoint():
    """Verify root endpoint returns system identity and notice."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Smart Traffic Management System" in data["system"]
    assert "Team RouteX" in data["team"]
    assert "simulation_notice" in data

def test_health_endpoint():
    """Verify health endpoint reports healthy and loaded data count."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["data_loaded"] is True
    assert data["record_count"] == 192

def test_junctions_endpoint():
    """Verify junctions list returns all 8 monitored urban junctions."""
    response = client.get("/api/junctions")
    assert response.status_code == 200
    junctions = response.json()
    assert len(junctions) == 8
    j_ids = [j["junction_id"] for j in junctions]
    assert "J-01" in j_ids
    assert "J-02" in j_ids
    assert "J-07" in j_ids

def test_traffic_observations_default():
    """Verify default traffic list returns all 192 observations."""
    response = client.get("/api/traffic")
    assert response.status_code == 200
    data = response.json()
    assert data["total_matches"] == 192
    assert len(data["records"]) == 192
    first = data["records"][0]
    assert "observation_id" in first
    assert "junction_name" in first
    assert "congestion_status" in first
    assert first["congestion_status"] in ["Clear", "Moderate", "Heavy"]

def test_traffic_filter_junction():
    """Verify filtering by junction_id returns only that junction's records."""
    response = client.get("/api/traffic?junction_id=J-01")
    assert response.status_code == 200
    data = response.json()
    assert data["total_matches"] == 24  # 24 hourly observations for J-01
    for r in data["records"]:
        assert r["junction_id"] == "J-01"

def test_traffic_filter_status():
    """Verify filtering by status returns only records matching that status."""
    response = client.get("/api/traffic?status=Heavy")
    assert response.status_code == 200
    data = response.json()
    assert data["total_matches"] > 0
    for r in data["records"]:
        assert r["congestion_status"] == "Heavy"
        assert r["average_speed"] < 25.0  # Verification of threshold rule

def test_traffic_filter_invalid_status():
    """Verify invalid status filter returns 400 Bad Request."""
    response = client.get("/api/traffic?status=SuperFast")
    assert response.status_code == 400
    assert "Invalid status filter" in response.json()["detail"]

def test_traffic_summary():
    """Verify summary calculations match observation count and distribution."""
    response = client.get("/api/traffic/summary")
    assert response.status_code == 200
    summary = response.json()
    assert summary["total_observations"] == 192
    assert summary["total_volume"] > 0
    assert summary["average_speed_kmh"] > 0
    assert summary["congested_count"] > 0
    dist = summary["status_distribution"]
    assert dist["Clear"] + dist["Moderate"] + dist["Heavy"] == 192
    assert summary["peak_corridor"] is not None

def test_traffic_hotspots():
    """Verify hotspot endpoint returns top congested junctions."""
    response = client.get("/api/traffic/hotspots?limit=5")
    assert response.status_code == 200
    hotspots = response.json()
    assert len(hotspots) == 5
    for h in hotspots:
        assert "junction_name" in h
        assert "heavy_observations_count" in h
        assert "average_speed_kmh" in h

# ==============================================================================
# Route Comparison Tests (Features 5 & 6)
# ==============================================================================

def test_route_compare_valid_multiple_alternatives():
    """Verify alternative routes are discovered and evaluated between J-01 and J-06."""
    payload = {"source_junction_id": "J-01", "destination_junction_id": "J-06"}
    response = client.post("/api/routes/compare", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["source"]["junction_id"] == "J-01"
    assert data["destination"]["junction_id"] == "J-06"
    assert len(data["routes"]) >= 2  # Multiple alternative corridors exist
    assert data["recommended_route_id"] is not None
    assert "Recommended" in data["recommendation_reason"]

    # Check structure of routes
    for route in data["routes"]:
        assert route["total_distance_km"] > 0
        assert route["estimated_time_mins"] > 0
        assert route["average_speed_kmh"] > 0
        assert route["congestion_status"] in ["Clear", "Moderate", "Heavy"]
        assert len(route["segments"]) > 0

    # Verify that recommended route has is_recommended == True and matches recommended_route_id
    rec_route = next(r for r in data["routes"] if r["route_id"] == data["recommended_route_id"])
    assert rec_route["is_recommended"] is True
    # The recommended route has the minimum or near-minimum travel time
    assert rec_route["estimated_time_mins"] <= min(r["estimated_time_mins"] for r in data["routes"])

def test_route_compare_same_source_and_destination():
    """Verify 400 Bad Request when source and destination are identical."""
    payload = {"source_junction_id": "J-01", "destination_junction_id": "J-01"}
    response = client.post("/api/routes/compare", json=payload)
    assert response.status_code == 400
    assert "cannot be the same" in response.json()["detail"]

def test_route_compare_invalid_junction_id():
    """Verify 400 Bad Request when an invalid junction ID is provided."""
    payload = {"source_junction_id": "J-99", "destination_junction_id": "J-01"}
    response = client.post("/api/routes/compare", json=payload)
    assert response.status_code == 400
    assert "Unknown source junction ID" in response.json()["detail"]

def test_route_compare_empty_ids():
    """Verify 400 Bad Request when junction IDs are empty."""
    payload = {"source_junction_id": "", "destination_junction_id": "J-06"}
    response = client.post("/api/routes/compare", json=payload)
    assert response.status_code == 400
    assert "required" in response.json()["detail"]
