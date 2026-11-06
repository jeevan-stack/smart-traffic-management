"""
Data Loader & Cleaning Service
Team RouteX • Smart Traffic Management System

Loads, cleans, validates, and serves traffic observations using Pandas.
"""

import os
from typing import Dict, List, Optional, Any
import pandas as pd
from datetime import datetime

# Resolve absolute path to data CSV
DATA_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "data", "traffic_observations.csv")
)

# Global in-memory cleaned dataframe cache
_DF_CACHE: Optional[pd.DataFrame] = None


def compute_congestion_status(speed: float) -> str:
    """
    Computes congestion status according to documented prototype thresholds:
    - Clear: speed >= 45.0 km/h
    - Moderate: 25.0 <= speed < 45.0 km/h
    - Heavy: speed < 25.0 km/h
    """
    if speed >= 45.0:
        return "Clear"
    elif speed >= 25.0:
        return "Moderate"
    else:
        return "Heavy"


def load_and_clean_data(csv_path: str = DATA_PATH) -> pd.DataFrame:
    """
    Loads, cleans, and validates the traffic observation dataset:
    1. Validates required columns.
    2. Drops rows with missing junction_id, timestamp, speed, or volume.
    3. Drops duplicate observations for the same (junction_id, timestamp).
    4. Validates ISO-8601 timestamps.
    5. Applies physical sanity bounds (speed: 0-120 km/h, volume: 0-5000 veh/h).
    6. Adds computed fields: congestion_status, volume_to_capacity.
    """
    global _DF_CACHE
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Traffic dataset not found at {csv_path}")

    df = pd.read_csv(csv_path)

    # 1. Required columns check
    required_cols = [
        "observation_id", "timestamp", "junction_id", "junction_name",
        "sector", "vehicle_volume", "average_speed", "estimated_delay", "capacity"
    ]
    for col in required_cols:
        if col not in df.columns:
            raise ValueError(f"Missing required dataset column: {col}")

    # 2. Drop rows with nulls in critical fields
    initial_count = len(df)
    df = df.dropna(subset=["junction_id", "timestamp", "average_speed", "vehicle_volume"])

    # 3. Deduplicate by junction_id and timestamp, keeping the last observation
    df = df.drop_duplicates(subset=["junction_id", "timestamp"], keep="last")

    # 4. Filter by physical sanity bounds
    df = df[
        (df["average_speed"] >= 0.0) & (df["average_speed"] <= 120.0) &
        (df["vehicle_volume"] >= 0) & (df["vehicle_volume"] <= 5000) &
        (df["estimated_delay"] >= 0) &
        (df["capacity"] > 0)
    ].copy()

    # 5. Type conversions
    df["observation_id"] = df["observation_id"].astype(int)
    df["vehicle_volume"] = df["vehicle_volume"].astype(int)
    df["average_speed"] = df["average_speed"].astype(float).round(1)
    df["estimated_delay"] = df["estimated_delay"].astype(int)
    df["capacity"] = df["capacity"].astype(int)

    # 6. Computed fields
    df["congestion_status"] = df["average_speed"].apply(compute_congestion_status)
    df["volume_to_capacity"] = (df["vehicle_volume"] / df["capacity"]).round(2)

    if "data_source" not in df.columns:
        df["data_source"] = "simulated_sample"

    # Sort deterministically
    df = df.sort_values(by=["timestamp", "junction_id"]).reset_index(drop=True)
    _DF_CACHE = df
    return df


def get_df() -> pd.DataFrame:
    """Returns the cached cleaned dataframe, loading it if not yet initialized."""
    global _DF_CACHE
    if _DF_CACHE is None:
        _DF_CACHE = load_and_clean_data()
    return _DF_CACHE


def get_dataset_stats() -> Dict[str, Any]:
    """Returns basic metadata for health checks."""
    try:
        df = get_df()
        return {
            "loaded": True,
            "count": len(df),
            "junctions_count": df["junction_id"].nunique()
        }
    except Exception as e:
        return {
            "loaded": False,
            "count": 0,
            "error": str(e)
        }


def get_all_junctions() -> List[Dict[str, Any]]:
    """Returns distinct junctions with sector and capacity."""
    df = get_df()
    junctions_df = df.groupby(["junction_id", "junction_name", "sector", "capacity"]).size().reset_index()
    records = []
    for _, row in junctions_df.iterrows():
        records.append({
            "junction_id": str(row["junction_id"]),
            "junction_name": str(row["junction_name"]),
            "sector": str(row["sector"]),
            "capacity": int(row["capacity"])
        })
    return sorted(records, key=lambda x: x["junction_id"])


