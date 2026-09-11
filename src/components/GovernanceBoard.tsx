import React, { useState } from 'react';
import { OperatorProfile, MissionRecord } from '../types';
import {
  Shield,
  Users,
  Cpu,
  Building2,
  Lock,
  ChevronRight,
  Plus,
  CheckCircle2,
  FileCheck2,
  GitCommit,
  Bot,
  UserCheck,
  Briefcase,
  Sliders,
  Award
} from 'lucide-react';

interface GovernanceBoardProps {
  profile: OperatorProfile;
  mission: MissionRecord;
  onUpdateOrganizationVersion?: (newVersion: number) => void;
}

export interface GovernanceNode {
  id: string;
  organizationId: string;
  versionNo: number;
  title: string;
  category: 'Executive' | 'Advisory Council' | 'AI-Cored Department';
  assignedActor: string;
  actorType: 'Human' | 'AI Agent' | 'Hybrid Advisory';
  authorityLevel: 'Full Approval Authority' | 'Advisory & Veto' | 'Bounded Autonomous Execution';
  responsibilities: string[];
  boundedConstraints: string[];
  status: 'Active & Verified' | 'Pending Review';
}

export const GovernanceBoard: React.FC<GovernanceBoardProps> = ({
  profile,
  mission,
  onUpdateOrganizationVersion
}) => {
  const [currentVersion, setCurrentVersion] = useState<number>(profile.versionNo || 1);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  // Initial organizational nodes bound to versioned organization_id contract
  const [nodes, setNodes] = useState<GovernanceNode[]>([
    {
      id: 'gov_exec_01',
      organizationId: profile.organizationId,
      versionNo: currentVersion,
      title: 'Managing Principal & Operator',
      category: 'Executive',
      assignedActor: profile.personName || 'Kagan Dolek (Managing Principal)',
      actorType: 'Human',
      authorityLevel: 'Full Approval Authority',
      responsibilities: [
        'Final gate sign-off for scope records, commercial payment, and code deployment.',
        'Directional priority alignment and capital allocation non-negotiables.',
        'Human-in-the-loop override for all consequential business actions.'
      ],
      boundedConstraints: [
        'Must explicitly approve Gate 2 (Scope) and Gate 4 (Deployment)',
        'No false revenue or unverified claims permitted'
      ],
      status: 'Active & Verified'
    },
    {
      id: 'gov_adv_01',
      organizationId: profile.organizationId,
      versionNo: currentVersion,
      title: 'Compliance & Legal Counsel',
      category: 'Advisory Council',
      assignedActor: 'Strategic Legal & Risk Advisory Council',
      actorType: 'Hybrid Advisory',
      authorityLevel: 'Advisory & Veto',
      responsibilities: [
        'Jurisdictional compliance review and regulatory risk surface analysis.',
        'Data sensitivity and contractual confidentiality bounds auditing.',
        'Relational contract compliance verification.'
      ],
      boundedConstraints: [
        'Veto authority on high-risk system access or unauthorized data export'
      ],
      status: 'Active & Verified'
    },
    {
      id: 'gov_adv_02',
      organizationId: profile.organizationId,
      versionNo: currentVersion,
      title: 'Financial Risk & Valuation Advisor',
      category: 'Advisory Council',
      assignedActor: 'Commercial Valuation Advisory Board',
      actorType: 'Hybrid Advisory',
      authorityLevel: 'Advisory & Veto',
      responsibilities: [
        'Baseline-vs-Target ROI verification and economic impact validation.',
        'Commercial terms auditing prior to quote/proposal release.',
        'Verification of E5 commercial evidence receipts.'
      ],
      boundedConstraints: [
        'Enforces "No False Revenue" trust principle strictly'
      ],
      status: 'Active & Verified'
    },
    {
      id: 'gov_dept_01',
      organizationId: profile.organizationId,
      versionNo: currentVersion,
      title: 'Intake & Opportunity AI Cored Dept',
      category: 'AI-Cored Department',
      assignedActor: 'RA6 Diagnostic & Intake Agent',
      actorType: 'AI Agent',
      authorityLevel: 'Bounded Autonomous Execution',
      responsibilities: [
        'Automated intake profiling, workflow mapping, and bottleneck classification.',
        'Formulating scored candidate recommendations (20% economic impact, 15% revenue proximity).',
        'Generating bounded proposal scope drafts (v1/v2).'
      ],
      boundedConstraints: [
        'Cannot commit capital or enter agreements without human approval',
        'Restricted to read/profile intake inputs'
      ],
      status: 'Active & Verified'
    },
    {
      id: 'gov_dept_02',
      organizationId: profile.organizationId,
      versionNo: currentVersion,
      title: 'Execution & Orchestration AI Cored Dept',
      category: 'AI-Cored Department',
      assignedActor: 'RA6 Build & Deployment Agent',
      actorType: 'AI Agent',
      authorityLevel: 'Bounded Autonomous Execution',
      responsibilities: [
        'Work package compilation, deterministic unit & package testing.',
        'Full-stack Express + React application execution and service bundling.',
        'Continuous integration test suite verification (E2/E3 evidence generation).'
      ],
      boundedConstraints: [
        'Requires Gate 4 (Deployment) human sign-off prior to production push'
      ],
      status: 'Active & Verified'
    },
    {
      id: 'gov_dept_03',
      organizationId: profile.organizationId,
      versionNo: currentVersion,
      title: 'Evidence & Governance Audit AI Cored Dept',
      category: 'AI-Cored Department',
      assignedActor: 'RA6 Audit & Compliance Ledger Agent',
      actorType: 'AI Agent',
      authorityLevel: 'Bounded Autonomous Execution',
      responsibilities: [
        'Real-time evidence grading (E0 to E5 ledger logging).',
        'State change attribution and immutable version audit trail logging.',
        'Relational implementation contract schema synchronization.'
      ],
      boundedConstraints: [
        'Immutable log generation — records cannot be rewritten or erased'
      ],
      status: 'Active & Verified'
    }
  ]);

  // Modal State for adding a new Council Role or AI Department
  const [showAddModal, setShowAddModal] = useState(false);
  const [nodeTitle, setNodeTitle] = useState('');
  const [nodeCategory, setNodeCategory] = useState<'Executive' | 'Advisory Council' | 'AI-Cored Department'>('AI-Cored Department');
  const [nodeActor, setNodeActor] = useState('');
  const [nodeActorType, setNodeActorType] = useState<'Human' | 'AI Agent' | 'Hybrid Advisory'>('AI Agent');
  const [nodeAuthority, setNodeAuthority] = useState<'Full Approval Authority' | 'Advisory & Veto' | 'Bounded Autonomous Execution'>('Bounded Autonomous Execution');
  const [nodeResp, setNodeResp] = useState('');

  const handleVersionBump = () => {
    const newVer = currentVersion + 1;
    setCurrentVersion(newVer);
    // Update version on all nodes under this organization_id
    setNodes(nodes.map(n => ({ ...n, versionNo: newVer })));
    if (onUpdateOrganizationVersion) {
      onUpdateOrganizationVersion(newVer);
    }
  };

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeTitle) return;

    const newNode: GovernanceNode = {
      id: `gov_node_${Date.now()}`,
      organizationId: profile.organizationId,
      versionNo: currentVersion,
      title: nodeTitle,
      category: nodeCategory,
      assignedActor: nodeActor || 'Assigned Agent',
      actorType: nodeActorType,
      authorityLevel: nodeAuthority,
      responsibilities: nodeResp ? [nodeResp] : ['Departmental workflow oversight'],
      boundedConstraints: ['Bounded by Organization ID contract schema'],
      status: 'Active & Verified'
    };

    setNodes([...nodes, newNode]);

    setNodeTitle('');
    setNodeActor('');
    setNodeResp('');
    setShowAddModal(false);
  };

  const filteredNodes = nodes.filter(
    (n) => selectedCategoryFilter === 'ALL' || n.category === selectedCategoryFilter
  );

  return (
    <div className="space-y-6">
      {/* Top Banner with Versioned Contract Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] uppercase font-bold border border-emerald-500/40">
              ORGANIZATION_ID CONTRACT
            </span>
            <span className="text-xs font-mono text-slate-400">ID: {profile.organizationId}</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40">
              v{currentVersion} CONTRACT
            </span>
          </div>

          <h2 className="text-xl font-black text-slate-100 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <span>Governance Board & AI-Cored Department Structure</span>
          </h2>
          <p className="text-xs text-slate-400">
            Hierarchical organizational architecture, advisory council oversight, and AI-cored department responsibilities bound to versioned contract rules.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleVersionBump}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs rounded-xl flex items-center space-x-1.5 transition-colors"
            title="Bump Organization Contract Version"
          >
            <GitCommit className="w-4 h-4 text-amber-400" />
            <span>Bump to v{currentVersion + 1}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Role / Department</span>
          </button>
        </div>
      </div>

      {/* Category Filter Controls */}
      <div className="flex items-center space-x-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <span className="text-xs font-bold text-slate-700 mr-2 shrink-0 flex items-center space-x-1">
          <Sliders className="w-3.5 h-3.5 text-slate-500" />
          <span>Category Filter:</span>
        </span>
        {['ALL', 'Executive', 'Advisory Council', 'AI-Cored Department'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategoryFilter === cat
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Organizational Hierarchy Diagram / Grid */}
      <div className="space-y-6">
        {/* EXECUTIVE LAYER */}
        {(selectedCategoryFilter === 'ALL' || selectedCategoryFilter === 'Executive') && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
              <UserCheck className="w-4 h-4 text-amber-500" />
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">
                1. Executive & Managing Control
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredNodes
                .filter((n) => n.category === 'Executive')
                .map((node) => (
                  <GovernanceNodeCard key={node.id} node={node} />
                ))}
            </div>
          </div>
        )}

        {/* ADVISORY COUNCIL LAYER */}
        {(selectedCategoryFilter === 'ALL' || selectedCategoryFilter === 'Advisory Council') && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">
                2. Advisory Council & Strategic Oversight
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNodes
                .filter((n) => n.category === 'Advisory Council')
                .map((node) => (
                  <GovernanceNodeCard key={node.id} node={node} />
                ))}
            </div>
          </div>
        )}

        {/* AI-CORED DEPARTMENT LAYER */}
        {(selectedCategoryFilter === 'ALL' || selectedCategoryFilter === 'AI-Cored Department') && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
              <Cpu className="w-4 h-4 text-amber-500" />
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">
                3. AI-Cored Autonomous Department Layer
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredNodes
                .filter((n) => n.category === 'AI-Cored Department')
                .map((node) => (
                  <GovernanceNodeCard key={node.id} node={node} />
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Contract Versioning Audit Footer */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 text-slate-500" />
          <span>
            Strict adherence to relational contract schema <strong>`organization_id`</strong> ({profile.organizationId}).
          </span>
        </div>
        <span className="font-mono text-[11px] font-bold text-slate-700">
          Contract Audit Status: Verified v{currentVersion}
        </span>
      </div>

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Governance Role or AI Department</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNode} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Role / Department Title *</label>
                <input
                  type="text"
                  required
                  value={nodeTitle}
                  onChange={(e) => setNodeTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Security & Key Vault Governance Department"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={nodeCategory}
                    onChange={(e) => setNodeCategory(e.target.value as any)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Executive">Executive</option>
                    <option value="Advisory Council">Advisory Council</option>
                    <option value="AI-Cored Department">AI-Cored Department</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Actor Type</label>
                  <select
                    value={nodeActorType}
                    onChange={(e) => setNodeActorType(e.target.value as any)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Human">Human</option>
                    <option value="AI Agent">AI Agent</option>
                    <option value="Hybrid Advisory">Hybrid Advisory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Assigned Actor / Agent Name</label>
                <input
                  type="text"
                  value={nodeActor}
                  onChange={(e) => setNodeActor(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., RA6 Vault Security Agent"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Authority Level</label>
                <select
                  value={nodeAuthority}
                  onChange={(e) => setNodeAuthority(e.target.value as any)}
                  className="w-full p-2 border rounded"
                >
                  <option value="Full Approval Authority">Full Approval Authority</option>
                  <option value="Advisory & Veto">Advisory & Veto</option>
                  <option value="Bounded Autonomous Execution">Bounded Autonomous Execution</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Primary Mandate / Responsibilities</label>
                <textarea
                  rows={2}
                  value={nodeResp}
                  onChange={(e) => setNodeResp(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Vault key access control, automated credential rotation auditing."
                />
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
                  Save Governance Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

interface GovernanceNodeCardProps {
  node: GovernanceNode;
}

const GovernanceNodeCard: React.FC<GovernanceNodeCardProps> = ({ node }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative hover:border-amber-400 transition-all">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center space-x-2">
          {node.actorType === 'Human' ? (
            <Briefcase className="w-4 h-4 text-amber-500" />
          ) : node.actorType === 'AI Agent' ? (
            <Bot className="w-4 h-4 text-blue-500" />
          ) : (
            <Users className="w-4 h-4 text-purple-500" />
          )}
          <h4 className="font-bold text-slate-900 text-sm">{node.title}</h4>
        </div>

        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
          v{node.versionNo}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
        <div>
          <span className="text-slate-400 block text-[9px] uppercase font-bold">Assigned Actor</span>
          <strong className="text-slate-800">{node.assignedActor}</strong>
        </div>

        <div>
          <span className="text-slate-400 block text-[9px] uppercase font-bold">Authority Level</span>
          <strong className="text-amber-800">{node.authorityLevel}</strong>
        </div>
      </div>

      <div className="space-y-1 pt-1">
        <span className="text-[10px] font-bold text-slate-700 uppercase block">Primary Responsibilities:</span>
        <ul className="list-disc list-inside text-slate-600 text-xs space-y-0.5">
          {node.responsibilities.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
        <span className="text-slate-400 font-mono">org_id: {node.organizationId}</span>
        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full border border-emerald-200">
          ✓ {node.status}
        </span>
      </div>
    </div>
  );
};
