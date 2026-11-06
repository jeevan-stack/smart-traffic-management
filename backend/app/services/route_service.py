"""
Route Comparison & Corridor Network Service
Team RouteX • Smart Traffic Management System

Manages the urban corridor network graph, discovers alternative routes (DFS <= 5 hops),
and computes dynamic travel times and congestion levels using simulated observations.
"""

from typing import Dict, List, Tuple, Optional, Any
import pandas as pd
from backend.app.services.data_loader import get_df, get_all_junctions

# ==============================================================================
# Road Network Model (Simulated Distance Assumptions)
# 8 Junctions connected by 10 bidirectional arterial corridor segments.
# Note: Distances are documented academic baseline assumptions for comparative analysis.
# ==============================================================================

ROAD_SEGMENTS: List[Dict[str, Any]] = [
    {"from": "J-01", "to": "J-04", "distance_km": 1.8, "name": "MG Rd - Brigade Rd Link"},
    {"from": "J-01", "to": "J-05", "distance_km": 2.5, "name": "MG Rd - Residency Rd Arterial"},
    {"from": "J-01", "to": "J-02", "distance_km": 8.2, "name": "Central - ORR North Connector"},
    {"from": "J-04", "to": "J-05", "distance_km": 1.5, "name": "Brigade - Residency Inner Link"},
    {"from": "J-04", "to": "J-07", "distance_km": 7.0, "name": "Brigade - Hosur Rd Radial"},
    {"from": "J-05", "to": "J-08", "distance_km": 6.5, "name": "Residency - Bannerghatta Link"},
    {"from": "J-02", "to": "J-03", "distance_km": 12.0, "name": "ORR - Airport Expressway"},
    {"from": "J-07", "to": "J-06", "distance_km": 9.0, "name": "Hosur Rd - Electronic City Flyover"},
    {"from": "J-08", "to": "J-06", "distance_km": 11.5, "name": "Bannerghatta - Electronic City Link"},
    {"from": "J-07", "to": "J-08", "distance_km": 4.8, "name": "Hosur - Bannerghatta Cross Connector"}
]

# Build undirected adjacency lookup and distance lookup
ADJACENCY: Dict[str, List[str]] = {}
SEGMENT_DISTANCES: Dict[Tuple[str, str], float] = {}

for seg in ROAD_SEGMENTS:
    u, v, dist = seg["from"], seg["to"], seg["distance_km"]
    ADJACENCY.setdefault(u, []).append(v)
    ADJACENCY.setdefault(v, []).append(u)
    SEGMENT_DISTANCES[(u, v)] = dist
    SEGMENT_DISTANCES[(v, u)] = dist


def find_alternative_paths(source_id: str, dest_id: str, max_hops: int = 5) -> List[List[str]]:
    """
    Discovers all simple (acyclic) paths from source_id to dest_id with at most max_hops.
    Uses Depth-First Search (DFS) to prevent infinite loops and duplicates.
    """
    if source_id == dest_id:
        return []
    if source_id not in ADJACENCY or dest_id not in ADJACENCY:
        return []

    paths: List[List[str]] = []

    def dfs(current: str, target: str, visited: set, current_path: List[str]):
        if len(current_path) - 1 > max_hops:
            return
        if current == target:
            paths.append(list(current_path))
            return

        for neighbor in ADJACENCY.get(current, []):
            if neighbor not in visited:
                visited.add(neighbor)
                current_path.append(neighbor)
                dfs(neighbor, target, visited, current_path)
                current_path.pop()
                visited.remove(neighbor)

    dfs(source_id, dest_id, {source_id}, [source_id])
    return paths


def get_latest_traffic_metrics() -> Dict[str, Dict[str, Any]]:
    """
    Returns latest speed, delay, and congestion status for each of the 8 junctions
    from the validated traffic dataset.
    """
    df = get_df()
    latest_metrics: Dict[str, Dict[str, Any]] = {}

    # Sort by timestamp descending so the first entry per junction is the latest
    sorted_df = df.sort_values(by="timestamp", ascending=False)
    for j_id, group in sorted_df.groupby("junction_id"):
        latest_row = group.iloc[0]
        latest_metrics[str(j_id)] = {
            "average_speed": float(latest_row["average_speed"]),
            "estimated_delay": int(latest_row["estimated_delay"]),
            "congestion_status": str(latest_row["congestion_status"]),
            "junction_name": str(latest_row["junction_name"]),
            "sector": str(latest_row["sector"]),
            "capacity": int(latest_row["capacity"])
        }
    return latest_metrics


def classify_congestion(average_speed_kmh: float) -> str:
    """
    Classifies route congestion according to documented STMS rules:
    - Clear: average_speed >= 45.0 km/h
    - Moderate: 25.0 <= average_speed < 45.0 km/h
    - Heavy: average_speed < 25.0 km/h
    """
    if average_speed_kmh >= 45.0:
        return "Clear"
    elif average_speed_kmh >= 25.0:
        return "Moderate"
    else:
        return "Heavy"


