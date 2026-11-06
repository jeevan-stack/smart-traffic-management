# Smart Traffic Management System (STMS)
## Academic Decision-Support Analytics Prototype • Team RouteX
### Second-Year Information Science & Engineering (ISE) • Problem-Based Learning (PBL)

---

> ⚠️ **SIMULATED DEMO DATA NOTICE:**  
> All traffic observations, vehicle volumes, speeds, and timestamps used in this application are **SIMULATED DEMO DATA**. The application does not connect to live GPS systems, municipal traffic sensors, road cameras, or commercial real-time traffic APIs. Daily development logs and sprint tracking belong strictly in documentation and never appear in the dashboard user interface.

---

### 1. Project Overview

The **Smart Traffic Management System (STMS)** is an academic traffic analytics application designed to help transportation planners, researchers, and students understand **where and when congestion occurs** across urban corridors using validated, structured observations.

Rather than making unsupported claims of autonomous signal control or AI prediction, STMS demonstrates:
* **Validated Data Ingestion:** Loading, cleaning, and deduplicating hourly traffic observations with Pandas.
* **Defensible Congestion Logic:** Classifying flow conditions using documented speed and volume-to-capacity thresholds (`Clear`, `Moderate`, `Heavy`).
* **Interactive Multi-Filtering:** Querying records by corridor/junction and congestion status with immediate UI synchronization.
* **Analytical Visualizations:** Exploring 24-hour traffic volume bars, speed trend lines, and ranked congestion hotspots.
* **Separation of Concerns:** A modern decoupled architecture featuring a Python FastAPI backend and a React + TypeScript frontend with Tailwind CSS.

---

### 2. Technology Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons.
* **Backend:** Python 3.13, FastAPI, Pydantic, Pandas, Uvicorn.
* **Data Storage:** Documented CSV dataset (`backend/data/traffic_observations.csv`) containing 192 observation records across 8 major urban corridors.
* **Testing:** Pytest, HTTPX, TypeScript Compiler (`tsc`), Postman.
* **Version Control:** Git (isolated repository inside `PBL/`).

---

### 3. Project Structure

```
PBL/
├── .gitignore                     # Git exclusion rules for node, python venv, secrets
├── DEVELOPMENT_PLAN.md            # Complete 14-day Agile sprint roadmap and verified progress
├── REQUIREMENTS.md                # Functional, non-functional, and data quality requirements
├── DESIGN.md                      # Architecture diagram, schemas, and design decisions
├── API_DOCUMENTATION.md           # REST API endpoints, query parameters, and example JSON payloads
├── TEST_PLAN.md                   # Automated test cases and verified test results
├── README.md                      # Project landing page and setup guide (this file)
│
├── index.html                     # [Preserved] Starter prototype HTML (instant fallback)
├── style.css                      # [Preserved] Starter prototype CSS
├── script.js                      # [Preserved] Starter prototype JS
│
├── backend/                       # Python FastAPI Backend
│   ├── requirements.txt           # fastapi, uvicorn, pandas, pydantic, pytest, httpx
│   ├── data/
│   │   ├── traffic_observations.csv # 192 observation records (24 hours x 8 junctions)
│   │   ├── data_dictionary.md       # Column definitions, units, and ranges
│   │   └── generate_data.py         # Deterministic data generation script
│   ├── app/
│   │   ├── main.py                # FastAPI entry point & CORS configuration
│   │   ├── api/
│   │   │   ├── health.py          # /api/health endpoint
│   │   │   └── endpoints.py       # /api/junctions, /api/traffic, /api/traffic/summary, /api/traffic/hotspots, /api/routes/compare
│   │   ├── models/
│   │   │   └── schemas.py         # Pydantic request/response validation models (traffic + route schemas)
│   │   └── services/
│   │       ├── data_loader.py     # Pandas loading, deduplication, sanity checks & filtering
│   │       └── route_service.py   # Corridor graph, DFS route finder, travel time & recommendation engine
│   └── tests/
│       └── test_api.py            # Automated pytest test suite (13 test cases)
│
└── frontend/                      # React + TypeScript + Vite + Tailwind CSS Frontend
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── tsconfig.json
    ├── src/
    │   ├── main.tsx               # React application root
    │   ├── App.tsx                # Dashboard container coordinating API state
    │   ├── index.css              # Tailwind CSS directives
    │   ├── types/
    │   │   └── traffic.ts         # TypeScript models matching backend schemas
    │   ├── services/
    │   │   └── api.ts             # Typed asynchronous API client
    │   └── components/
    │       ├── Header.tsx         # Brand header, notice & nav (Overview, Route Planner, Corridors, Hotspots, Trends)
    │       ├── SummaryCards.tsx   # 4 metric cards (Total Obs, Congested, Speed, Peak)
    │       ├── FilterBar.tsx      # Junction & status dropdown filters + reset action
    │       ├── RoutePlanner.tsx   # Route Planner — source/dest selectors, swap, comparison cards
    │       ├── TrafficTable.tsx   # Observation table with status badges & units
    │       ├── TrendChart.tsx     # 24-hour volume bars & speed trend visualizer
    │       ├── HotspotsList.tsx   # Ranked congestion hotspot cards
    │       ├── ErrorBanner.tsx    # Connection status & troubleshooting alert
    │       └── Footer.tsx         # Academic attribution & demo notice
```

