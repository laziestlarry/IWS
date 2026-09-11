import React, { useState } from 'react';
import { ProposalScope, MissionRecord, ApprovalGate } from '../types';
import {
  X,
  FileCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  DollarSign,
  ArrowRight,
  Lock,
  Edit2,
  Save,
  Printer,
  Download
} from 'lucide-react';

interface ProposalGateModalProps {
  mission: MissionRecord;
  scope: ProposalScope;
  onClose: () => void;
  onSaveScope: (updatedScope: ProposalScope) => void;
  onApproveGate: (gateType: ApprovalGate['gateType'], notes?: string) => void;
  onProceedToPaidState: () => void;
}

export const ProposalGateModal: React.FC<ProposalGateModalProps> = ({
  mission,
  scope,
  onClose,
  onSaveScope,
  onApproveGate,
  onProceedToPaidState,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedScope, setEditedScope] = useState<ProposalScope>(scope);
  const [approvalNotes, setApprovalNotes] = useState('');

  const handleSaveClick = () => {
    onSaveScope({ ...editedScope, versionNo: (scope.versionNo || 1) + 1 });
    setIsEditing(false);
  };

  const handleDownloadProposalText = () => {
    const text = `INTELLIWEALTH SOLUTIONS — BOUNDED PROPOSAL SCOPE RECORD
------------------------------------------------------------
Mission Title: ${mission.intake.sectionB.missionTitle}
Version: ${scope.versionNo}
Delivery Window: ${scope.deliveryWindow}
Commercial Terms: ${scope.priceCommercialTerms}

PROBLEM STATEMENT:
${scope.problemStatement}

WORKFLOW BOUNDARY:
${scope.workflowBoundary}

IN SCOPE:
${scope.inScope.map(i => `- ${i}`).join('\n')}

OUT OF SCOPE:
${scope.outOfScope.map(o => `- ${o}`).join('\n')}

ACCEPTANCE CRITERIA:
${scope.acceptanceCriteria.map(a => `- ${a}`).join('\n')}

CHANGE CONTROL RULE:
${scope.changeControlRule}

Signed By: ${mission.approvals.scope?.approvedBy || 'Pending Signature'}
Signed Date: ${mission.approvals.scope?.approvedAt || 'Pending'}
------------------------------------------------------------`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Proposal_Scope_v${scope.versionNo}_${mission.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isAllPreApproved =
    mission.approvals.direction?.status === 'approved' &&
    mission.approvals.scope?.status === 'approved' &&
    mission.approvals.access?.status === 'approved';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-slate-100">
                  QUOTE / PROPOSAL GATE (VERSION {scope.versionNo})
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  SCOPE RECORD
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Bounded scope record produced prior to paid implementation or code deployment.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center space-x-1"
              title="Print Proposal"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownloadProposalText}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center space-x-1"
              title="Export Text Agreement"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800">
          {/* Top Info Bar */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-slate-400 block uppercase font-bold text-[10px]">Mission Title</span>
              <strong className="text-slate-900 text-sm">{mission.intake.sectionB.missionTitle}</strong>
            </div>

            <div>
              <span className="text-slate-400 block uppercase font-bold text-[10px]">Delivery Window</span>
              <strong className="text-slate-900 text-sm">{scope.deliveryWindow}</strong>
            </div>

            <div>
              <span className="text-slate-400 block uppercase font-bold text-[10px]">Commercial Price Terms</span>
              <strong className="text-amber-700 text-sm font-mono">{scope.priceCommercialTerms}</strong>
            </div>
          </div>

          {/* Edit / View Toggle */}
          <div className="flex justify-end">
            {isEditing ? (
              <button
                onClick={handleSaveClick}
                className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save New Scope Revision</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-300"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Scope Sections</span>
              </button>
            )}
          </div>

          {/* Section 1: Problem Statement & Boundary */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
              1. Problem Statement & Workflow Boundary
            </h4>

            {isEditing ? (
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Problem Statement</label>
                  <textarea
                    rows={2}
                    value={editedScope.problemStatement}
                    onChange={e => setEditedScope({ ...editedScope, problemStatement: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Workflow Boundary</label>
                  <input
                    type="text"
                    value={editedScope.workflowBoundary}
                    onChange={e => setEditedScope({ ...editedScope, workflowBoundary: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <strong className="text-slate-900 block mb-1">Problem Statement:</strong>
                  <p className="text-slate-700">{scope.problemStatement}</p>
                </div>
                <div>
                  <strong className="text-slate-900 block mb-1">Workflow Boundary:</strong>
                  <p className="text-slate-700">{scope.workflowBoundary}</p>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: In-Scope vs Out-Of-Scope */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
              2. Scope Boundaries (In-Scope vs. Out-of-Scope)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200 space-y-1">
                <strong className="text-emerald-900 block mb-1">In Scope:</strong>
                <ul className="list-disc list-inside text-emerald-800 space-y-1">
                  {scope.inScope.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-50/50 p-3.5 rounded-xl border border-rose-200 space-y-1">
                <strong className="text-rose-900 block mb-1">Explicitly Out of Scope:</strong>
                <ul className="list-disc list-inside text-rose-800 space-y-1">
                  {scope.outOfScope.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Acceptance Criteria & Required Evidence */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
              3. Acceptance Criteria & Evidence Required
            </h4>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <strong className="text-slate-900 block">Acceptance Criteria Checklist:</strong>
              <ul className="space-y-1 font-mono text-slate-800">
                {scope.acceptanceCriteria.map((crit, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 border-t border-slate-200 mt-2">
                <strong className="text-slate-900 block mb-1">Evidence Required for Acceptance:</strong>
                <div className="flex flex-wrap gap-2">
                  {scope.evidenceRequired.map((ev, idx) => (
                    <span key={idx} className="bg-white px-2.5 py-1 rounded border border-slate-300 font-semibold text-slate-800">
                      📄 {ev}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Customer Responsibilities & Change Control Rule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <strong className="text-slate-900 block">Customer Responsibilities:</strong>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {scope.customerResponsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200 space-y-1">
              <strong className="text-amber-900 block">Change Control Rule:</strong>
              <p className="text-amber-800">{scope.changeControlRule}</p>
            </div>
          </div>

          {/* Human Approval Gates Control */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h4 className="font-extrabold text-sm text-slate-100">HUMAN GOVERNANCE APPROVAL GATES</h4>
              </div>
              <span className="text-[10px] text-slate-400">All consequential actions require explicit sign-off</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {[
                { type: 'direction', title: '1. Direction' },
                { type: 'scope', title: '2. Scope' },
                { type: 'access', title: '3. Access' },
                { type: 'deployment', title: '4. Deployment' },
                { type: 'acceptance', title: '5. Acceptance' },
              ].map((g) => {
                const gate = mission.approvals[g.type as ApprovalGate['gateType']];
                const isApproved = gate?.status === 'approved';
                return (
                  <div
                    key={g.type}
                    className={`p-3 rounded-xl border text-center flex flex-col justify-between space-y-2 ${
                      isApproved
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs block">{g.title}</span>
                      <span className={`text-[10px] font-mono font-semibold uppercase ${isApproved ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {gate?.status || 'pending'}
                      </span>
                    </div>

                    {!isApproved && (
                      <button
                        type="button"
                        onClick={() => onApproveGate(g.type as any, 'Approved by operator')}
                        className="w-full py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px]"
                      >
                        Approve Gate
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Paid Gate Transition */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400">
                <strong className="text-slate-200">Payment Verification Rule:</strong> State advances to <code className="text-amber-400 font-mono">PAID</code> only after provider/bank verified payment evidence.
              </div>

              <button
                type="button"
                onClick={onProceedToPaidState}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                <DollarSign className="w-4 h-4 text-slate-950" />
                <span>Simulate Verified Payment & Advance to PAID State</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
