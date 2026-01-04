
export interface TranscriptSegment {
  time: string;
  text: string;
}

export interface ProposalData {
  extraction: {
    painPoints: string[];
    proposedSolution: string;
    scopeItems: string[];
    timelineParams: string;
    budgetParams: string;
  };
  transcriptSummary: string;
  transcript: TranscriptSegment[];
  proposal: {
    title: string;
    executiveSummary: string;
    problemStatement: string;
    proposedSolution: string;
    methodologyAndDeliverables: string[];
    timeline: string;
    investment: string;
    termsAndConditions: string;
  };
}

export interface ExpandedProposalData {
  abstract: string;
  coreBusiness: string;
  coalitionOpportunities: string;
  strategiesAndMembership: string;
  insuranceAndCrossBusiness: string;
  equityStructure: string;
  financialRisk: string;
  marketingProposal: string;
  mindMap: string;
}

export interface TranslatedProposalData {
  abstract: string;
  coreBusiness: string;
  coalitionOpportunities: string;
  strategiesAndMembership: string;
  insuranceAndCrossBusiness: string;
  equityStructure: string;
  financialRisk: string;
  marketingProposal: string;
  mindMap: string;
}

// --- NEW TYPES FOR 5-BLOCK WORKFLOW ---

export type ProcessingLanguage = 'CN' | 'EN';

// Fix: Updated model name to gemini-3-flash-preview as per guidelines
export type GeminiModel = 'gemini-3-flash-preview' | 'gemini-3-pro-preview';

export interface OrganizedContentData {
  title: string; // Auto-generated title
  abstract: string; // Auto-generated abstract
  mainContent: string; // The organized, flowing text
  keyPoints: string[]; // Bullet points
  language: ProcessingLanguage;
}

export interface DeepDiveData {
  expandedContent?: string;
  businessPlan?: string;
  mindMap?: string; // Changed from mindMapEnglish to generic mindMap (now Chinese)
}

export interface FinalReportData {
  title: string;
  executiveSummary: string;
  fullNarrative: string; // The cohesive, flowing report
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  type: 'organized' | 'expanded' | 'businessPlan' | 'mindMap' | 'other';
  included: boolean;
}

export interface ProposalTheme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  logoUrl: string | null;
  filenamePrefix: string;
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  ORGANIZED = 'ORGANIZED', // Block 3 complete
  GENERATING_STEPS = 'GENERATING_STEPS', // Block 4 processing
  STEPS_COMPLETE = 'STEPS_COMPLETE', // Block 4 complete
  GENERATING_REPORT = 'GENERATING_REPORT', // Block 5 processing
  REPORT_COMPLETE = 'REPORT_COMPLETE', // Block 5 complete
  ERROR = 'ERROR'
}

export interface ProcessingStep {
  id: number;
  label: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
}

// Fix: Added missing SavedVersion interface for history persistence
export interface SavedVersion {
  id: string;
  timestamp: number;
  name: string;
  organizedData: OrganizedContentData;
  deepDiveData: DeepDiveData | null;
  finalReportData: FinalReportData | null;
  theme: ProposalTheme;
}
