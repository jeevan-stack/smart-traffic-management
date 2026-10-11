# Smart Traffic Management System (STMS)
## Academic Problem-Based Learning (PBL) Project • Day 1 Prototype Documentation

---

### 1. Project Overview & Current Objectives

The **Smart Traffic Management System (STMS)** is an academic Problem-Based Learning (PBL) project developed for second-year **Information Science & Engineering (ISE)** coursework.

* **Mentor Topic Approval:** The project concept and problem statement have been reviewed and approved by the academic mentor.
* **Requirements Status:** Detailed system requirements, functional specifications, and advanced feature sets are currently in progress and pending final approval.
* **Development Methodology:** A structured **10-week Agile development approach** is being followed, organized into 2-week sprint increments.
* **Day 1 Objective:** Construct a clean, responsive, and easy-to-change starter prototype focusing on the user-facing operator dashboard. The goal is to establish baseline UI structure, data presentation, and interactive filtering using pure web standards—without framework overhead or build tool complexity.

> ⚠️ **SIMULATED DEMO DATA NOTICE:**  
> All traffic metrics, corridor speeds, delay estimates, and congestion statuses displayed in this prototype are **SIMULATED DEMO DATA**. The application does not connect to live GPS systems, municipal traffic sensors, road cameras, or real-time traffic APIs.

---

### 2. Day 1 Work Completed

During Day 1 of development, the following milestones were completed:
1. **User-Focused Dashboard Layout:** Built an operator-style academic interface (`index.html`) presenting simulated corridor traffic statuses, eliminating internal development meta-text from the user interface.
2. **Prominent Simulation Notice:** Positioned a clear, accessible banner at the top of the interface stating that all displayed data is synthetic demo data.
3. **Responsive Visual System:** Authored a complete, framework-free styling architecture (`style.css`) using CSS custom properties, accessible color contrast (WCAG AA), and adaptive CSS Grid/Flexbox layouts.
4. **Dynamic Data & Interactive Filtering:** Developed modular Vanilla JavaScript (`script.js`) with an in-memory sample dataset of 8 city corridors, real-time status filtering (`Clear`, `Moderate`, `Heavy`), count indicators, filter reset, and dynamic summary calculations.
5. **Quality & Verification Testing:** Created and executed automated verification checks to validate DOM consistency, syntax validity, and filtering logic across all states.

---

### 3. Current Project Structure & Purpose of Each File

```
PBL/
├── index.html     # Semantic HTML5 academic prototype markup
├── style.css      # Custom styling, layout tokens, and responsive design
├── script.js      # Vanilla JavaScript logic, mock data, and DOM filtering
└── README.md      # Comprehensive project documentation & Agile roadmap
```

| File Name | Purpose & Responsibilities |
| :--- | :--- |
| **`index.html`** | Houses the semantic structure of the traffic prototype console, including the simulation disclaimer banner, navigation header, console header, summary metrics grid, corridor status table, status filter controls, and footer. |
| **`style.css`** | Provides complete visual design without third-party frameworks. Defines theme color tokens (`:root`), typography, table styling, status indicator badges, empty state formatting, and responsive breakpoints (`@media (max-width: 768px)` and `480px`). |
| **`script.js`** | Implements application behavior using pure Vanilla JavaScript (ES6+). Manages the in-memory corridor dataset (`trafficCorridors`), populates the table dynamically, computes summary metrics, and handles status filter changes. |
| **`README.md`** | Serves as the primary documentation repository for project objectives, architecture, setup instructions, test results, limitations, and proposed future sprints. |

---

### 4. Technologies Used

* **HTML5:** Semantic document structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<table>`, `<footer>`) with explicit `aria-label` attributes for accessibility.
* **CSS3:** Modern CSS without preprocessors or frameworks. Uses CSS Custom Properties (variables), CSS Grid (`repeat(auto-fit, minmax(...))`), Flexbox, and mobile-friendly media queries.
* **Vanilla JavaScript (ES6+):** Pure client-side JavaScript executing in strict mode (`'use strict'`). Employs standard array methods (`.filter()`, `.reduce()`), safe DOM manipulation, and event handling (`addEventListener`). No bundlers, npm packages, or external runtime libraries are used.

---

### 5. Setup & Instructions to Run the Project

No dependencies, Node.js installations, or compilation steps are needed. The project runs directly in any modern web browser.

#### Method 1: Direct File Launch (Recommended)
1. Open Windows File Explorer and navigate to:
   ```
   c:\Users\jeeva\OneDrive\Desktop\PBL
   ```
2. Double-click **`index.html`** to launch it in your default web browser (Chrome, Edge, Firefox, Brave, etc.).

#### Method 2: Launch via PowerShell
From the project folder in PowerShell, run:
```powershell
Start-Process "c:\Users\jeeva\OneDrive\Desktop\PBL\index.html"
```

#### Method 3: Local HTTP Server (Optional)
If running through a local development server:
```powershell
cd "c:\Users\jeeva\OneDrive\Desktop\PBL"
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

---

### 6. Features Implemented & Actual Test Results

#### Features Implemented:
* **Simulation Notice Banner:** Accessible warning banner stating that all traffic figures represent simulated data.
* **Prototype Status Console Header:** Clean header with active "Simulation Mode Active" indicator.
* **Three Traffic Summary Cards:**
  - *Total Monitored Corridors:* 8 routes.
  - *High Congestion Corridors:* 3 routes.
  - *Average Flow Speed:* Computed network average speed of 35.4 km/h.
