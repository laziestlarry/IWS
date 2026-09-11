import React, { useState } from 'react';
import {
  MissionIntakeData,
  TodayStage,
  PrimaryPriority
} from '../types';
import {
  Save,
  Trash2,
  XCircle,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Building,
  Target,
  GitBranch,
  Clock,
  CheckSquare,
  ShieldAlert
} from 'lucide-react';

interface MissionIntakeFormProps {
  initialData: MissionIntakeData;
  onSubmitMission: (data: MissionIntakeData) => void;
  onCancelMission: () => void;
  onSaveDraft: (data: MissionIntakeData) => void;
  onClearDraft: () => void;
}

export const MissionIntakeForm: React.FC<MissionIntakeFormProps> = ({
  initialData,
  onSubmitMission,
  onCancelMission,
  onSaveDraft,
  onClearDraft
}) => {
  const [formData, setFormData] = useState<MissionIntakeData>(initialData);
  const [activeSection, setActiveSection] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'F'>('A');
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  const updateSectionA = (fields: Partial<MissionIntakeData['sectionA']>) => {
    setFormData(prev => ({ ...prev, sectionA: { ...prev.sectionA, ...fields } }));
  };

  const updateSectionB = (fields: Partial<MissionIntakeData['sectionB']>) => {
    setFormData(prev => ({ ...prev, sectionB: { ...prev.sectionB, ...fields } }));
  };

  const updateSectionC = (fields: Partial<MissionIntakeData['sectionC']>) => {
    setFormData(prev => ({ ...prev, sectionC: { ...prev.sectionC, ...fields } }));
  };

  const updateSectionD = (fields: Partial<MissionIntakeData['sectionD']>) => {
    setFormData(prev => ({ ...prev, sectionD: { ...prev.sectionD, ...fields } }));
  };

  const updateSectionE = (fields: Partial<MissionIntakeData['sectionE']>) => {
    setFormData(prev => ({ ...prev, sectionE: { ...prev.sectionE, ...fields } }));
  };

  const updateSectionF = (fields: Partial<MissionIntakeData['sectionF']>) => {
    setFormData(prev => ({ ...prev, sectionF: { ...prev.sectionF, ...fields } }));
  };

  const toggleSystemUsed = (systemName: string) => {
    const current = formData.sectionC.systemsUsed;
    const exists = current.includes(systemName);
    const updated = exists ? current.filter(s => s !== systemName) : [...current, systemName];
    updateSectionC({ systemsUsed: updated });
  };

  const handleSaveDraftClick = () => {
    onSaveDraft(formData);
    setSavedStatus('Draft saved locally.');
    setTimeout(() => setSavedStatus(null), 3000);
  };

  const handleExportIntakeJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mission_intake_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getFormCompletionPercentage = () => {
    let filled = 0;
    let total = 10;
    if (formData.sectionA.businessName) filled++;
    if (formData.sectionA.serviceCategory) filled++;
    if (formData.sectionB.missionTitle) filled++;
    if (formData.sectionB.changeGoal) filled++;
    if (formData.sectionC.workflowName) filled++;
    if (formData.sectionC.trigger) filled++;
    if (formData.sectionC.outputs) filled++;
    if (formData.sectionD.occurrencesPerMonth > 0) filled++;
    if (formData.sectionE.metricToImprove) filled++;
    if (formData.sectionE.desiredTarget) filled++;
    return Math.min(100, Math.round((filled / total) * 100));
  };

  const handleDeleteSection = (sectionKey: 'A' | 'B' | 'C' | 'D' | 'E' | 'F') => {
    if (!confirm(`Are you sure you want to reset Section ${sectionKey}?`)) return;
    if (sectionKey === 'A') updateSectionA({ businessName: '', serviceCategory: '', roleAndAuthority: '', teamSize: '1', jurisdiction: '' });
    if (sectionKey === 'B') updateSectionB({ missionTitle: '', changeGoal: '', mustNotChange: '', deadlineUrgency: '', budgetCeiling: '' });
    if (sectionKey === 'C') updateSectionC({ workflowName: '', trigger: '', inputs: '', currentSteps: '', outputs: '', owner: '', systemsUsed: [] });
    if (sectionKey === 'D') updateSectionD({ occurrencesPerMonth: 0, minutesPerRun: 0, waitingTimeHandoffMins: 0, reworkErrorRatePct: 0, laborRateUsdHr: 0, mostExpensiveFailure: '', customerRevenueImpact: '' });
    if (sectionKey === 'E') updateSectionE({ metricToImprove: '', currentBaseline: '', desiredTarget: '', measurementPeriod: '', representativeTestCase: '', successThreshold: '', evidenceSource: '' });
    if (sectionKey === 'F') updateSectionF({ requiredTools: [], forbiddenSystems: '', complianceConcern: '', requiredHumanApprovals: [] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitMission(formData);
  };

  const sectionsList = [
    { key: 'A', name: 'Business Context', icon: Building, color: 'text-amber-600' },
    { key: 'B', name: 'Mission Goals', icon: Target, color: 'text-blue-600' },
    { key: 'C', name: 'Workflow Details', icon: GitBranch, color: 'text-purple-600' },
    { key: 'D', name: 'Baseline & Pain', icon: Clock, color: 'text-rose-600' },
    { key: 'E', name: 'Target & Acceptance', icon: CheckSquare, color: 'text-emerald-600' },
    { key: 'F', name: 'Constraints & Governance', icon: ShieldAlert, color: 'text-indigo-600' },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Title & Mission Controls */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 uppercase tracking-wider">
              PROGRESSIVE MISSION INTAKE
            </span>
            {savedStatus && (
              <span className="text-xs text-emerald-600 font-semibold animate-pulse">
                ✓ {savedStatus}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Map Your Workflow & Bottleneck
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Progressive intake form. Save drafts, edit sections individually, or clear before submission.
          </p>
        </div>

        {/* Mission Controls Bar */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSaveDraftClick}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={handleExportIntakeJSON}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-amber-50 text-slate-800 hover:text-amber-800 border border-slate-300 transition-colors"
            title="Export Intake JSON"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={onClearDraft}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 transition-colors"
            title="Clear unsaved draft"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Draft</span>
          </button>

          <button
            type="button"
            onClick={onCancelMission}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancel Mission</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Indicator */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>Form Completion Progress</span>
          <span className="text-amber-600 font-mono font-bold">{getFormCompletionPercentage()}% Complete</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-amber-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getFormCompletionPercentage()}%` }}
          />
        </div>
      </div>

      {/* Progressive Step Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {sectionsList.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.key;
          return (
            <button
              key={sec.key}
              type="button"
              onClick={() => setActiveSection(sec.key as any)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-800'}`}>
                  {sec.key}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : sec.color}`} />
              </div>
              <div className="text-xs font-semibold mt-2 truncate">{sec.name}</div>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION A: BUSINESS CONTEXT */}
        {activeSection === 'A' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">A</span>
                <h3 className="text-base font-bold text-slate-900">Business Context</h3>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteSection('A')}
                className="text-xs text-slate-400 hover:text-rose-600 flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Section</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Business / Project Name *</label>
                <input
                  type="text"
                  required
                  value={formData.sectionA.businessName}
                  onChange={e => updateSectionA({ businessName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., Apex Advisory & Consulting"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Business Type / Service Category *</label>
                <input
                  type="text"
                  required
                  value={formData.sectionA.serviceCategory}
                  onChange={e => updateSectionA({ serviceCategory: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., B2B Strategy & Financial Advisory"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Your Role & Decision Authority *</label>
                <input
                  type="text"
                  required
                  value={formData.sectionA.roleAndAuthority}
                  onChange={e => updateSectionA({ roleAndAuthority: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., Managing Principal (Full Authority)"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Team Size</label>
                <input
                  type="text"
                  value={formData.sectionA.teamSize}
                  onChange={e => updateSectionA({ teamSize: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., Solo Operator / 1-5 Team"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Country / Jurisdiction *</label>
                <input
                  type="text"
                  required
                  value={formData.sectionA.jurisdiction}
                  onChange={e => updateSectionA({ jurisdiction: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., United States (Delaware LLC)"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Current Stage</label>
                <select
                  value={formData.sectionA.currentStage}
                  onChange={e => updateSectionA({ currentStage: e.target.value as TodayStage })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                >
                  <option value="ideas">Ideas — Choosing the right path</option>
                  <option value="offer">Offer — Need system to sell/deliver</option>
                  <option value="operating">Operating — Need focus & automation</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setActiveSection('B')}
                className="inline-flex items-center space-x-2 px-5 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
              >
                <span>Next: Mission Goals (Section B)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION B: MISSION */}
        {activeSection === 'B' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center">B</span>
                <h3 className="text-base font-bold text-slate-900">Mission Goals</h3>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteSection('B')}
                className="text-xs text-slate-400 hover:text-rose-600 flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Section</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Mission Title *</label>
                <input
                  type="text"
                  required
                  value={formData.sectionB.missionTitle}
                  onChange={e => updateSectionB({ missionTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., Client Onboarding & Intake Automation"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">What do you want to change or achieve? *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.sectionB.changeGoal}
                  onChange={e => updateSectionB({ changeGoal: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="Eliminate manual document chasing, agreement signatures, and initial client kickoff delays."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">What must NOT be changed? (Non-negotiables) *</label>
                <input
                  type="text"
                  required
                  value={formData.sectionB.mustNotChange}
                  onChange={e => updateSectionB({ mustNotChange: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., Personal welcome video call and custom financial advisory strategy review."
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Deadline / Urgency</label>
                <input
                  type="text"
                  value={formData.sectionB.deadlineUrgency}
                  onChange={e => updateSectionB({ deadlineUrgency: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., Within 14 Days / High"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Budget Ceiling (Optional)</label>
                <input
                  type="text"
                  value={formData.sectionB.budgetCeiling || ''}
                  onChange={e => updateSectionB({ budgetCeiling: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., $2,500 USD"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Mission Priority</label>
                <select
                  value={formData.sectionB.priority}
                  onChange={e => updateSectionB({ priority: e.target.value as PrimaryPriority })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900 font-semibold"
                >
                  <option value="speed_to_revenue">⚡ Speed to Revenue — Validate sellable path quickly</option>
                  <option value="reliable_operations">🔒 Reliable Operations — Build repeatable delivery & control</option>
                  <option value="scalable_growth">📈 Scalable Growth — Expand what is already working</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-3">
              <button
                type="button"
                onClick={() => setActiveSection('A')}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('C')}
                className="inline-flex items-center space-x-2 px-5 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
              >
                <span>Next: Workflow Details (Section C)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION C: WORKFLOW */}
        {activeSection === 'C' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-900 font-bold text-xs flex items-center justify-center">C</span>
                <h3 className="text-base font-bold text-slate-900">Workflow Mapping</h3>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteSection('C')}
                className="text-xs text-slate-400 hover:text-rose-600 flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Section</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Workflow Name *</label>
                <input
                  type="text"
                  required
                  value={formData.sectionC.workflowName}
                  onChange={e => updateSectionC({ workflowName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., New Client Intake & Document Collection"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Trigger — What starts it? *</label>
                <input
                  type="text"
                  required
                  value={formData.sectionC.trigger}
                  onChange={e => updateSectionC({ trigger: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., Client signs advisory proposal or submits deposit payment"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Inputs required *</label>
                <input
                  type="text"
                  required
                  value={formData.sectionC.inputs}
                  onChange={e => updateSectionC({ inputs: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., Signed contract, corporate tax returns, bank statements, onboarding questionnaire"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Current Steps (Short description) *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.sectionC.currentSteps}
                  onChange={e => updateSectionC({ currentSteps: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="Email client pdf intake form -> Wait 3-5 days -> Check files -> Send reminder emails -> Create Drive folder -> Setup CRM contact"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Outputs required *</label>
                <input
                  type="text"
                  required
                  value={formData.sectionC.outputs}
                  onChange={e => updateSectionC({ outputs: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., Complete client vault, populated CRM record, calendar invite"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Workflow Owner *</label>
                <input
                  type="text"
                  required
                  value={formData.sectionC.owner}
                  onChange={e => updateSectionC({ owner: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., Kagan Dolek (Managing Principal)"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-2">Systems Used</label>
                <div className="flex flex-wrap gap-2">
                  {['Pipedrive CRM', 'HubSpot CRM', 'Google Drive', 'Dropbox', 'Stripe Commerce', 'DocuSign', 'Calendly', 'Gmail / Email', 'Airtable', 'Slack', 'Zapier'].map((sys) => {
                    const isSelected = formData.sectionC.systemsUsed.includes(sys);
                    return (
                      <button
                        type="button"
                        key={sys}
                        onClick={() => toggleSystemUsed(sys)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold'
                            : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{sys}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-3">
              <button
                type="button"
                onClick={() => setActiveSection('B')}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('D')}
                className="inline-flex items-center space-x-2 px-5 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
              >
                <span>Next: Baseline & Pain (Section D)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION D: BASELINE / PAIN */}
        {activeSection === 'D' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-900 font-bold text-xs flex items-center justify-center">D</span>
                <h3 className="text-base font-bold text-slate-900">Baseline Metrics & Pain</h3>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteSection('D')}
                className="text-xs text-slate-400 hover:text-rose-600 flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Section</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Occurrences Per Month *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.sectionD.occurrencesPerMonth || ''}
                  onChange={e => updateSectionD({ occurrencesPerMonth: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., 18"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Minutes Per Run *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.sectionD.minutesPerRun || ''}
                  onChange={e => updateSectionD({ minutesPerRun: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., 125"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Waiting / Handoff Delay (Mins)</label>
                <input
                  type="number"
                  value={formData.sectionD.waitingTimeHandoffMins || ''}
                  onChange={e => updateSectionD({ waitingTimeHandoffMins: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., 2880 (48 hours)"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Rework or Error Rate (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.sectionD.reworkErrorRatePct || ''}
                  onChange={e => updateSectionD({ reworkErrorRatePct: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., 22"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Labor Rate ($/hr Optional)</label>
                <input
                  type="number"
                  value={formData.sectionD.laborRateUsdHr || ''}
                  onChange={e => updateSectionD({ laborRateUsdHr: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., 150"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block font-medium text-slate-700 mb-1">Most Expensive Failure or Frustration *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.sectionD.mostExpensiveFailure}
                  onChange={e => updateSectionD({ mostExpensiveFailure: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., Client drops off or delays project start by 3 weeks due to lost intake emails."
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block font-medium text-slate-700 mb-1">Customer / Revenue Impact *</label>
                <input
                  type="text"
                  required
                  value={formData.sectionD.customerRevenueImpact}
                  onChange={e => updateSectionD({ customerRevenueImpact: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., High ($4,500 average retainer per delayed client onboarding)"
                />
              </div>
            </div>

            <div className="flex justify-between pt-3">
              <button
                type="button"
                onClick={() => setActiveSection('C')}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('E')}
                className="inline-flex items-center space-x-2 px-5 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
              >
                <span>Next: Target & Acceptance (Section E)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION E: TARGET & ACCEPTANCE */}
        {activeSection === 'E' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center">E</span>
                <h3 className="text-base font-bold text-slate-900">Target & Acceptance Criteria</h3>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteSection('E')}
                className="text-xs text-slate-400 hover:text-rose-600 flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Section</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Metric to Improve *</label>
                <input
                  type="text"
                  required
                  value={formData.sectionE.metricToImprove}
                  onChange={e => updateSectionE({ metricToImprove: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., Onboarding Turnaround Time"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Current Baseline *</label>
                <input
                  type="text"
                  required
                  value={formData.sectionE.currentBaseline}
                  onChange={e => updateSectionE({ currentBaseline: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., 5.2 days"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Desired Target *</label>
                <input
                  type="text"
                  required
                  value={formData.sectionE.desiredTarget}
                  onChange={e => updateSectionE({ desiredTarget: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., Under 12 hours"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Measurement Period</label>
                <input
                  type="text"
                  value={formData.sectionE.measurementPeriod}
                  onChange={e => updateSectionE({ measurementPeriod: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., 30 Days"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Representative Test Case *</label>
                <input
                  type="text"
                  required
                  value={formData.sectionE.representativeTestCase}
                  onChange={e => updateSectionE({ representativeTestCase: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., Stripe deposit payment -> Automated vault provisioned -> Documents uploaded -> Kickoff booked."
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Success Threshold *</label>
                <input
                  type="text"
                  required
                  value={formData.sectionE.successThreshold}
                  onChange={e => updateSectionE({ successThreshold: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., 100% complete vault in < 12 hours"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Evidence Source *</label>
                <input
                  type="text"
                  required
                  value={formData.sectionE.evidenceSource}
                  onChange={e => updateSectionE({ evidenceSource: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., CRM timestamps & Drive audit logs"
                />
              </div>
            </div>

            <div className="flex justify-between pt-3">
              <button
                type="button"
                onClick={() => setActiveSection('D')}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('F')}
                className="inline-flex items-center space-x-2 px-5 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
              >
                <span>Next: Governance (Section F)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION F: CONSTRAINTS & GOVERNANCE */}
        {activeSection === 'F' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-900 font-bold text-xs flex items-center justify-center">F</span>
                <h3 className="text-base font-bold text-slate-900">Constraints & Governance</h3>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteSection('F')}
                className="text-xs text-slate-400 hover:text-rose-600 flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Section</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Forbidden Actions / Systems that must remain untouched *</label>
                <input
                  type="text"
                  required
                  value={formData.sectionF.forbiddenSystems}
                  onChange={e => updateSectionF({ forbiddenSystems: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., Existing accounting database and client banking credentials"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Data Sensitivity</label>
                <select
                  value={formData.sectionF.dataSensitivity}
                  onChange={e => updateSectionF({ dataSensitivity: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                >
                  <option value="Low">Low — Public operational data</option>
                  <option value="Medium">Medium — Standard customer contact info</option>
                  <option value="High">High — Proprietary business files</option>
                  <option value="Strictly Confidential">Strictly Confidential — Financial / Legal credentials</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Autonomy Preference</label>
                <select
                  value={formData.sectionF.autonomyPreference}
                  onChange={e => updateSectionF({ autonomyPreference: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900 font-semibold"
                >
                  <option value="advise_only">Advise Only — Strategic recommendations only</option>
                  <option value="prepare_for_approval">Prepare for Approval — Stage drafts for human sign-off</option>
                  <option value="execute_approved_actions">Execute Approved Actions — Auto-dispatch after gate approval</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Compliance Concern (If applicable)</label>
                <input
                  type="text"
                  value={formData.sectionF.complianceConcern}
                  onChange={e => updateSectionF({ complianceConcern: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  placeholder="e.g., SOC2 & FINRA document retention requirements"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setActiveSection('E')}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
              >
                Back
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>SUBMIT MISSION & COMPUTE RECOMMENDATIONS</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
