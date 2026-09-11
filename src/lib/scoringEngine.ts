/**
 * IntelliWealth Solutions — Scoring Engine & Recommendation Generator
 * 
 * Implements the 9-Factor Weighted Scoring Model:
 * 1. Economic/Operational Impact (20%)
 * 2. Revenue/Customer Proximity (15%)
 * 3. Frequency (10%)
 * 4. Measurability (10%)
 * 5. Data Readiness (10%)
 * 6. Integration Fit (10%)
 * 7. Owner/Readiness (10%)
 * 8. Low Implementation Effort (10%)
 * 9. Low Delivery/Compliance Risk (5%)
 */

import {
  MissionIntakeData,
  RecommendationCandidate,
  ScoringBreakdown,
  EvidenceGrade,
  ServicePath,
  TodayStage,
  StrongestAsset,
  PrimaryPriority
} from '../types';

export function calculateServicePath(
  stage: TodayStage,
  asset: StrongestAsset,
  priority: PrimaryPriority
): ServicePath {
  if (stage === 'ideas' || priority === 'speed_to_revenue') {
    return 'opportunity_and_offer';
  }
  if (stage === 'offer' || priority === 'reliable_operations') {
    return 'build_and_automate';
  }
  return 'manage_and_grow';
}

export function computeScoringBreakdown(intake: MissionIntakeData): ScoringBreakdown {
  const { sectionA, sectionB, sectionC, sectionD, sectionE, sectionF } = intake;

  // 1. Economic / Operational Impact (20%) - Based on monthly labor hours and labor rate
  const monthlyHours = (sectionD.occurrencesPerMonth * sectionD.minutesPerRun) / 60;
  const laborCost = monthlyHours * (sectionD.laborRateUsdHr || 50);
  let impactScore = 50;
  if (laborCost > 2000 || sectionD.reworkErrorRatePct > 20) impactScore = 95;
  else if (laborCost > 800 || sectionD.reworkErrorRatePct > 10) impactScore = 80;
  else if (laborCost > 300) impactScore = 65;

  // 2. Revenue / Customer Proximity (15%)
  let revProximityScore = 60;
  if (sectionB.priority === 'speed_to_revenue' || sectionD.customerRevenueImpact.toLowerCase().includes('high') || sectionD.customerRevenueImpact.toLowerCase().includes('churn')) {
    revProximityScore = 92;
  } else if (sectionB.priority === 'scalable_growth') {
    revProximityScore = 80;
  }

  // 3. Frequency (10%)
  let freqScore = 50;
  if (sectionD.occurrencesPerMonth >= 50) freqScore = 95;
  else if (sectionD.occurrencesPerMonth >= 20) freqScore = 80;
  else if (sectionD.occurrencesPerMonth >= 8) freqScore = 65;

  // 4. Measurability (10%)
  let measurabilityScore = 60;
  if (sectionE.currentBaseline && sectionE.desiredTarget && sectionE.metricToImprove) {
    measurabilityScore = 90;
  }

  // 5. Data Readiness (10%)
  let dataReadinessScore = 70;
  if (sectionC.inputs && sectionC.outputs) dataReadinessScore = 85;

  // 6. Integration Fit (10%)
  let integrationScore = 75;
  if (sectionC.systemsUsed && sectionC.systemsUsed.length > 0) integrationScore = 88;

  // 7. Owner / Readiness (10%)
  let ownerScore = 70;
  if (sectionC.owner && sectionA.roleAndAuthority) ownerScore = 90;

  // 8. Low Implementation Effort (10%)
  const effortScore = sectionF.forbiddenSystems ? 65 : 85;

  // 9. Low Delivery / Compliance Risk (5%)
  let riskScore = 85;
  if (sectionF.dataSensitivity === 'Strictly Confidential' || sectionF.complianceConcern) {
    riskScore = 60;
  }

  // Calculate weighted total (0-100)
  const totalScore = Math.round(
    impactScore * 0.20 +
    revProximityScore * 0.15 +
    freqScore * 0.10 +
    measurabilityScore * 0.10 +
    dataReadinessScore * 0.10 +
    integrationScore * 0.10 +
    ownerScore * 0.10 +
    effortScore * 0.10 +
    riskScore * 0.05
  );

  return {
    economicImpact: Math.round(impactScore),
    revenueProximity: Math.round(revProximityScore),
    frequency: Math.round(freqScore),
    measurability: Math.round(measurabilityScore),
    dataReadiness: Math.round(dataReadinessScore),
    integrationFit: Math.round(integrationScore),
    ownerReadiness: Math.round(ownerScore),
    lowEffort: Math.round(effortScore),
    lowRisk: Math.round(riskScore),
    totalScore
  };
}

