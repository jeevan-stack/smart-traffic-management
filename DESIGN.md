# DESIGN.md — Smart Traffic Management System (STMS)
## Software Architecture & System Design Document • Two-Week Sprint • Team RouteX

---

## 1. System Architecture Overview

The Smart Traffic Management System uses a decoupled, two-tier client-server architecture designed for high maintainability, strict separation of concerns, and beginner-friendly academic demonstration.

```
+--------------------------------------------------------------------------+
|                            USER BROWSER                                  |
|                                                                          |
|   +------------------------------------------------------------------+   |
|   |             React 18 + TypeScript + Vite + Tailwind CSS          |   |
|   |  - Summary Cards (Total Vol, Congested Count, Avg Speed, etc.)   |   |
|   |  - Interactive Multi-Filter Controls (Junction, Date, Status)     |   |
|   |  - Corridor Observation Data Table with Status Pills             |   |
|   |  - Trend Charts & Congestion Hotspots Widgets                    |   |
|   |  - State Handling (Loading, Error, Empty State, Sim Notice)      |   |
|   +---------------------------------+--------------------------------+   |
+-------------------------------------|------------------------------------+
                                      | HTTP REST / JSON
                                      | (e.g. GET /api/observations?junction=...)
                                      v
+--------------------------------------------------------------------------+
|                           FASTAPI BACKEND                                |
|                                                                          |
|   +------------------------------------------------------------------+   |
|   |                        FastAPI Router                            |   |
|   |     /api/health | /api/junctions | /api/observations | /api/summary|   |
|   +---------------------------------+--------------------------------+   |
|                                     | Pydantic Models & DTOs             |
|                                     v                                    |
|   +------------------------------------------------------------------+   |
|   |                       Data Service Layer                         |   |
|   |  - Pandas Filtering, Slicing, GroupBy, and Aggregations         |   |
|   |  - Data Quality Pipeline (Deduplication, Imputation, Validation) |   |
|   +---------------------------------+--------------------------------+   |
|                                     |                                    |
|                                     v                                    |
|   +------------------------------------------------------------------+   |
|   |                   Data Source / Storage                          |   |
|   |        `backend/data/traffic_observations.csv`                   |   |
|   |     (Optional fallback: SQLite if persistent state needed)       |   |
|   +------------------------------------------------------------------+   |
+--------------------------------------------------------------------------+
```

---

## 2. Directory Structure & Separation of Concerns

To avoid accidental cross-contamination and preserve the working starter prototype, the repository uses a clean directory layout:

```
PBL/
├── .gitignore                     # Git exclusion rules for node, python, secrets
├── DEVELOPMENT_PLAN.md            # 14-day Agile roadmap & honest status tracker
├── REQUIREMENTS.md                # Functional, non-functional & data requirements
├── DESIGN.md                      # System architecture, API contract & models
├── README.md                      # Project landing page & run instructions
│
├── index.html                     # [Preserved] Starter prototype HTML
├── style.css                      # [Preserved] Starter prototype CSS
├── script.js                      # [Preserved] Starter prototype JS
│
├── backend/                       # Python FastAPI Backend
│   ├── .venv/                     # Python virtual environment (ignored in git)
│   ├── requirements.txt           # fastapi, uvicorn, pandas, pydantic
│   ├── data/
│   │   ├── traffic_observations.csv # Documented sample CSV dataset
│   │   └── data_dictionary.md       # Source, units, and column definitions
│   └── app/
│       ├── __init__.py
│       ├── main.py                # FastAPI entry point & CORS setup
│       ├── api/
│       │   ├── __init__.py
│       │   ├── endpoints.py       # API route handlers
│       │   └── health.py          # Health check endpoint
│       ├── models/
│       │   ├── __init__.py
│       │   └── schemas.py         # Pydantic request/response models
│       └── services/
│           ├── __init__.py
│           ├── data_loader.py     # Pandas CSV loading & quality validation
│           └── analytics.py       # Aggregation, summary, and hotspot logic
│
└── frontend/                      # React + TypeScript + Vite + Tailwind Frontend
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── App.tsx                # Main dashboard container
        ├── main.tsx               # React root renderer
        ├── components/
        │   ├── Header.tsx         # Brand header & simulation banner
        │   ├── SummaryCards.tsx   # Top-level metric cards
        │   ├── FilterBar.tsx      # Junction, date range, and status filters
        │   ├── TrafficTable.tsx   # Corridor observation table with pills
        │   ├── TrendChart.tsx     # Volume and speed trend visualizations
        │   ├── HotspotsList.tsx   # Top congested corridors widget
        │   ├── EmptyState.tsx     # Zero results feedback
        │   └── ErrorBanner.tsx    # Backend connection failure alert
        ├── services/
        │   └── api.ts             # Typed fetch client to FastAPI
        └── types/
            └── traffic.ts         # TypeScript interfaces matching backend models
```

---

## 3. Data Schema & CSV Structure

The primary data source is `backend/data/traffic_observations.csv`. Each row represents a single hourly observation at a specific urban junction.

### Field Definitions

