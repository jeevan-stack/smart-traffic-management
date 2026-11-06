"""
Health Check Endpoint
"""

from fastapi import APIRouter
from backend.app.models.schemas import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["System"])
def get_health():
    """
    Returns server health status, data availability, and sample dataset count.
    """
    # Try importing data loader to report actual record count if loaded
    try:
        from backend.app.services.data_loader import get_dataset_stats
        stats = get_dataset_stats()
        return HealthResponse(
            status="healthy",
            data_loaded=stats.get("loaded", False),
            record_count=stats.get("count", 0),
            simulation_notice="All data is simulated demo data for academic decision support."
        )
    except Exception:
        return HealthResponse(
            status="healthy",
            data_loaded=False,
            record_count=0,
            simulation_notice="All data is simulated demo data for academic decision support."
        )
