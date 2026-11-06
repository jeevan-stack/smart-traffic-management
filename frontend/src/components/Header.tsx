import React from 'react';

interface HeaderProps {
  isBackendConnected: boolean;
  totalRecords: number;
}

export const Header: React.FC<HeaderProps> = ({ isBackendConnected, totalRecords }) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Simulation Notice Banner */}
      <aside className="bg-red-50 border-b border-red-200 text-red-900 px-4 py-2 text-xs md:text-sm font-medium" role="note" aria-label="Simulated Demo Notice">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-red-700 text-white font-bold text-xs uppercase px-2 py-0.5 rounded tracking-wide">
              SIMULATED DEMO
            </span>
            <span>
              <strong>Academic Notice:</strong> All traffic values, vehicle speeds, and congestion statuses displayed are <strong>SIMULATED DEMO DATA</strong>. No connection to live municipal sensors or cameras.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              isBackendConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              <span className={`h-2 w-2 rounded-full ${isBackendConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              {isBackendConnected ? `API Connected (${totalRecords} records)` : 'API Offline (Check Backend)'}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Brand Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">🚦</span>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Smart Traffic Management System
            </h1>
            <p className="text-xs text-slate-500">
              City Corridor Traffic Analytics & Congestion Dashboard • Team RouteX
            </p>
          </div>
        </div>

        <nav aria-label="Dashboard Sections" className="flex items-center gap-4 text-sm font-semibold text-slate-600">
          <a href="#summary-section" className="hover:text-blue-700 transition-colors">Overview</a>
          <a href="#route-planner-section" className="hover:text-blue-700 transition-colors">Route Planner</a>
          <a href="#corridors-section" className="hover:text-blue-700 transition-colors">Corridors</a>
          <a href="#hotspots-section" className="hover:text-blue-700 transition-colors">Hotspots</a>
          <a href="#trends-section" className="hover:text-blue-700 transition-colors">Hourly Trends</a>
        </nav>
      </div>
    </header>
  );
};
