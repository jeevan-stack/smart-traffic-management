"""
Traffic REST API Endpoints
Team RouteX • Smart Traffic Management System
"""

from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException
from backend.app.models.schemas import (
    JunctionInfo,
    TrafficListResponse,
    TrafficSummaryResponse,
    CongestionHotspot,
    FilterParameters,
    RouteCompareRequest,
    RouteCompareResponse
)
from backend.app.services.data_loader import (
    get_all_junctions,
    filter_traffic,
    get_traffic_summary,
    get_congestion_hotspots
)
from backend.app.services.route_service import evaluate_routes
from backend.app.api.health import router as health_router

router = APIRouter()

# Include health router
router.include_router(health_router)


@router.get("/junctions", response_model=List[JunctionInfo], tags=["Junctions"])
def list_junctions():
    """
    Returns the list of all monitored urban junctions with sectors and designed capacities.
    """
    try:
        return get_all_junctions()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load junctions: {str(e)}")


@router.get("/traffic", response_model=TrafficListResponse, tags=["Traffic Observations"])
def list_traffic_observations(
    junction_id: Optional[str] = Query(None, description="Filter by Junction ID (e.g. J-01)"),
    status: Optional[str] = Query(None, description="Filter by status (Clear, Moderate, Heavy)"),
    start_time: Optional[str] = Query(None, description="ISO-8601 start timestamp (e.g. 2026-10-18T08:00:00)"),
    end_time: Optional[str] = Query(None, description="ISO-8601 end timestamp (e.g. 2026-10-18T20:00:00)"),
    limit: int = Query(500, ge=1, le=500, description="Max observation records to return")
):
    """
    Returns filtered traffic observation records. Supports junction, status, and time range filters.
    """
    if status and status.lower() not in ["all", "clear", "moderate", "heavy"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid status filter. Allowed values: 'Clear', 'Moderate', 'Heavy', 'all'."
        )

    try:
        result = filter_traffic(
            junction_id=junction_id,
            status=status,
            start_time=start_time,
            end_time=end_time,
            limit=limit
        )
        return TrafficListResponse(
            total_matches=result["total_matches"],
            applied_filters=FilterParameters(**result["applied_filters"]),
            records=result["records"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Traffic query failed: {str(e)}")


@router.get("/traffic/summary", response_model=TrafficSummaryResponse, tags=["Traffic Analytics"])
def get_summary(
    junction_id: Optional[str] = Query(None, description="Filter summary by Junction ID"),
    status: Optional[str] = Query(None, description="Filter summary by status"),
    start_time: Optional[str] = Query(None, description="ISO-8601 start timestamp"),
    end_time: Optional[str] = Query(None, description="ISO-8601 end timestamp")
):
    """
    Computes high-level aggregate summary metrics for the given filter parameters.
    Keeps cards, charts, and table strictly synchronized.
    """
    try:
        data = get_traffic_summary(
            junction_id=junction_id,
            status=status,
            start_time=start_time,
            end_time=end_time
        )
        return TrafficSummaryResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summary computation failed: {str(e)}")


@router.get("/traffic/hotspots", response_model=List[CongestionHotspot], tags=["Traffic Analytics"])
def get_hotspots(
    limit: int = Query(5, ge=1, le=20, description="Number of hotspots to return")
):
    """
    Returns corridors ranked by frequency of heavy congestion and lowest average speed.
    """
    try:
        return get_congestion_hotspots(limit=limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hotspot computation failed: {str(e)}")


# ==============================================================================
# Feature 5 & 6: Route Planner & Comparison Endpoint
# ==============================================================================

@router.post("/routes/compare", response_model=RouteCompareResponse, tags=["Route Planning"])
def compare_routes(request: RouteCompareRequest):
    """
    Evaluates and compares alternative corridor routes between source and destination junctions.
    Calculates distance, dynamic transit time, intersection delays, and recommendation rationale.
    """
    src = request.source_junction_id.strip()
    dst = request.destination_junction_id.strip()

    if not src or not dst:
        raise HTTPException(status_code=400, detail="Source and destination junctions are required.")

    if src.upper() == dst.upper():
        raise HTTPException(
            status_code=400,
            detail="Source and destination junctions cannot be the same. Please select distinct junctions."
        )

    try:
        result = evaluate_routes(source_id=src, dest_id=dst)
        return RouteCompareResponse(**result)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Route evaluation failed: {str(e)}")