| Column Name | Data Type | Units / Format | Allowed Values / Sanity Bounds | Description |
| :--- | :--- | :--- | :--- | :--- |
| `observation_id` | Integer | Unique identifier | Positive integer ($>0$) | Primary key for observation. |
| `junction_id` | String | Code string | e.g., `J-01`, `J-02`, ... | Unique identifier for the junction. |
| `junction_name` | String | Text name | e.g., `MG Road Central Corridor` | Human-readable corridor/junction name. |
| `sector` | String | Text category | Central, IT Corridor, North, etc. | Municipal zone or city sector. |
| `timestamp` | String | ISO-8601 (`YYYY-MM-DDTHH:MM:SS`) | Within simulation window | Time when observation occurred. |
| `vehicle_volume` | Integer | Vehicles / hour (veh/h) | $0 \le \text{volume} \le 5000$ | Number of vehicles traversing corridor. |
| `average_speed` | Float | Kilometers / hour (km/h) | $0.0 \le \text{speed} \le 120.0$ | Mean vehicular speed observed. |
| `estimated_delay`| Integer | Minutes | $\ge 0$ minutes | Estimated travel time delay above baseline. |
| `capacity` | Integer | Vehicles / hour (veh/h) | $> 0$ | Designed physical lane capacity. |

---

## 4. API Design & Endpoint Contracts

All endpoints return JSON responses and use standard HTTP status codes (`200 OK`, `400 Bad Request`, `404 Not Found`, `500 Internal Error`).

### 1. Health Check
* **Route:** `GET /api/health`
* **Purpose:** Verify server readiness and data loading status.
* **Sample Response:**
```json
{
  "status": "healthy",
  "data_loaded": true,
  "record_count": 120,
  "simulation_notice": "All data is simulated for academic demonstration."
}
```

### 2. Junction Catalog
* **Route:** `GET /api/junctions`
* **Purpose:** Returns list of all distinct junctions for dropdown filters.
* **Sample Response:**
```json
[
  {
    "junction_id": "J-01",
    "junction_name": "MG Road Central Corridor",
    "sector": "Central Business District"
  }
]
```

### 3. Filtered Observations
* **Route:** `GET /api/observations`
* **Query Parameters:**
  - `junction_id` (optional, string): Filter by junction ID.
  - `status` (optional, string): `Clear` | `Moderate` | `Heavy`.
  - `start_time` (optional, ISO string): Beginning of time range.
  - `end_time` (optional, ISO string): End of time range.
  - `limit` (optional, integer, default 50): Pagination limit.
* **Sample Response:**
```json
{
  "total_matches": 15,
  "applied_filters": {
    "junction_id": "J-01",
    "status": "Heavy"
  },
  "records": [
    {
      "observation_id": 1,
      "junction_id": "J-01",
      "junction_name": "MG Road Central Corridor",
      "sector": "Central Business District",
      "timestamp": "2026-10-18T10:00:00",
      "vehicle_volume": 1420,
      "average_speed": 16.5,
      "estimated_delay": 18,
      "congestion_status": "Heavy"
    }
  ]
}
```

### 4. Summary & Analytics Metrics
* **Route:** `GET /api/summary`
* **Query Parameters:** Same filter parameters as `/api/observations`.
* **Purpose:** Computes aggregate metrics across the filtered subset so summary cards, charts, and table rows stay in sync.
* **Sample Response:**
```json
{
  "total_observations": 120,
  "congested_count": 32,
  "average_speed_kmh": 34.2,
  "peak_volume_junction": "Outer Ring Road (North)",
  "peak_volume_value": 2450,
  "status_distribution": {
    "Clear": 45,
    "Moderate": 43,
    "Heavy": 32
  }
}
```

### 5. Congestion Hotspots
* **Route:** `GET /api/hotspots`
* **Purpose:** Returns top 5 corridors with highest congestion frequency or longest delay.

---

## 5. Congestion Calculation Logic

The backend executes a single, unambiguous classification rule inside Pandas:

$$\text{Congestion Status} = \begin{cases} 
\text{"Clear"} & \text{if } \text{average\_speed} \ge 45.0\text{ km/h} \\ 
\text{"Moderate"} & \text{if } 25.0\text{ km/h} \le \text{average\_speed} < 45.0\text{ km/h} \\ 
\text{"Heavy"} & \text{if } \text{average\_speed} < 25.0\text{ km/h} 
\end{cases}$$

Additionally, Volume-to-Capacity ($V/C$) ratio is calculated as:
$$V/C = \frac{\text{vehicle\_volume}}{\text{capacity}}$$
This provides secondary validation for traffic engineering discussions during viva defense.

---

## 6. Visual Identity Preservation Strategy

The original starter prototype established an accessible, high-contrast visual design that faculty appreciated. When building the React + Tailwind frontend in Day 3, we will map those CSS tokens directly into Tailwind:

| Original CSS Variable | Purpose | Tailwind Class Equivalent |
| :--- | :--- | :--- |
| `--bg-primary: #f8fafc` | Page Background | `bg-slate-50` |
| `--bg-surface: #ffffff` | Card Surfaces | `bg-white` |
| `--text-primary: #0f172a` | High-contrast text | `text-slate-900` |
| `--text-secondary: #475569` | Secondary text | `text-slate-600` |
| `--primary: #1d4ed8` | Brand Blue | `bg-blue-700` / `text-blue-700` |
| `--status-clear: #dcfce7` | Clear Status Pill | `bg-emerald-100 text-emerald-900 border-emerald-300` |
| `--status-moderate: #fef3c7` | Moderate Status Pill | `bg-amber-100 text-amber-900 border-amber-300` |
| `--status-heavy: #fee2e2` | Heavy Status Pill | `bg-red-100 text-red-900 border-red-300` |

---

## 7. Migration Safety & Fallback Plan

1. **Zero Overwrite of Working Baseline:** The existing `index.html`, `style.css`, and `script.js` files remain permanently in the project root as an immediate fallback that can be demoed without node or python running.
2. **Modular Directory Separation:** React code lives entirely under `frontend/` and FastAPI code lives entirely under `backend/`.
3. **Independent Verification:** Both tiers can be tested independently (FastAPI via Swagger `/docs`, React via Vite dev server).
