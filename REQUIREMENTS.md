# REQUIREMENTS.md — Smart Traffic Management System (STMS)
## Requirements Specification Document • Two-Week Sprint • Team RouteX

---

## 1. Project Title & Overview

**Project Title:** Smart Traffic Management System (STMS)  
**Team:** Team RouteX  
**Coursework:** Second-Year Information Science & Engineering (ISE) Problem-Based Learning (PBL)  
**Academic Nature:** Decision-Support Analytics Prototype (Not an operational control system)

### Project Summary
The Smart Traffic Management System is an academic traffic analytics dashboard designed to help city planners, researchers, and students understand **where and when traffic congestion occurs** using structured, validated traffic observations.

Rather than making unsupported claims of real-time control or autonomous artificial intelligence, the system focuses on clear data presentation, robust data cleaning, verifiable congestion thresholds, interactive filtering, and exploratory trend visualizations.

> ⚠️ **SIMULATED / SAMPLE DATA NOTICE:**  
> All traffic observations, vehicle volumes, speeds, and timestamps used in this application are **sample / synthetic demonstration data**. This prototype does not connect to live municipal road sensors, CCTV video feeds, or commercial GPS providers.

---

## 2. Problem Statement & User Validation

### Problem Statement
> "The intended users struggle to understand traffic congestion because traffic information can be difficult to interpret, leading to delays in understanding road conditions. Our prototype presents sample corridor and junction traffic information in an analytical dashboard with summary metrics, trends, and interactive filtering."

### User Validation Status
* **Status:** ⏳ **Pending Real-User Validation.**
* **Explanation:** The problem statement has been formulated based on literature and mentor requirements for second-year ISE coursework. Formal user feedback collection from civil transportation authorities or independent operators has not yet been conducted. User validation remains an open activity for future phases.

---

## 3. Technology Stack & Technical Constraints

In accordance with mentor directives, the project will transition from the Day 1 starter prototype (HTML/CSS/Vanilla JS) to a modern, decoupled full-stack architecture:

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18+ with TypeScript | Component reusability, strict type safety, and clear UI state management. |
| **Frontend Tooling** | Vite | Fast development builds, hot module replacement, and modern module bundling. |
| **Styling** | Tailwind CSS | Utility-first, responsive, accessible, and maintainable styling without heavy UI kits. |
| **Backend Framework** | Python 3.13+ with FastAPI | High-performance asynchronous REST API, automatic OpenAPI / Swagger documentation (`/docs`), and type hinting via Pydantic. |
| **Data Processing** | Pandas | Efficient tabular data manipulation, filtering, aggregation, and data quality validation. |
| **Database / Storage** | CSV dataset (with SQLite path if needed) | File-based, transparent, easy to audit, version-controlled sample dataset. Avoids heavy external database dependencies (e.g., PostgreSQL) for the MVP. |
| **Testing & Tooling** | Git, GitHub, Postman, pytest | Industry-standard version control and endpoint verification. |

---

## 4. Intended Users & User Needs

| User Persona | Context | Key Needs |
| :--- | :--- | :--- |
| **Engineering Student (Author)** | Second-year student presenting at academic review/viva. | Clean code structure, understandable data pipeline, defensible congestion logic, and zero hidden magic. |
| **Academic Evaluator / Mentor** | Faculty assessing PBL outcomes and engineering rigor. | Evidence of proper architecture, data validation, error handling, accurate metrics, and clear separation of concerns. |
| **Traffic Analyst / Viewer** | User exploring corridor conditions. | Clear visual identification of congestion levels, ability to filter by junction and time, trend charts, and evident data provenance. |

---

## 5. Functional Requirements (MVP Priorities)

| ID | Requirement | MVP Priority | Implementation Status |
| :--- | :--- | :---: | :---: |
| **FR-01** | **Clean Dashboard Summary:** Present high-level summary cards (Total Observations, Congested Junctions, Average Flow Speed, Peak Volume Junction) derived from validated data. | Must Have (Priority 1) | 🟡 In Progress (Baseline in HTML; React port planned) |
| **FR-02** | **Traffic Junction Table:** Display structured tabular observations including Junction Name, Sector, Status Badge, Average Speed, Vehicle Volume, and Observation Timestamp. | Must Have (Priority 2) | 🟡 In Progress (Baseline in HTML; React port planned) |
| **FR-03** | **Documented Sample CSV Dataset:** Provide a realistic CSV file with documented column definitions, data types, physical units, and sampling frequency. | Must Have (Priority 3) | ⚪ Not Started (Planned Day 5) |
| **FR-04** | **FastAPI Backend & Health Check:** Provide a Python FastAPI service exposing a `/api/health` status check and serving validated data. | Must Have (Priority 4) | ⚪ Not Started (Planned Day 4) |
| **FR-05** | **REST API Endpoints:** Provide `/api/junctions`, `/api/observations`, and `/api/summary` endpoints with query parameter support. | Must Have (Priority 5) | ⚪ Not Started (Planned Day 6) |
| **FR-06** | **Frontend-Backend Integration:** Fetch dynamic data from the FastAPI backend into the React dashboard via an asynchronous client. | Must Have (Priority 6) | ⚪ Not Started (Planned Day 7) |
| **FR-07** | **Dynamic Multi-Parameter Filtering:** Allow users to filter observations by Junction Name, Congestion Status, and Date/Time Range, with immediate table and card updates. | Must Have (Priority 7) | ⚪ Not Started (Planned Day 8) |
| **FR-08** | **Traffic Volume & Speed Trend Charts:** Render interactive trend visualizations (e.g., hourly volume and speed variations over time). | Should Have (Priority 8) | ⚪ Not Started (Planned Day 10) |
| **FR-09** | **Congestion Hotspot Ranking:** Compute and highlight junctions experiencing the highest frequency of heavy congestion or slowest average speeds. | Should Have (Priority 9) | ⚪ Not Started (Planned Day 10) |
| **FR-10** | **Comprehensive UI States:** Provide explicit visual feedback for Loading, Empty Results, Invalid Filter Ranges, and Backend Unavailable (API error). | Should Have (Priority 10) | ⚪ Not Started (Planned Day 11) |
| **FR-11** | **Data Quality & Ingestion Handling:** Automatically clean, log, and filter out missing fields, duplicate timestamps, and out-of-bound speed/volume records. | Must Have (Priority 11) | ⚪ Not Started (Planned Day 5) |
| **FR-12** | **Prominent Simulation Notice:** Display an unmissable banner and pill indicators identifying all data as synthetic/sample demo data. | Must Have (Priority 12) | ✅ Implemented in baseline |
| **FR-13** | **Documentation & Test Suite:** Provide setup guides, Postman test instructions, and automated endpoint tests. | Must Have (Priority 13) | 🟡 In Progress |

