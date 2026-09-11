import React, { useState } from 'react';
import { exportAllDataJSON } from '../lib/storage';
import { Database, Download, Code, CheckCircle, ShieldCheck } from 'lucide-react';

export const RelationalContractViewer: React.FC = () => {
  const [jsonText] = useState(() => exportAllDataJSON());
  const [copied, setCopied] = useState(false);

  const entitiesList = [
    'person', 'organization', 'membership', 'operator_profile', 'profile_asset', 'profile_constraint',
    'workflow', 'workflow_baseline', 'mission', 'mission_requirement', 'outcome_target', 'automation_candidate',
    'recommendation', 'scope', 'approval', 'work_package', 'deliverable', 'acceptance_test',
    'evidence', 'metric_observation', 'change_request', 'audit_event', 'attribution', 'system_connection'
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intelliwealth_relational_contract_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>RELATIONAL IMPLEMENTATION CONTRACT SCHEMA</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">
            24 Persistent Entities Data Model
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Every entity includes organization_id, version_no, created_at, updated_at, and actor attribution. Secrets are referenced, never stored.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Code className="w-4 h-4 text-amber-400" />
            <span>{copied ? 'Copied!' : 'Copy Payload'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Schema JSON</span>
          </button>
        </div>
      </div>

      {/* Entities Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
          Required 24 Persistent Schema Entities
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {entitiesList.map((ent) => (
            <div
              key={ent}
              className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 flex items-center space-x-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{ent}</span>
            </div>
          ))}
        </div>
      </div>

      {/* JSON Viewer */}
      <div className="bg-slate-950 text-emerald-400 p-5 rounded-2xl font-mono text-xs overflow-x-auto max-h-[500px] shadow-inner border border-slate-800 space-y-2">
        <div className="text-slate-400 text-[10px] pb-2 border-b border-slate-800 flex justify-between">
          <span>// LIVE PERSISTED RELATIONAL PAYLOAD</span>
          <span>JSON Schema v1.0</span>
        </div>
        <pre>{jsonText}</pre>
      </div>
    </div>
  );
};
