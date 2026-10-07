import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Plus, 
  ShieldAlert, 
  Trophy, 
  Target, 
  ExternalLink,
  Sparkles,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { CompetitorIntelData, SearchIntent } from '../types/seo';

interface CompetitorTrackerProps {
  data: CompetitorIntelData;
  targetDomain: string;
  competitors: string[];
  onAddCompetitor: (domain: string) => void;
  onAddTrackedKeyword: (keyword: string) => void;
  onRefreshIntel: () => void;
  isLoading: boolean;
  onSelectKeywordToOptimize: (kw: string) => void;
}

export const CompetitorTracker: React.FC<CompetitorTrackerProps> = ({
  data,
  targetDomain,
  competitors,
  onAddCompetitor,
  onAddTrackedKeyword,
  onRefreshIntel,
  isLoading,
  onSelectKeywordToOptimize,
}) => {
  const [newCompetitorInput, setNewCompetitorInput] = useState('');
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'winning' | 'losing' | 'gap'>('all');
  const [selectedKeywordForChart, setSelectedKeywordForChart] = useState<string>(
    data.trackedKeywords[0]?.keyword || 'agile workflow management software'
  );

  const handleAddCompetitorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCompetitorInput.trim()) {
      onAddCompetitor(newCompetitorInput.trim().replace(/^https?:\/\//, '').replace(/\/$/, ''));
      setNewCompetitorInput('');
    }
  };

  const handleAddKeywordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeywordInput.trim()) {
      onAddTrackedKeyword(newKeywordInput.trim());
      setNewKeywordInput('');
    }
  };

  const getRankMovement = (targetRank: number, prevRank: number) => {
    const diff = prevRank - targetRank;
    if (diff > 0) {
      return (
        <span className="flex items-center text-xs font-bold text-emerald-400">
          <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +{diff}
        </span>
      );
    }
    if (diff < 0) {
      return (
        <span className="flex items-center text-xs font-bold text-rose-400">
          <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> {diff}
        </span>
      );
    }
    return (
      <span className="flex items-center text-xs font-medium text-slate-500">
        <Minus className="w-3.5 h-3.5 mr-0.5" /> 0
      </span>
    );
  };

  const getRankPill = (rank: number, isWinner: boolean) => {
    if (!rank || rank > 100) return <span className="text-slate-600 text-xs">—</span>;
    if (rank <= 3) {
      return (
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
          isWinner ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-slate-800 text-slate-200'
        }`}>
          #{rank}
        </span>
      );
    }
    if (rank <= 10) {
      return (
        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/15 text-emerald-300">
          #{rank}
        </span>
      );
    }
    return <span className="px-2 py-0.5 rounded text-xs text-slate-400 bg-slate-800/80">#{rank}</span>;
  };

  // Filter keywords
  const filteredKeywords = data.trackedKeywords.filter((item) => {
    const compRanks = Object.values(item.competitorRanks);
    const minCompRank = compRanks.length > 0 ? Math.min(...compRanks) : 999;
    const isTargetLeading = item.targetRank <= minCompRank;

    if (filterMode === 'winning') return isTargetLeading;
    if (filterMode === 'losing') return !isTargetLeading;
    if (filterMode === 'gap') return item.targetRank > 10 && minCompRank <= 5;
    return true;
  });

  // Calculate 90-day mock trend points for the selected keyword
  const activeKeywordObj = data.trackedKeywords.find(k => k.keyword === selectedKeywordForChart) || data.trackedKeywords[0];
  const currentRank = activeKeywordObj ? activeKeywordObj.targetRank : 4;
  const trendHistory = [
    { day: '60d ago', rank: Math.min(25, currentRank + 6) },
    { day: '45d ago', rank: Math.min(20, currentRank + 4) },
    { day: '30d ago', rank: Math.min(15, currentRank + 3) },
    { day: '15d ago', rank: Math.min(10, currentRank + 1) },
    { day: 'Today', rank: currentRank },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Competitor Intelligence & Action Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" />
                SERP Competitor Intelligence
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Daily Position Radar
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Benchmark Keyword Rankings & Close Content Gaps
            </h2>
            <p className="text-sm text-slate-400">
              Track side-by-side positions against key competitors, identify low-hanging rank jumps, and conquer high-value keyword opportunities.
            </p>
          </div>

          <button
            onClick={onRefreshIntel}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" /> : <RefreshCw className="w-3.5 h-3.5" />}
            <span>Re-Audit SERP Data</span>
          </button>
        </div>

        {/* Competitor Domain Management Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            Tracking Domains:
          </span>
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold">
            {targetDomain} (Your Site)
          </span>

          {competitors.map((comp, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-medium"
            >
              vs. {comp}
            </span>
          ))}

          {/* Add Competitor inline form */}
          <form onSubmit={handleAddCompetitorSubmit} className="flex items-center gap-1.5 ml-auto">
            <input
              type="text"
              value={newCompetitorInput}
              onChange={(e) => setNewCompetitorInput(e.target.value)}
              placeholder="Add competitor domain..."
              className="px-2.5 py-1 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="p-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
              title="Add Competitor"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Domain Authority & Scale Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.overview.map((site, sIdx) => (
          <div
            key={sIdx}
            className={`rounded-2xl p-5 border transition ${
              site.isTarget
                ? 'bg-slate-900 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base truncate max-w-[180px]">{site.domain}</span>
                {site.isTarget && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Your Site
                  </span>
                )}
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">Authority Score</span>
                <span className="text-xl font-extrabold text-white">{site.authorityScore}</span>
                <span className="text-[10px] text-emerald-400 block">/ 100 benchmark</span>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">Est. Monthly Visits</span>
                <span className="text-xl font-extrabold text-white">
                  {(site.estimatedMonthlyVisits / 1000).toFixed(1)}k
                </span>
                <span className="text-[10px] text-slate-400 block">Organic traffic</span>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">Ranking Keywords</span>
                <span className="text-sm font-bold text-slate-200">
                  {site.organicKeywordsCount.toLocaleString()}
                </span>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">Total Backlinks</span>
                <span className="text-sm font-bold text-slate-200">
                  {site.backlinksCount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Historical Trend Simulator for Selected Keyword */}
      {activeKeywordObj && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                SERP Position Trajectory (90 Days)
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Target Keyword: <span className="text-emerald-400 font-extrabold">"{activeKeywordObj.keyword}"</span>
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Current Rank:</span>
              <span className="px-2.5 py-1 rounded-lg text-sm font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Position #{activeKeywordObj.targetRank}
              </span>
            </div>
          </div>

          {/* Simple Clean Responsive Trajectory Visualizer */}
          <div className="grid grid-cols-5 gap-2 pt-2">
            {trendHistory.map((step, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                <div className="text-[11px] text-slate-400 mb-1">{step.day}</div>
                <div className="text-lg font-bold text-white">#{step.rank}</div>
                <div className="text-[10px] text-emerald-400 mt-1">
                  {idx === 0 ? 'Baseline' : `+${Math.max(0, trendHistory[idx - 1].rank - step.rank)} spots`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Side-by-Side Tracked Keywords Ranking Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-slate-950/70 border-b border-slate-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterMode === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Tracked ({data.trackedKeywords.length})
            </button>
            <button
              onClick={() => setFilterMode('winning')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterMode === 'winning'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Winning Top Spots
            </button>
            <button
              onClick={() => setFilterMode('losing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterMode === 'losing'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Behind Competitors
            </button>
          </div>

          {/* Add Tracked Keyword Form */}
          <form onSubmit={handleAddKeywordSubmit} className="flex items-center gap-1.5 w-full sm:w-auto">
            <input
              type="text"
              value={newKeywordInput}
              onChange={(e) => setNewKeywordInput(e.target.value)}
              placeholder="Track new keyword..."
              className="px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full sm:w-56"
            />
            <button
              type="submit"
              className="p-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shrink-0"
              title="Track Keyword"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3 font-semibold">Tracked Keyword</th>
                <th className="px-4 py-3 font-semibold">Search Volume</th>
                <th className="px-4 py-3 font-semibold">Your Rank</th>
                <th className="px-4 py-3 font-semibold">30d Movement</th>
                {competitors.map((comp, cIdx) => (
                  <th key={cIdx} className="px-4 py-3 font-semibold">
                    {comp}
                  </th>
                ))}
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredKeywords.map((item, idx) => {
                const compRanks = Object.values(item.competitorRanks);
                const minCompRank = compRanks.length > 0 ? Math.min(...compRanks) : 999;
                const isTargetWinning = item.targetRank <= minCompRank;

                return (
                  <tr
                    key={idx}
                    onClick={() => setSelectedKeywordForChart(item.keyword)}
                    className={`cursor-pointer transition ${
                      selectedKeywordForChart === item.keyword
                        ? 'bg-emerald-500/10'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 font-medium text-white">
                        <span>{item.keyword}</span>
                        {isTargetWinning && (
                          <span className="flex items-center text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold">
                            Leader
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">{item.intent}</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-200 font-semibold">
                      {item.searchVolume.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      {getRankPill(item.targetRank, isTargetWinning)}
                    </td>
                    <td className="px-4 py-3.5">
                      {getRankMovement(item.targetRank, item.previousRank)}
                    </td>
                    {competitors.map((comp, cIdx) => {
                      const cRank = item.competitorRanks[comp];
                      const compWon = cRank < item.targetRank;
                      return (
                        <td key={cIdx} className="px-4 py-3.5">
                          {getRankPill(cRank, compWon)}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectKeywordToOptimize(item.keyword);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white transition inline-flex items-center gap-1"
                      >
                        <span>Optimize</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Content Gap Matrix: High Priority Ranking Opportunities */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white text-base">High-Value Content Gap Matrix</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Keywords where competitors are securing Top 3 rankings while your site has little or no footprint.
            </p>
          </div>
          <span className="px-2.5 py-1 text-xs font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {data.contentGaps.length} Actionable Gaps
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.contentGaps.map((gap, gIdx) => (
            <div key={gIdx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-sm">{gap.keyword}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                    Opp. Score {gap.opportunityScore}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mb-2">
                  <span className="text-slate-200 font-semibold">{gap.volume.toLocaleString()} searches/mo</span>
                  <span className="mx-1">•</span>
                  <span>Competitor rank: #{gap.leaderRank} ({gap.competitorLeader})</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 mb-3">
                  {gap.actionRecommendation}
                </p>
              </div>

              <button
                onClick={() => onSelectKeywordToOptimize(gap.keyword)}
                className="w-full py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white border border-slate-700 hover:border-emerald-500 transition flex items-center justify-center gap-1.5"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Build Content Page for this Gap</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
