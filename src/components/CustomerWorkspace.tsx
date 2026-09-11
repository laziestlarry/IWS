import React, { useState } from 'react';
import { KpiDashboard } from './KpiDashboard';
import { GovernanceBoard } from './GovernanceBoard';
import {
  MissionRecord,
  OperatorProfile,
  EvidenceRecord,
  MetricObservation,
  EVIDENCE_GRADES,
  EvidenceGrade,
  ApprovalGate
} from '../types';
import {
  UserCheck,
  Target,
  GitBranch,
  FileCheck,
  ShieldCheck,
  TrendingUp,
  Plus,
  AlertCircle,
  XCircle,
  FileText,
  Clock,
  Layers,
  CheckCircle2,
  Lock,
  Download,
  DollarSign,
  BarChart3,
  Shield
} from 'lucide-react';

interface CustomerWorkspaceProps {
  mission: MissionRecord;
  profile: OperatorProfile;
  onUpdateProfile: (updatedProfile: OperatorProfile) => void;
  onCancelActiveMission: () => void;
  onAddEvidence: (evidence: EvidenceRecord) => void;
  onOpenProposalGate: () => void;
}

export const CustomerWorkspace: React.FC<CustomerWorkspaceProps> = ({
  mission,
  profile,
  onUpdateProfile,
  onCancelActiveMission,
  onAddEvidence,
  onOpenProposalGate,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'missions' | 'workflow' | 'evidence' | 'approvals' | 'performance' | 'kpi_dashboard' | 'governance_board'>('kpi_dashboard');
  const [evidenceGradeFilter, setEvidenceGradeFilter] = useState<'ALL' | EvidenceGrade>('ALL');

  // New evidence form state
  const [showAddEvidenceModal, setShowAddEvidenceModal] = useState(false);
  const [evTitle, setEvTitle] = useState('');
  const [evGrade, setEvGrade] = useState<EvidenceGrade>('E2');
  const [evDesc, setEvDesc] = useState('');
  const [evSource, setEvSource] = useState('');

  // New metric observation form state
  const [showAddMetricModal, setShowAddMetricModal] = useState(false);
  const [metricName, setMetricName] = useState('');
  const [metricBaseline, setMetricBaseline] = useState('');
  const [metricObserved, setMetricObserved] = useState('');
  const [metricTarget, setMetricTarget] = useState('');
  const [metricNotes, setMetricNotes] = useState('');

  const handleAddMetricSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricName) return;
    const newMetric: MetricObservation = {
      id: `m_${Date.now()}`,
      missionId: mission.id,
      metricName,
      baselineValue: metricBaseline || '0',
      observedValue: metricObserved || '0',
      targetValue: metricTarget || '0',
      unit: 'hrs',
      benefitNotes: metricNotes || 'Updated metric observation logged by operator.',
      measuredAt: new Date().toISOString()
    };
    mission.metrics.push(newMetric);
    setMetricName('');
    setMetricBaseline('');
    setMetricObserved('');
    setMetricTarget('');
    setMetricNotes('');
    setShowAddMetricModal(false);
  };

  const handleAddEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evTitle) return;
    const newEv: EvidenceRecord = {
      id: `ev_${Date.now()}`,
      missionId: mission.id,
      title: evTitle,
      grade: evGrade,
      description: evDesc,
      sourceRef: evSource || 'Operator Verified Test Log',
      capturedAt: new Date().toISOString(),
      verified: true,
    };
    onAddEvidence(newEv);
    setEvTitle('');
    setEvDesc('');
    setEvSource('');
    setShowAddEvidenceModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Workspace Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
              CUSTOMER WORKSPACE
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ORG: {profile.organizationName}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 mt-1">
            {mission.intake.sectionB.missionTitle || 'Active Mission Workspace'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Operator: {profile.personName} ({profile.personRole}) • Jurisdiction: {profile.jurisdiction}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenProposalGate}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-colors"
          >
            <FileCheck className="w-4 h-4" />
            <span>Open Proposal Gate</span>
          </button>

          <button
            onClick={onCancelActiveMission}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/80 font-semibold text-xs transition-colors"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel Mission</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex overflow-x-auto space-x-1 shadow-sm">
        {[
          { id: 'kpi_dashboard', label: '1. KPI Dashboard', icon: BarChart3 },
          { id: 'governance_board', label: '2. Governance Board', icon: Shield },
          { id: 'profile', label: '3. Profile', icon: UserCheck },
          { id: 'missions', label: '4. Missions & Revisions', icon: Target },
          { id: 'workflow', label: '5. Workflow', icon: GitBranch },
          { id: 'evidence', label: '6. Evidence (E0–E5)', icon: FileCheck },
          { id: 'approvals', label: '7. Approvals', icon: ShieldCheck },
          { id: 'performance', label: '8. Performance & ROI', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-slate-900 text-amber-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: KPI DASHBOARD */}
      {activeTab === 'kpi_dashboard' && (
        <KpiDashboard
          mission={mission}
          onUpdateMetrics={(updated) => {
            mission.metrics = updated;
          }}
        />
      )}

      {/* TAB 2: GOVERNANCE BOARD */}
      {activeTab === 'governance_board' && (
        <GovernanceBoard
          profile={profile}
          mission={mission}
          onUpdateOrganizationVersion={(v) =>
            onUpdateProfile({ ...profile, versionNo: v })
          }
        />
      )}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-amber-500" />
              <span>Reusable Operator & Organization Profile</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Version {profile.versionNo}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-xs block border-b border-slate-200 pb-1">
                Operator Facts
              </span>
              <p><strong>Name:</strong> {profile.personName}</p>
              <p><strong>Email:</strong> {profile.personEmail}</p>
              <p><strong>Role:</strong> {profile.personRole}</p>
              <p><strong>Organization:</strong> {profile.organizationName}</p>
              <p><strong>Jurisdiction:</strong> {profile.jurisdiction}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-xs block border-b border-slate-200 pb-1">
                Core Assets
              </span>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {profile.assets.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-xs block border-b border-slate-200 pb-1">
                Operational Constraints
              </span>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {profile.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-xs block border-b border-slate-200 pb-1">
                Connected Systems (Secrets Reference Only)
              </span>
              <div className="space-y-1">
                {profile.systemsConnected.map((sys, i) => (
                  <div key={i} className="flex items-center justify-between font-mono text-[11px]">
                    <span>{sys.name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {sys.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-xs block border-b border-slate-200 pb-1">
                Risk & Autonomy Settings
              </span>
              <p><strong>Risk Tolerance:</strong> {profile.riskTolerance}</p>
              <p><strong>Autonomy Preference:</strong> {profile.autonomyPreference}</p>
              <p><strong>Data Governance:</strong> Strictly Bounded Scope</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MISSIONS & REVISIONS */}
      {activeTab === 'missions' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
              <Target className="w-5 h-5 text-amber-500" />
              <span>Active Mission & Audit Trail</span>
            </h3>
            <span className="font-mono text-xs font-bold text-slate-700">State: {mission.state}</span>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-amber-400 text-sm">{mission.intake.sectionB.missionTitle}</h4>
              <span className="text-[11px] font-mono bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                Revision v{mission.versionNo}
              </span>
            </div>
            <p className="text-slate-300">{mission.intake.sectionB.changeGoal}</p>
            <div className="flex flex-wrap gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span>Urgency: {mission.intake.sectionB.deadlineUrgency}</span>
              <span>Priority: {mission.intake.sectionB.priority}</span>
              <span>Created: {new Date(mission.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Comparative Mission Analytics */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span>Multi-Mission Comparative Analytics Matrix</span>
            </h4>

            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-slate-50">
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="p-3">Mission ID</th>
                    <th className="p-3">Workflow Name</th>
                    <th className="p-3">State</th>
                    <th className="p-3">Monthly Runs</th>
                    <th className="p-3">Run Time</th>
                    <th className="p-3">Labor Rate</th>
                    <th className="p-3">Revision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  <tr className="bg-amber-50/50">
                    <td className="p-3 font-bold">{mission.id.slice(0, 8)}... (Active)</td>
                    <td className="p-3 font-semibold">{mission.intake.sectionC.workflowName || 'Client Intake'}</td>
                    <td className="p-3 font-bold text-amber-700">{mission.state}</td>
                    <td className="p-3">{mission.intake.sectionD.occurrencesPerMonth} / mo</td>
                    <td className="p-3">{mission.intake.sectionD.minutesPerRun} mins</td>
                    <td className="p-3">${mission.intake.sectionD.laborRateUsdHr}/hr</td>
                    <td className="p-3">v{mission.versionNo}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-500">hist_msn_001 (Benchmark)</td>
                    <td className="p-3">Document Provisioning</td>
                    <td className="p-3 text-emerald-700 font-bold">CLOSED</td>
                    <td className="p-3">45 / mo</td>
                    <td className="p-3">120 mins</td>
                    <td className="p-3">$65/hr</td>
                    <td className="p-3">v1</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-500">hist_msn_002 (Benchmark)</td>
                    <td className="p-3">Weekly Executive Report</td>
                    <td className="p-3 text-emerald-700 font-bold">CLOSED</td>
                    <td className="p-3">12 / mo</td>
                    <td className="p-3">90 mins</td>
                    <td className="p-3">$85/hr</td>
                    <td className="p-3">v2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2">
            <strong className="text-slate-900 font-bold block text-xs">Revision Rule Note:</strong>
            <p className="text-slate-600 bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900">
              After submission, changes create a new revision (v2, v3...) rather than silently rewriting history. Cancellation preserves the audit trail but halts further execution.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: WORKFLOW */}
      {activeTab === 'workflow' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
              <GitBranch className="w-5 h-5 text-amber-500" />
              <span>Mapped Workflow & Baseline Metrics</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">
                Workflow Structure
              </span>
              <p><strong>Workflow Name:</strong> {mission.intake.sectionC.workflowName}</p>
              <p><strong>Trigger:</strong> {mission.intake.sectionC.trigger}</p>
              <p><strong>Inputs:</strong> {mission.intake.sectionC.inputs}</p>
              <p><strong>Outputs:</strong> {mission.intake.sectionC.outputs}</p>
              <p><strong>Owner:</strong> {mission.intake.sectionC.owner}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">
                Baseline Pain & Economics
              </span>
              <p><strong>Occurrences/Mo:</strong> {mission.intake.sectionD.occurrencesPerMonth}</p>
              <p><strong>Minutes/Run:</strong> {mission.intake.sectionD.minutesPerRun} mins</p>
              <p><strong>Handoff Delay:</strong> {mission.intake.sectionD.waitingTimeHandoffMins} mins</p>
              <p><strong>Error Rate:</strong> {mission.intake.sectionD.reworkErrorRatePct}%</p>
              <p><strong>Labor Rate:</strong> ${mission.intake.sectionD.laborRateUsdHr}/hr</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EVIDENCE */}
      {activeTab === 'evidence' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-amber-500" />
                <span>Evidence Ledger (Grades E0 to E5)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Claims, candidate recommendations, tests, and outcomes are graded separately.
              </p>
            </div>

            <button
              onClick={() => setShowAddEvidenceModal(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Add Verified Evidence</span>
            </button>
          </div>

          {/* Evidence Grades Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 font-mono text-[10px]">
            {Object.values(EVIDENCE_GRADES).map((eg) => (
              <div key={eg.grade} className={`p-2 rounded border ${eg.color}`}>
                <strong className="block font-bold">{eg.grade}: {eg.title}</strong>
                <span className="text-[9px] opacity-80 leading-tight block mt-0.5">{eg.description}</span>
              </div>
            ))}
          </div>

          {/* Grade Filter Bar */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[11px] font-bold text-slate-700 mr-2 shrink-0">Filter Grade:</span>
            {['ALL', 'E0', 'E1', 'E2', 'E3', 'E4', 'E5'].map((grade) => (
              <button
                key={grade}
                onClick={() => setEvidenceGradeFilter(grade as any)}
                className={`px-3 py-1 rounded text-[11px] font-mono font-bold transition-colors shrink-0 ${
                  evidenceGradeFilter === grade
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>

          {/* Evidence Records List */}
          <div className="space-y-3">
            {mission.evidenceList
              .filter(ev => evidenceGradeFilter === 'ALL' || ev.grade === evidenceGradeFilter)
              .map((ev) => {
              const eg = EVIDENCE_GRADES[ev.grade];
              return (
                <div key={ev.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] border ${eg.color}`}>
                        {ev.grade} — {eg.title}
                      </span>
                      <strong className="text-slate-900 font-bold text-xs">{ev.title}</strong>
                    </div>
                    <p className="text-slate-600 text-xs">{ev.description}</p>
                    <span className="text-[10px] text-slate-400 font-mono">Source: {ev.sourceRef} • Captured: {new Date(ev.capturedAt).toLocaleString()}</span>
                  </div>

                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full border border-emerald-300 shrink-0">
                    ✓ Verified
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: APPROVALS & GOVERNANCE */}
      {activeTab === 'approvals' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <span>Human Approval Gates & Audit Control</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.values(mission.approvals) as ApprovalGate[]).map((gate) => (
              <div
                key={gate.gateType}
                className={`p-4 rounded-xl border space-y-2 ${
                  gate.status === 'approved'
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase">{gate.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    gate.status === 'approved' ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                  }`}>
                    {gate.status}
                  </span>
                </div>
                {gate.approvedBy && <p className="text-[11px]"><strong>Approved by:</strong> {gate.approvedBy}</p>}
                {gate.approvedAt && <p className="text-[10px] text-slate-500 font-mono">Date: {new Date(gate.approvedAt).toLocaleString()}</p>}
                <p className="text-[11px] italic text-slate-600">{gate.notes}</p>
              </div>
            ))}
          </div>

          {/* Audit Event Log */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Governance & Task Execution Audit Trail</span>
            </h4>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between py-1 border-b border-slate-200">
                <span className="text-slate-700 font-bold">STATE_CHANGED → {mission.state}</span>
                <span className="text-slate-500">{new Date(mission.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-200">
                <span className="text-slate-700 font-bold">ACTOR_ATTRIBUTION</span>
                <span className="text-slate-500">{mission.actorAttribution}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-700 font-bold">REVISION_NO</span>
                <span className="text-slate-500">v{mission.versionNo}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PERFORMANCE */}
      {activeTab === 'performance' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-xs">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <span>Observed Performance & Outcomes vs. Baseline</span>
            </h3>
            <button
              onClick={() => setShowAddMetricModal(true)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Log Metric Observation</span>
            </button>
          </div>

          <div className="space-y-4">
            {mission.metrics.map((m) => (
              <div key={m.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <strong className="text-slate-900 font-bold text-sm">{m.metricName}</strong>
                  <span className="text-[10px] text-slate-500 font-mono">Measured: {new Date(m.measuredAt).toLocaleDateString()}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 font-mono text-center pt-1">
                  <div className="p-2 bg-rose-50 rounded border border-rose-200">
                    <span className="text-rose-700 block text-[10px] font-bold">Baseline</span>
                    <span className="text-slate-900 font-bold">{m.baselineValue}</span>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
                    <span className="text-emerald-700 block text-[10px] font-bold">Current Observation</span>
                    <span className="text-emerald-900 font-bold">{m.observedValue}</span>
                  </div>
                  <div className="p-2 bg-blue-50 rounded border border-blue-200">
                    <span className="text-blue-700 block text-[10px] font-bold">Target</span>
                    <span className="text-blue-900 font-bold">{m.targetValue}</span>
                  </div>
                </div>

                <p className="text-slate-700 pt-1"><strong>Benefit Notes:</strong> {m.benefitNotes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Evidence Modal */}
      {showAddEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl text-xs">
            <h3 className="text-base font-bold text-slate-900">Add Verified Evidence</h3>

            <form onSubmit={handleAddEvidenceSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Evidence Title *</label>
                <input
                  type="text"
                  required
                  value={evTitle}
                  onChange={e => setEvTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Live Client Onboarding Test Transcript"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Evidence Grade *</label>
                <select
                  value={evGrade}
                  onChange={e => setEvGrade(e.target.value as EvidenceGrade)}
                  className="w-full p-2 border rounded font-semibold"
                >
                  <option value="E0">E0 Claim — narrative assertion</option>
                  <option value="E1">E1 Generated — artifact exists</option>
                  <option value="E2">E2 Tested — unit/package tests passed</option>
                  <option value="E3">E3 Integrated — system integration test passed</option>
                  <option value="E4">E4 Operational — observed in live operation</option>
                  <option value="E5">E5 Accepted / Commercial — customer sign-off / payment verified</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={evDesc}
                  onChange={e => setEvDesc(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Observations, test logs, or acceptance results."
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Source Reference</label>
                <input
                  type="text"
                  value={evSource}
                  onChange={e => setEvSource(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Stripe Webhook Log #39401"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEvidenceModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 rounded font-bold text-slate-950"
                >
                  Save Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Add Metric Observation Modal */}
      {showAddMetricModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl text-xs">
            <h3 className="text-base font-bold text-slate-900">Log Metric Observation</h3>

            <form onSubmit={handleAddMetricSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Metric Name *</label>
                <input
                  type="text"
                  required
                  value={metricName}
                  onChange={e => setMetricName(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Monthly Onboarding Cycle Hours"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Baseline</label>
                  <input
                    type="text"
                    value={metricBaseline}
                    onChange={e => setMetricBaseline(e.target.value)}
                    className="w-full p-2 border rounded font-mono"
                    placeholder="e.g. 120 hrs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Observed</label>
                  <input
                    type="text"
                    value={metricObserved}
                    onChange={e => setMetricObserved(e.target.value)}
                    className="w-full p-2 border rounded font-mono"
                    placeholder="e.g. 18 hrs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Target</label>
                  <input
                    type="text"
                    value={metricTarget}
                    onChange={e => setMetricTarget(e.target.value)}
                    className="w-full p-2 border rounded font-mono"
                    placeholder="e.g. 24 hrs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Benefit Notes & Observations</label>
                <textarea
                  rows={2}
                  value={metricNotes}
                  onChange={e => setMetricNotes(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Automated vault provisioning reduced client manual delays by 85%."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMetricModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 rounded font-bold text-slate-950"
                >
                  Save Metric Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
