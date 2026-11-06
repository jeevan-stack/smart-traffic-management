/**
 * Asynchronous API Client to FastAPI Backend
 * Team RouteX • Smart Traffic Management System
 */

import type {
  HealthStatus,
  Junction,
  TrafficListResponse,
  TrafficSummary,
  CongestionHotspot,
  FilterParams,
  RouteCompareRequest,
  RouteCompareResponse
} from '../types/traffic';

const BASE_URL = 'http://127.0.0.1:8001/api';

/**
 * Custom error class capturing HTTP status code and details.
 */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(options?.headers || {})
      }
    });

    if (!res.ok) {
      let detail = `HTTP ${res.status}: ${res.statusText}`;
      try {
        const errorJson = await res.json();
        if (errorJson.detail) {
          detail = errorJson.detail;
        }
      } catch {
        // Fallback to text status
      }
      throw new ApiError(detail, res.status);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Unable to connect to FastAPI backend. Is the server running on port 8001?', 0);
  }
}

export const trafficApi = {
  getHealth: () => request<HealthStatus>('/health'),

  getJunctions: () => request<Junction[]>('/junctions'),

  getTraffic: (filters: FilterParams = {}) => {
    const query = new URLSearchParams();
    if (filters.junction_id && filters.junction_id !== 'all') {
      query.append('junction_id', filters.junction_id);
    }
    if (filters.status && filters.status !== 'all') {
      query.append('status', filters.status);
    }
    if (filters.start_time) {
      query.append('start_time', filters.start_time);
    }
    if (filters.end_time) {
      query.append('end_time', filters.end_time);
    }
    const qStr = query.toString();
    return request<TrafficListResponse>(`/traffic${qStr ? `?${qStr}` : ''}`);
  },

  getSummary: (filters: FilterParams = {}) => {
    const query = new URLSearchParams();
    if (filters.junction_id && filters.junction_id !== 'all') {
      query.append('junction_id', filters.junction_id);
    }
    if (filters.status && filters.status !== 'all') {
      query.append('status', filters.status);
    }
    if (filters.start_time) {
      query.append('start_time', filters.start_time);
    }
    if (filters.end_time) {
      query.append('end_time', filters.end_time);
    }
    const qStr = query.toString();
    return request<TrafficSummary>(`/traffic/summary${qStr ? `?${qStr}` : ''}`);
  },

  getHotspots: (limit: number = 5) => request<CongestionHotspot[]>(`/traffic/hotspots?limit=${limit}`),

  compareRoutes: (payload: RouteCompareRequest) =>
    request<RouteCompareResponse>('/routes/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
};
