/**
 * IntelliWealth Solutions — Local Persistence & Audit Engine
 * Manages Relational Implementation Contract Entities, Versioning, and Audit Trail
 */

import {
  MissionRecord,
  OperatorProfile,
  AuditEvent,
  MissionIntakeData,
  ProposalScope,
  ApprovalGate,
  EvidenceRecord,
  MetricObservation,
  RelationalEntities
} from '../types';
import { generateCandidateRecommendations, calculateServicePath } from './scoringEngine';

const STORAGE_KEYS = {
  PROFILE: 'intelliwealth_operator_profile_v1',
  MISSIONS: 'intelliwealth_missions_v1',
  ACTIVE_MISSION_ID: 'intelliwealth_active_mission_id_v1',
  AUDIT_LOGS: 'intelliwealth_audit_logs_v1',
};

// Default Sample Intake for initial load
export const DEFAULT_SAMPLE_INTAKE: MissionIntakeData = {
  sectionA: {
    businessName: 'Apex Advisory & Consulting',
    serviceCategory: 'B2B Strategy & Financial Consulting',
    roleAndAuthority: 'Managing Principal & Lead Consultant (100% Authority)',
    teamSize: '1-5 (Solo operator + 2 sub-contractors)',
    jurisdiction: 'United States (Delaware LLC)',
    currentStage: 'operating'
  },
  sectionB: {
    missionTitle: 'Client Onboarding & Intake Automation',
    changeGoal: 'Eliminate manual document chasing, agreement signatures, and initial client kickoff delays.',
    mustNotChange: 'Personal welcome video call and custom financial advisory strategy review.',
    deadlineUrgency: 'Within 14 days',
    budgetCeiling: '$2,500',
    priority: 'reliable_operations'
  },
  sectionC: {
    workflowName: 'New Client Intake & Document Collection',
    trigger: 'Client signs advisory proposal or submits deposit payment',
    inputs: 'Signed contract, corporate tax returns, bank statements, onboarding questionnaire',
    currentSteps: 'Email client pdf intake form -> Wait 3-5 days for response -> Manually check files -> Send reminder emails -> Create Google Drive folder -> Setup CRM contact',
    outputs: 'Complete client vault, populated CRM record, calendar invite for Strategy Kickoff',
    owner: 'Kagan Dolek (Managing Principal)',
    systemsUsed: ['Pipedrive CRM', 'Google Drive', 'Stripe Commerce', 'DocuSign', 'Calendly']
  },
  sectionD: {
    occurrencesPerMonth: 18,
    minutesPerRun: 125,
    waitingTimeHandoffMins: 2880, // 48 hours waiting time
    reworkErrorRatePct: 22,
    laborRateUsdHr: 150,
    mostExpensiveFailure: 'Client drops off or delays project start by 3 weeks due to lost intake emails, delaying revenue recognition.',
    customerRevenueImpact: 'High ($4,500 average retainer per delayed client onboarding)'
  },
  sectionE: {
    metricToImprove: 'Onboarding Turnaround Time (Payment to Kickoff)',
    currentBaseline: '5.2 days',
    desiredTarget: 'Under 12 hours',
    measurementPeriod: '30 days',
    representativeTestCase: 'New client submits deposit via Stripe -> Automated intake vault provisioned -> Documents uploaded -> Kickoff scheduled.',
    successThreshold: '100% complete client folder within 12 hours with zero manual reminder emails.',
    evidenceSource: 'CRM timestamps & Drive folder creation audit logs'
  },
  sectionF: {
    requiredTools: ['Pipedrive CRM', 'Google Drive', 'Stripe', 'Gmail'],
    forbiddenSystems: 'Existing accounting database and client banking credentials',
    dataSensitivity: 'High',
    complianceConcern: 'SOC2 & FINRA financial document retention requirements',
    autonomyPreference: 'prepare_for_approval',
    requiredHumanApprovals: ['Scope Approval', 'Deployment Approval', 'Client Data Release']
  }
};

