import React from 'react';
import type { TrafficSummary } from '../types/traffic';

interface SummaryCardsProps {
  summary: TrafficSummary | null;
  loading: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, loading }) => {
  return (
    <section id="summary-section" className="mb-8" aria-labelledby="summary-heading">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 id="summary-heading" className="text-lg font-bold text-slate-900">
          Network Analytics Overview
        </h2>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Calculated from Loaded Data
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Observations */}
        <article className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-sm font-semibold mb-2">
            <span>Total Observations</span>
            <span className="text-xl" aria-hidden="true">🛣️</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">
            {loading ? '...' : (summary?.total_observations ?? 0)}
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Corridor records analyzed under active filters
          </p>
          <div className="text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded w-max">
            Total Vol: {loading ? '...' : (summary?.total_volume?.toLocaleString() ?? 0)} veh
          </div>
        </article>

        {/* Card 2: Congested Corridors */}
        <article className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-sm font-semibold mb-2">
            <span>High Congestion</span>
            <span className="text-xl" aria-hidden="true">⚠️</span>
          </div>
          <div className="text-3xl font-extrabold text-red-600 mb-1">
            {loading ? '...' : (summary?.congested_count ?? 0)}
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Observations categorized with Heavy delay (&lt; 25 km/h)
          </p>
          <div className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded w-max">
            Heavy: {loading ? '...' : (summary?.status_distribution?.Heavy ?? 0)} observations
          </div>
        </article>

        {/* Card 3: Average Network Speed */}
        <article className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-sm font-semibold mb-2">
            <span>Average Flow Speed</span>
            <span className="text-xl" aria-hidden="true">⚡</span>
          </div>
          <div className="text-3xl font-extrabold text-blue-700 mb-1">
            {loading ? '...' : `${summary?.average_speed_kmh ?? 0} km/h`}
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Mean vehicular speed computed across sample corridors
          </p>
          <div className="text-xs font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded w-max">
            Avg Delay: {loading ? '...' : `${summary?.average_delay_mins ?? 0} mins`}
          </div>
        </article>

        {/* Card 4: Peak Volume Corridor */}
        <article className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-sm font-semibold mb-2">
            <span>Peak Volume Point</span>
            <span className="text-xl" aria-hidden="true">📊</span>
          </div>
          <div className="text-2xl font-bold text-purple-700 truncate mb-1" title={summary?.peak_corridor?.junction_name || 'N/A'}>
            {loading ? '...' : (summary?.peak_corridor?.junction_name || 'None')}
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Highest traffic volume observed in active dataset
          </p>
          <div className="text-xs font-semibold text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded w-max">
            Peak: {loading ? '...' : `${summary?.peak_corridor?.peak_volume ?? 0} veh/h`}
          </div>
        </article>
      </div>
    </section>
  );
};
