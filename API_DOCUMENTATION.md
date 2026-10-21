# API_DOCUMENTATION.md — Smart Traffic Management System (STMS)
## REST API Contract Specification • Team RouteX

### Base URL
* Local Development: `http://localhost:8000`
* Interactive OpenAPI Documentation: `http://localhost:8000/docs`
* ReDoc Specification: `http://localhost:8000/redoc`

All endpoints return JSON responses. Errors use standard HTTP status codes and provide structured error objects:
```json
{
  "detail": "Descriptive error message"
}
```

---

### 1. Health Check Endpoint
* **Method & Path:** `GET /api/health`
* **Purpose:** Heartbeat and data availability check for frontend integration.
* **Response Status:** `200 OK`
* **Response Schema:**
```json
{
  "status": "healthy",
  "data_loaded": true,
  "record_count": 192,
  "simulation_notice": "All data is simulated demo data for academic decision support."
}
```

---

### 2. Junction Catalog Endpoint
* **Method & Path:** `GET /api/junctions`
* **Purpose:** Retrieves the list of monitored junctions/corridors for populating filter controls.
* **Response Status:** `200 OK`
* **Response Schema:** Array of Junction objects:
```json
[
  {
    "junction_id": "J-01",
    "junction_name": "MG Road Central Corridor",
    "sector": "Central Business District",
    "capacity": 1800
  },
  {
    "junction_id": "J-02",
    "junction_name": "Outer Ring Road (North)",
    "sector": "IT & Tech Corridor",
    "capacity": 2500
  }
]
```

---

### 3. Traffic Observations Endpoint
* **Method & Path:** `GET /api/traffic`
* **Purpose:** Fetches traffic observation records with multi-parameter filtering.
* **Query Parameters:**
  | Parameter | Type | Required | Description | Example |
  | :--- | :--- | :---: | :--- | :--- |
  | `junction_id` | String | No | Filter by specific junction code | `J-01` |
  | `status` | String | No | Filter by congestion status (`Clear`, `Moderate`, `Heavy`) | `Heavy` |
  | `start_time` | String | No | ISO-8601 start datetime filter | `2026-10-18T08:00:00` |
  | `end_time` | String | No | ISO-8601 end datetime filter | `2026-10-18T20:00:00` |
  | `limit` | Integer | No | Max records to return (Default: `100`, Max: `500`) | `50` |
* **Response Status:** `200 OK`
* **Response Schema:**
```json
{
  "total_matches": 24,
  "applied_filters": {
    "junction_id": "J-01",
    "status": "Heavy",
    "start_time": null,
    "end_time": null
  },
  "records": [
    {
      "observation_id": 101,
      "timestamp": "2026-10-18T08:00:00",
      "junction_id": "J-01",
      "junction_name": "MG Road Central Corridor",
      "sector": "Central Business District",
      "vehicle_volume": 1650,
      "average_speed": 14.8,
      "estimated_delay": 22,
      "congestion_status": "Heavy",
      "volume_to_capacity": 0.92
    }
  ]
}
```

---

### 4. Traffic Summary Endpoint
* **Method & Path:** `GET /api/traffic/summary`
* **Purpose:** Computes high-level aggregate metrics across the filtered subset so cards, charts, and tables remain strictly consistent.
* **Query Parameters:** Identical to `GET /api/traffic` (`junction_id`, `status`, `start_time`, `end_time`).
* **Response Status:** `200 OK`
* **Response Schema:**
```json
{
  "total_observations": 192,
  "total_volume": 218400,
  "average_speed_kmh": 36.8,
  "average_delay_mins": 9.4,
  "congested_count": 48,
  "peak_corridor": {
    "junction_id": "J-02",
    "junction_name": "Outer Ring Road (North)",
    "peak_volume": 2420,
    "timestamp": "2026-10-18T18:00:00"
  },
  "status_distribution": {
    "Clear": 82,
    "Moderate": 62,
    "Heavy": 48
  }
}
```

---

### 5. Congestion Hotspots Endpoint
* **Method & Path:** `GET /api/traffic/hotspots`
* **Purpose:** Identifies junctions with the highest frequency of congestion or lowest average speeds.
* **Query Parameters:**
  | Parameter | Type | Required | Description | Default |
  | :--- | :--- | :---: | :--- | :--- |
  | `limit` | Integer | No | Number of top hotspots to return | `5` |
* **Response Status:** `200 OK`
* **Response Schema:**
```json
[
  {
    "junction_id": "J-07",
    "junction_name": "Hosur Road Junction",
    "sector": "South Sector",
    "heavy_observations_count": 14,
    "average_speed_kmh": 18.2,
    "max_delay_mins": 28
  }
]
```

---

### 6. Error Responses
* **400 Bad Request:** If an invalid timestamp format is provided.
```json
{
  "detail": "Invalid start_time format. Expected ISO-8601 (e.g. 2026-10-18T08:00:00)."
}
```
* **404 Not Found:** If a requested resource does not exist.
```json
{
  "detail": "Junction 'J-99' not found in observation catalog."
}
```
