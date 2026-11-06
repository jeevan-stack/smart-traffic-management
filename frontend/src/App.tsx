import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { FilterBar } from './components/FilterBar';
import { TrafficTable } from './components/TrafficTable';
import { TrendChart } from './components/TrendChart';
import { HotspotsList } from './components/HotspotsList';
import { RoutePlanner } from './components/RoutePlanner';
import { ErrorBanner } from './components/ErrorBanner';
import { Footer } from './components/Footer';
import { trafficApi, ApiError } from './services/api';
import type {
  Junction,
  TrafficObservation,
  TrafficSummary,
  CongestionHotspot,
  FilterParams
} from './types/traffic';

export function App() {
  const [junctions, setJunctions] = useState<Junction[]>([]);
  const [records, setRecords] = useState<TrafficObservation[]>([]);
  const [summary, setSummary] = useState<TrafficSummary | null>(null);
  const [hotspots, setHotspots] = useState<CongestionHotspot[]>([]);

  const [filters, setFilters] = useState<FilterParams>({
    junction_id: 'all',
    status: 'all'
  });

  const [totalMatches, setTotalMatches] = useState<number>(0);
  const [totalDatasetCount, setTotalDatasetCount] = useState<number>(192);

  const [loading, setLoading] = useState<boolean>(true);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initial load of catalog and static items
  const loadInitialData = useCallback(async () => {
    try {
      const health = await trafficApi.getHealth();
      setBackendConnected(health.status === 'healthy');
      setTotalDatasetCount(health.record_count || 192);

      const [jList, hList] = await Promise.all([
        trafficApi.getJunctions(),
        trafficApi.getHotspots(5)
      ]);
      setJunctions(jList);
      setHotspots(hList);
      setErrorMessage(null);
    } catch (err) {
      setBackendConnected(false);
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to connect to backend server.');
      }
    }
  }, []);

  // Fetch observations & summary when filters change
  const fetchFilteredData = useCallback(async () => {
    setLoading(true);
    try {
      const [trafficRes, summaryRes] = await Promise.all([
        trafficApi.getTraffic(filters),
        trafficApi.getSummary(filters)
      ]);

      setRecords(trafficRes.records);
      setTotalMatches(trafficRes.total_matches);
      setSummary(summaryRes);
      setBackendConnected(true);
      setErrorMessage(null);
    } catch (err) {
      setBackendConnected(false);
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    fetchFilteredData();
  }, [fetchFilteredData]);

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      junction_id: 'all',
      status: 'all',
      start_time: undefined,
      end_time: undefined
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header
        isBackendConnected={backendConnected}
        totalRecords={totalDatasetCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {errorMessage && (
          <ErrorBanner
            message={errorMessage}
            onRetry={() => {
              loadInitialData();
              fetchFilteredData();
            }}
          />
        )}

        {/* Console Heading Card */}
        <section className="bg-white border border-slate-200 border-l-4 border-l-blue-700 rounded-xl p-5 shadow-sm mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                City Corridor Traffic Dashboard
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Analytical decision-support interface displaying validated hourly traffic observations, vehicular speeds, and simulated congestion levels.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Simulation Mode Active
            </div>
          </div>
        </section>

        {/* Summary Cards */}
        <SummaryCards summary={summary} loading={loading} />

        {/* Filter Bar */}
        <FilterBar
          junctions={junctions}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          totalMatches={totalMatches}
          totalRecords={totalDatasetCount}
        />

        {/* Route Planner & Corridor Comparison — Features 5 & 6 */}
        <RoutePlanner
          junctions={junctions}
          isBackendConnected={backendConnected}
        />

        {/* 24-Hour Trend Visualization */}
        <TrendChart records={records} />

        {/* Congestion Hotspots Ranking */}
        <HotspotsList hotspots={hotspots} loading={loading} />

        {/* Observations Data Table */}
        <section id="corridors-section">
          <TrafficTable records={records} loading={loading} />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
