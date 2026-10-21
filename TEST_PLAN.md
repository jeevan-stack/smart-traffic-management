# TEST_PLAN.md — Smart Traffic Management System (STMS)
## Verification Plan & Actual Test Results • Team RouteX

This document records the automated and manual verification strategy for the STMS prototype, including test cases, expected results, execution commands, and verified real-world outcomes.

---

### 1. Test Environment Summary
* **Operating System:** Windows 11 / Windows PowerShell
* **Backend Runtime:** Python 3.13.5 (in `backend/.venv`)
* **Backend Framework:** FastAPI 0.145.0, Pydantic 2.14.1, Pandas 3.0.6, pytest 9.1.1
* **Frontend Runtime:** Node.js v24.22.0, npm 11.19.1
* **Frontend Framework:** React 19 / Vite 8.3.4, TypeScript, Tailwind CSS 3.4.17
* **Data Source:** `backend/data/traffic_observations.csv` (192 records)

---

### 2. Backend Automated Test Suite (`backend/tests/test_api.py`)

Run command:
```powershell
$env:PYTHONPATH="." ; backend\.venv\Scripts\pytest.exe backend\tests\test_api.py -v
```

| Test Case ID | Test Function | Description | Expected Outcome | Actual Result |
| :--- | :--- | :--- | :--- | :---: |
| **TC-BE-01** | `test_root_endpoint` | Query `GET /` | Returns 200, system name "Smart Traffic Management System", team "Team RouteX", and simulation notice. | **PASS** |
| **TC-BE-02** | `test_health_endpoint` | Query `GET /api/health` | Returns 200, status "healthy", `data_loaded: true`, and `record_count: 192`. | **PASS** |
| **TC-BE-03** | `test_junctions_endpoint` | Query `GET /api/junctions` | Returns 200, array of 8 distinct junctions including J-01, J-02, J-07. | **PASS** |
| **TC-BE-04** | `test_traffic_observations_default` | Query `GET /api/traffic` | Returns 200, total_matches: 192, records array with observation schema. | **PASS** |
| **TC-BE-05** | `test_traffic_filter_junction` | Query `GET /api/traffic?junction_id=J-01` | Returns 200, total_matches: 24, all records have `junction_id == 'J-01'`. | **PASS** |
| **TC-BE-06** | `test_traffic_filter_status` | Query `GET /api/traffic?status=Heavy` | Returns 200, all records have `congestion_status == 'Heavy'` and `speed < 25.0 km/h`. | **PASS** |
| **TC-BE-07** | `test_traffic_filter_invalid_status` | Query `GET /api/traffic?status=SuperFast` | Returns 400 Bad Request with descriptive error detail. | **PASS** |
| **TC-BE-08** | `test_traffic_summary` | Query `GET /api/traffic/summary` | Returns 200, total_observations: 192, status distribution sum == 192, peak corridor defined. | **PASS** |
| **TC-BE-09** | `test_traffic_hotspots` | Query `GET /api/traffic/hotspots?limit=5` | Returns 200, top 5 junctions ranked by heavy congestion count and speed. | **PASS** |

**Execution Result:** 9 passed in 1.54s (100% success rate).

---

### 3. Frontend Build & TypeScript Type Verification

Run command:
```powershell
cd frontend ; npm run build
```

| Test Case ID | Test Target | Description | Expected Outcome | Actual Result |
| :--- | :--- | :--- | :--- | :---: |
| **TC-FE-01** | TypeScript Compilation (`tsc -b`) | Type check all TypeScript source files under strict mode with `verbatimModuleSyntax`. | Zero type errors. | **PASS** |
| **TC-FE-02** | Vite Production Build (`vite build`) | Compile and bundle React components, Tailwind styles, and assets into `frontend/dist`. | Successful bundle output under 1 second. | **PASS (959ms)** |
| **TC-FE-03** | Component Tree Rendering | Check `App.tsx`, `Header`, `SummaryCards`, `FilterBar`, `TrafficTable`, `TrendChart`, `HotspotsList`, `ErrorBanner`, `Footer`. | All components mount cleanly without runtime warnings. | **PASS** |

---

### 4. Baseline Starter Prototype Verification (`verify_day1.js`)

Run command:
```powershell
node scratch\verify_day1.js
```

| Test Case ID | Test Function | Expected Outcome | Actual Result |
| :--- | :--- | :--- | :---: |
| **TC-BASE-01** | File Presence | `index.html`, `style.css`, `script.js` exist. | **PASS** |
| **TC-BASE-02** | Wording Audit | "City Corridor Traffic Dashboard" present; no surveillance claims. | **PASS** |
| **TC-BASE-03** | DOM Consistency | All 8 DOM IDs match. | **PASS** |
| **TC-BASE-04** | Status Filter Tests | Clear (3), Moderate (2), Heavy (3), Reset (8), Empty state verified. | **PASS** |

---

### 5. Data Quality Pipeline Tests (`backend/app/services/data_loader.py`)

| Test Case ID | Validation Rule | Test Scenario | Verified Outcome |
| :--- | :--- | :--- | :---: |
| **TC-DQ-01** | Missing Identifier Dropping | CSV rows with null `junction_id` or `timestamp` | Dropped automatically during ingestion. |
| **TC-DQ-02** | Duplicate Deduplication | Multiple observations with identical `(junction_id, timestamp)` | Deduplicated; only latest observation retained. |
| **TC-DQ-03** | Speed Sanity Bounds | Speeds outside $0.0 \le \text{speed} \le 120.0\text{ km/h}$ | Out-of-bounds rows rejected. |
| **TC-DQ-04** | Volume Bounds | Negative volume or volume $> 5000\text{ veh/h}$ | Out-of-bounds rows rejected. |
| **TC-DQ-05** | Speed-Status Thresholds | Speed $\ge 45 \rightarrow$ Clear; $25 \le \text{Speed} < 45 \rightarrow$ Moderate; $< 25 \rightarrow$ Heavy | Calculated with 100% consistency across all 192 rows. |
