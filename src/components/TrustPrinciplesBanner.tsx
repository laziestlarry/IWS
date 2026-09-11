import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export const TrustPrinciplesBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                PRIMARY PROMISE
              </p>
              <p className="text-sm font-medium text-slate-100">
                Stop collecting ideas. Fix the workflow that moves revenue, reliability, or scalable growth.
              </p>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center space-x-1 text-xs text-amber-400 hover:text-amber-300 font-medium py-1 px-2.5 rounded bg-amber-400/10 hover:bg-amber-400/20 transition-colors shrink-0"
          >
            <span>5 Trust Principles</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-300 animate-fadeIn">
            <div className="flex items-start space-x-2 bg-slate-800/60 p-2.5 rounded border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100 block">Built on Actual Business Reality</strong>
                Grounds all recommendations in your stage, assets, constraints, and live workflow data.
              </div>
            </div>

            <div className="flex items-start space-x-2 bg-slate-800/60 p-2.5 rounded border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100 block">Human-Controlled Execution</strong>
                You approve consequential actions, scope boundaries, deployment gates, and payouts.
              </div>
            </div>

            <div className="flex items-start space-x-2 bg-slate-800/60 p-2.5 rounded border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100 block">Evidence-Led Grading (E0–E5)</strong>
                Claims, candidate recommendations, tests, and operational observations are graded separately.
              </div>
            </div>

            <div className="flex items-start space-x-2 bg-slate-800/60 p-2.5 rounded border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100 block">Compliance-Aware Surfacing</strong>
                Surfaces legal, ethical, security, financial, and operational risks before execution.
              </div>
            </div>

            <div className="flex items-start space-x-2 bg-slate-800/60 p-2.5 rounded border border-slate-700/60 md:col-span-2 lg:col-span-1">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100 block">No False Revenue Guarantee</strong>
                Intent, tests, page views, or self-originated actions do not count as verified revenue.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