export const INITIAL_OPERATOR_PROFILE: OperatorProfile = {
  organizationId: 'org_apex_advisory',
  personName: 'Kagan Dolek',
  personEmail: 'kagan@aikagan.com',
  personRole: 'Managing Principal',
  organizationName: 'Apex Advisory & Consulting',
  businessType: 'B2B Strategy & Financial Consulting',
  teamSize: '1-5',
  jurisdiction: 'United States',
  todayStage: 'operating',
  strongestAsset: 'skill',
  priority: 'reliable_operations',
  assets: ['10+ years corporate financial advisory experience', 'High-value executive network', 'Proven consulting framework'],
  constraints: ['Solo operator time bottleneck', 'Strict SEC/FINRA financial compliance', 'No unauthorized data sharing'],
  systemsConnected: [
    { name: 'Stripe Commerce', status: 'connected' },
    { name: 'Pipedrive CRM', status: 'connected' },
    { name: 'Google Workspace', status: 'connected' },
    { name: 'DocuSign', status: 'reference_only' }
  ],
  riskTolerance: 'Moderate',
  autonomyPreference: 'prepare_for_approval',
  versionNo: 1,
  updatedAt: new Date().toISOString()
};

export function createInitialSampleMission(): MissionRecord {
  const intake = DEFAULT_SAMPLE_INTAKE;
  const recommendations = generateCandidateRecommendations(intake);
  const selectedRec = recommendations[0];

  const scope: ProposalScope = {
    id: 'scope_apex_01',
    missionId: 'mission_apex_sample',
    versionNo: 1,
    problemStatement: 'Manual client onboarding chokepoint causes 5.2-day delays and 22% file error rate, risking client churn and delaying $4,500 retainer billing.',
    workflowBoundary: 'From Stripe payment confirmation to client kickoff meeting booking and document vault initialization.',
    inScope: [
      'Automated Google Drive client folder hierarchy generator',
      'Interactive client intake form with field validation',
      'Automated email notification with magic link',
      'Calendly kickoff link dispatch upon 100% document completion',
      'Pipedrive deal state auto-advance'
    ],
    outOfScope: [
      'Historical document migration prior to active month',
      'Custom legal contract modification outside DocuSign templates',
      'Third-party accounting software re-integration'
    ],
    inputsRequired: ['Stripe webhook token', 'Google Drive API access token', 'Intake form template schema'],
    outputsProduced: ['Provisioned Drive Vault', 'Validated Client Questionnaire Payload', 'Calendly Booking URL'],
    dependencies: ['Stripe Payment Gateway', 'Google Workspace API', 'Pipedrive CRM'],
    assumptions: ['Client completes intake form on mobile or desktop browser', 'Stripe account is active'],
    customerResponsibilities: ['Provide branding logo for intake portal', 'Review and approve magic link email copy'],
    acceptanceCriteria: [
      '1. Stripe deposit payment triggers automated Drive folder creation within 30 seconds.',
      '2. Magic link email sent to client with personalized login credentials.',
      '3. Form submission automatically validates all 5 required document uploads before marking complete.',
      '4. Audit event recorded in CRM timeline with 100% accurate timestamps.'
    ],
    evidenceRequired: ['API Webhook Log (E2)', 'Integrated Test Run Transcript (E3)', 'Live Client Onboarding Proof (E4)'],
    deliveryWindow: '5 Business Days',
    priceCommercialTerms: '$1,800 USD Fixed Fee (Verified Provider Gate)',
    changeControlRule: 'Any change in workflow scope requires an explicit revision record and human re-approval.',
    createdAt: new Date().toISOString()
  };

  const initialApprovals: Record<ApprovalGate['gateType'], ApprovalGate> = {
    direction: { gateType: 'direction', title: 'Direction Approval', status: 'approved', approvedBy: 'Kagan Dolek', approvedAt: new Date().toISOString(), notes: 'Approved automated pipeline path.' },
    scope: { gateType: 'scope', title: 'Scope Approval', status: 'approved', approvedBy: 'Kagan Dolek', approvedAt: new Date().toISOString(), notes: 'Scope bounded to intake & vault setup.' },
    access: { gateType: 'access', title: 'Access Approval', status: 'approved', approvedBy: 'Kagan Dolek', approvedAt: new Date().toISOString(), notes: 'Scoped read/write to Client Vault folder only.' },
    deployment: { gateType: 'deployment', title: 'Deployment Approval', status: 'pending', notes: 'Pending final staging test evidence.' },
    acceptance: { gateType: 'acceptance', title: 'Acceptance Approval', status: 'pending', notes: 'Awaiting operational trial run.' }
  };

  const initialEvidence: EvidenceRecord[] = [
    {
      id: 'ev_01',
      missionId: 'mission_apex_sample',
      title: 'Workflow Bottleneck Diagnostic Report',
      grade: 'E1',
      description: 'Calculated baseline impact: 37.5 labor hours/mo costing $5,625/mo in lost productivity.',
      sourceRef: 'IntelliWealth Recommendation Engine v1.0',
      capturedAt: new Date().toISOString(),
      verified: true
    },
    {
      id: 'ev_02',
      missionId: 'mission_apex_sample',
      title: 'Integration Test Suite Execution',
      grade: 'E2',
      description: 'Deterministic test package passed: 5/5 mock payloads processed without errors.',
      sourceRef: 'Jest/Playwright Automated Test Runner',
      capturedAt: new Date().toISOString(),
      verified: true
    }
  ];

  const initialMetrics: MetricObservation[] = [
    {
      id: 'metric_01',
      missionId: 'mission_apex_sample',
      metricName: 'Turnaround Time (Payment to Kickoff)',
      baselineValue: '5.2 days',
      observedValue: '4.5 hours (In Staging)',
      targetValue: '< 12 hours',
      unit: 'Hours',
      measuredAt: new Date().toISOString(),
      benefitNotes: 'Demonstrated 96% reduction in elapsed turnaround time during trial.'
    },
    {
      id: 'metric_02',
      missionId: 'mission_apex_sample',
      metricName: 'Document Error/Rework Rate',
      baselineValue: '22%',
      observedValue: '0%',
      targetValue: '< 2%',
      unit: '%',
      measuredAt: new Date().toISOString(),
      benefitNotes: 'Upstream field validation prevented missing files.'
    }
  ];

  return {
    id: 'mission_apex_sample',
    organizationId: 'org_apex_advisory',
    versionNo: 1,
    state: 'RECOMMENDED',
    intake,
    routing: {
      todayStage: 'operating',
      strongestAsset: 'skill',
      priority: 'reliable_operations',
      servicePath: 'build_and_automate'
    },
    recommendations,
    selectedRecommendationId: selectedRec.id,
    proposalScope: scope,
    approvals: initialApprovals,
    evidenceList: initialEvidence,
    metrics: initialMetrics,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    actorAttribution: 'Kagan Dolek'
  };
}

