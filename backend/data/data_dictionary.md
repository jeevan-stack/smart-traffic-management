# Traffic Observation Dataset — Data Dictionary
## Team RouteX • Smart Traffic Management System

### 1. Dataset Overview
- **File Location:** `backend/data/traffic_observations.csv`
- **Data Source Category:** Academic Simulated Observation Dataset
- **Observation Frequency:** Hourly time intervals (60 minutes per observation)
- **Time Horizon:** 24-hour observation snapshot across 8 major urban corridors
- **Purpose:** Decision-support traffic analytics, congestion trend analysis, and hotspot identification.

---

### 2. Schema Specification

| Column Name | Data Type | Physical Unit | Valid Range / Format | Description | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `observation_id` | Integer | Identifier | Positive Integer ($\ge 1$) | Primary key for the observation row | `101` |
| `timestamp` | String (ISO-8601) | Datetime | `YYYY-MM-DDTHH:MM:SS` | Timestamp when the observation was recorded | `2026-10-18T08:00:00` |
| `junction_id` | String | Categorical Code | Format `J-01` to `J-08` | Unique corridor/junction identifier | `J-01` |
| `junction_name` | String | Text | Alpha-numeric name | Human-readable arterial corridor or junction name | `MG Road Central Corridor` |
| `sector` | String | Categorical Text | Zone name | Municipal or urban district (e.g., Central, IT Corridor, South) | `Central Business District` |
| `vehicle_volume` | Integer | Vehicles / Hour (veh/h) | $0 \le \text{volume} \le 5000$ | Total count of motorized vehicles traversing the corridor in 1 hour | `1450` |
| `average_speed` | Float | Kilometers / Hour (km/h) | $0.0 \le \text{speed} \le 120.0$ | Mean vehicular flow speed recorded during the observation window | `16.5` |
| `estimated_delay`| Integer | Minutes (min) | $\ge 0$ | Estimated queue and travel delay compared to free-flow conditions | `18` |
| `capacity` | Integer | Vehicles / Hour (veh/h) | $> 0$ | Designed physical maximum throughput of the corridor section | `1800` |
| `data_source` | String | Label | `simulated_sample` | Audit label confirming data origin is academic demo data | `simulated_sample` |

---

### 3. Congestion Classification Rules

Congestion status is derived from the observed average speed:

* **Clear (🟢):** $\text{average\_speed} \ge 45.0\text{ km/h}$. Minimal or no delay; speeds near free-flow.
* **Moderate (🟡):** $25.0\text{ km/h} \le \text{average\_speed} < 45.0\text{ km/h}$. Noticeable slowdowns during peak hours; modest delays ($5$–$15$ mins).
* **Heavy (🔴):** $\text{average\_speed} < 25.0\text{ km/h}$. Stop-and-go congestion; severe intersection delays ($> 15$ mins).

Volume-to-Capacity ratio ($V/C = \text{vehicle\_volume} / \text{capacity}$) serves as a supporting engineering indicator where:
* $V/C < 0.60 \rightarrow$ Free Flow
* $0.60 \le V/C < 0.85 \rightarrow$ Approaching Capacity
* $V/C \ge 0.85 \rightarrow$ Saturated / Over Capacity
