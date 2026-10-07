import React from 'react';
import { 
  Globe, 
  Search, 
  Sliders, 
  BarChart3, 
  Layers, 
  Activity, 
  Sparkles, 
  RefreshCw,
  FileCheck
} from 'lucide-react';
import { ProjectPreset } from '../types/seo';
import { PRESETS } from '../data/presets';

interface HeaderProps {
  activeTab: 'keywords' | 'content' | 'competitors' | 'metadata' | 'performance';
  setActiveTab: (tab: 'keywords' | 'content' | 'competitors' | 'metadata' | 'performance') => void;
  selectedPreset: ProjectPreset;
  onSelectPreset: (preset: ProjectPreset) => void;
  targetDomain: string;
  setTargetDomain: (domain: string) => void;
  onCrawlDomain: () => void;
  isCrawling: boolean;
  onOpenReport: () => void;
  overallScore: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedPreset,
  onSelectPreset,
  targetDomain,
  setTargetDomain,
  onCrawlDomain,
  isCrawling,
  onOpenReport,
  overallScore
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 text-slate-100 backdrop-blur-md bg-opacity-95">
      {/* Top Bar: Brand, URL Bar, Preset Switcher, Overall Health Badge, Export Report */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                    ApexSEO
                  </span>
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    PRO SUITE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">AI SEO Builder & Competitor Intelligence</p>
              </div>
            </div>

            {/* Mobile Score Badge */}
            <div className="md:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">{overallScore}/100</span>
            </div>
          </div>

          {/* Center Domain & Quick URL Auditor */}
          <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-xl">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Globe className="w-4 h-4 text-emerald-400" />
              </div>
              <input
                type="text"
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                placeholder="Enter target URL or domain (e.g. yoursite.com)"
                className="w-full pl-9 pr-24 py-1.5 text-xs sm:text-sm bg-slate-950/70 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
              />
              <button
                onClick={onCrawlDomain}
                disabled={isCrawling}
                className="absolute inset-y-1 right-1 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition disabled:opacity-50"
                title="Crawl and inspect live HTML"
              >
                {isCrawling ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                <span>Audit</span>
              </button>
            </div>

            {/* Presets dropdown */}
            <div className="relative shrink-0">
              <select
                value={selectedPreset.id}
                onChange={(e) => {
                  const found = PRESETS.find(p => p.id === e.target.value);
                  if (found) onSelectPreset(found);
                }}
                className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-300 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option disabled>Select Preset</option>
                {PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Action: Overall Health Indicator & Audit Export */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60">
              <div className="relative flex items-center justify-center">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div className="text-left">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">SEO Health Score</div>
                <div className="text-sm font-bold text-emerald-400">{overallScore} / 100</div>
              </div>
            </div>

            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Full Audit Report</span>
            </button>
          </div>

        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="border-t border-slate-800/80 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('keywords')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                activeTab === 'keywords'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Keyword Intelligence</span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                activeTab === 'content'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Content Optimization</span>
            </button>

            <button
              onClick={() => setActiveTab('competitors')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                activeTab === 'competitors'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Competitor Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab('metadata')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                activeTab === 'metadata'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Metadata & Schema</span>
            </button>

            <button
              onClick={() => setActiveTab('performance')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                activeTab === 'performance'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Performance Audit</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
