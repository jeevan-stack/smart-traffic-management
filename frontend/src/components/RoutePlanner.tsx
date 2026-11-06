/**
 * Route Planner & Comparison Component — Features 5 & 6
 * Team RouteX • Smart Traffic Management System
 *
 * Displays source/destination selectors, triggers POST /api/routes/compare,
 * and renders side-by-side alternative route comparison cards.
 */

import React, { useState } from 'react';
import type { Junction, RouteOption, RouteCompareResponse } from '../types/traffic';
import { trafficApi, ApiError } from '../services/api';

interface RoutePlannerProps {
  junctions: Junction[];
  isBackendConnected: boolean;
}

// Status pill consistent with the existing TrafficTable style
function CongestionBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  if (lower === 'clear') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
        <span aria-hidden="true">●</span> Clear
      </span>
    );
  }
  if (lower === 'moderate') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
        <span aria-hidden="true">●</span> Moderate
      </span>
    );
  }
  if (lower === 'heavy') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-900 border border-red-300">
        <span aria-hidden="true">●</span> Heavy
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800">
      {status}
    </span>
  );
}

function RouteCard({ route, rank }: { route: RouteOption; rank: number }) {
  const [segmentsOpen, setSegmentsOpen] = useState(false);

  return (
    <article
      className={`rounded-xl border-2 p-5 flex flex-col gap-3 ${
        route.is_recommended
          ? 'border-blue-700 bg-blue-50/40'
          : 'border-slate-200 bg-white'
      }`}
      aria-label={`Route ${rank}: ${route.route_name}`}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            {route.is_recommended && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-700 text-white">
                ★ Recommended
              </span>
            )}
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
              Route {rank}
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
            {route.route_name}
          </h4>
        </div>
        <CongestionBadge status={route.congestion_status} />
      </div>

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-center">
          <p className="text-2xl font-extrabold text-slate-900">
            {route.estimated_time_mins}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">mins total</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-center">
          <p className="text-2xl font-extrabold text-slate-700">
            {route.total_distance_km}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">km distance</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-center">
          <p className="text-2xl font-extrabold text-blue-700">
            {route.average_speed_kmh}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">km/h avg speed</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-center">
          <p className="text-2xl font-extrabold text-amber-600">
            {route.total_delay_mins}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">mins delay</p>
        </div>
      </div>

      {/* Junction sequence */}
      <div>
        <p className="text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
          Corridor Sequence:
        </p>
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {route.junction_names.map((name, i) => (
            <React.Fragment key={route.junction_ids[i]}>
              <span className="bg-slate-100 border border-slate-200 text-slate-800 px-2 py-0.5 rounded font-medium">
                {name}
              </span>
              {i < route.junction_names.length - 1 && (
                <span className="text-slate-400 font-bold">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Segment breakdown toggle */}
      <div>
        <button
          type="button"
          onClick={() => setSegmentsOpen((v) => !v)}
          className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline focus:outline-none"
          aria-expanded={segmentsOpen}
        >
          {segmentsOpen ? '▲ Hide segment details' : '▼ Show segment details'}
        </button>

        {segmentsOpen && (
          <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 font-bold text-slate-700">From</th>
                  <th className="px-3 py-2 font-bold text-slate-700">To</th>
                  <th className="px-3 py-2 font-bold text-slate-700 text-right">Dist (km)</th>
                  <th className="px-3 py-2 font-bold text-slate-700 text-right">Speed (km/h)</th>
                  <th className="px-3 py-2 font-bold text-slate-700 text-right">Time (mins)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {route.segments.map((seg, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-3 py-2 text-slate-700 font-medium">
                      {seg.from_junction_name}
                    </td>
                    <td className="px-3 py-2 text-slate-700 font-medium">
                      {seg.to_junction_name}
                    </td>
                    <td className="px-3 py-2 text-right text-slate-900 font-mono">
                      {seg.distance_km}
                    </td>
                    <td className="px-3 py-2 text-right text-slate-900 font-mono">
                      {seg.segment_speed_kmh}
                    </td>
                    <td className="px-3 py-2 text-right text-slate-900 font-mono">
                      {seg.estimated_segment_time_mins}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </article>
  );
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  junctions,
  isBackendConnected
}) => {
  const [sourceId, setSourceId] = useState<string>('J-01');
  const [destId, setDestId] = useState<string>('J-06');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RouteCompareResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSwap = () => {
    setSourceId(destId);
    setDestId(sourceId);
    setResult(null);
    setError(null);
    setValidationError(null);
  };

  const handleCompare = async () => {
    setValidationError(null);
    setError(null);

    if (!sourceId || !destId) {
      setValidationError('Please select both source and destination junctions.');
      return;
    }
    if (sourceId === destId) {
      setValidationError('Source and destination cannot be the same junction. Please select different junctions.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await trafficApi.compareRoutes({
        source_junction_id: sourceId,
        destination_junction_id: destId,
        time_filter: 'latest'
      });
      setResult(response);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to connect to backend. Ensure the FastAPI server is running on port 8000.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSourceChange = (val: string) => {
    setSourceId(val);
    setResult(null);
    setError(null);
    setValidationError(null);
  };

  const handleDestChange = (val: string) => {
    setDestId(val);
    setResult(null);
    setError(null);
    setValidationError(null);
  };

  const selectClass =
    'bg-white border border-slate-300 text-slate-800 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-600 focus:outline-none w-full';

  return (
    <section
      id="route-planner-section"
      className="bg-white border border-slate-200 rounded-xl shadow-sm mb-6"
      aria-labelledby="route-planner-heading"
    >
      {/* Section header */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 id="route-planner-heading" className="text-base font-bold text-slate-900">
            Route Planner &amp; Corridor Comparison
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare alternative corridor routes between two junctions using simulated traffic observations.
          </p>
        </div>
        <span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full">
          Decision Support
        </span>
      </div>

      <div className="p-5">
        {/* Controls row */}
        <div className="flex flex-col sm:flex-row items-end gap-3 mb-4">
          {/* Source */}
          <div className="flex-1 min-w-[180px]">
            <label htmlFor="route-source" className="block text-xs font-semibold text-slate-700 mb-1">
              Source Junction:
            </label>
            <select
              id="route-source"
              value={sourceId}
              onChange={(e) => handleSourceChange(e.target.value)}
              className={selectClass}
              disabled={loading}
            >
              {junctions.map((j) => (
                <option key={j.junction_id} value={j.junction_id}>
                  {j.junction_name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap button */}
          <div className="flex-shrink-0 pb-0 sm:pb-0">
            <button
              type="button"
              onClick={handleSwap}
              disabled={loading}
              title="Swap source and destination"
              aria-label="Swap source and destination"
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors disabled:opacity-40 text-base font-bold"
            >
              ⇄
            </button>
          </div>

          {/* Destination */}
          <div className="flex-1 min-w-[180px]">
            <label htmlFor="route-dest" className="block text-xs font-semibold text-slate-700 mb-1">
              Destination Junction:
            </label>
            <select
              id="route-dest"
              value={destId}
              onChange={(e) => handleDestChange(e.target.value)}
              className={selectClass}
              disabled={loading}
            >
              {junctions.map((j) => (
                <option key={j.junction_id} value={j.junction_id}>
                  {j.junction_name}
                </option>
              ))}
            </select>
          </div>

          {/* Compare button */}
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={handleCompare}
              disabled={loading || !isBackendConnected}
              className="h-9 px-4 rounded-lg bg-blue-700 text-white text-sm font-bold hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? 'Comparing...' : 'Compare Routes'}
            </button>
          </div>
        </div>

        {/* Backend offline warning */}
        {!isBackendConnected && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold">
            Backend is offline. Start the FastAPI server to use route comparison.
          </div>
        )}

        {/* Validation error */}
        {validationError && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-300 text-red-800 text-xs font-semibold">
            {validationError}
          </div>
        )}

        {/* API error */}
        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-300 text-red-800 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="py-10 text-center text-slate-400 text-sm">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mr-2 align-middle" />
            Evaluating corridor routes...
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div>
            {/* Journey header */}
            <div className="mb-4 flex items-center gap-2 flex-wrap text-sm text-slate-600">
              <span className="font-bold text-slate-900">{result.source.junction_name}</span>
              <span className="text-slate-400 font-bold">→</span>
              <span className="font-bold text-slate-900">{result.destination.junction_name}</span>
              <span className="ml-auto text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                {result.routes.length} corridor{result.routes.length !== 1 ? 's' : ''} found
              </span>
            </div>

            {/* No routes case */}
            {result.routes.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-sm border border-slate-200 rounded-lg bg-slate-50">
                No feasible corridor routes found between these junctions within the current network model.
              </div>
            ) : (
              <>
                {/* Recommendation banner */}
                <div className="mb-4 px-4 py-3 rounded-lg bg-blue-50 border border-blue-300 text-blue-900 text-sm">
                  <span className="font-bold">★ Recommendation: </span>
                  {result.recommendation_reason}
                </div>

                {/* Route cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  {result.routes.map((route, idx) => (
                    <RouteCard key={route.route_id} route={route} rank={idx + 1} />
                  ))}
                </div>
              </>
            )}

            {/* Academic disclaimer */}
            <div className="mt-3 px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-700">Academic Notice: </strong>
              {result.simulation_notice}
            </div>
          </div>
        )}

        {/* Initial state guidance */}
        {!result && !loading && !error && !validationError && (
          <div className="py-8 text-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
            Select source and destination junctions, then click <strong>Compare Routes</strong> to evaluate available corridors.
          </div>
        )}
      </div>
    </section>
  );
};
