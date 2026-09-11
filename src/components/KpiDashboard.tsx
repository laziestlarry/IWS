import React, { useState } from 'react';
import { MissionRecord, MetricObservation } from '../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  Target,
  Plus,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  SlidersHorizontal,
  RefreshCw,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface KpiDashboardProps {
  mission: MissionRecord;
  onUpdateMetrics: (updatedMetrics: MetricObservation[]) => void;
}

interface OKRItem {
  id: string;
  objective: string;
  category: 'Revenue & Speed' | 'Reliability & Quality' | 'Cost & Scalability';
  keyResult: string;
  metricId?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: 'On Track' | 'At Risk' | 'Achieved';
}

export const KpiDashboard: React.FC<KpiDashboardProps> = ({ mission, onUpdateMetrics }) => {
  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'line' | 'area'>('bar');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  
  // Modal for adding a new KPI linked to metric_observation
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKpiName, setNewKpiName] = useState('');
  const [newBaseline, setNewBaseline] = useState('');
  const [newObserved, setNewObserved] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newUnit, setNewUnit] = useState('hrs');

  // Convert mission.metrics into chart-friendly format
  const chartData = mission.metrics.map((m) => {
    const base = typeof m.baselineValue === 'number' ? m.baselineValue : parseFloat(m.baselineValue as string) || 0;
    const obs = typeof m.observedValue === 'number' ? m.observedValue : parseFloat(m.observedValue as string) || 0;
    const tgt = typeof m.targetValue === 'number' ? m.targetValue : parseFloat(m.targetValue as string) || 0;
    
    // Improvement percentage
    const diff = base !== 0 ? Math.round(((obs - base) / base) * 100) : 0;

    return {
      name: m.metricName.length > 18 ? m.metricName.substring(0, 16) + '...' : m.metricName,
      fullName: m.metricName,
      Baseline: base,
      Observed: obs,
      Target: tgt,
      Unit: m.unit || 'units',
      ImprovementPct: diff,
      date: new Date(m.measuredAt).toLocaleDateString()
    };
  });

  // Pre-configured default OKRs derived from mission intake baseline & targets
  const okrList: OKRItem[] = [
    {
      id: 'okr_1',
      objective: 'Accelerate Client Onboarding & Commercial Execution Velocity',
      category: 'Revenue & Speed',
      keyResult: 'Reduce cycle hours per workflow run by at least 60%',
      targetValue: Math.max(1, Math.round(mission.intake.sectionD.minutesPerRun * 0.4)),
      currentValue: Math.round(mission.intake.sectionD.minutesPerRun * 0.55),
      unit: 'mins',
      status: 'On Track'
    },
    {
      id: 'okr_2',
      objective: 'Eliminate Process Rework & Elevate Verification Integrity',
      category: 'Reliability & Quality',
      keyResult: 'Lower rework error rate to under 2.5%',
      targetValue: 2.5,
      currentValue: mission.intake.sectionD.reworkErrorRatePct || 4.2,
      unit: '%',
      status: mission.intake.sectionD.reworkErrorRatePct <= 5 ? 'On Track' : 'At Risk'
    },
    {
      id: 'okr_3',
      objective: 'Maximize Scalable Labor Productivity & Cost Recovery',
      category: 'Cost & Scalability',
      keyResult: 'Achieve $12,500/mo in automated labor capacity equivalent',
      targetValue: 12500,
      currentValue: Math.round((mission.intake.sectionD.occurrencesPerMonth * (mission.intake.sectionD.minutesPerRun / 60) * mission.intake.sectionD.laborRateUsdHr) * 0.75),
      unit: 'USD',
      status: 'Achieved'
    }
  ];

  const handleCreateMetric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKpiName) return;

    const newMetric: MetricObservation = {
      id: `mo_${Date.now()}`,
      missionId: mission.id,
      metricName: newKpiName,
      baselineValue: newBaseline || '0',
      observedValue: newObserved || '0',
      targetValue: newTarget || '0',
      unit: newUnit,
      benefitNotes: `KPI Observation logged in OKR-Dashboard for org: ${mission.organizationId}`,
      measuredAt: new Date().toISOString()
    };

    onUpdateMetrics([...mission.metrics, newMetric]);

    setNewKpiName('');
    setNewBaseline('');
    setNewObserved('');
    setNewTarget('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[10px] uppercase font-bold border border-amber-500/40">
              REAL-TIME OKR-TO-KPI DASHBOARD
            </span>
            <span className="text-xs text-slate-400 font-mono">ORG ID: {mission.organizationId}</span>
          </div>
          <h2 className="text-xl font-black mt-1 text-slate-100 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <span>Mission Outcome & OKR Progress Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dynamic telemetry mapping baseline metric observations directly to strategic business objectives.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Log KPI Observation</span>
          </button>
        </div>
      </div>

      {/* OKR Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {okrList.map((okr) => {
          const progressPct = Math.min(100, Math.round((okr.currentValue / (okr.targetValue || 1)) * 100));
          return (
            <div
              key={okr.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {okr.category}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    okr.status === 'Achieved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : okr.status === 'On Track'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {okr.status}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs leading-snug">{okr.objective}</h4>
                <p className="text-[11px] text-slate-500 mt-1">{okr.keyResult}</p>
              </div>

              <div className="space-y-1 pt-2">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                  <span className="text-slate-600">Progress</span>
                  <span className="text-slate-900">
                    {okr.currentValue} / {okr.targetValue} {okr.unit} ({progressPct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      progressPct >= 100
                        ? 'bg-emerald-500'
                        : progressPct >= 60
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Interactive Recharts Telemetry Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-amber-500" />
              <span>Metric Observation Telemetry (Baseline vs Observed vs Target)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Visualizing baseline performance against verified observations and strategic target thresholds.
            </p>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setSelectedChartType('bar')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedChartType === 'bar'
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bar Comparison
            </button>
            <button
              onClick={() => setSelectedChartType('line')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedChartType === 'line'
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Trend Line
            </button>
            <button
              onClick={() => setSelectedChartType('area')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedChartType === 'area'
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Volume Area
            </button>
          </div>
        </div>

        {/* Recharts Canvas */}
        <div className="h-80 w-full pt-2">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
              No metric observations logged yet. Click "Log KPI Observation" above.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {selectedChartType === 'bar' ? (
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', color: '#F8FAFC', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Baseline" fill="#F43F5E" radius={[6, 6, 0, 0]} name="Baseline Value" />
                  <Bar dataKey="Observed" fill="#10B981" radius={[6, 6, 0, 0]} name="Observed Value" />
                  <Bar dataKey="Target" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Target Value" />
                </BarChart>
              ) : selectedChartType === 'line' ? (
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', color: '#F8FAFC', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="Baseline" stroke="#F43F5E" strokeWidth={3} dot={{ r: 5 }} name="Baseline Value" />
                  <Line type="monotone" dataKey="Observed" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} name="Observed Value" />
                  <Line type="monotone" dataKey="Target" stroke="#3B82F6" strokeWidth={3} dot={{ r: 5 }} name="Target Value" />
                </LineChart>
              ) : (
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', color: '#F8FAFC', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="Baseline" fill="#FECDD3" stroke="#F43F5E" name="Baseline Value" />
                  <Area type="monotone" dataKey="Observed" fill="#A7F3D0" stroke="#10B981" name="Observed Value" />
                  <Area type="monotone" dataKey="Target" fill="#BFDBFE" stroke="#3B82F6" name="Target Value" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        {/* Detailed Metric Observations Table */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="font-bold text-sm text-slate-900 flex items-center justify-between">
            <span>Linked `metric_observation` Entities ({mission.metrics.length})</span>
            <span className="text-xs text-slate-500 font-mono">Contract Version: {mission.versionNo}</span>
          </h4>

          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-slate-50">
            <table className="w-full text-left font-mono text-[11px]">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="p-3">Metric Name</th>
                  <th className="p-3">Baseline</th>
                  <th className="p-3">Observed</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">Unit</th>
                  <th className="p-3">Measured Date</th>
                  <th className="p-3">Notes & Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {mission.metrics.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-100/80 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{m.metricName}</td>
                    <td className="p-3 text-rose-700 font-bold">{m.baselineValue}</td>
                    <td className="p-3 text-emerald-700 font-bold">{m.observedValue}</td>
                    <td className="p-3 text-blue-700 font-bold">{m.targetValue}</td>
                    <td className="p-3 font-bold text-slate-600">{m.unit}</td>
                    <td className="p-3 text-slate-500">{new Date(m.measuredAt).toLocaleDateString()}</td>
                    <td className="p-3 text-slate-600 max-w-xs truncate">{m.benefitNotes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Log Metric Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Log New KPI `metric_observation`</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMetric} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Metric / KPI Title *</label>
                <input
                  type="text"
                  required
                  value={newKpiName}
                  onChange={(e) => setNewKpiName(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Conversion Lead Time Hours"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Baseline</label>
                  <input
                    type="text"
                    value={newBaseline}
                    onChange={(e) => setNewBaseline(e.target.value)}
                    className="w-full p-2 border rounded font-mono"
                    placeholder="48"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Observed</label>
                  <input
                    type="text"
                    value={newObserved}
                    onChange={(e) => setNewObserved(e.target.value)}
                    className="w-full p-2 border rounded font-mono"
                    placeholder="12"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Target</label>
                  <input
                    type="text"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full p-2 border rounded font-mono"
                    placeholder="8"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Unit</label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full p-2 border rounded font-mono"
                  >
                    <option value="hrs">hrs</option>
                    <option value="mins">mins</option>
                    <option value="USD">USD</option>
                    <option value="%">%</option>
                    <option value="units">units</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 rounded font-bold text-slate-950"
                >
                  Save KPI Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
