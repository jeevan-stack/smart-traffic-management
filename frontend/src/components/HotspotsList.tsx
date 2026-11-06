import React from 'react';
import type { CongestionHotspot } from '../types/traffic';

interface HotspotsListProps {
  hotspots: CongestionHotspot[];
  loading: boolean;
}

export const HotspotsList: React.FC<HotspotsListProps> = ({ hotspots, loading }) => {
  return (
    <div id="hotspots-section" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Top Congestion Hotspots
          </h3>
          <p className="text-xs text-slate-500">
            Corridors experiencing the highest frequency of Heavy delay and slowest speeds
          </p>
        </div>
        <span className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
          High Priority
        </span>
      </div>

      {loading ? (
        <div className="py-8 text-center text-slate-400 text-sm">
          Loading hotspot rankings...
        </div>
      ) : hotspots.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-sm">
          No congestion hotspots detected in current dataset.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {hotspots.map((h, idx) => (
            <div
              key={h.junction_id}
              className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  #{idx + 1} {h.junction_id}
                </span>
                <span className="text-xs font-bold text-red-700">
                  {h.heavy_observations_count} Heavy Hours
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 truncate" title={h.junction_name}>
                {h.junction_name}
              </h4>
              <p className="text-xs text-slate-500 mb-2">{h.sector}</p>
              <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-200/80 pt-1.5 font-medium">
                <span>Avg Speed: <strong className="text-slate-900">{h.average_speed_kmh} km/h</strong></span>
                <span>Max Delay: <strong className="text-slate-900">{h.max_delay_mins}m</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
