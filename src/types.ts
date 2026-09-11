/**
 * IntelliWealth Solutions — Outcome Operating System
 * Shared Types & Relational Implementation Contract Schema (24 Entities)
 */

export type TodayStage = 'ideas' | 'offer' | 'operating';
export type StrongestAsset = 'skill' | 'audience' | 'product' | 'operations';
export type PrimaryPriority = 'speed_to_revenue' | 'reliable_operations' | 'scalable_growth';

export type ActiveTab = 'routing' | 'intake' | 'recommendations' | 'workspace' | 'relational_contract';

export type ServicePath = 'opportunity_and_offer' | 'build_and_automate' | 'manage_and_grow';

export type EvidenceGrade = 'E0' | 'E1' | 'E2' | 'E3' | 'E4' | 'E5';

export interface EvidenceGradeInfo {
  grade: EvidenceGrade;
  title: string;
  description: string;
  color: string;
}

export const EVIDENCE_GRADES: Record<EvidenceGrade, EvidenceGradeInfo> = {
  E0: {
    grade: 'E0',
    title: 'Claim',
    description: 'Narrative or model assertion only (unverified hypothesis)',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  E1: {
    grade: 'E1',
    title: 'Generated',
    description: 'Artifact exists but is not independently tested',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  E2: {
    grade: 'E2',
    title: 'Tested',
    description: 'Deterministic or package tests passed',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  },
  E3: {
    grade: 'E3',
    title: 'Integrated',
    description: 'Works inside the integrated target system',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  E4: {
    grade: 'E4',
    title: 'Operational',
    description: 'Observed functioning in the intended live operating environment',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  E5: {
    grade: 'E5',
    title: 'Accepted / Commercial',
    description: 'Customer acceptance and/or provider-verified commercial payment evidence',
    color: 'bg-teal-100 text-teal-900 border-teal-400 font-bold',
  },
};

export type MissionState =
  | 'DRAFT'
  | 'PROFILED'
  | 'DIAGNOSED'
  | 'RECOMMENDED'
  | 'SCOPE_PENDING'
  | 'APPROVED'
  | 'PROPOSAL'
  | 'PAID'
  | 'DELIVERY'
  | 'ACCEPTANCE'
  | 'CLOSED'
  | 'CANCELLED';

export interface ScoringBreakdown {
  economicImpact: number; // 20%
  revenueProximity: number; // 15%
  frequency: number; // 10%
  measurability: number; // 10%
  dataReadiness: number; // 10%
  integrationFit: number; // 10%
  ownerReadiness: number; // 10%
  lowEffort: number; // 10%
  lowRisk: number; // 5%
  totalScore: number; // 0-100
}

export interface RecommendationCandidate {
  id: string;
  candidateName: string;
  fitScore: number;
  scoringBreakdown: ScoringBreakdown;
  evidenceGrade: EvidenceGrade;
  whyRanksHere: string;
  expectedBusinessEffect: string;
  dependencies: string[];
  risks: string[];
  requiredSystems: string[];
  estimatedEffortBand: 'Low (1-3 days)' | 'Medium (1-2 weeks)' | 'High (3-4 weeks)';
  acceptanceTest: string;
  whatIsStillUnknown: string;
}

// Progressive Mission Intake Sections
export interface ContextA {
  businessName: string;
  serviceCategory: string;
  roleAndAuthority: string;
  teamSize: string;
  jurisdiction: string;
  currentStage: TodayStage;
}

export interface MissionB {
  missionTitle: string;
  changeGoal: string;
  mustNotChange: string;
  deadlineUrgency: string;
  budgetCeiling?: string;
  priority: PrimaryPriority;
}

export interface WorkflowC {
  workflowName: string;
  trigger: string;
  inputs: string;
  currentSteps: string;
  outputs: string;
  owner: string;
  systemsUsed: string[];
}

export interface BaselineD {
  occurrencesPerMonth: number;
  minutesPerRun: number;
  waitingTimeHandoffMins: number;
  reworkErrorRatePct: number;
  laborRateUsdHr: number;
  mostExpensiveFailure: string;
  customerRevenueImpact: string;
}

export interface TargetE {
  metricToImprove: string;
  currentBaseline: string;
  desiredTarget: string;
  measurementPeriod: string;
  representativeTestCase: string;
  successThreshold: string;
  evidenceSource: string;
}

export interface GovernanceF {
  requiredTools: string[];
  forbiddenSystems: string;
  dataSensitivity: 'Low' | 'Medium' | 'High' | 'Strictly Confidential';
  complianceConcern: string;
  autonomyPreference: 'advise_only' | 'prepare_for_approval' | 'execute_approved_actions';
  requiredHumanApprovals: string[];
}

export interface MissionIntakeData {
  sectionA: ContextA;
  sectionB: MissionB;
  sectionC: WorkflowC;
  sectionD: BaselineD;
  sectionE: TargetE;
  sectionF: GovernanceF;
}

export interface ProposalScope {
  id: string;
  missionId: string;
  versionNo: number;
  problemStatement: string;
  workflowBoundary: string;
  inScope: string[];
  outOfScope: string[];
  inputsRequired: string[];
  outputsProduced: string[];
  dependencies: string[];
  assumptions: string[];
  customerResponsibilities: string[];
  acceptanceCriteria: string[];
  evidenceRequired: string[];
  deliveryWindow: string;
  priceCommercialTerms: string;
  changeControlRule: string;
  createdAt: string;
}

export interface ApprovalGate {
  gateType: 'direction' | 'scope' | 'access' | 'deployment' | 'acceptance';
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface EvidenceRecord {
  id: string;
  missionId: string;
  title: string;
  grade: EvidenceGrade;
  description: string;
  sourceRef: string;
  capturedAt: string;
  verified: boolean;
}

export interface MetricObservation {
  id: string;
  missionId: string;
  metricName: string;
  baselineValue: number | string;
  observedValue: number | string;
  targetValue: number | string;
  unit: string;
  measuredAt: string;
  benefitNotes: string;
}

export interface AuditEvent {
  id: string;
  entityType: string;
  entityId: string;
  versionNo: number;
  action: string;
  actor: string;
  timestamp: string;
  details: string;
}

// Persistent Mission Structure
export interface MissionRecord {
  id: string;
  organizationId: string;
  versionNo: number;
  state: MissionState;
  intake: MissionIntakeData;
  routing: {
    todayStage: TodayStage;
    strongestAsset: StrongestAsset;
    priority: PrimaryPriority;
    servicePath: ServicePath;
  };
  recommendations: RecommendationCandidate[];
  selectedRecommendationId?: string;
  proposalScope?: ProposalScope;
  approvals: Record<ApprovalGate['gateType'], ApprovalGate>;
  evidenceList: EvidenceRecord[];
  metrics: MetricObservation[];
  createdAt: string;
  updatedAt: string;
  actorAttribution: string;
}

// Operator Profile Storage
export interface OperatorProfile {
  organizationId: string;
  personName: string;
  personEmail: string;
  personRole: string;
  organizationName: string;
  businessType: string;
  teamSize: string;
  jurisdiction: string;
  todayStage: TodayStage;
  strongestAsset: StrongestAsset;
  priority: PrimaryPriority;
  assets: string[];
  constraints: string[];
  systemsConnected: Array<{ name: string; status: 'connected' | 'auth_pending' | 'reference_only' }>;
  riskTolerance: 'Conservative' | 'Moderate' | 'Growth-Oriented';
  autonomyPreference: 'advise_only' | 'prepare_for_approval' | 'execute_approved_actions';
  versionNo: number;
  updatedAt: string;
}

// Relational Implementation Contract Entities (24 Entities Schema)
export interface RelationalEntities {
  person: Array<{ id: string; email: string; name: string }>;
  organization: Array<{ id: string; name: string; jurisdiction: string }>;
  membership: Array<{ person_id: string; organization_id: string; role: string }>;
  operator_profile: OperatorProfile[];
  profile_asset: Array<{ id: string; organization_id: string; asset_type: string; detail: string }>;
  profile_constraint: Array<{ id: string; organization_id: string; constraint_type: string; detail: string }>;
  workflow: Array<{ id: string; organization_id: string; name: string; owner: string }>;
  workflow_baseline: Array<{ id: string; workflow_id: string; occurrences_mo: number; mins_run: number }>;
  mission: MissionRecord[];
  mission_requirement: Array<{ id: string; mission_id: string; text: string }>;
  outcome_target: Array<{ id: string; mission_id: string; metric: string; target: string }>;
  automation_candidate: RecommendationCandidate[];
  recommendation: RecommendationCandidate[];
  scope: ProposalScope[];
  approval: ApprovalGate[];
  work_package: Array<{ id: string; mission_id: string; title: string; status: string }>;
  deliverable: Array<{ id: string; work_package_id: string; title: string; artifact_ref: string }>;
  acceptance_test: Array<{ id: string; mission_id: string; title: string; pass_criteria: string }>;
  evidence: EvidenceRecord[];
  metric_observation: MetricObservation[];
  change_request: Array<{ id: string; mission_id: string; reason: string; version_no: number }>;
  audit_event: AuditEvent[];
  attribution: Array<{ id: string; actor: string; timestamp: string }>;
  system_connection: Array<{ id: string; provider: string; status: string }>;
}