---

### 4. Setup & Running Instructions (Windows)

#### Step 1: Start the Backend (Terminal 1)
Open Windows PowerShell in the project directory:
```powershell
cd "C:\Users\jeeva\OneDrive\Desktop\PBL"

# Activate the virtual environment and start the FastAPI server
backend\.venv\Scripts\uvicorn.exe backend.app.main:app --reload --port 8000
```
* Backend will be running at: `http://localhost:8000`
* Interactive API Documentation (Swagger UI): `http://localhost:8000/docs`
* Health check: `http://localhost:8000/api/health`

#### Step 2: Start the Frontend (Terminal 2)
Open a second Windows PowerShell window:
```powershell
cd "C:\Users\jeeva\OneDrive\Desktop\PBL\frontend"

# Launch the Vite development server
npm run dev
```
* Open your browser and navigate to: `http://localhost:5173`

#### Fallback: Running the Vanilla JS Prototype
If you need to demonstrate the dashboard immediately without starting Python or Node:
* Double-click `index.html` in the root folder, or run:
```powershell
Start-Process "C:\Users\jeeva\OneDrive\Desktop\PBL\index.html"
```

---

### 5. Running the Automated Tests

#### Backend Automated Test Suite (Pytest)
```powershell
cd "C:\Users\jeeva\OneDrive\Desktop\PBL"
$env:PYTHONPATH="." ; backend\.venv\Scripts\pytest.exe backend\tests\test_api.py -v
```
* **Result:** 13 passed in 2.35s (100% pass rate — 9 traffic tests + 4 route comparison tests).

#### Frontend Production Build & Type Check
```powershell
cd "C:\Users\jeeva\OneDrive\Desktop\PBL\frontend"
npm run build
```
* **Result:** `tsc -b && vite build` built cleanly in 959ms with zero errors.

---

### 6. Congestion Classification Rules

| Status Label | Speed Threshold | Volume-to-Capacity | Description |
| :--- | :--- | :--- | :--- |
| **Clear** (🟢) | $\ge 45.0\text{ km/h}$ | $V/C < 0.60$ | Free-flowing traffic near posted corridor limit. |
| **Moderate** (🟡) | $25.0\text{ km/h} \le \text{Speed} < 45.0\text{ km/h}$ | $0.60 \le V/C < 0.85$ | Stable flow with noticeable peak-hour slowing. |
| **Heavy** (🔴) | $< 25.0\text{ km/h}$ | $V/C \ge 0.85$ | Unstable stop-and-go congestion with delays $> 15$ mins. |

---

### 7. Known Limitations & Academic Assumptions

