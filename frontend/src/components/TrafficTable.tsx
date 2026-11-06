import React from 'react';
import type { TrafficObservation } from '../types/traffic';

interface TrafficTableProps {
  records: TrafficObservation[];
  loading: boolean;
}

export const TrafficTable: React.FC<TrafficTableProps> = ({ records, loading }) => {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'clear':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <span aria-hidden="true">●</span> Clear
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <span aria-hidden="true">●</span> Moderate
          </span>
        );
      case 'heavy':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-900 border border-red-300">
            <span aria-hidden="true">●</span> Heavy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800">
            {status}
          </span>
        );
    }
  };

  const formatTimestamp = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (Demo)';
    } catch {
      return ts;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Corridor Traffic Observation Log
          </h3>
          <p className="text-xs text-slate-500">
            Validated observations fetched directly from FastAPI backend (Simulated Data)
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-5 py-3">Corridor Name</th>
              <th scope="col" className="px-5 py-3">Sector</th>
              <th scope="col" className="px-5 py-3">Status</th>
              <th scope="col" className="px-5 py-3">Avg Speed</th>
              <th scope="col" className="px-5 py-3">Volume</th>
              <th scope="col" className="px-5 py-3">Estimated Delay</th>
              <th scope="col" className="px-5 py-3">Obs Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mr-2"></div>
                  Loading traffic observations...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-slate-500">
                  No traffic observations match the selected filter criteria.
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.observation_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-slate-900">
                    {r.junction_name}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {r.sector}
                  </td>
                  <td className="px-5 py-3.5">
                    {getStatusBadge(r.congestion_status)}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    {r.average_speed} km/h
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-mono text-xs">
                    {r.vehicle_volume} veh/h
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {r.estimated_delay} mins
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs font-mono">
                    {formatTimestamp(r.timestamp)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between flex-wrap gap-2">
        <span>
          <strong>Classification Thresholds:</strong> Clear (&ge; 45 km/h), Moderate (25&ndash;44 km/h), Heavy (&lt; 25 km/h).
        </span>
        <span className="font-semibold text-slate-600">
          Source: backend/data/traffic_observations.csv
        </span>
      </div>
    </div>
  );
};