// Storage Helpers
export function loadOperatorProfile(): OperatorProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading profile:', e);
  }
  return INITIAL_OPERATOR_PROFILE;
}

export function saveOperatorProfile(profile: OperatorProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    logAuditEvent('operator_profile', profile.organizationId, profile.versionNo, 'PROFILE_UPDATED', profile.personName, 'Profile details updated.');
  } catch (e) {
    console.error('Error saving profile:', e);
  }
}

export function loadMissions(): MissionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MISSIONS);
    if (raw) {
      const parsed: MissionRecord[] = JSON.parse(raw);
      if (parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading missions:', e);
  }
  const sample = createInitialSampleMission();
  saveMissions([sample]);
  setActiveMissionId(sample.id);
  return [sample];
}

export function saveMissions(missions: MissionRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
  } catch (e) {
    console.error('Error saving missions:', e);
  }
}

export function loadActiveMission(): MissionRecord | null {
  const missions = loadMissions();
  const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_MISSION_ID);
  if (activeId) {
    const found = missions.find(m => m.id === activeId);
    if (found) return found;
  }
  return missions[0] || null;
}

export function setActiveMissionId(id: string): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_MISSION_ID, id);
}

export function saveMissionRecord(mission: MissionRecord): void {
  const missions = loadMissions();
  const idx = missions.findIndex(m => m.id === mission.id);
  if (idx >= 0) {
    missions[idx] = mission;
  } else {
    missions.unshift(mission);
  }
  saveMissions(missions);
  setActiveMissionId(mission.id);
  logAuditEvent('mission', mission.id, mission.versionNo, 'MISSION_SAVED', mission.actorAttribution, `Mission state updated to ${mission.state}`);
}

export const saveActiveMission = saveMissionRecord;
export const createDefaultSampleMission = createInitialSampleMission;

export function getEmptyIntakeData(): MissionIntakeData {
  return {
    sectionA: {
      businessName: '',
      serviceCategory: '',
      roleAndAuthority: '',
      teamSize: '1',
      jurisdiction: '',
      currentStage: 'ideas'
    },
    sectionB: {
      missionTitle: '',
      changeGoal: '',
      mustNotChange: '',
      deadlineUrgency: '',
      budgetCeiling: '',
      priority: 'speed_to_revenue'
    },
    sectionC: {
      workflowName: '',
      trigger: '',
      inputs: '',
      currentSteps: '',
      outputs: '',
      owner: '',
      systemsUsed: []
    },
    sectionD: {
      occurrencesPerMonth: 0,
      minutesPerRun: 0,
      waitingTimeHandoffMins: 0,
      reworkErrorRatePct: 0,
      laborRateUsdHr: 0,
      mostExpensiveFailure: '',
      customerRevenueImpact: ''
    },
    sectionE: {
      metricToImprove: '',
      currentBaseline: '',
      desiredTarget: '',
      measurementPeriod: '',
      representativeTestCase: '',
      successThreshold: '',
      evidenceSource: ''
    },
    sectionF: {
      requiredTools: [],
      forbiddenSystems: '',
      dataSensitivity: 'Medium',
      complianceConcern: '',
      autonomyPreference: 'prepare_for_approval',
      requiredHumanApprovals: ['Scope Approval']
    }
  };
}