export function calculateCandidateFitScore(
  intake: MissionIntakeData,
  customScores?: {
    impactScore?: number;
    revenueProximityScore?: number;
    frequencyScore?: number;
    measurabilityScore?: number;
    dataReadinessScore?: number;
    integrationFitScore?: number;
    ownerReadinessScore?: number;
    lowEffortScore?: number;
    lowRiskScore?: number;
  }
) {
  const base = computeScoringBreakdown(intake);
  if (!customScores) {
    return { fitScore: base.totalScore, scoringBreakdown: base };
  }

  const breakdown: ScoringBreakdown = {
    economicImpact: customScores.impactScore ?? base.economicImpact,
    revenueProximity: customScores.revenueProximityScore ?? base.revenueProximity,
    frequency: customScores.frequencyScore ?? base.frequency,
    measurability: customScores.measurabilityScore ?? base.measurability,
    dataReadiness: customScores.dataReadinessScore ?? base.dataReadiness,
    integrationFit: customScores.integrationFitScore ?? base.integrationFit,
    ownerReadiness: customScores.ownerReadinessScore ?? base.ownerReadiness,
    lowEffort: customScores.lowEffortScore ?? base.lowEffort,
    lowRisk: customScores.lowRiskScore ?? base.lowRisk,
    totalScore: Math.round(
      (customScores.impactScore ?? base.economicImpact) * 0.20 +
      (customScores.revenueProximityScore ?? base.revenueProximity) * 0.15 +
      (customScores.frequencyScore ?? base.frequency) * 0.10 +
      (customScores.measurabilityScore ?? base.measurability) * 0.10 +
      (customScores.dataReadinessScore ?? base.dataReadiness) * 0.10 +
      (customScores.integrationFitScore ?? base.integrationFit) * 0.10 +
      (customScores.ownerReadinessScore ?? base.ownerReadiness) * 0.10 +
      (customScores.lowEffortScore ?? base.lowEffort) * 0.10 +
      (customScores.lowRiskScore ?? base.lowRisk) * 0.05
    )
  };

  return { fitScore: breakdown.totalScore, scoringBreakdown: breakdown };
}

export function generateCandidateRecommendations(
  intake: MissionIntakeData
): RecommendationCandidate[] {
  const breakdown = computeScoringBreakdown(intake);
  const workflowName = intake.sectionC.workflowName || 'Workflow';
  const trigger = intake.sectionC.trigger || 'Manual trigger';
  const metric = intake.sectionE.metricToImprove || 'Turnaround time & errors';
  const systems = intake.sectionC.systemsUsed.length > 0 ? intake.sectionC.systemsUsed : ['CRM', 'Email', 'Forms'];

  const candidate1: RecommendationCandidate = {
    id: 'rec_01_automated_pipeline',
    candidateName: `Automated Event-Driven Pipeline for ${workflowName}`,
    fitScore: breakdown.totalScore,
    scoringBreakdown: breakdown,
    evidenceGrade: 'E1', // Generated
    whyRanksHere: `Highest economic score (${breakdown.economicImpact}/100). Directly addresses ${intake.sectionD.occurrencesPerMonth} monthly occurrences triggering from "${trigger}".`,
    expectedBusinessEffect: `Reduces run duration from ${intake.sectionD.minutesPerRun} mins to under 2 mins per run, reclaiming ~${Math.round((intake.sectionD.occurrencesPerMonth * (intake.sectionD.minutesPerRun - 2)) / 60)} labor hours/month.`,
    dependencies: systems,
    risks: [
      'API rate limits on legacy external tools',
      'Requires initial human approval gate on customer communications'
    ],
    requiredSystems: systems,
    estimatedEffortBand: 'Low (1-3 days)',
    acceptanceTest: `Run 5 representative test cases with mock inputs. Verify zero manual data entry and output artifact created within 60 seconds.`,
    whatIsStillUnknown: `Exact schema format of incoming payload from ${systems[0] || 'input trigger'}.`
  };

  const candidate2: RecommendationCandidate = {
    id: 'rec_02_approval_gated_copilot',
    candidateName: `Human-in-the-Loop Review & Dispatch System`,
    fitScore: Math.max(50, breakdown.totalScore - 8),
    scoringBreakdown: {
      ...breakdown,
      lowRisk: 95,
      lowEffort: 90,
      totalScore: Math.max(50, breakdown.totalScore - 8)
    },
    evidenceGrade: 'E1',
    whyRanksHere: `Minimizes governance risk (${breakdown.lowRisk}/100) by staging draft deliverables for 1-click human verification before dispatch.`,
    expectedBusinessEffect: `Eliminates ${intake.sectionD.reworkErrorRatePct}% rework rate while preserving 100% human governance over external output.`,
    dependencies: ['Email notification / Slack webhooks', ...systems],
    risks: [
      'Handoff delay depends on human operator response time'
    ],
    requiredSystems: systems,
    estimatedEffortBand: 'Low (1-3 days)',
    acceptanceTest: `Submit test request -> System drafts output -> Operator approves in 1 click -> Output dispatched with audit log entry.`,
    whatIsStillUnknown: `Who holds secondary backup approval authority when owner is offline.`
  };

  const candidate3: RecommendationCandidate = {
    id: 'rec_03_standardized_sops_tracker',
    candidateName: `Structured Intake & Validation Gatekeeper`,
    fitScore: Math.max(45, breakdown.totalScore - 15),
    scoringBreakdown: {
      ...breakdown,
      dataReadiness: 95,
      totalScore: Math.max(45, breakdown.totalScore - 15)
    },
    evidenceGrade: 'E0',
    whyRanksHere: `Fixes input data quality upstream before triggering downstream workflows.`,
    expectedBusinessEffect: `Prevents invalid inputs from stalling execution; reduces waiting time handoffs by ${intake.sectionD.waitingTimeHandoffMins || 30} mins.`,
    dependencies: ['Webform / Portal input'],
    risks: [
      'User adoption friction if form validation is overly restrictive'
    ],
    requiredSystems: ['Webform / Commerce portal'],
    estimatedEffortBand: 'Medium (1-2 weeks)',
    acceptanceTest: `Attempt submitting incomplete input -> Form blocks submit with field guide -> Submit valid input -> Ticket correctly created.`,
    whatIsStillUnknown: `Exact list of non-negotiable fields required by customer.`
  };

  return [candidate1, candidate2, candidate3];
}
