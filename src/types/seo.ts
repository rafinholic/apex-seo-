export type SearchIntent = 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';

export interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  intent: SearchIntent;
  cpc: string;
  trend?: string;
  density?: number;
  count?: number;
  recommendedRange?: string;
  serpFeatures?: string[];
  searchIntentExplanation?: string;
}

export interface TopicalCluster {
  clusterName: string;
  relevance: number;
  keywords: string[];
}

export interface MissingKeyword {
  keyword: string;
  importance: 'High' | 'Medium';
  reason: string;
}

export interface CompetitorOverview {
  domain: string;
  authorityScore: number;
  organicKeywordsCount: number;
  estimatedMonthlyVisits: number;
  backlinksCount: number;
  isTarget: boolean;
}

export interface TrackedRankKeyword {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  targetRank: number;
  previousRank: number;
  competitorRanks: Record<string, number>;
  url: string;
  intent: SearchIntent;
}

export interface ContentGap {
  keyword: string;
  volume: number;
  competitorLeader: string;
  leaderRank: number;
  opportunityScore: number;
  actionRecommendation: string;
}

export interface ActionPlanItem {
  priority: 'High' | 'Medium' | 'Quick Win';
  title: string;
  description: string;
  potentialTrafficLift: string;
}

export interface CompetitorIntelData {
  overview: CompetitorOverview[];
  trackedKeywords: TrackedRankKeyword[];
  contentGaps: ContentGap[];
  actionPlan: ActionPlanItem[];
}

export interface ContentOptimizationResult {
  overallScore: number;
  readabilityScore: number;
  readabilityGrade: string;
  wordCountBenchmark: {
    current: number;
    recommended: number;
    status: 'Below Target' | 'Optimal' | 'Exceeds Target';
  };
  keywordEvaluations: {
    keyword: string;
    frequency: number;
    recommendedRange: string;
    densityPercent: number;
    status: 'Under-optimized' | 'Optimal' | 'Over-optimized';
    placementTip: string;
  }[];
  headingRecommendations: {
    heading: string;
    type: 'H2' | 'H3';
    reason: string;
  }[];
  missingTopicGaps: {
    topic: string;
    suggestedSentence: string;
  }[];
  actionChecklist: {
    task: string;
    priority: 'High' | 'Medium' | 'Low';
    completed: boolean;
    fixAdvice: string;
  }[];
  enhancedFaqSection?: {
    question: string;
    answer: string;
  }[];
}

export interface MetadataPackage {
  title: string;
  metaDescription: string;
  url: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: 'summary_large_image' | 'summary';
  schemaType: 'Article' | 'Product' | 'FAQPage' | 'Organization' | 'LocalBusiness' | 'BreadcrumbList';
  schemaJson: Record<string, any>;
}

export interface AuditCheckItem {
  id: string;
  category: 'Performance' | 'Indexing' | 'OnPage' | 'Mobile' | 'Links';
  title: string;
  status: 'passed' | 'warning' | 'critical';
  value: string;
  impact: 'High' | 'Medium' | 'Low';
  description: string;
  fixGuide: string;
}

export interface ProjectPreset {
  id: string;
  name: string;
  domain: string;
  niche: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  initialTitle: string;
  initialDescription: string;
  content: string;
  competitors: string[];
}
