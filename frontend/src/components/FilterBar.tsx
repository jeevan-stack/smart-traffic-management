import React from 'react';
import type { Junction, FilterParams } from '../types/traffic';

interface FilterBarProps {
  junctions: Junction[];
  filters: FilterParams;
  onFilterChange: (newFilters: FilterParams) => void;
  onReset: () => void;
  totalMatches: number;
  totalRecords: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  junctions,
  filters,
  onFilterChange,
  onReset,
  totalMatches,
  totalRecords
}) => {
  const isFiltered = Boolean(
    (filters.junction_id && filters.junction_id !== 'all') ||
    (filters.status && filters.status !== 'all') ||
    filters.start_time ||
    filters.end_time
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-wrap">
        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Junction Filter */}
          <div>
            <label htmlFor="junction-select" className="block text-xs font-semibold text-slate-700 mb-1">
              Corridor / Junction:
            </label>
            <select
              id="junction-select"
              value={filters.junction_id || 'all'}
              onChange={(e) => onFilterChange({ ...filters, junction_id: e.target.value })}
              className="bg-white border border-slate-300 text-slate-800 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="all">All Junctions (8 Corridors)</option>
              {junctions.map((j) => (
                <option key={j.junction_id} value={j.junction_id}>
                  {j.junction_name} ({j.sector})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status-select" className="block text-xs font-semibold text-slate-700 mb-1">
              Traffic Status:
            </label>
            <select
              id="status-select"
              value={filters.status || 'all'}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
              className="bg-white border border-slate-300 text-slate-800 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="all">All Statuses (Show All)</option>
              <option value="Clear">🟢 Clear (≥ 45 km/h)</option>
              <option value="Moderate">🟡 Moderate (25–44 km/h)</option>
              <option value="Heavy">🔴 Heavy (&lt; 25 km/h)</option>
            </select>
          </div>
        </div>

        {/* Counter and Reset Action */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-600">
            Showing <span className="text-slate-900 font-bold">{totalMatches}</span> of {totalRecords} records
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline focus:outline-none"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
