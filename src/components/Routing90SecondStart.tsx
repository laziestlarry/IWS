import React, { useState } from 'react';
import { TodayStage, StrongestAsset, PrimaryPriority, ServicePath } from '../types';
import { calculateServicePath } from '../lib/scoringEngine';
import { ArrowRight, CheckCircle2, Sparkles, FileText, Zap, Compass, Shield } from 'lucide-react';

interface RoutingProps {
  onBuildRecommendation: (routing: {
    todayStage: TodayStage;
    strongestAsset: StrongestAsset;
    priority: PrimaryPriority;
    servicePath: ServicePath;
  }) => void;
  onStartManualMission: () => void;
}

export const Routing90SecondStart: React.FC<RoutingProps> = ({
  onBuildRecommendation,
  onStartManualMission,
}) => {
  const [stage, setStage] = useState<TodayStage>('operating');
  const [asset, setAsset] = useState<StrongestAsset>('skill');
  const [priority, setPriority] = useState<PrimaryPriority>('reliable_operations');

  const computedPath = calculateServicePath(stage, asset, priority);

  const getServicePathInfo = (path: ServicePath) => {
    switch (path) {
      case 'opportunity_and_offer':
        return {
          code: '01',
          title: 'Opportunity & Offer Path',
          tagline: 'Find a defensible problem, buyer, and offer when commercial direction itself is unclear.',
          outputs: ['Market & buyer research', 'Offer positioning blueprint', 'Revenue-path prioritization matrix'],
          badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
        };
      case 'build_and_automate':
        return {
          code: '02',
          title: 'Build & Automate Path',
          tagline: 'Convert a validated workflow into the smallest credible implementation that can sell or fulfill reliably.',
          outputs: ['Project architecture', 'Workflow automation spec', 'Integration plan', 'QA & acceptance gates'],
          badgeColor: 'bg-blue-100 text-blue-900 border-blue-300'
        };
      case 'manage_and_grow':
        return {
          code: '03',
          title: 'Manage & Grow Path',
          tagline: 'Keep priorities, projects, and performance tied to verified business outcomes.',
          outputs: ['Priority management dashboard', 'Evidence reviews', 'Operational performance metrics', 'Controlled iteration logs'],
          badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
        };
    }
  };

  const currentPathInfo = getServicePathInfo(computedPath);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBuildRecommendation({
      todayStage: stage,
      strongestAsset: asset,
      priority,
      servicePath: computedPath,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Heading */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200">
          <Compass className="w-3.5 h-3.5 text-amber-700" />
          <span>90-SECOND START — PROFILE ROUTING</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Where should your business focus today?
        </h2>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Answer 3 quick questions to select your service path and generate a tailored bottleneck recommendation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Where are you today? */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="text-base font-bold text-slate-900">Where are you today?</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: 'ideas',
                title: 'I have ideas',
                desc: 'I need to choose the right one.'
              },
              {
                id: 'offer',
                title: 'I have an offer',
                desc: 'I need a system to sell and deliver it.'
              },
              {
                id: 'operating',
                title: 'I’m operating',
                desc: 'I need focus, automation, and growth.'
              }
            ].map((item) => (
              <label
                key={item.id}
                className={`relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  stage === item.id
                    ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="stage"
                  value={item.id}
                  checked={stage === item.id}
                  onChange={() => setStage(item.id as TodayStage)}
                  className="sr-only"
                />
                <span className="font-semibold text-sm text-slate-900">{item.title}</span>
                <span className="text-xs text-slate-500 mt-1">{item.desc}</span>
                {stage === item.id && (
                  <CheckCircle2 className="w-4 h-4 text-amber-600 absolute top-3 right-3" />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Step 2: What is your strongest current asset? */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h3 className="text-base font-bold text-slate-900">What is your strongest current asset?</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'skill',
                title: 'A professional skill',
                desc: 'Expertise I can package and sell.'
              },
              {
                id: 'audience',
                title: 'An audience or network',
                desc: 'People I can reach with trust.'
              },
              {
                id: 'product',
                title: 'A product or system',
                desc: 'Something already partly built.'
              },
              {
                id: 'operations',
                title: 'Existing operations/data',
                desc: 'Recurring work I can measure and improve.'
              }
            ].map((item) => (
              <label
                key={item.id}
                className={`relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  asset === item.id
                    ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="asset"
                  value={item.id}
                  checked={asset === item.id}
                  onChange={() => setAsset(item.id as StrongestAsset)}
                  className="sr-only"
                />
                <span className="font-semibold text-sm text-slate-900">{item.title}</span>
                <span className="text-xs text-slate-500 mt-1">{item.desc}</span>
                {asset === item.id && (
                  <CheckCircle2 className="w-4 h-4 text-amber-600 absolute top-3 right-3" />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Step 3: What matters most right now? */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h3 className="text-base font-bold text-slate-900">What matters most right now?</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: 'speed_to_revenue',
                title: 'Speed to revenue',
                desc: 'Validate a sellable path quickly.'
              },
              {
                id: 'reliable_operations',
                title: 'Reliable operations',
                desc: 'Build repeatable delivery and control.'
              },
              {
                id: 'scalable_growth',
                title: 'Scalable growth',
                desc: 'Expand what is already working.'
              }
            ].map((item) => (
              <label
                key={item.id}
                className={`relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  priority === item.id
                    ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value={item.id}
                  checked={priority === item.id}
                  onChange={() => setPriority(item.id as PrimaryPriority)}
                  className="sr-only"
                />
                <span className="font-semibold text-sm text-slate-900">{item.title}</span>
                <span className="text-xs text-slate-500 mt-1">{item.desc}</span>
                {priority === item.id && (
                  <CheckCircle2 className="w-4 h-4 text-amber-600 absolute top-3 right-3" />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Selected Service Path Preview */}
        <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${currentPathInfo.badgeColor}`}>
                PATH {currentPathInfo.code}
              </span>
              <h4 className="text-base font-bold text-amber-400">{currentPathInfo.title}</h4>
            </div>
            <span className="text-xs text-slate-400">Assigned Outcome Operating Path</span>
          </div>

          <p className="text-xs text-slate-300">{currentPathInfo.tagline}</p>

          <div className="space-y-1.5 pt-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Deliverable Outputs:</p>
            <div className="flex flex-wrap gap-2">
              {currentPathInfo.outputs.map((out, idx) => (
                <span key={idx} className="text-xs bg-slate-800 text-slate-200 px-2.5 py-1 rounded border border-slate-700">
                  ✓ {out}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Primary and Secondary Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>PRIMARY ACTION: Build my recommendation</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          <button
            type="button"
            onClick={onStartManualMission}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm border border-slate-300 transition-colors"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>SECONDARY ACTION: Start a mission manually</span>
          </button>
        </div>
      </form>
    </div>
  );
};
