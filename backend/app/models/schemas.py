"""
Pydantic Schemas for Traffic Observations and Route Planning API
Team RouteX • Smart Traffic Management System
"""

from typing import List, Optional, Dict
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(..., json_schema_extra={"example": "healthy"})
    data_loaded: bool = Field(..., json_schema_extra={"example": True})
    record_count: int = Field(..., json_schema_extra={"example": 192})
    simulation_notice: str = Field(
        ...,
        json_schema_extra={"example": "All data is simulated demo data for academic decision support."}
    )


class JunctionInfo(BaseModel):
    junction_id: str = Field(..., json_schema_extra={"example": "J-01"})
    junction_name: str = Field(..., json_schema_extra={"example": "MG Road Central Corridor"})
    sector: str = Field(..., json_schema_extra={"example": "Central Business District"})
    capacity: int = Field(..., json_schema_extra={"example": 1800})


class TrafficObservation(BaseModel):
    observation_id: int
    timestamp: str
    junction_id: str
    junction_name: str
    sector: str
    vehicle_volume: int
    average_speed: float
    estimated_delay: int
    capacity: int
    congestion_status: str
    volume_to_capacity: float
    data_source: str = "simulated_sample"


class FilterParameters(BaseModel):
    junction_id: Optional[str] = None
    status: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None


class TrafficListResponse(BaseModel):
    total_matches: int
    applied_filters: FilterParameters
    records: List[TrafficObservation]


class PeakCorridor(BaseModel):
    junction_id: str
    junction_name: str
    peak_volume: int
    timestamp: str


class TrafficSummaryResponse(BaseModel):
    total_observations: int
    total_volume: int
    average_speed_kmh: float
    average_delay_mins: float
    congested_count: int
    peak_corridor: Optional[PeakCorridor] = None
    status_distribution: Dict[str, int]


class CongestionHotspot(BaseModel):
    junction_id: str
    junction_name: str
    sector: str
    heavy_observations_count: int
    average_speed_kmh: float
    max_delay_mins: int


# ==========================================
# Route Planner & Route Comparison Schemas
# ==========================================

class RouteCompareRequest(BaseModel):
    source_junction_id: str = Field(..., json_schema_extra={"example": "J-01"})
    destination_junction_id: str = Field(..., json_schema_extra={"example": "J-06"})
    time_filter: Optional[str] = Field("latest", json_schema_extra={"example": "latest"})


class RouteSegmentDetail(BaseModel):
    from_junction_id: str
    from_junction_name: str
    to_junction_id: str
    to_junction_name: str
    distance_km: float
    estimated_segment_time_mins: float
    segment_speed_kmh: float


class RouteOption(BaseModel):
    route_id: str
    route_name: str
    junction_ids: List[str]
    junction_names: List[str]
    total_distance_km: float
    estimated_time_mins: float
    average_speed_kmh: float
    total_delay_mins: int
    congestion_status: str
    is_recommended: bool
    segments: List[RouteSegmentDetail]


class RouteCompareResponse(BaseModel):
    source: JunctionInfo
    destination: JunctionInfo
    recommended_route_id: Optional[str] = None
    recommendation_reason: str
    routes: List[RouteOption]
    simulation_notice: str = (
        "Route distances and travel-time estimates are based on simulated academic "
        "sample data and are not live navigation predictions."
    )
