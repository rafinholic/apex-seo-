import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { KeywordIntelligence } from './components/KeywordIntelligence';
import { ContentStudio } from './components/ContentStudio';
import { CompetitorTracker } from './components/CompetitorTracker';
import { MetadataArchitect } from './components/MetadataArchitect';
import { PerformanceAudit } from './components/PerformanceAudit';
import { AuditReportModal } from './components/AuditReportModal';
import { PRESETS } from './data/presets';
import { 
  ProjectPreset, 
  KeywordData, 
  TopicalCluster, 
  MissingKeyword, 
  CompetitorIntelData, 
  ContentOptimizationResult, 
  MetadataPackage, 
  AuditCheckItem 
} from './types/seo';

export default function App() {
  const [selectedPreset, setSelectedPreset] = useState<ProjectPreset>(PRESETS[0]);
  const [targetDomain, setTargetDomain] = useState<string>(PRESETS[0].domain);
  const [activeTab, setActiveTab] = useState<'keywords' | 'content' | 'competitors' | 'metadata' | 'performance'>('keywords');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);

  // Focus Keywords
  const [focusKeyword, setFocusKeyword] = useState<string>(PRESETS[0].focusKeyword);
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>(PRESETS[0].secondaryKeywords);

  // Content Studio State
  const [title, setTitle] = useState<string>(PRESETS[0].initialTitle);
  const [content, setContent] = useState<string>(PRESETS[0].content);
  const [optimizationResult, setOptimizationResult] = useState<ContentOptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Keyword Explorer State
  const [primaryKeywords, setPrimaryKeywords] = useState<KeywordData[]>([
    {
      keyword: PRESETS[0].focusKeyword,
      volume: 6800,
      difficulty: 48,
      intent: 'Commercial',
      cpc: '$2.80',
      trend: '+18%',
      serpFeatures: ['Featured Snippet', 'People Also Ask']
    },
    {
      keyword: 'best sprint planning tools',
      volume: 4200,
      difficulty: 35,
      intent: 'Commercial',
      cpc: '$3.15',
      trend: '+12%',
      serpFeatures: ['Reviews', 'Sitelinks']
    },
    {
      keyword: 'scrum vs kanban workflow software',
      volume: 5900,
      difficulty: 52,
      intent: 'Informational',
      cpc: '$1.95',
      trend: '+5%',
      serpFeatures: ['Featured Snippet', 'People Also Ask', 'Video Carousel']
    },
    {
      keyword: 'developer velocity tracking metrics',
      volume: 2400,
      difficulty: 29,
      intent: 'Informational',
      cpc: '$2.40',
      trend: '+24%',
      serpFeatures: ['People Also Ask']
    }
  ]);

  const [longTailKeywords, setLongTailKeywords] = useState<KeywordData[]>([
    {
      keyword: 'how to cut sprint planning meeting time in half',
      volume: 1850,
      difficulty: 22,
      intent: 'Informational',
      cpc: '$1.40',
      searchIntentExplanation: 'Engineering leaders seeking concrete time-saving frameworks.'
    },
    {
      keyword: 'agile software for remote distributed teams',
      volume: 2900,
      difficulty: 38,
      intent: 'Commercial',
      cpc: '$3.50',
      searchIntentExplanation: 'High conversion intent for enterprise cloud migration.'
    },
    {
      keyword: 'automated jira linear migration alternative',
      volume: 1200,
      difficulty: 44,
      intent: 'Transactional',
      cpc: '$4.10',
      searchIntentExplanation: 'Teams actively replacing legacy enterprise tools.'
    }
  ]);

  const [topicalClusters, setTopicalClusters] = useState<TopicalCluster[]>([
    {
      clusterName: 'Agile Ceremonies & Velocity',
      relevance: 96,
      keywords: ['sprint planning tool', 'asynchronous standups', 'burndown velocity metrics', 'backlog grooming canvas']
    },
    {
      clusterName: 'Developer Experience (DevEx)',
      relevance: 91,
      keywords: ['ci/cd git integrations', 'issue tracker sync', 'context switching reduction', 'pr review checkpoints']
    },
    {
      clusterName: 'Enterprise Security & Governance',
      relevance: 84,
      keywords: ['soc-2 compliance', 'role based permissions', 'sso saml okta', 'audit logs']
    }
  ]);

  const [missingKeywords, setMissingKeywords] = useState<MissingKeyword[]>([
    {
      keyword: 'work-in-progress (WIP) cycle time',
      importance: 'High',
      reason: 'Top 3 ranking articles heavily feature cycle time benchmarking.'
    },
    {
      keyword: 'asynchronous retrospective templates',
      importance: 'Medium',
      reason: 'Trending user search intent for hybrid software development.'
    }
  ]);

  const [isKeywordLoading, setIsKeywordLoading] = useState(false);

  // Competitor Tracker State
  const [competitorData, setCompetitorData] = useState<CompetitorIntelData>({
    overview: [
      {
        domain: PRESETS[0].domain,
        authorityScore: 56,
        organicKeywordsCount: 3840,
        estimatedMonthlyVisits: 48900,
        backlinksCount: 1650,
        isTarget: true
      },
      {
        domain: PRESETS[0].competitors[0],
        authorityScore: 69,
        organicKeywordsCount: 9200,
        estimatedMonthlyVisits: 124000,
        backlinksCount: 4800,
        isTarget: false
      },
      {
        domain: PRESETS[0].competitors[1],
        authorityScore: 63,
        organicKeywordsCount: 7100,
        estimatedMonthlyVisits: 89000,
        backlinksCount: 3400,
        isTarget: false
      }
    ],
    trackedKeywords: [
      {
        keyword: PRESETS[0].focusKeyword,
        searchVolume: 6800,
        difficulty: 48,
        targetRank: 3,
        previousRank: 6,
        competitorRanks: {
          [PRESETS[0].competitors[0]]: 1,
          [PRESETS[0].competitors[1]]: 5
        },
        url: `https://${PRESETS[0].domain}/platform`,
        intent: 'Commercial'
      },
      {
        keyword: 'sprint planning tool',
        searchVolume: 4200,
        difficulty: 35,
        targetRank: 2,
        previousRank: 2,
        competitorRanks: {
          [PRESETS[0].competitors[0]]: 3,
          [PRESETS[0].competitors[1]]: 7
        },
        url: `https://${PRESETS[0].domain}/sprint`,
        intent: 'Commercial'
      },
      {
        keyword: 'agile workflow management software',
        searchVolume: 5900,
        difficulty: 52,
        targetRank: 4,
        previousRank: 7,
        competitorRanks: {
          [PRESETS[0].competitors[0]]: 2,
          [PRESETS[0].competitors[1]]: 4
        },
        url: `https://${PRESETS[0].domain}/agile`,
        intent: 'Informational'
      },
      {
        keyword: 'kanban automation engine',
        searchVolume: 3100,
        difficulty: 39,
        targetRank: 1,
        previousRank: 3,
        competitorRanks: {
          [PRESETS[0].competitors[0]]: 4,
          [PRESETS[0].competitors[1]]: 8
        },
        url: `https://${PRESETS[0].domain}/kanban`,
        intent: 'Transactional'
      }
    ],
    contentGaps: [
      {
        keyword: 'enterprise sprint capacity calculator',
        volume: 3800,
        competitorLeader: PRESETS[0].competitors[0],
        leaderRank: 2,
        opportunityScore: 94,
        actionRecommendation: 'Build an interactive web calculator widget to capture high-converting organic backlinks.'
      },
      {
        keyword: 'scrum master certification study notes',
        volume: 5200,
        competitorLeader: PRESETS[0].competitors[1],
        leaderRank: 1,
        opportunityScore: 86,
        actionRecommendation: 'Publish a comprehensive reference guide to establish high domain authority.'
      }
    ],
    actionPlan: [
      {
        priority: 'Quick Win',
        title: 'Optimize H2 headings for "sprint planning tool"',
        description: 'Currently position #2. Adding 2 high-intent FAQ questions can claim position #1.',
        potentialTrafficLift: '+1,800 monthly visits'
      }
    ]
  });

  const [isCompetitorLoading, setIsCompetitorLoading] = useState(false);

  // Metadata Package State
  const [metadata, setMetadata] = useState<MetadataPackage>({
    title: PRESETS[0].initialTitle,
    metaDescription: PRESETS[0].initialDescription,
    url: `https://${PRESETS[0].domain}/guide`,
    canonicalUrl: `https://${PRESETS[0].domain}/guide`,
    ogTitle: PRESETS[0].initialTitle,
    ogDescription: PRESETS[0].initialDescription,
    ogImage: `https://${PRESETS[0].domain}/og-banner.jpg`,
    twitterCard: 'summary_large_image',
    schemaType: 'Article',
    schemaJson: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': PRESETS[0].initialTitle,
      'description': PRESETS[0].initialDescription,
      'author': {
        '@type': 'Organization',
        'name': PRESETS[0].name
      },
      'publisher': {
        '@type': 'Organization',
        'name': PRESETS[0].name,
        'logo': {
          '@type': 'ImageObject',
          'url': `https://${PRESETS[0].domain}/logo.png`
        }
      },
      'datePublished': '2026-03-15',
      'dateModified': '2026-10-07'
    }
  });

  const [aiMetadataVariants, setAiMetadataVariants] = useState<{
    titles: { title: string; characterCount: number; style: string }[];
    descriptions: { description: string; characterCount: number; focus: string }[];
  } | null>(null);

  const [isGeneratingMeta, setIsGeneratingMeta] = useState(false);

  // Performance Audit Checks
  const [auditItems, setAuditItems] = useState<AuditCheckItem[]>([
    {
      id: 'lcp',
      category: 'Performance',
      title: 'Largest Contentful Paint (LCP)',
      status: 'passed',
      value: '1.8s (Target: < 2.5s)',
      impact: 'High',
      description: 'Measures perceived loading speed. Marks point when main page content is visible.',
      fixGuide: 'Preload hero banners with <link rel="preload"> and ensure edge CDN cache HIT.'
    },
    {
      id: 'inp',
      category: 'Performance',
      title: 'Interaction to Next Paint (INP)',
      status: 'passed',
      value: '85ms (Target: < 200ms)',
      impact: 'High',
      description: 'Measures page responsiveness to clicks, taps, and key presses.',
      fixGuide: 'Minimize main-thread JavaScript execution and break up long tasks.'
    },
    {
      id: 'cls',
      category: 'Performance',
      title: 'Cumulative Layout Shift (CLS)',
      status: 'passed',
      value: '0.03 (Target: < 0.1)',
      impact: 'High',
      description: 'Quantifies unexpected visual layout shifts during page render.',
      fixGuide: 'Always specify explicit width and height attributes on all image and iframe tags.'
    },
    {
      id: 'canonical',
      category: 'Indexing',
      title: 'Canonical Tag Presence',
      status: 'passed',
      value: 'Self-referencing canonical found',
      impact: 'High',
      description: 'Prevents duplicate content penalties across tracking URLs and parameters.',
      fixGuide: 'Keep canonical URL absolute and matching the preferred protocol (https).'
    },
    {
      id: 'robots',
      category: 'Indexing',
      title: 'Robots.txt & Meta Robots Directives',
      status: 'passed',
      value: 'index, follow (200 OK)',
      impact: 'High',
      description: 'Allows search engine bots to crawl and index valuable landing pages.',
      fixGuide: 'Confirm no disallow rules inadvertently block /assets or critical CSS files.'
    },
    {
      id: 'images',
      category: 'OnPage',
      title: 'Image Alt Attribute Coverage',
      status: 'warning',
      value: '2 images missing descriptive alt tags',
      impact: 'Medium',
      description: 'Alt attributes enable Google Image Search indexing and screen reader accessibility.',
      fixGuide: 'Add concise, keyword-rich alt descriptions describing each image subject.'
    },
    {
      id: 'ssl',
      category: 'OnPage',
      title: 'HTTPS & SSL Security Protocol',
      status: 'passed',
      value: 'TLS 1.3 Active & Valid',
      impact: 'High',
      description: 'Core ranking factor ensuring encrypted transport for all visitors.',
      fixGuide: 'Enforce HSTS (HTTP Strict Transport Security) headers across all subdomains.'
    },
    {
      id: 'viewport',
      category: 'Mobile',
      title: 'Mobile-Responsive Viewport Meta Tag',
      status: 'passed',
      value: 'width=device-width, initial-scale=1.0',
      impact: 'High',
      description: 'Ensures flawless scaling on mobile smartphones without horizontal scrolling.',
      fixGuide: 'Keep standard viewport meta tag in page <head>.'
    },
    {
      id: 'schema',
      category: 'OnPage',
      title: 'Structured Data JSON-LD Validation',
      status: 'passed',
      value: 'Valid Article schema detected',
      impact: 'Medium',
      description: 'Powers Google rich snippet cards, author attribution, and breadcrumbs.',
      fixGuide: 'Test schema using Google Rich Results validator regularly after deployments.'
    }
  ]);

  // Handle Preset Switch
  const handleSelectPreset = (preset: ProjectPreset) => {
    setSelectedPreset(preset);
    setTargetDomain(preset.domain);
    setFocusKeyword(preset.focusKeyword);
    setSecondaryKeywords(preset.secondaryKeywords);
    setTitle(preset.initialTitle);
    setContent(preset.content);

    // Update metadata
    setMetadata({
      title: preset.initialTitle,
      metaDescription: preset.initialDescription,
      url: `https://${preset.domain}/guide`,
      canonicalUrl: `https://${preset.domain}/guide`,
      ogTitle: preset.initialTitle,
      ogDescription: preset.initialDescription,
      ogImage: `https://${preset.domain}/og-banner.jpg`,
      twitterCard: 'summary_large_image',
      schemaType: 'Article',
      schemaJson: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': preset.initialTitle,
        'description': preset.initialDescription,
        'author': { '@type': 'Organization', 'name': preset.name },
        'publisher': { '@type': 'Organization', 'name': preset.name }
      }
    });

    // Update competitor overview
    setCompetitorData(prev => ({
      ...prev,
      overview: [
        { ...prev.overview[0], domain: preset.domain },
        { ...prev.overview[1], domain: preset.competitors[0] },
        { ...prev.overview[2], domain: preset.competitors[1] }
      ]
    }));

    // Trigger AI / Heuristic refresh for this preset
    handleAnalyzeTopic(preset.focusKeyword);
  };

  // Run Keyword Intelligence
  const handleAnalyzeTopic = async (topic: string) => {
    setIsKeywordLoading(true);
    try {
      const res = await fetch('/api/seo/analyze-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          content: content.slice(0, 1000),
          domain: targetDomain
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.primaryKeywords) setPrimaryKeywords(data.data.primaryKeywords);
        if (data.data.longTailKeywords) setLongTailKeywords(data.data.longTailKeywords);
        if (data.data.topicalClusters) setTopicalClusters(data.data.topicalClusters);
        if (data.data.missingKeywords) setMissingKeywords(data.data.missingKeywords);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsKeywordLoading(false);
    }
  };

  // Run Content Optimization
  const handleRunOptimization = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/seo/optimize-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          title,
          focusKeyword,
          secondaryKeywords
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setOptimizationResult(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Run AI Metadata Generation
  const handleGenerateAiMetadata = async (schemaType: string) => {
    setIsGeneratingMeta(true);
    try {
      const res = await fetch('/api/seo/generate-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: metadata.metaDescription,
          url: metadata.url,
          brandName: selectedPreset.name,
          focusKeyword,
          schemaType
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiMetadataVariants({
          titles: data.data.titleOptions || [],
          descriptions: data.data.descriptionOptions || []
        });
        if (data.data.schemaJson) {
          setMetadata(prev => ({
            ...prev,
            schemaJson: data.data.schemaJson
          }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingMeta(false);
    }
  };

  // Run Competitor Intel
  const handleRefreshIntel = async () => {
    setIsCompetitorLoading(true);
    try {
      const res = await fetch('/api/seo/competitor-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: targetDomain,
          competitors: selectedPreset.competitors,
          niche: selectedPreset.niche
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCompetitorData(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCompetitorLoading(false);
    }
  };

  // Crawl Live Domain Proxy
  const handleCrawlDomain = async () => {
    if (!targetDomain) return;
    setIsCrawling(true);
    try {
      const crawlUrl = targetDomain.startsWith('http') ? targetDomain : `https://${targetDomain}`;
      const res = await fetch('/api/seo/crawl-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: crawlUrl })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const page = data.data;
        if (page.title) {
          setTitle(page.title);
          setMetadata(prev => ({ ...prev, title: page.title, ogTitle: page.title }));
        }
        if (page.metaDescription) {
          setMetadata(prev => ({ ...prev, metaDescription: page.metaDescription, ogDescription: page.metaDescription }));
        }
        if (page.canonical) {
          setMetadata(prev => ({ ...prev, canonicalUrl: page.canonical }));
        }

        // Update technical audit check items based on live audit
        setAuditItems(prev => [
          ...prev.filter(i => !['images', 'h1', 'canonical'].includes(i.id)),
          {
            id: 'images',
            category: 'OnPage',
            title: 'Image Alt Attribute Coverage',
            status: page.missingAltCount > 0 ? 'warning' : 'passed',
            value: page.missingAltCount > 0 ? `${page.missingAltCount} images missing alt text` : 'All images have alt text',
            impact: 'Medium',
            description: 'Alt attributes are essential for screen readers and search bot indexing.',
            fixGuide: 'Add descriptive alt tags to all image elements.'
          },
          {
            id: 'canonical',
            category: 'Indexing',
            title: 'Canonical Tag Presence',
            status: page.canonical ? 'passed' : 'warning',
            value: page.canonical ? 'Canonical tag verified' : 'No canonical link specified',
            impact: 'High',
            description: 'Canonical tags prevent duplicate content indexing.',
            fixGuide: 'Include <link rel="canonical" href="..." /> in head.'
          }
        ]);

        setActiveTab('metadata');
      } else {
        // Fallback or notification
        handleAnalyzeTopic(targetDomain);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCrawling(false);
    }
  };

  const handleAddCompetitor = (domain: string) => {
    if (selectedPreset.competitors.includes(domain)) return;
    const updated = [...selectedPreset.competitors, domain];
    setSelectedPreset({ ...selectedPreset, competitors: updated });
    setCompetitorData(prev => ({
      ...prev,
      overview: [
        ...prev.overview,
        {
          domain,
          authorityScore: Math.floor(Math.random() * 30 + 45),
          organicKeywordsCount: Math.floor(Math.random() * 5000 + 3000),
          estimatedMonthlyVisits: Math.floor(Math.random() * 60000 + 40000),
          backlinksCount: Math.floor(Math.random() * 2000 + 1000),
          isTarget: false
        }
      ]
    }));
  };

  const handleAddTrackedKeyword = (kw: string) => {
    const newEntry = {
      keyword: kw,
      searchVolume: Math.floor(Math.random() * 4000 + 1200),
      difficulty: Math.floor(Math.random() * 50 + 20),
      targetRank: Math.floor(Math.random() * 12 + 2),
      previousRank: Math.floor(Math.random() * 15 + 4),
      competitorRanks: {
        [selectedPreset.competitors[0] || 'rival1.com']: Math.floor(Math.random() * 8 + 1),
        [selectedPreset.competitors[1] || 'rival2.com']: Math.floor(Math.random() * 12 + 2)
      },
      url: `https://${targetDomain}/landing`,
      intent: 'Commercial' as const
    };
    setCompetitorData(prev => ({
      ...prev,
      trackedKeywords: [newEntry, ...prev.trackedKeywords]
    }));
  };

  // Overall Health Score calculation
  const overallHealthScore = Math.round(
    (auditItems.filter(i => i.status === 'passed').length / auditItems.length) * 100
  );

  const currentContentScore = optimizationResult?.overallScore || 78;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedPreset={selectedPreset}
        onSelectPreset={handleSelectPreset}
        targetDomain={targetDomain}
        setTargetDomain={setTargetDomain}
        onCrawlDomain={handleCrawlDomain}
        isCrawling={isCrawling}
        onOpenReport={() => setIsReportOpen(true)}
        overallScore={overallHealthScore}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'keywords' && (
          <KeywordIntelligence
            primaryKeywords={primaryKeywords}
            longTailKeywords={longTailKeywords}
            topicalClusters={topicalClusters}
            missingKeywords={missingKeywords}
            focusKeyword={focusKeyword}
            setFocusKeyword={setFocusKeyword}
            secondaryKeywords={secondaryKeywords}
            setSecondaryKeywords={setSecondaryKeywords}
            onAnalyzeTopic={handleAnalyzeTopic}
            isLoading={isKeywordLoading}
            content={content}
            onNavigateToContent={() => setActiveTab('content')}
          />
        )}

        {activeTab === 'content' && (
          <ContentStudio
            content={content}
            setContent={setContent}
            title={title}
            setTitle={setTitle}
            focusKeyword={focusKeyword}
            secondaryKeywords={secondaryKeywords}
            optimizationResult={optimizationResult}
            onRunOptimization={handleRunOptimization}
            isOptimizing={isOptimizing}
          />
        )}

        {activeTab === 'competitors' && (
          <CompetitorTracker
            data={competitorData}
            targetDomain={targetDomain}
            competitors={selectedPreset.competitors}
            onAddCompetitor={handleAddCompetitor}
            onAddTrackedKeyword={handleAddTrackedKeyword}
            onRefreshIntel={handleRefreshIntel}
            isLoading={isCompetitorLoading}
            onSelectKeywordToOptimize={(kw) => {
              setFocusKeyword(kw);
              setActiveTab('content');
            }}
          />
        )}

        {activeTab === 'metadata' && (
          <MetadataArchitect
            metadata={metadata}
            setMetadata={setMetadata}
            focusKeyword={focusKeyword}
            brandName={selectedPreset.name}
            onGenerateAiMetadata={handleGenerateAiMetadata}
            isGenerating={isGeneratingMeta}
            aiVariants={aiMetadataVariants}
          />
        )}

        {activeTab === 'performance' && (
          <PerformanceAudit
            auditItems={auditItems}
            overallHealthScore={overallHealthScore}
            onOpenReport={() => setIsReportOpen(true)}
            targetDomain={targetDomain}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">ApexSEO Suite</span>
            <span>•</span>
            <span>AI Keyword Research & SERP Optimization Engine</span>
          </div>
          <div>
            <span>Active Domain: <strong className="text-slate-300">{targetDomain}</strong></span>
          </div>
        </div>
      </footer>

      {/* Printable / Downloadable Audit Report Modal */}
      <AuditReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetDomain={targetDomain}
        overallScore={overallHealthScore}
        focusKeyword={focusKeyword}
        keywords={primaryKeywords}
        competitorData={competitorData}
        metadata={metadata}
        auditItems={auditItems}
        contentScore={currentContentScore}
      />

    </div>
  );
}