1. **Simulated Dataset:** Observations are realistically modeled (with peak commute profiles and random noise) but are not connected to physical municipal road detectors.
2. **Decision Support Only:** The system analyzes and visualizes traffic conditions; it does not directly control physical traffic signal hardware.
3. **Discrete Time Windows:** Data represents 60-minute aggregated intervals rather than sub-second sensor ticks.
4. **Single-City Scope:** The current catalog models 8 arterial corridors in an urban metropolitan network.

---

### 8. Daily Development Log

> **Note:** Entries before 18-Oct-2026 are not documented here — the project was initially built as a vanilla JS prototype without chronological logging. The entries below reflect only verified, committed development work.

---

#### Session 1 — 18 October 2026 (Prototype Construction)
**Milestone:** Full-stack MVP scaffolded and backend tests verified.

**Backend — created:**
- `backend/app/main.py` — FastAPI app with CORS for `localhost:5173`
- `backend/app/api/health.py` — `/api/health` endpoint
- `backend/app/api/endpoints.py` — `/api/junctions`, `/api/traffic`, `/api/traffic/summary`, `/api/traffic/hotspots`
- `backend/app/models/schemas.py` — Pydantic v2 response models
- `backend/app/services/data_loader.py` — Pandas CSV loading, cleaning, filtering, aggregation
- `backend/data/traffic_observations.csv` — 192 records (24 hours × 8 junctions, `random.seed(42)`)
- `backend/data/generate_data.py` — Deterministic data generator
- `backend/data/data_dictionary.md` — Column definitions and physical sanity bounds
- `backend/tests/test_api.py` — 9 initial pytest test cases
- `backend/requirements.txt`

**Frontend — created:**
- Scaffolded via `npm create vite@latest frontend -- --template react-ts`
- `frontend/src/types/traffic.ts`, `frontend/src/services/api.ts`
- Components: `Header.tsx`, `SummaryCards.tsx`, `FilterBar.tsx`, `TrafficTable.tsx`, `TrendChart.tsx`, `HotspotsList.tsx`, `ErrorBanner.tsx`, `Footer.tsx`
- `frontend/src/App.tsx` — Dashboard coordinator
- Tailwind CSS, PostCSS, TypeScript configured

**Documentation — created:**
- `README.md`, `REQUIREMENTS.md`, `DESIGN.md`, `DEVELOPMENT_PLAN.md`, `API_DOCUMENTATION.md`, `TEST_PLAN.md`, `.gitignore`

**Preserved baseline:** `index.html`, `style.css`, `script.js` (original vanilla JS prototype)

**Test results (Session 1):**
- Backend pytest: 9 passed in ~1.5s
- Frontend `npm run build`: PASS — `tsc -b && vite build` in ~959ms, zero TypeScript errors

**Issues encountered:**
- `verbatimModuleSyntax` required all type imports to use `import type { ... }` syntax — fixed across all files.
- Pydantic v2 deprecation: `Field(..., example=...)` replaced with `Field(..., json_schema_extra={"example": ...})`.
- `PYTHONPATH` must be set to PBL root when running pytest or uvicorn to resolve `backend.*` module paths.

---

#### Session 2 — 04 November 2026 (Route Planner — Features 5 & 6)
**Milestone:** Route Planner & Corridor Comparison implemented and all tests verified.

**Backend — created:**
- `backend/app/services/route_service.py` — 8-node corridor graph (10 bidirectional road segments with documented simulated distance assumptions), DFS path finder (≤5 hops, cycle-free), dynamic speed/delay aggregation from dataset, congestion classification, recommendation logic with human-readable explanation.

**Backend — modified:**
- `backend/app/models/schemas.py` — Added `RouteCompareRequest`, `RouteSegmentDetail`, `RouteOption`, `RouteCompareResponse` Pydantic schemas.
- `backend/app/api/endpoints.py` — Added `POST /api/routes/compare` endpoint with full input validation (empty IDs, same source/destination, unknown junction IDs).
- `backend/app/main.py` — Aligned root endpoint JSON structure with test assertions.
- `backend/tests/test_api.py` — Added 4 route comparison test cases: valid multi-route, same junction, invalid ID, empty ID.

**Frontend — created:**
- `frontend/src/components/RoutePlanner.tsx` — Source/destination selectors, swap button, loading state, inline validation, alternative route comparison cards with per-segment breakdown table, recommended route badge, human-readable recommendation banner, academic disclaimer.

