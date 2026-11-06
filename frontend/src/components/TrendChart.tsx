import React from 'react';
import type { TrafficObservation } from '../types/traffic';

interface TrendChartProps {
  records: TrafficObservation[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ records }) => {
  // Create 24 hourly buckets.
  const hourlyData: {
    hour: number;
    label: string;
    volume: number;
    avgSpeed: number;
    count: number;
  }[] = [];

  for (let h = 0; h < 24; h++) {
    hourlyData.push({
      hour: h,
      label: `${h.toString().padStart(2, '0')}:00`,
      volume: 0,
      avgSpeed: 0,
      count: 0
    });
  }

  // Aggregate observations by hour.
  records.forEach((r) => {
    const date = new Date(r.timestamp);
    const h = date.getHours();

    if (!Number.isNaN(date.getTime()) && h >= 0 && h < 24) {
      hourlyData[h].volume += r.vehicle_volume;
      hourlyData[h].avgSpeed += r.average_speed;
      hourlyData[h].count += 1;
    }
  });

  // Calculate average speed only when observations exist.
  hourlyData.forEach((d) => {
    if (d.count > 0) {
      d.avgSpeed = Math.round((d.avgSpeed / d.count) * 10) / 10;
    }
  });

  const maxVolume = Math.max(...hourlyData.map((d) => d.volume), 100);

  return (
    <div id="trends-section" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            24-Hour Traffic Volume & Flow Trends
          </h3>
          <p className="text-xs text-slate-500">
            Hourly vehicular volume (bars) and speed patterns (simulated observations)
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-blue-700">
            <span className="w-3 h-3 bg-blue-600 rounded-sm"></span>
            Volume (veh/h)
          </span>
          <span className="flex items-center gap-1.5 text-amber-700">
            <span className="w-3 h-1 bg-amber-500 rounded"></span>
            Flow Speed (km/h)
          </span>
        </div>
      </div>

      {/* Responsive Bar Visualization */}
      <div className="h-48 flex items-end gap-1 sm:gap-2 pt-6 pb-2 border-b border-slate-200">
        {hourlyData.map((d) => {
          const heightPercent = maxVolume > 0 ? (d.volume / maxVolume) * 100 : 0;

          return (
            <div
              key={d.hour}
              className="flex-1 flex flex-col items-center group relative h-full justify-end"
            >
              {/* Tooltip */}
              <div className="absolute -top-12 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                <p className="font-bold">{d.label}</p>

                {d.count > 0 ? (
                  <>
                    <p>Volume: {d.volume.toLocaleString()} veh</p>
                    <p>Speed: {d.avgSpeed} km/h</p>
                    <p>Observations: {d.count}</p>
                  </>
                ) : (
                  <p>No observations</p>
                )}
              </div>

              {/* Show a bar only when observations exist */}
              {d.count > 0 ? (
                <div
                  style={{ height: `${Math.max(heightPercent, 4)}%` }}
                  className={`w-full rounded-t transition-all ${
                    d.avgSpeed < 25
                      ? 'bg-red-500 group-hover:bg-red-600'
                      : d.avgSpeed < 45
                      ? 'bg-amber-400 group-hover:bg-amber-500'
                      : 'bg-blue-600 group-hover:bg-blue-700'
                  }`}
                ></div>
              ) : (
                <div className="w-full border-t-2 border-dashed border-slate-300"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hour Labels */}
      <div className="flex justify-between text-[10px] text-slate-500 pt-2 font-mono">
        <span>00:00</span>
        <span>04:00</span>
        <span>08:00 (Morning Peak)</span>
        <span>12:00</span>
        <span>16:00</span>
        <span>18:00 (Evening Peak)</span>
        <span>22:00</span>
      </div>
    </div>
  );
};
