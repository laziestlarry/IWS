import React, { useState } from 'react';
import { RecommendationCandidate, EVIDENCE_GRADES, MissionRecord } from '../types';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Layers,
  CheckCircle,
  HelpCircle,
  BarChart2,
  Clock,
  ArrowRight,
  FileCheck
} from 'lucide-react';

interface RecommendationCardProps {
  candidate: RecommendationCandidate;
  isSelected: boolean;
  onSelectScope: (candidate: RecommendationCandidate) => void;
  rankIndex: number;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  candidate,
  isSelected,
  onSelectScope,
  rankIndex,
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const evidenceInfo = EVIDENCE_GRADES[candidate.evidenceGrade] || EVIDENCE_GRADES.E0;

  return (
    <div
      className={`bg-white rounded-2xl border-2 transition-all shadow-sm ${
        isSelected
          ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/10'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="p-6 space-y-5">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-900 text-amber-400 font-mono">
                RANK #{rankIndex + 1}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${evidenceInfo.color}`}>
                Grade {candidate.evidenceGrade}: {evidenceInfo.title}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {candidate.candidateName}
            </h3>
          </div>

          {/* Fit Score Badge */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="text-right">
              <div className="text-2xl font-black text-slate-900 font-mono">
                {candidate.fitScore}<span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Fit Score
              </span>
            </div>

            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Toggle 9-Factor Scoring Model Breakdown"
            >
              {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 9-Factor Scoring Model Breakdown Drawer */}
        {showBreakdown && (
          <div className="bg-slate-900 text-white p-4 rounded-xl space-y-3 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-amber-400">Weighted Scoring Breakdown</span>
              </div>
              <span className="text-[10px] text-slate-400">Total Fit Score: {candidate.fitScore}/100</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono">
              <div className="bg-slate-800 p-2 rounded border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Impact (20%)</span>
                <span className="font-bold text-slate-100">{candidate.scoringBreakdown.economicImpact}/100</span>
              </div>
              <div className="bg-slate-800 p-2 rounded border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Rev Proximity (15%)</span>
                <span className="font-bold text-slate-100">{candidate.scoringBreakdown.revenueProximity}/100</span>
              </div>
              <div className="bg-slate-800 p-2 rounded border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Frequency (10%)</span>
                <span className="font-bold text-slate-100">{candidate.scoringBreakdown.frequency}/100</span>
              </div>
              <div className="bg-slate-800 p-2 rounded border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Measurability (10%)</span>
                <span className="font-bold text-slate-100">{candidate.scoringBreakdown.measurability}/100</span>
              </div>
              <div className="bg-slate-800 p-2 rounded border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Data Readiness (10%)</span>
                <span className="font-bold text-slate-100">{candidate.scoringBreakdown.dataReadiness}/100</span>
              </div>
              <div className="bg-slate-800 p-2 rounded border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Integration Fit (10%)</span>
                <span className="font-bold text-slate-100">{candidate.scoringBreakdown.integrationFit}/100</span>
              </div>
              <div className="bg-slate-800 p-2 rounded border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Owner Readiness (10%)</span>
                <span className="font-bold text-slate-100">{candidate.scoringBreakdown.ownerReadiness}/100</span>
              </div>
              <div className="bg-slate-800 p-2 rounded border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Low Effort (10%)</span>
                <span className="font-bold text-slate-100">{candidate.scoringBreakdown.lowEffort}/100</span>
              </div>
              <div className="bg-slate-800 p-2 rounded border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Low Risk (5%)</span>
                <span className="font-bold text-slate-100">{candidate.scoringBreakdown.lowRisk}/100</span>
              </div>
            </div>
          </div>
        )}

        {/* Core Rationale & Expected Business Effect */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
            <span className="font-bold text-slate-900 block">Why it ranks here</span>
            <p className="text-slate-700">{candidate.whyRanksHere}</p>
          </div>

          <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200/80 space-y-1">
            <span className="font-bold text-emerald-900 block">Expected Business Effect</span>
            <p className="text-emerald-800">{candidate.expectedBusinessEffect}</p>
          </div>
        </div>

        {/* Detailed Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-semibold text-slate-800 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              <span>Implementation Effort</span>
            </span>
            <p className="font-mono text-slate-900">{candidate.estimatedEffortBand}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-semibold text-slate-800 flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              <span>Required Systems / Access</span>
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {candidate.requiredSystems.map((sys, idx) => (
                <span key={idx} className="bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-700 font-mono">
                  {sys}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-semibold text-slate-800 flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Risks & Safeguards</span>
            </span>
            <ul className="list-disc list-inside text-slate-700 space-y-0.5">
              {candidate.risks.map((risk, idx) => (
                <li key={idx}>{risk}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Acceptance Test & Unknown Factors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs border-t border-slate-100 pt-3">
          <div className="space-y-1">
            <span className="font-bold text-slate-900 flex items-center space-x-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Acceptance Test Script</span>
            </span>
            <p className="text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 font-mono text-[11px]">
              {candidate.acceptanceTest}
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-900 flex items-center space-x-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>What is still unknown</span>
            </span>
            <p className="text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 italic">
              {candidate.whatIsStillUnknown}
            </p>
          </div>
        </div>

        {/* Select & Convert Action */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => onSelectScope(candidate)}
            className={`inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
              isSelected
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Select & Convert to Proposal Scope</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface RecommendationsViewProps {
  mission: MissionRecord;
  onSelectCandidate: (candidate: RecommendationCandidate) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  mission,
  onSelectCandidate,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 text-purple-900 text-xs font-semibold border border-purple-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>EVIDENCE-LED RECOMMENDATION ENGINE</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Candidate Interventions for {mission.intake.sectionC.workflowName || 'Workflow'}
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Ranked by the 9-Factor Weighted Scoring Model. Claims and evidence grades are tracked separately.
          </p>
        </div>

        <div className="bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-800 text-right">
          <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Mission State</span>
          <span className="text-sm font-bold text-amber-400">{mission.state}</span>
        </div>
      </div>

      {/* Candidate Cards List */}
      <div className="space-y-6">
        {mission.recommendations.map((candidate, index) => {
          const isSelected = mission.selectedRecommendationId === candidate.id;
          return (
            <RecommendationCard
              key={candidate.id}
              candidate={candidate}
              isSelected={isSelected}
              onSelectScope={onSelectCandidate}
              rankIndex={index}
            />
          );
        })}
      </div>
    </div>
  );
};
