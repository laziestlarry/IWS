import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  MissionRecord,
  OperatorProfile,
  MissionIntakeData,
  RecommendationCandidate,
  ProposalScope,
  ApprovalGate,
  EvidenceRecord,
  TodayStage,
  PrimaryPriority
} from './types';
import {
  loadActiveMission,
  saveActiveMission,
  loadOperatorProfile,
  saveOperatorProfile,
  getEmptyIntakeData,
  createDefaultSampleMission
} from './lib/storage';
import { calculateCandidateFitScore } from './lib/scoringEngine';

import { Header } from './components/Header';
import { TrustPrinciplesBanner } from './components/TrustPrinciplesBanner';
import { Routing90SecondStart } from './components/Routing90SecondStart';
import { MissionIntakeForm } from './components/MissionIntakeForm';
import { RecommendationsView } from './components/RecommendationsView';
import { CustomerWorkspace } from './components/CustomerWorkspace';
import { RelationalContractViewer } from './components/RelationalContractViewer';
import { CommanderDrawer } from './components/CommanderDrawer';
import { ProposalGateModal } from './components/ProposalGateModal';
import { PrivacyDataModal } from './components/PrivacyDataModal';

import { Sparkles, Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('routing');
  const [profile, setProfile] = useState<OperatorProfile>(loadOperatorProfile);
  const [mission, setMission] = useState<MissionRecord>(loadActiveMission);

  // Modals & Drawers state
  const [isCommanderOpen, setIsCommanderOpen] = useState(false);
  const [isProposalGateOpen, setIsProposalGateOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sync to local storage
  useEffect(() => {
    saveActiveMission(mission);
  }, [mission]);

  useEffect(() => {
    saveOperatorProfile(profile);
  }, [profile]);

  // Handle 90-Second Start Routing selection
  const handleStartRouting = (stage: TodayStage, priority: PrimaryPriority) => {
    // Update intake defaults with selected stage & priority
    const updatedIntake: MissionIntakeData = {
      ...mission.intake,
      sectionA: { ...mission.intake.sectionA, currentStage: stage },
      sectionB: { ...mission.intake.sectionB, priority },
    };

    setMission(prev => ({
      ...prev,
      intake: updatedIntake,
    }));

    setActiveTab('intake');
  };

  // Handle Mission Intake Form Save Draft
  const handleSaveDraft = (draftIntake: MissionIntakeData) => {
    setMission(prev => ({
      ...prev,
      intake: draftIntake,
      state: prev.state === 'DRAFT' ? 'DRAFT' : prev.state,
    }));
  };

  // Handle Clear Unsaved Draft
  const handleClearDraft = () => {
    if (confirm('Are you sure you want to clear the unsaved intake draft?')) {
      setMission(prev => ({
        ...prev,
        intake: getEmptyIntakeData(),
        state: 'DRAFT',
      }));
    }
  };

  // Handle Cancel Active Mission
  const handleCancelMission = () => {
    if (confirm('Cancel active mission? The audit trail will be preserved.')) {
      setMission(prev => ({
        ...prev,
        state: 'CLOSED',
      }));
      setActiveTab('workspace');
    }
  };

  // Handle Mission Submission & AI/Scoring Analysis
  const handleSubmitMission = async (intakeData: MissionIntakeData) => {
    setIsAnalyzing(true);
    let candidateRecommendations: RecommendationCandidate[] = [];

    try {
      // Call server API
      const res = await fetch('/api/gemini/analyze-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intakeData, profile }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.candidates && Array.isArray(data.candidates)) {
          candidateRecommendations = data.candidates;
        }
      }
    } catch (err) {
      console.warn('API call fallback to local scoring engine:', err);
    }

    // Fallback or score verification if API returned fewer than 3 candidates
    if (candidateRecommendations.length < 3) {
      const defaultCandidates: Array<{
        candidateName: string;
        evidenceGrade: 'E1' | 'E2' | 'E3';
        whyRanksHere: string;
        expectedBusinessEffect: string;
        dependencies: string[];
        risks: string[];
        requiredSystems: string[];
        estimatedEffortBand: 'Low (1-3 days)' | 'Medium (1-2 weeks)' | 'High (3-4 weeks)';
        acceptanceTest: string;
        whatIsStillUnknown: string;
      }> = [
        {
          candidateName: 'Automated Client Onboarding & Document Vault Provisioning',
          evidenceGrade: 'E3',
          whyRanksHere: 'Directly addresses manual intake bottleneck with zero custom code overhead using existing Drive & CRM APIs.',
          expectedBusinessEffect: 'Reduces turnaround time from 5.2 days to under 12 hours. Saves ~37.5 labor hours per month.',
          dependencies: ['HubSpot or Pipedrive API Access', 'Google Drive OAuth Scope'],
          risks: ['Clients upload incorrect document formats or incomplete tax files.'],
          requiredSystems: ['CRM', 'Google Drive', 'Email Notification API'],
          estimatedEffortBand: 'Low (1-3 days)',
          acceptanceTest: 'Stripe deposit webhook triggers automated vault folder creation and sends pre-filled agreement link within 60 seconds.',
          whatIsStillUnknown: 'Client document file size variations for large corporate returns.'
        },
        {
          candidateName: 'Automated Payment Deposit & Proposal Signoff Sync',
          evidenceGrade: 'E2',
          whyRanksHere: 'Prevents unpaid kickoff work by strictly requiring deposit clearance before booking client intake calendar slot.',
          expectedBusinessEffect: 'Eliminates unbilled advisory hours and speeds up revenue realization by 4 days.',
          dependencies: ['Stripe Merchant Account', 'DocuSign / HelloSign Webhook'],
          risks: ['Payment authorization delays on international client cards.'],
          requiredSystems: ['Stripe Commerce', 'Calendly', 'CRM'],
          estimatedEffortBand: 'Low (1-3 days)',
          acceptanceTest: 'Signing contract automatically unlocks deposit checkout URL and logs lead status to Won in CRM.',
          whatIsStillUnknown: 'International currency exchange fee preferences.'
        },
        {
          candidateName: 'Weekly Executive Operational Progress Dashboard',
          evidenceGrade: 'E1',
          whyRanksHere: 'Provides high-level visibility for managing principals without interfering with daily client delivery workflows.',
          expectedBusinessEffect: 'Reduces weekly administrative status checks by 2.5 hours per week.',
          dependencies: ['Airtable / Database Read API'],
          risks: ['Stale baseline metrics if manual logs are skipped.'],
          requiredSystems: ['Airtable', 'Slack / Email'],
          estimatedEffortBand: 'Medium (1-2 weeks)',
          acceptanceTest: 'Every Friday at 5 PM, automated summary metric report posts to leadership Slack channel.',
          whatIsStillUnknown: 'Exact client satisfaction rating survey response rate.'
        }
      ];

      candidateRecommendations = defaultCandidates.map((c, i) => {
        const scored = calculateCandidateFitScore(intakeData, {
          impactScore: 90 - i * 8,
          revenueProximityScore: 85 - i * 10,
          frequencyScore: 80 - i * 5,
          measurabilityScore: 90,
          dataReadinessScore: 85,
          integrationFitScore: 80,
          ownerReadinessScore: 90,
          lowEffortScore: 85 - i * 10,
          lowRiskScore: 90,
        });

        return {
          id: `cand_${Date.now()}_${i}`,
          candidateName: c.candidateName,
          fitScore: scored.fitScore,
          scoringBreakdown: scored.scoringBreakdown,
          evidenceGrade: c.evidenceGrade,
          whyRanksHere: c.whyRanksHere,
          expectedBusinessEffect: c.expectedBusinessEffect,
          dependencies: c.dependencies,
          risks: c.risks,
          requiredSystems: c.requiredSystems,
          estimatedEffortBand: c.estimatedEffortBand,
          acceptanceTest: c.acceptanceTest,
          whatIsStillUnknown: c.whatIsStillUnknown
        };
      });
    }

    // Sort candidates by fitScore descending
    candidateRecommendations.sort((a, b) => b.fitScore - a.fitScore);

    // Update active mission state
    setMission(prev => ({
      ...prev,
      state: 'RECOMMENDED',
      intake: intakeData,
      recommendations: candidateRecommendations,
    }));

    setIsAnalyzing(false);
    setActiveTab('recommendations');
  };

  // Convert candidate recommendation to Proposal Scope
  const handleSelectCandidateForScope = (candidate: RecommendationCandidate) => {
    const scopeRecord: ProposalScope = {
      id: `scope_${Date.now()}`,
      missionId: mission.id,
      problemStatement: candidate.whyRanksHere,
      workflowBoundary: `Bounded to: ${mission.intake.sectionC.workflowName}`,
      inScope: [
        candidate.candidateName,
        'Automated trigger & webhook setup',
        'Verification testing with representative test data',
        'Documentation & operator handoff'
      ],
      outOfScope: [
        'Unapproved third-party system migrations',
        'Redesign of existing corporate website or legacy ERP',
        'Manual data entry for past historical years'
      ],
      inputsRequired: [mission.intake.sectionC.inputs],
      outputsProduced: [mission.intake.sectionC.outputs],
      dependencies: candidate.dependencies,
      assumptions: ['Client maintains valid active API credentials for connected tools.'],
      customerResponsibilities: [
        'Provide API key access for designated CRM and cloud storage',
        'Participate in final acceptance test review'
      ],
      acceptanceCriteria: [
        candidate.acceptanceTest,
        'Zero manual intervention required for standard test cases',
        'Audit trail evidence logged with grade >= E2'
      ],
      evidenceRequired: [
        'Representative test case run transcript',
        'CRM record timestamp audit log'
      ],
      deliveryWindow: candidate.estimatedEffortBand,
      priceCommercialTerms: '$2,500 USD (Fixed Bounded Implementation)',
      changeControlRule: 'Any change to in-scope items requires a new versioned Proposal Scope revision and explicit human approval.',
      versionNo: 1,
      createdAt: new Date().toISOString()
    };

    setMission(prev => ({
      ...prev,
      selectedRecommendationId: candidate.id,
      proposalScope: scopeRecord,
      state: 'PROPOSAL',
    }));

    setIsProposalGateOpen(true);
  };

  // Save updated scope
  const handleSaveScope = (updatedScope: ProposalScope) => {
    setMission(prev => ({
      ...prev,
      proposalScope: updatedScope,
      versionNo: prev.versionNo + 1,
    }));
  };

  // Approve Governance Gate
  const handleApproveGate = (gateType: ApprovalGate['gateType'], notes?: string) => {
    setMission(prev => {
      const currentGate = prev.approvals[gateType] || { gateType, status: 'pending', title: gateType };
      const updatedGate: ApprovalGate = {
        ...currentGate,
        status: 'approved',
        approvedBy: profile.personName,
        approvedAt: new Date().toISOString(),
        notes: notes || 'Approved by operator',
      };

      const newApprovals = {
        ...prev.approvals,
        [gateType]: updatedGate,
      };

      // If scope and direction are approved, advance state
      let newState = prev.state;
      if (gateType === 'scope' || gateType === 'direction') {
        newState = 'APPROVED';
      }

      return {
        ...prev,
        approvals: newApprovals,
        state: newState,
      };
    });
  };

  // Advance to PAID State after payment evidence
  const handleProceedToPaidState = () => {
    setMission(prev => ({
      ...prev,
      state: 'PAID',
    }));
    setIsProposalGateOpen(false);
    setActiveTab('workspace');
  };

  // Handle Adding Evidence
  const handleAddEvidence = (ev: EvidenceRecord) => {
    setMission(prev => ({
      ...prev,
      evidenceList: [ev, ...prev.evidenceList],
    }));
  };

  // Reset to default sample mission
  const handleResetSampleData = () => {
    const sample = createDefaultSampleMission();
    setMission(sample);
    setActiveTab('workspace');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeMissionState={mission.state}
        onOpenCommander={() => setIsCommanderOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onResetDemoData={handleResetSampleData}
        hasActiveMission={!!mission}
      />

      {/* Trust Principles Banner */}
      <TrustPrinciplesBanner />

      {/* Analyzing Modal overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
            <h3 className="text-lg font-extrabold text-slate-900">
              Computing 9-Factor Weighted Fit Scores
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Analyzing workflow baseline metrics, economic impact, integration readiness, and risk boundaries against evidence grades (E0–E5)...
            </p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'routing' && (
          <Routing90SecondStart onSelectRouting={handleStartRouting} />
        )}

        {activeTab === 'intake' && (
          <MissionIntakeForm
            initialData={mission.intake}
            onSubmitMission={handleSubmitMission}
            onCancelMission={handleCancelMission}
            onSaveDraft={handleSaveDraft}
            onClearDraft={handleClearDraft}
          />
        )}

        {activeTab === 'recommendations' && (
          <RecommendationsView
            mission={mission}
            onSelectCandidate={handleSelectCandidateForScope}
          />
        )}

        {activeTab === 'workspace' && (
          <CustomerWorkspace
            mission={mission}
            profile={profile}
            onUpdateProfile={setProfile}
            onCancelActiveMission={handleCancelMission}
            onAddEvidence={handleAddEvidence}
            onOpenProposalGate={() => setIsProposalGateOpen(true)}
          />
        )}

        {activeTab === 'relational_contract' && (
          <RelationalContractViewer />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-amber-400">INTELLIWEALTH SOLUTIONS</span> — Outcome Operating System
            <p className="text-[10px] text-slate-500 mt-0.5">
              Built around your actual business reality • Human-controlled • Evidence-led • Compliance-aware
            </p>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              Privacy & Control
            </button>
            <span>•</span>
            <button
              onClick={handleResetSampleData}
              className="hover:text-amber-400 transition-colors"
            >
              Load Sample Mission
            </button>
            <span>•</span>
            <a href="mailto:kagan@aikagan.com" className="hover:text-amber-400 transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </footer>

      {/* Commander AI Drawer */}
      <CommanderDrawer
        isOpen={isCommanderOpen}
        onClose={() => setIsCommanderOpen(false)}
        activeMission={mission}
      />

      {/* Proposal Scope Gate Modal */}
      {isProposalGateOpen && mission.proposalScope && (
        <ProposalGateModal
          mission={mission}
          scope={mission.proposalScope}
          onClose={() => setIsProposalGateOpen(false)}
          onSaveScope={handleSaveScope}
          onApproveGate={handleApproveGate}
          onProceedToPaidState={handleProceedToPaidState}
        />
      )}

      {/* Privacy Modal */}
      <PrivacyDataModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        onDataReset={() => {
          setMission(loadActiveMission());
          setProfile(loadOperatorProfile());
        }}
      />
    </div>
  );
}
