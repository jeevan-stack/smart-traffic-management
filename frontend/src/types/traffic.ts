/**
 * TypeScript Data Models matching FastAPI schemas
 * Team RouteX • Smart Traffic Management System
 */

export interface Junction {
  junction_id: string;
  junction_name: string;
  sector: string;
  capacity: number;
}

export interface TrafficObservation {
  observation_id: number;
  timestamp: string;
  junction_id: string;
  junction_name: string;
  sector: string;
  vehicle_volume: number;
  average_speed: number;
  estimated_delay: number;
  capacity: number;
  congestion_status: 'Clear' | 'Moderate' | 'Heavy' | string;
  volume_to_capacity: number;
  data_source: string;
}

export interface FilterParams {
  junction_id?: string;
  status?: string;
  start_time?: string;
  end_time?: string;
}

export interface TrafficListResponse {
  total_matches: number;
  applied_filters: FilterParams;
  records: TrafficObservation[];
}

export interface PeakCorridor {
  junction_id: string;
  junction_name: string;
  peak_volume: number;
  timestamp: string;
}

export interface TrafficSummary {
  total_observations: number;
  total_volume: number;
  average_speed_kmh: number;
  average_delay_mins: number;
  congested_count: number;
  peak_corridor?: PeakCorridor | null;
  status_distribution: {
    Clear: number;
    Moderate: number;
    Heavy: number;
  };
}

export interface CongestionHotspot {
  junction_id: string;
  junction_name: string;
  sector: string;
  heavy_observations_count: number;
  average_speed_kmh: number;
  max_delay_mins: number;
}

export interface HealthStatus {
  status: string;
  data_loaded: boolean;
  record_count: number;
  simulation_notice: string;
}

// ==============================================================================
// Route Planner & Route Comparison (Features 5 & 6)
// Field names match backend Pydantic schemas exactly.
// ==============================================================================

export interface RouteCompareRequest {
  source_junction_id: string;
  destination_junction_id: string;
  time_filter?: string;
}

export interface RouteSegmentDetail {
  from_junction_id: string;
  from_junction_name: string;
  to_junction_id: string;
  to_junction_name: string;
  distance_km: number;
  estimated_segment_time_mins: number;
  segment_speed_kmh: number;
}

export interface RouteOption {
  route_id: string;
  route_name: string;
  junction_ids: string[];
  junction_names: string[];
  total_distance_km: number;
  estimated_time_mins: number;
  average_speed_kmh: number;
  total_delay_mins: number;
  congestion_status: string;
  is_recommended: boolean;
  segments: RouteSegmentDetail[];
}

export interface RouteCompareResponse {
  source: Junction;
  destination: Junction;
  recommended_route_id: string | null;
  recommendation_reason: string;
  routes: RouteOption[];
  simulation_notice: string;
}