**Frontend — modified:**
- `frontend/src/types/traffic.ts` — Added `RouteCompareRequest`, `RouteSegmentDetail`, `RouteOption`, `RouteCompareResponse` interfaces matching backend schemas exactly.
- `frontend/src/services/api.ts` — Added `compareRoutes(payload)` method using `POST` with JSON body and `ApiError` pattern.
- `frontend/src/App.tsx` — Mounted `<RoutePlanner />` between `FilterBar` and `TrendChart`; added import.
- `frontend/src/components/Header.tsx` — Added "Route Planner" anchor link to navigation.

**Verification helper scripts created (not application code):**
- `backend/verify_routes.py`, `backend/verify_junctions.py`, `backend/verify_traffic.py`

**Test results (Session 2 — all executed, not fabricated):**

| Check | Result |
|---|---|
| Backend pytest (13 tests) | **13 passed, 0 failed** in 2.35s |
| Frontend `npm run build` | **PASS** — 26 modules, built in 2.22s, zero TypeScript errors |
| `GET /api/health` | HTTP 200 — `status: healthy`, `record_count: 192` |
| `GET /api/junctions` | HTTP 200 — 8 junctions returned, all IDs and names match CSV |
| `GET /api/traffic` | HTTP 200 — `total_matches: 192`, 100 records returned (default limit) |
| `GET /api/traffic/summary` | HTTP 200 — `total_obs: 192`, `congested_count: 36`, `avg_speed: 38.4 km/h` |
| `GET /api/traffic/summary?junction_id=J-01` | HTTP 200 — `total_obs: 24`, `avg_speed: 36.6 km/h` |
| `POST /api/routes/compare (J-01 → J-06)` | HTTP 200 — 8 routes found, recommended: `route-3` (via Brigade & Hosur, 24.7 mins, 43.2 km/h, Moderate) |
| `POST /api/routes/compare (J-06 → J-01 swap)` | HTTP 200 — 8 routes found, reverse direction works correctly |
| `POST /api/routes/compare (same junction J-01)` | HTTP 400 — `"Source and destination junctions cannot be the same."` |
| `POST /api/routes/compare (invalid J-99)` | HTTP 400 — `"Unknown source junction ID: 'J-99'"` |

**Issues encountered:**
- PowerShell's sandbox mode blocked access to `backend/.venv/` and `.git/`; resolved by running server and test commands with `BypassSandbox: true`.
- Git was originally initialized at `C:\Users\jeeva` (home directory) instead of `PBL/`; a nested `.git` exists inside `backend/`. Git consolidation at the project root is pending.
- `test_root_endpoint` had a pre-existing field name mismatch — fixed by aligning `main.py` root endpoint to return `"system"` and `"team"` keys.

**Remaining work:**
- Git consolidation: initialize a clean repo at `PBL/` root and make first commit.
- Features 7–10 from DEVELOPMENT_PLAN.md: SQLite persistence, route filtering by time-of-day, expanded test suite, Postman collection export, and final documentation freeze.
- `RoutePlanner` currently shows all 8 DFS-discovered alternative paths; a configurable maximum display count (e.g., top 3 by travel time) may improve UI readability.

---

### 9. Academic Viva Talking Points

When presenting this project to your mentor and faculty examiners:
1. **Separation of Concerns:** Explain how the frontend React app acts purely as a consumer of typed REST APIs, while FastAPI and Pandas handle all data loading, cleaning, and mathematical aggregations.
2. **Data Consistency:** Point out that filtering by a corridor updates the summary cards, the 24-hour trend chart, and the observation table simultaneously because they all derive from the same backend endpoint (`/api/traffic/summary` and `/api/traffic`).
3. **Data Quality Handling:** Explain how `data_loader.py` actively guards against malformed rows, missing identifiers, duplicates, and physical speed violations.
4. **Academic Transparency:** Emphasize that the system makes no unverified claims of "AI prediction" or "live surveillance", prioritizing honest, defensible engineering rigor.