---

## 6. Data Quality & Cleaning Requirements

The ingestion pipeline (`backend/app/services/data_loader.py`) must handle real-world data discrepancies:

1. **Missing Values (`NaN` / Null):**
   - Rows missing critical identifiers (`junction_id`, `timestamp`) must be dropped and logged.
   - Rows missing numerical metrics (`speed_kmh`, `vehicle_count`) must either be imputed with corridor rolling averages or dropped based on a documented rule.
2. **Duplicate Observations:**
   - Multiple observations for the exact same junction at the exact same timestamp must be deduplicated, retaining the latest record.
3. **Invalid Timestamps:**
   - Timestamps must parse to valid ISO-8601 datetimes. Unparseable rows must be flagged and rejected.
4. **Physical Sanity Bounds:**
   - Average Speed: Valid between `0.0 km/h` and `120.0 km/h`. Values outside this range are deemed sensor/simulation errors.
   - Vehicle Count: Valid between `0` and `5000` vehicles/hour for urban corridors. Negative values are invalid.

---

## 7. Congestion Level Calculation Rules (Prototype Assumptions)

To ensure academic transparency, congestion levels are **not** claimed as universal municipal standards, but as documented prototype assumptions:

| Status Label | Color Indicator | Speed Threshold Assumption | Volume-to-Capacity (V/C) Ratio Assumption | Qualitative Description |
| :--- | :---: | :---: | :---: | :--- |
| **Clear** | 🟢 Green | $\ge 45\text{ km/h}$ | $V/C < 0.60$ | Free-flowing traffic with minimal delay; speeds close to posted corridor limit. |
| **Moderate** | 🟡 Amber | $25\text{ km/h} \le \text{Speed} < 45\text{ km/h}$ | $0.60 \le V/C < 0.85$ | Stable flow with noticeable slowing at major intersections; minor delays. |
| **Heavy** | 🔴 Red | $< 25\text{ km/h}$ | $V/C \ge 0.85$ | Unstable stop-and-go flow; significant queues and prolonged intersection delays. |

*Note:* If volume and speed conflict, speed governs status for the primary classification rule in this prototype.

---

## 8. Non-Functional Requirements

- **NFR-01: Usability & Student Clarity:** Clean, readable interface that a second-year engineering student can easily demonstrate and explain in a viva examination.
- **NFR-02: Accessibility & Contrast:** Compliance with WCAG 2.1 AA contrast standards; meaningful labels for screen readers; clear color distinctions beyond color alone (using icons/text).
- **NFR-03: Responsive Layout:** Smooth layout adaptation from mobile viewports (375px) to desktop monitors (1920px) without horizontal scrolling.
- **NFR-04: API Performance:** Typical query response times under 150ms for local CSV dataset operations.
- **NFR-05: Maintainability & Code Quality:** Separation of concerns: UI components in `frontend/`, API routing and business logic in `backend/`. Zero secrets in source control.
- **NFR-06: Windows Compatibility:** Simple setup instructions using standard Windows PowerShell commands, virtual environments, and standard ports.

---

## 9. Scope Boundaries & Explicit Non-Goals

The following capabilities are **explicitly out of scope** for this two-week sprint:
- ❌ **Live Municipal Feeds:** No real-time integration with live city cameras or GPS telemetry without actual data feeds.
- ❌ **Direct Signal Actuation:** No claim of changing real-world physical traffic lights or automated signal override.
- ❌ **Computer Vision / CCTV Detection:** No vehicle object detection models running on live video streams.
- ❌ **Unverified AI Forecasting:** No unvalidated ML models claiming guaranteed traffic predictions.
- ❌ **Heavy Infrastructure:** No complex distributed clusters, Kubernetes, or enterprise databases.
