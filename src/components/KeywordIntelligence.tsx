import React, { useState } from 'react';
import { 
  Search, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight, 
  Plus, 
  PieChart, 
  Target,
  RefreshCw,
  FolderTree,
  AlertTriangle
} from 'lucide-react';
import { KeywordData, TopicalCluster, MissingKeyword, SearchIntent } from '../types/seo';

interface KeywordIntelligenceProps {
  primaryKeywords: KeywordData[];
  longTailKeywords: KeywordData[];
  topicalClusters: TopicalCluster[];
  missingKeywords: MissingKeyword[];
  focusKeyword: string;
  setFocusKeyword: (kw: string) => void;
  secondaryKeywords: string[];
  setSecondaryKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  onAnalyzeTopic: (topic: string) => void;
  isLoading: boolean;
  content: string;
  onNavigateToContent: () => void;
}

export const KeywordIntelligence: React.FC<KeywordIntelligenceProps> = ({
  primaryKeywords,
  longTailKeywords,
  topicalClusters,
  missingKeywords,
  focusKeyword,
  setFocusKeyword,
  secondaryKeywords,
  setSecondaryKeywords,
  onAnalyzeTopic,
  isLoading,
  content,
  onNavigateToContent,
}) => {
  const [topicInput, setTopicInput] = useState(focusKeyword);
  const [filterIntent, setFilterIntent] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'primary' | 'longtail' | 'clusters' | 'density'>('primary');

  // Calculate live n-gram density from current content
  const computeDensity = () => {
    if (!content) return [];
    const clean = content.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    const words = clean.split(/\s+/).filter(w => w.length > 3);
    const stopWords = new Set([
      'about','above','after','again','against','all','and','any','are','because','been','before','being','below','between','both','but','can','could','did','does','doing','down','during','each','few','for','from','further','had','has','have','having','here','how','into','its','just','more','most','must','nor','not','now','off','once','only','other','our','out','over','own','same','should','some','such','than','that','the','their','them','then','there','these','they','this','those','through','too','under','until','very','was','were','what','when','where','which','while','who','whom','why','with','would','your'
    ]);

    const counts: Record<string, number> = {};
    for (const w of words) {
      if (!stopWords.has(w)) counts[w] = (counts[w] || 0) + 1;
    }

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => {
        const pct = ((count / Math.max(words.length, 1)) * 100);
        let status: 'optimal' | 'low' | 'stuffed' = 'optimal';
        if (pct < 0.8) status = 'low';
        else if (pct > 3.0) status = 'stuffed';
        return {
          word,
          count,
          percentage: pct.toFixed(1),
          status
        };
      });
  };

  const densityList = computeDensity();

  const handleAddKeyword = (kw: string) => {
    if (secondaryKeywords.includes(kw) || focusKeyword.toLowerCase() === kw.toLowerCase()) return;
    setSecondaryKeywords([...secondaryKeywords, kw]);
  };

  const handleSetPrimary = (kw: string) => {
    setFocusKeyword(kw);
  };

  const allKeywords = [...primaryKeywords, ...longTailKeywords];
  const filteredKeywords = (activeTab === 'primary' ? primaryKeywords : longTailKeywords).filter(k => {
    if (filterIntent === 'all') return true;
    return k.intent.toLowerCase() === filterIntent.toLowerCase();
  });

  const getKdBadge = (kd: number) => {
    if (kd < 30) return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">KD {kd} Easy</span>;
    if (kd < 50) return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-teal-500/15 text-teal-400 border border-teal-500/30">KD {kd} Med</span>;
    if (kd < 70) return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">KD {kd} Hard</span>;
    return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">KD {kd} Tough</span>;
  };

  const getIntentBadge = (intent: SearchIntent) => {
    const colors = {
      Informational: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      Commercial: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      Transactional: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      Navigational: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    };
    return (
      <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full border ${colors[intent] || colors.Informational}`}>
        {intent}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Keyword Topic Explorer & Focus Assignment */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Keyword Explorer & Intelligence
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Analyze High-Intent Keywords & Search Demand
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl">
              Uncover search volume, competitive difficulty (KD), search intent categorization, topical clusters, and content gaps to outrank search rivals.
            </p>
          </div>

          {/* Quick Search Bar */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onAnalyzeTopic(topicInput)}
                placeholder="Search seed keyword (e.g. agile software)..."
                className="w-full pl-3 pr-10 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <button
                onClick={() => onAnalyzeTopic(topicInput)}
                disabled={isLoading}
                className="absolute inset-y-1 right-1 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Current Active Target Keywords Pill Strip */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            Active Focus Keyword:
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold">
            <span>{focusKeyword}</span>
            <span className="text-[10px] bg-emerald-500/30 px-1.5 py-0.2 rounded">Primary</span>
          </div>

          {secondaryKeywords.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Secondary Targets:</span>
              {secondaryKeywords.map((sec, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-md text-xs group"
                >
                  <span>{sec}</span>
                  <button
                    onClick={() => setSecondaryKeywords(secondaryKeywords.filter((_, idx) => idx !== i))}
                    className="text-slate-500 hover:text-rose-400 text-xs font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <button
            onClick={onNavigateToContent}
            className="ml-auto text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
          >
            <span>Optimize Content for these Keywords</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metric Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Total Discovered</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{allKeywords.length} Keywords</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">High search volume opportunities</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Avg. Keyword Difficulty</span>
            <Target className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {Math.round(allKeywords.reduce((acc, k) => acc + k.difficulty, 0) / Math.max(allKeywords.length, 1))} / 100
          </div>
          <div className="text-[11px] text-teal-400 font-medium mt-1">Competitive rank landscape</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Monthly Potential Volume</span>
            <Search className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {allKeywords.reduce((acc, k) => acc + (k.volume || 0), 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-indigo-400 font-medium mt-1">Combined monthly organic searches</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Topical Clusters</span>
            <FolderTree className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{topicalClusters.length} Hubs</div>
          <div className="text-[11px] text-amber-400 font-medium mt-1">Semantic authority pillars</div>
        </div>
      </div>

      {/* Main Keywords Table & Clustering Workspace */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Sub Navigation Bar */}
        <div className="border-b border-slate-800 bg-slate-950/60 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('primary')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'primary'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Primary Seed Keywords ({primaryKeywords.length})
            </button>
            <button
              onClick={() => setActiveTab('longtail')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'longtail'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Long-Tail & Question Queries ({longTailKeywords.length})
            </button>
            <button
              onClick={() => setActiveTab('clusters')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'clusters'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Topical Clusters ({topicalClusters.length})
            </button>
            <button
              onClick={() => setActiveTab('density')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'density'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Density Analyzer ({densityList.length})
            </button>
          </div>

          {/* Intent Filter */}
          {(activeTab === 'primary' || activeTab === 'longtail') && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Intent:</span>
              <select
                value={filterIntent}
                onChange={(e) => setFilterIntent(e.target.value)}
                className="text-xs bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 focus:outline-none"
              >
                <option value="all">All Intents</option>
                <option value="informational">Informational</option>
                <option value="commercial">Commercial</option>
                <option value="transactional">Transactional</option>
                <option value="navigational">Navigational</option>
              </select>
            </div>
          )}
        </div>

        {/* Tab 1 & 2: Primary & Long-tail Tables */}
        {(activeTab === 'primary' || activeTab === 'longtail') && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/70 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">Keyword / Search Query</th>
                  <th className="px-4 py-3 font-semibold">Search Volume</th>
                  <th className="px-4 py-3 font-semibold">Difficulty</th>
                  <th className="px-4 py-3 font-semibold">Intent</th>
                  <th className="px-4 py-3 font-semibold">Est. CPC</th>
                  <th className="px-4 py-3 font-semibold">SERP Features</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredKeywords.map((item, idx) => {
                  const isPrimary = focusKeyword.toLowerCase() === item.keyword.toLowerCase();
                  const isSecondary = secondaryKeywords.map(s => s.toLowerCase()).includes(item.keyword.toLowerCase());

                  return (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 font-medium text-white">
                          <span>{item.keyword}</span>
                          {isPrimary && (
                            <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-semibold">
                              Primary Focus
                            </span>
                          )}
                          {isSecondary && (
                            <span className="px-2 py-0.5 text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded font-semibold">
                              Secondary
                            </span>
                          )}
                        </div>
                        {item.searchIntentExplanation && (
                          <p className="text-xs text-slate-400 mt-0.5">{item.searchIntentExplanation}</p>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-200">
                        {item.volume ? item.volume.toLocaleString() : '1,200'}
                        <span className="text-[11px] text-slate-500 font-normal block">/month</span>
                      </td>
                      <td className="px-4 py-3.5">
                        {getKdBadge(item.difficulty || 35)}
                      </td>
                      <td className="px-4 py-3.5">
                        {getIntentBadge(item.intent || 'Informational')}
                      </td>
                      <td className="px-4 py-3.5 text-slate-300 font-mono text-xs">
                        {item.cpc || '$1.80'}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {(item.serpFeatures || ['Featured Snippet', 'People Also Ask']).map((feat, fIdx) => (
                            <span key={fIdx} className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded">
                              {feat}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isPrimary && (
                            <button
                              onClick={() => handleSetPrimary(item.keyword)}
                              title="Set as Primary Focus Keyword"
                              className="px-2 py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            >
                              Make Primary
                            </button>
                          )}
                          {!isSecondary && !isPrimary && (
                            <button
                              onClick={() => handleAddKeyword(item.keyword)}
                              title="Add to Secondary Targets"
                              className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          )}
                          {isSecondary && (
                            <span className="text-xs text-indigo-400 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Added
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Topical Clusters */}
        {activeTab === 'clusters' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {topicalClusters.map((cluster, cIdx) => (
              <div key={cIdx} className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-emerald-400" />
                    {cluster.clusterName}
                  </h3>
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {cluster.relevance}% Match
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Covering this cluster establishes topical authority in Google's semantic index.
                </p>
                <div className="space-y-1.5">
                  {cluster.keywords.map((kw, kIdx) => (
                    <div key={kIdx} className="flex items-center justify-between text-xs bg-slate-900 px-3 py-2 rounded-lg text-slate-300">
                      <span>{kw}</span>
                      <button
                        onClick={() => handleAddKeyword(kw)}
                        className="text-emerald-400 hover:text-emerald-300 text-xs font-medium"
                      >
                        + Target
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Real-time Keyword Density Analyzer */}
        {activeTab === 'density' && (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-emerald-400" />
                  Live On-Page Keyword Density Audit
                </h3>
                <p className="text-xs text-slate-400">
                  Ideal keyword density is between 1.0% - 2.5%. Anything above 3.5% risks a Google keyword stuffing algorithmic penalty.
                </p>
              </div>
              <button
                onClick={onNavigateToContent}
                className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
              >
                Edit Content Text
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {densityList.map((item, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white text-sm">{item.word}</span>
                    <span className="text-xs font-mono font-bold text-slate-300">{item.count}x</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${
                        item.status === 'optimal'
                          ? 'bg-emerald-500'
                          : item.status === 'stuffed'
                          ? 'bg-rose-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, parseFloat(item.percentage) * 25)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{item.percentage}% density</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        item.status === 'optimal'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : item.status === 'stuffed'
                          ? 'bg-rose-500/10 text-rose-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {item.status === 'optimal' ? 'Safe Zone (1-2.5%)' : item.status === 'stuffed' ? 'Over-optimized!' : 'Low presence'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Missing High-Value Keywords Panel */}
      {missingKeywords.length > 0 && (
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 bg-gradient-to-r from-amber-500/5 to-transparent">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-base">Missing High-Opportunity Keywords Detected</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Top-ranking competitor articles frequently mention these entities. Integrating them will immediately boost your page's semantic relevance score.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {missingKeywords.map((gap, gIdx) => (
              <div key={gIdx} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 text-sm">{gap.keyword}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      gap.importance === 'High' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {gap.importance} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{gap.reason}</p>
                </div>
                <button
                  onClick={() => handleAddKeyword(gap.keyword)}
                  className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md shrink-0 transition"
                >
                  + Add to Target
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
