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
│   │   │   └── endpoints.py       # /api/junctions, /api/traffic, /api/traffic/summary, /api/traffic/hotspots
│   │   ├── models/
│   │   │   └── schemas.py         # Pydantic request/response validation models
│   │   └── services/
│   │       └── data_loader.py     # Pandas loading, deduplication, sanity checks & filtering
│   └── tests/
│       └── test_api.py            # Automated pytest test suite (9 test cases)
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
    │       ├── Header.tsx         # Brand header & persistent simulation notice
    │       ├── SummaryCards.tsx   # 4 metric cards (Total Obs, Congested, Speed, Peak)
    │       ├── FilterBar.tsx      # Junction & status dropdown filters + reset action
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
* **Result:** 9 passed in 1.54s (100% pass rate).

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

### 8. Academic Viva Talking Points

When presenting this project to your mentor and faculty examiners:
1. **Separation of Concerns:** Explain how the frontend React app acts purely as a consumer of typed REST APIs, while FastAPI and Pandas handle all data loading, cleaning, and mathematical aggregations.
2. **Data Consistency:** Point out that filtering by a corridor updates the summary cards, the 24-hour trend chart, and the observation table simultaneously because they all derive from the same backend endpoint (`/api/traffic/summary` and `/api/traffic`).
3. **Data Quality Handling:** Explain how `data_loader.py` actively guards against malformed rows, missing identifiers, duplicates, and physical speed violations.
4. **Academic Transparency:** Emphasize that the system makes no unverified claims of "AI prediction" or "live surveillance", prioritizing honest, defensible engineering rigor.
