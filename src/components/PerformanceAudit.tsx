import React, { useState } from 'react';
import { 
  Activity, 
  Gauge, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  FileCheck, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  Globe, 
  ArrowRight
} from 'lucide-react';
import { AuditCheckItem } from '../types/seo';

interface PerformanceAuditProps {
  auditItems: AuditCheckItem[];
  overallHealthScore: number;
  onOpenReport: () => void;
  targetDomain: string;
}

export const PerformanceAudit: React.FC<PerformanceAuditProps> = ({
  auditItems,
  overallHealthScore,
  onOpenReport,
  targetDomain,
}) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'passed'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const criticalCount = auditItems.filter(i => i.status === 'critical').length;
  const warningCount = auditItems.filter(i => i.status === 'warning').length;
  const passedCount = auditItems.filter(i => i.status === 'passed').length;

  const filteredItems = auditItems.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Technical Performance Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Technical SEO & Core Web Vitals Audit
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Google 2026 Ranking Signals
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Site Health, Crawlability & Speed Diagnostics
          </h2>
          <p className="text-sm text-slate-400">
            Real-time verification of Core Web Vitals, indexability directives, HTTPS security, responsive viewports, and on-page technical standards.
          </p>
        </div>

        <button
          onClick={onOpenReport}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition"
        >
          <FileCheck className="w-4 h-4" />
          <span>Export Full Audit Report</span>
        </button>
      </div>

      {/* Core Web Vitals Simulated Gauges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: LCP */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Largest Contentful Paint</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">1.8s</div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[11px]">
            <span className="text-emerald-400 font-semibold">Good (&lt; 2.5s)</span>
            <span className="text-slate-500">Fast Render</span>
          </div>
        </div>

        {/* Metric 2: INP */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Interaction to Next Paint</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">85ms</div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[11px]">
            <span className="text-emerald-400 font-semibold">Good (&lt; 200ms)</span>
            <span className="text-slate-500">Fluid Response</span>
          </div>
        </div>

        {/* Metric 3: CLS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Cumulative Layout Shift</span>
            <Smartphone className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">0.03</div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[11px]">
            <span className="text-emerald-400 font-semibold">Good (&lt; 0.1)</span>
            <span className="text-slate-500">Stable Layout</span>
          </div>
        </div>

        {/* Metric 4: TTFB */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Time to First Byte</span>
            <Globe className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">190ms</div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[11px]">
            <span className="text-teal-400 font-semibold">Optimal (&lt; 800ms)</span>
            <span className="text-slate-500">Edge CDN</span>
          </div>
        </div>
      </div>

      {/* Main Health Diagnostic Panel & Issue Tracker */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Diagnostic Bar & Filters */}
        <div className="p-5 bg-slate-950/70 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Health Score Pill */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Health Rating</span>
                <span className="text-base font-extrabold text-emerald-400">{overallHealthScore}% Operational</span>
              </div>
            </div>

            {/* Counts */}
            <div className="flex items-center gap-3 text-xs">
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> {criticalCount} Critical
              </span>
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> {warningCount} Warnings
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {passedCount} Passed
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Checks ({auditItems.length})
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                filter === 'critical' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Errors ({criticalCount})
            </button>
            <button
              onClick={() => setFilter('warning')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                filter === 'warning' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Warnings ({warningCount})
            </button>
            <button
              onClick={() => setFilter('passed')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                filter === 'passed' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Passed ({passedCount})
            </button>
          </div>
        </div>

        {/* Audit Checks Accordion List */}
        <div className="divide-y divide-slate-800/80">
          {filteredItems.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div key={item.id} className="hover:bg-slate-800/30 transition">
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-4 sm:px-6 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {/* Status Icon */}
                    {item.status === 'passed' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {item.status === 'warning' && (
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    )}
                    {item.status === 'critical' && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{item.title}</span>
                        <span className="px-2 py-0.2 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-400">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 mt-0.5 block">{item.description}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right">
                      <div className="text-xs font-mono font-semibold text-slate-200">{item.value}</div>
                      <div className="text-[10px] text-slate-500 font-medium">Impact: {item.impact}</div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Fix Guidance */}
                {isExpanded && (
                  <div className="px-6 pb-5 pt-1 text-xs space-y-3 bg-slate-950/60 border-t border-slate-800/60">
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                        <span>Actionable Fix Recommendation</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-slate-300 leading-relaxed font-sans">{item.fixGuide}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