export function logAuditEvent(
  entityType: string,
  entityId: string,
  versionNo: number,
  action: string,
  actor: string,
  details: string
): void {
  try {
    const logs = loadAuditLogs();
    const event: AuditEvent = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      entityType,
      entityId,
      versionNo,
      action,
      actor,
      timestamp: new Date().toISOString(),
      details
    };
    logs.unshift(event);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 200)));
  } catch (e) {
    console.error('Error logging audit event:', e);
  }
}

export function loadAuditLogs(): AuditEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading audit logs:', e);
  }
  return [
    {
      id: 'audit_01',
      entityType: 'mission',
      entityId: 'mission_apex_sample',
      versionNo: 1,
      action: 'SYSTEM_INITIALIZED',
      actor: 'System Commander',
      timestamp: new Date().toISOString(),
      details: 'IntelliWealth Outcome Operating System initialized with profile and mission.'
    }
  ];
}

export function exportAllDataJSON(): string {
  const profile = loadOperatorProfile();
  const missions = loadMissions();
  const audit = loadAuditLogs();
  
  // Construct 24 Entities Schema Payload
  const relationalData: RelationalEntities = {
    person: [{ id: 'p_01', email: profile.personEmail, name: profile.personName }],
    organization: [{ id: profile.organizationId, name: profile.organizationName, jurisdiction: profile.jurisdiction }],
    membership: [{ person_id: 'p_01', organization_id: profile.organizationId, role: profile.personRole }],
    operator_profile: [profile],
    profile_asset: profile.assets.map((a, i) => ({ id: `asset_${i}`, organization_id: profile.organizationId, asset_type: 'Core Asset', detail: a })),
    profile_constraint: profile.constraints.map((c, i) => ({ id: `cnst_${i}`, organization_id: profile.organizationId, constraint_type: 'Business Constraint', detail: c })),
    workflow: missions.map(m => ({ id: `wf_${m.id}`, organization_id: m.organizationId, name: m.intake.sectionC.workflowName, owner: m.intake.sectionC.owner })),
    workflow_baseline: missions.map(m => ({ id: `wb_${m.id}`, workflow_id: `wf_${m.id}`, occurrences_mo: m.intake.sectionD.occurrencesPerMonth, mins_run: m.intake.sectionD.minutesPerRun })),
    mission: missions,
    mission_requirement: missions.map(m => ({ id: `mr_${m.id}`, mission_id: m.id, text: m.intake.sectionB.changeGoal })),
    outcome_target: missions.map(m => ({ id: `ot_${m.id}`, mission_id: m.id, metric: m.intake.sectionE.metricToImprove, target: m.intake.sectionE.desiredTarget })),
    automation_candidate: missions.flatMap(m => m.recommendations),
    recommendation: missions.flatMap(m => m.recommendations),
    scope: missions.filter(m => m.proposalScope).map(m => m.proposalScope!),
    approval: missions.flatMap(m => Object.values(m.approvals)),
    work_package: missions.map(m => ({ id: `wp_${m.id}`, mission_id: m.id, title: 'Smallest Credible Implementation Package', status: m.state })),
    deliverable: missions.map(m => ({ id: `del_${m.id}`, work_package_id: `wp_${m.id}`, title: 'Workflow Automation Artifact', artifact_ref: 'v1.0-release' })),
    acceptance_test: missions.map(m => ({ id: `at_${m.id}`, mission_id: m.id, title: m.intake.sectionE.representativeTestCase, pass_criteria: m.intake.sectionE.successThreshold })),
    evidence: missions.flatMap(m => m.evidenceList),
    metric_observation: missions.flatMap(m => m.metrics),
    change_request: [],
    audit_event: audit,
    attribution: [{ id: 'attr_01', actor: profile.personName, timestamp: new Date().toISOString() }],
    system_connection: profile.systemsConnected.map((s, i) => ({ id: `sys_${i}`, provider: s.name, status: s.status }))
  };

  return JSON.stringify(relationalData, null, 2);
}

export function clearAllLocalData(): void {
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.MISSIONS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_MISSION_ID);
  localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
}