* **Interactive Corridor Status Table:**
  - 8 arterial routes across city sectors (MG Road, Outer Ring Road, Airport Expressway, Brigade Road, Residency Road, Electronic City Flyover, Hosur Road Junction, Bannerghatta Link Road).
  - Status indicator badges: 🟢 Clear (≥ 45 km/h), 🟡 Moderate (25–44 km/h), 🔴 Heavy (< 25 km/h).
  - Average speed, estimated delay, and sample timestamp per corridor.
* **Interactive Status Filter:**
  - Dropdown selector (`All`, `Clear`, `Moderate`, `Heavy`).
  - Real-time counter badge (e.g., `Showing 3 of 8 corridors`).
  - "Reset Filter" button to restore all records with one click.
  - User-friendly empty-state display if no records match.
* **Responsive Layout:** Adapts smoothly across desktop, tablet, and mobile screen widths.

#### Actual Test Results:
An automated Node.js verification script was executed against the project files. The following tests were performed and confirmed:

| Test Case | Description | Actual Result | Status |
| :--- | :--- | :--- | :---: |
| **TC-01: File Presence** | Confirmed all 4 project files exist on disk. | `index.html`, `style.css`, `script.js`, `README.md` present. | **PASS** |
| **TC-02: Asset Linking** | Verified `index.html` references `style.css` and `script.js`. | Both stylesheet and script tags properly declared. | **PASS** |
| **TC-03: DOM Consistency** | Verified every DOM element ID queried by `script.js` exists in `index.html`. | 8 IDs checked (`trafficTableBody`, `statusFilter`, `recordCountBadge`, `resetFilterBtn`, `emptyState`, `cardTotalCorridors`, `cardCongestedCount`, `cardAvgSpeed`) — all found. | **PASS** |
| **TC-04: Script Syntax & Execution** | Parsed and initialized `script.js` in a DOM sandbox. | Zero syntax errors; `DOMContentLoaded` executed cleanly. | **PASS** |
| **TC-05: Initial Summary Calculation** | Verified metric computation from baseline dataset. | Total: 8, Heavy: 3, Avg Speed: 35.4 km/h correctly rendered. | **PASS** |
| **TC-06: Initial Table Population** | Counted rendered rows upon initial dashboard load. | Exactly 8 corridor table rows rendered. | **PASS** |
| **TC-07: Status Filter - Clear** | Evaluated filter for `Clear` status. | 3 corridors rendered (`Showing 3 of 8 corridors`). | **PASS** |
| **TC-08: Status Filter - Moderate** | Evaluated filter for `Moderate` status. | 2 corridors rendered (`Showing 2 of 8 corridors`). | **PASS** |
| **TC-09: Status Filter - Heavy** | Evaluated filter for `Heavy` status. | 3 corridors rendered (`Showing 3 of 8 corridors`). | **PASS** |
| **TC-10: Reset Filter Action** | Dispatched click event on `#resetFilterBtn`. | Dropdown restored to `'all'`, all 8 corridors re-rendered. | **PASS** |
| **TC-11: Empty State Handling** | Filtered by a non-matching status value. | 0 table rows rendered; `#emptyState` display toggled to `'block'`. | **PASS** |

---

### 7. Current Limitations (Day 1 Scope)

In accordance with Day 1 objectives and Agile principles, the following features are intentionally not implemented:
* **Simulated Data Only:** Data does not reflect live traffic conditions and is not connected to external traffic APIs, IoT hardware, or GPS devices.
* **In-Memory Storage Only:** No persistent database (MySQL, PostgreSQL, MongoDB) or backend server (Node.js/Express, Python/Flask) is integrated; data is stored in a JavaScript array.
* **No Authentication / Authorization:** No user login, registration, or operator permission roles exist.
* **No Traffic Signal Control Logic:** Automated traffic light state transitions (Red/Yellow/Green) and adaptive timer algorithms are not yet built.
* **No AI or Machine Learning:** No predictive traffic flow modeling or machine learning inference is included.
* **Static Snapshot:** Data values remain constant and do not automatically fluctuate until a simulation loop is introduced.

---

### 8. Proposed Next Steps *(Pending Mentor Approval)*

> 📌 **NOTE:** The following steps represent the proposed 10-week Agile development roadmap. All subsequent features, architectures, and implementations are **strictly pending review and formal approval from the project mentor** before work commences.

* **Sprint 2 (Weeks 2–3) — Proposed: Intersection Schema & Dynamic Simulation Loop**
  * *Status:* Pending Mentor Approval
  * *Proposal:* Formalize intersection and lane data models; introduce an interval-based simulation loop (`setInterval`) to demonstrate fluctuating vehicle counts and speeds over time.
* **Sprint 3 (Weeks 4–5) — Proposed: Traffic Signal State Machine & Adaptive Timing**
  * *Status:* Pending Mentor Approval
  * *Proposal:* Create an interactive intersection traffic light module with visual signal lights (Red/Yellow/Green); prototype a rule-based algorithm to extend green-light duration based on simulated corridor congestion.
* **Sprint 4 (Weeks 6–7) — Proposed: Congestion Alerts & State Persistence**
  * *Status:* Pending Mentor Approval
  * *Proposal:* Implement alert notifications when corridor speeds fall below critical thresholds; introduce browser `localStorage` or a lightweight mock REST API to persist incident logs.
* **Sprint 5 (Weeks 8–10) — Proposed: Analytics Dashboard, Verification & Final Viva**
  * *Status:* Pending Mentor Approval
  * *Proposal:* Integrate traffic throughput summary charts, conduct comprehensive usability and accessibility tests, finalize the academic report, and prepare for the project defense/viva.