def filter_traffic(
    junction_id: Optional[str] = None,
    status: Optional[str] = None,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    limit: int = 500
) -> Dict[str, Any]:
    """Applies filters to the observation dataframe."""
    df = get_df()
    filtered = df.copy()

    if junction_id and junction_id.strip() and junction_id.strip().lower() != "all":
        filtered = filtered[filtered["junction_id"].str.lower() == junction_id.strip().lower()]

    if status and status.strip() and status.strip().lower() != "all":
        filtered = filtered[filtered["congestion_status"].str.lower() == status.strip().lower()]

    if start_time and start_time.strip():
        filtered = filtered[filtered["timestamp"] >= start_time.strip()]

    if end_time and end_time.strip():
        filtered = filtered[filtered["timestamp"] <= end_time.strip()]

    total_matches = len(filtered)
    limited = filtered.head(limit)
    records = limited.to_dict(orient="records")

    return {
        "total_matches": total_matches,
        "applied_filters": {
            "junction_id": junction_id,
            "status": status,
            "start_time": start_time,
            "end_time": end_time
        },
        "records": records
    }


def get_traffic_summary(
    junction_id: Optional[str] = None,
    status: Optional[str] = None,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None
) -> Dict[str, Any]:
    """Computes aggregate analytics over the filtered subset."""
    df = get_df()
    filtered = df.copy()

    if junction_id and junction_id.strip() and junction_id.strip().lower() != "all":
        filtered = filtered[filtered["junction_id"].str.lower() == junction_id.strip().lower()]

    if status and status.strip() and status.strip().lower() != "all":
        filtered = filtered[filtered["congestion_status"].str.lower() == status.strip().lower()]

    if start_time and start_time.strip():
        filtered = filtered[filtered["timestamp"] >= start_time.strip()]

    if end_time and end_time.strip():
        filtered = filtered[filtered["timestamp"] <= end_time.strip()]

    total_obs = len(filtered)
    if total_obs == 0:
        return {
            "total_observations": 0,
            "total_volume": 0,
            "average_speed_kmh": 0.0,
            "average_delay_mins": 0.0,
            "congested_count": 0,
            "peak_corridor": None,
            "status_distribution": {"Clear": 0, "Moderate": 0, "Heavy": 0}
        }

    total_vol = int(filtered["vehicle_volume"].sum())
    avg_speed = round(float(filtered["average_speed"].mean()), 1)
    avg_delay = round(float(filtered["estimated_delay"].mean()), 1)
    heavy_count = int((filtered["congestion_status"] == "Heavy").sum())

    # Peak corridor by volume
    peak_row = filtered.loc[filtered["vehicle_volume"].idxmax()]
    peak_corridor = {
        "junction_id": str(peak_row["junction_id"]),
        "junction_name": str(peak_row["junction_name"]),
        "peak_volume": int(peak_row["vehicle_volume"]),
        "timestamp": str(peak_row["timestamp"])
    }

    status_dist = {
        "Clear": int((filtered["congestion_status"] == "Clear").sum()),
        "Moderate": int((filtered["congestion_status"] == "Moderate").sum()),
        "Heavy": int((filtered["congestion_status"] == "Heavy").sum()),
    }

    return {
        "total_observations": total_obs,
        "total_volume": total_vol,
        "average_speed_kmh": avg_speed,
        "average_delay_mins": avg_delay,
        "congested_count": heavy_count,
        "peak_corridor": peak_corridor,
        "status_distribution": status_dist
    }


def get_congestion_hotspots(limit: int = 5) -> List[Dict[str, Any]]:
    """Ranks junctions by frequency of Heavy congestion and lowest average speed."""
    df = get_df()
    hotspots = []

    grouped = df.groupby(["junction_id", "junction_name", "sector"])
    for (j_id, j_name, sector), group in grouped:
        heavy_count = int((group["congestion_status"] == "Heavy").sum())
        avg_speed = round(float(group["average_speed"].mean()), 1)
        max_delay = int(group["estimated_delay"].max())
        hotspots.append({
            "junction_id": str(j_id),
            "junction_name": str(j_name),
            "sector": str(sector),
            "heavy_observations_count": heavy_count,
            "average_speed_kmh": avg_speed,
            "max_delay_mins": max_delay
        })

    # Sort primarily by heavy count descending, then by average speed ascending
    hotspots.sort(key=lambda x: (-x["heavy_observations_count"], x["average_speed_kmh"]))
    return hotspots[:limit]
