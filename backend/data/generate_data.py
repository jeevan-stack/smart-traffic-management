"""
Generate Realistic 24-Hour Traffic Observations Dataset for 8 Urban Junctions
Team RouteX • Smart Traffic Management System
"""

import csv
import random

random.seed(42)  # Deterministic seed for reproducible academic testing

junctions = [
    {"id": "J-01", "name": "MG Road Central Corridor", "sector": "Central Business District", "capacity": 1800, "base_speed": 48},
    {"id": "J-02", "name": "Outer Ring Road (North)", "sector": "IT & Tech Corridor", "capacity": 2500, "base_speed": 60},
    {"id": "J-03", "name": "Airport Expressway", "sector": "North Sector", "capacity": 2800, "base_speed": 75},
    {"id": "J-04", "name": "Brigade Road Commercial", "sector": "Commercial District", "capacity": 1600, "base_speed": 45},
    {"id": "J-05", "name": "Residency Road Arterial", "sector": "Central Sector", "capacity": 1900, "base_speed": 50},
    {"id": "J-06", "name": "Electronic City Elevated Flyover", "sector": "South Sector", "capacity": 2400, "base_speed": 65},
    {"id": "J-07", "name": "Hosur Road Junction", "sector": "South Sector", "capacity": 2200, "base_speed": 45},
    {"id": "J-08", "name": "Bannerghatta Link Road", "sector": "South-West Sector", "capacity": 2000, "base_speed": 55},
]

# Hourly traffic volume multiplier profile (24 hours: 00:00 to 23:00)
# Peaks at 8-10 AM (morning commute) and 17-20 PM (evening commute)
hourly_profile = [
    0.12, 0.08, 0.06, 0.05, 0.09, 0.22,  # 00:00 - 05:00
    0.45, 0.78, 0.95, 0.92, 0.70, 0.65,  # 06:00 - 11:00 (morning peak)
    0.68, 0.64, 0.66, 0.72, 0.85, 0.98,  # 12:00 - 17:00 (mid-day & start evening)
    0.94, 0.88, 0.75, 0.58, 0.38, 0.22   # 18:00 - 23:00 (evening peak & wind down)
]

output_path = r"c:\Users\jeeva\OneDrive\Desktop\PBL\backend\data\traffic_observations.csv"

rows = []
obs_id = 101

date_str = "2026-10-18"

for j in junctions:
    for hour in range(24):
        timestamp = f"{date_str}T{hour:02d}:00:00"
        mult = hourly_profile[hour]

        # Add realistic noise (+/- 10%)
        noise = random.uniform(0.92, 1.08)
        volume = int(j["capacity"] * mult * noise)
        volume = max(50, min(j["capacity"] + 300, volume))

        # Volume-to-Capacity ratio
        vc_ratio = volume / j["capacity"]

        # Speed inversely correlates with volume/capacity
        if vc_ratio > 0.88:
            # Heavy congestion
            speed = round(random.uniform(11.0, 23.5), 1)
            delay = int(random.uniform(16, 28))
        elif vc_ratio > 0.60:
            # Moderate traffic
            speed = round(random.uniform(26.0, 43.5), 1)
            delay = int(random.uniform(6, 14))
        else:
            # Clear / Free Flow
            speed = round(random.uniform(46.0, j["base_speed"] + 2), 1)
            delay = int(random.uniform(0, 4))

        rows.append({
            "observation_id": obs_id,
            "timestamp": timestamp,
            "junction_id": j["id"],
            "junction_name": j["name"],
            "sector": j["sector"],
            "vehicle_volume": volume,
            "average_speed": speed,
            "estimated_delay": delay,
            "capacity": j["capacity"],
            "data_source": "simulated_sample"
        })
        obs_id += 1

fieldnames = [
    "observation_id", "timestamp", "junction_id", "junction_name",
    "sector", "vehicle_volume", "average_speed", "estimated_delay",
    "capacity", "data_source"
]

with open(output_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"Generated {len(rows)} observation rows into {output_path}")
