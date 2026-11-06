"""
Smart Traffic Management System (STMS) - FastAPI Application
Team RouteX • Academic Decision-Support Prototype
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.endpoints import router as api_router

app = FastAPI(
    title="RouteX Smart Traffic Management System API",
    description="Academic traffic analytics, corridor monitoring, and route comparison API for Team RouteX",
    version="1.0.0"
)

# CORS configuration restricted to local frontend origins
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the modular API router
app.include_router(api_router, prefix="/api")


@app.get("/", tags=["Root"])
def root_endpoint():
    return {
        "system": "RouteX Smart Traffic Management System API",
        "team": "Team RouteX",
        "documentation": "/docs",
        "health": "/api/health",
        "simulation_notice": "All data is simulated demo data for academic decision support."
    }
