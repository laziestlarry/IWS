import React from 'react';
import {
  ShieldCheck,
  Compass,
  FileText,
  LayoutDashboard,
  Bot,
  Database,
  Lock,
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';
import { MissionState, ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeMissionState?: MissionState;
  onOpenCommander: () => void;
  onOpenPrivacy: () => void;
  onResetDemoData?: () => void;
  hasActiveMission?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeMissionState,
  onOpenCommander,
  onOpenPrivacy,
  onResetDemoData,
  hasActiveMission,
}) => {
  const getStateColor = (state?: MissionState) => {
    switch (state) {
      case 'DRAFT': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'PROFILED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DIAGNOSED': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'RECOMMENDED': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'SCOPE_PENDING': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'PROPOSAL': return 'bg-sky-50 text-sky-700 border-sky-300';
      case 'PAID': return 'bg-teal-50 text-teal-800 border-teal-300 font-bold';
      case 'DELIVERY': return 'bg-blue-100 text-blue-900 border-blue-400';
      case 'ACCEPTANCE': return 'bg-emerald-100 text-emerald-900 border-emerald-400';
      case 'CLOSED': return 'bg-gray-800 text-white border-gray-900';
      case 'CANCELLED': return 'bg-rose-100 text-rose-800 border-rose-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding Bar */}
        <div className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black text-xl tracking-wider shadow-inner">
              IW
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-100">
                  INTELLIWEALTH SOLUTIONS
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  OUTCOME OPERATING SYSTEM
                </span>
              </div>
              <p className="text-xs text-slate-400">
                AI-guided business design & execution for solo operators & service businesses
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center flex-wrap gap-2">
            {activeMissionState && (
              <div className="flex items-center space-x-2 mr-2">
                <span className="text-xs text-slate-400 hidden sm:inline">Active Mission:</span>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-mono ${getStateColor(activeMissionState)}`}>
                  ● {activeMissionState}
                </span>
              </div>
            )}

            <button
              onClick={onOpenCommander}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm"
              title="Open AI Commander Assistant"
            >
              <Bot className="w-4 h-4 text-slate-950" />
              <span>AI Commander</span>
            </button>

            <button
              onClick={onOpenPrivacy}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Privacy, Data Export & Governance"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Privacy & Data</span>
            </button>

            <button
              onClick={() => onResetDemoData?.()}
              className="inline-flex items-center space-x-1 px-2 py-1.5 text-xs font-medium rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              title="Reset Sample Demo Mission"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('routing')}
            className={`inline-flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'routing'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>90-Sec Routing</span>
          </button>

          <button
            onClick={() => setActiveTab('intake')}
            className={`inline-flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'intake'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Mission Intake</span>
          </button>

          <button
            onClick={() => setActiveTab('recommendations')}
            className={`inline-flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'recommendations'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Recommendations</span>
          </button>

          {hasActiveMission && (
            <button
              onClick={() => setActiveTab('workspace')}
              className={`inline-flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === 'workspace'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Customer Workspace</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('relational_contract')}
            className={`inline-flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'relational_contract'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>24-Entity Schema</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