def evaluate_routes(source_id: str, dest_id: str) -> Dict[str, Any]:
    """
    Evaluates alternative routes between source_id and dest_id:
    1. Finds alternative acyclic paths (DFS, max 5 hops).
    2. Computes segment transit times based on connected junctions' speed.
    3. Aggregates intermediate junction delays (avoids double counting start/end junctions).
    4. Computes total estimated travel time and classifies overall congestion.
    5. Selects the recommended route with clear, transparent explanation.
    """
    all_junctions = {j["junction_id"]: j for j in get_all_junctions()}

    if source_id not in all_junctions:
        raise ValueError(f"Unknown source junction ID: '{source_id}'")
    if dest_id not in all_junctions:
        raise ValueError(f"Unknown destination junction ID: '{dest_id}'")
    if source_id == dest_id:
        raise ValueError("Source and destination junctions cannot be the same.")

    paths = find_alternative_paths(source_id, dest_id, max_hops=5)
    latest_metrics = get_latest_traffic_metrics()

    if not paths:
        return {
            "source": all_junctions[source_id],
            "destination": all_junctions[dest_id],
            "recommended_route_id": None,
            "recommendation_reason": "No feasible corridor route found within 5 hops in the current network model.",
            "routes": []
        }

    evaluated_routes: List[Dict[str, Any]] = []

    for idx, path in enumerate(paths, start=1):
        total_distance_km = 0.0
        total_transit_time_mins = 0.0
        segments_detail: List[Dict[str, Any]] = []

        # Calculate segment travel times
        for i in range(len(path) - 1):
            u = path[i]
            v = path[i + 1]
            seg_dist = SEGMENT_DISTANCES.get((u, v), 5.0)
            total_distance_km += seg_dist

            # Segment speed is the harmonic mean / average of the two connected junctions
            speed_u = latest_metrics.get(u, {}).get("average_speed", 35.0)
            speed_v = latest_metrics.get(v, {}).get("average_speed", 35.0)
            effective_seg_speed = round((speed_u + speed_v) / 2.0, 1)
            effective_seg_speed = max(effective_seg_speed, 5.0)  # Avoid div by zero

            seg_time_mins = round((seg_dist / effective_seg_speed) * 60.0, 1)
            total_transit_time_mins += seg_time_mins

            segments_detail.append({
                "from_junction_id": u,
                "from_junction_name": all_junctions[u]["junction_name"],
                "to_junction_id": v,
                "to_junction_name": all_junctions[v]["junction_name"],
                "distance_km": round(seg_dist, 1),
                "estimated_segment_time_mins": seg_time_mins,
                "segment_speed_kmh": effective_seg_speed
            })

        # Junction delay aggregation:
        # Sum delays of intermediate junctions (path[1:-1]) to represent intersection wait times,
        # plus 50% of destination approach delay.
        intermediate_delay = 0
        for intermediate_junc in path[1:-1]:
            intermediate_delay += latest_metrics.get(intermediate_junc, {}).get("estimated_delay", 0)

        # Add half of destination approach delay
        dest_delay = int(round(latest_metrics.get(path[-1], {}).get("estimated_delay", 0) * 0.5))
        total_delay = intermediate_delay + dest_delay

        total_estimated_time_mins = round(total_transit_time_mins + total_delay, 1)
        avg_speed = round((total_distance_km / (total_estimated_time_mins / 60.0)), 1) if total_estimated_time_mins > 0 else 0.0
        status = classify_congestion(avg_speed)

        # Generate a descriptive route title
        if len(path) == 2:
            route_name = f"Direct Corridor via {all_junctions[path[0]]['junction_name']}"
        else:
            via_names = [all_junctions[j]["junction_name"].split()[0] for j in path[1:-1]]
            route_name = f"Corridor via {' & '.join(via_names)}"

        evaluated_routes.append({
            "route_id": f"route-{idx}",
            "route_name": route_name,
            "junction_ids": path,
            "junction_names": [all_junctions[j]["junction_name"] for j in path],
            "total_distance_km": round(total_distance_km, 1),
            "estimated_time_mins": total_estimated_time_mins,
            "average_speed_kmh": avg_speed,
            "total_delay_mins": total_delay,
            "congestion_status": status,
            "is_recommended": False,
            "segments": segments_detail
        })

    # Sort routes by estimated travel time ascending
    evaluated_routes.sort(key=lambda r: r["estimated_time_mins"])

    # Best route is the one with minimal travel time
    best_route = evaluated_routes[0]
    best_route["is_recommended"] = True

    # Build human-readable reason
    if len(evaluated_routes) > 1:
        time_diff = round(evaluated_routes[1]["estimated_time_mins"] - best_route["estimated_time_mins"], 1)
        reason = (
            f"Recommended: {best_route['route_name']} provides the lowest estimated travel time "
            f"({best_route['estimated_time_mins']} mins at {best_route['average_speed_kmh']} km/h), "
            f"saving approximately {time_diff} minutes compared to the alternative."
        )
    else:
        reason = (
            f"Recommended: {best_route['route_name']} is the primary corridor connecting these "
            f"sectors with an estimated travel time of {best_route['estimated_time_mins']} mins."
        )

    return {
        "source": all_junctions[source_id],
        "destination": all_junctions[dest_id],
        "recommended_route_id": best_route["route_id"],
        "recommendation_reason": reason,
        "routes": evaluated_routes
    }
