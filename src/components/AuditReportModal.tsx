import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  Sparkles, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Target, 
  BarChart3, 
  Layers
} from 'lucide-react';
import { 
  KeywordData, 
  CompetitorIntelData, 
  MetadataPackage, 
  AuditCheckItem 
} from '../types/seo';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDomain: string;
  overallScore: number;
  focusKeyword: string;
  keywords: KeywordData[];
  competitorData: CompetitorIntelData;
  metadata: MetadataPackage;
  auditItems: AuditCheckItem[];
  contentScore: number;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  isOpen,
  onClose,
  targetDomain,
  overallScore,
  focusKeyword,
  keywords,
  competitorData,
  metadata,
  auditItems,
  contentScore,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const criticalIssues = auditItems.filter(i => i.status === 'critical');
  const warningIssues = auditItems.filter(i => i.status === 'warning');

  const generateMarkdownReport = () => {
    return `# ApexSEO Intelligence & Site Audit Report
**Domain:** ${targetDomain}
**Generated:** ${new Date().toLocaleDateString()}
**Overall SEO Health Rating:** ${overallScore}/100
**On-Page Content Score:** ${contentScore}/100
**Focus Keyword:** ${focusKeyword}

---

## 1. Executive Summary
- **Overall Health:** ${overallScore}% compliant with Google ranking standards.
- **Top Competitor:** ${competitorData.overview[1]?.domain || 'N/A'} (Authority: ${competitorData.overview[1]?.authorityScore || 0})
- **Tracked High-Intent Keywords:** ${keywords.length} target queries analyzed.
- **Critical Technical Issues:** ${criticalIssues.length} found.
- **Warnings & Optimizations:** ${warningIssues.length} found.

---

## 2. Target Keyword Intelligence
${keywords.slice(0, 5).map(k => `- **${k.keyword}** | Volume: ${k.volume?.toLocaleString()} | KD: ${k.difficulty} | Intent: ${k.intent}`).join('\n')}

---

## 3. Competitor Position Radar
${competitorData.trackedKeywords.slice(0, 5).map(tk => `- **${tk.keyword}** -> Your Rank: #${tk.targetRank} (Prev: #${tk.previousRank})`).join('\n')}

---

## 4. Metadata Configuration
- **Title Tag:** ${metadata.title} (${metadata.title.length} chars)
- **Meta Description:** ${metadata.metaDescription} (${metadata.metaDescription.length} chars)
- **Canonical URL:** ${metadata.canonicalUrl || metadata.url}
- **Schema Type:** ${metadata.schemaType}

---

## 5. Prioritized Technical Action Items
${criticalIssues.map(ci => `### [CRITICAL] ${ci.title}\n- **Impact:** ${ci.impact}\n- **Fix Recommendation:** ${ci.fixGuide}`).join('\n\n')}

${warningIssues.map(wi => `### [WARNING] ${wi.title}\n- **Impact:** ${wi.impact}\n- **Fix Recommendation:** ${wi.fixGuide}`).join('\n\n')}

Report generated via ApexSEO Intelligence Suite.
`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                ApexSEO Executive Audit Report
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {targetDomain}
                </span>
              </h2>
              <p className="text-xs text-slate-400">Ready for stakeholder presentation or developer action items</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Printable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* Executive Rating Banner */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Overall SEO Health</span>
              <span className="text-2xl font-extrabold text-emerald-400">{overallScore}%</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">On-Page Content Score</span>
              <span className="text-2xl font-extrabold text-teal-400">{contentScore}/100</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Target Keywords</span>
              <span className="text-2xl font-extrabold text-white">{keywords.length}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">Critical Action Items</span>
              <span className="text-2xl font-extrabold text-rose-400">{criticalIssues.length}</span>
            </div>
          </div>

          {/* Section 1: Keywords */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              1. Discovered Keyword Landscape
            </h3>
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Keyword</th>
                    <th className="p-3">Search Volume</th>
                    <th className="p-3">Difficulty</th>
                    <th className="p-3">Intent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {keywords.slice(0, 5).map((k, i) => (
                    <tr key={i}>
                      <td className="p-3 font-medium text-white">{k.keyword}</td>
                      <td className="p-3">{k.volume?.toLocaleString()}</td>
                      <td className="p-3">KD {k.difficulty}</td>
                      <td className="p-3">{k.intent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Competitor Tracking */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              2. Competitor Ranking Benchmark
            </h3>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              {competitorData.trackedKeywords.slice(0, 4).map((tk, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-900 last:border-0">
                  <span className="text-slate-200 font-medium">{tk.keyword}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Position:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                      #{tk.targetRank}
                    </span>
                    <span className="text-slate-500 font-mono">({tk.searchVolume.toLocaleString()} vol)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Technical Fix Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              3. Critical Fixes & Optimization Roadmap
            </h3>
            <div className="space-y-2">
              {criticalIssues.map((ci) => (
                <div key={ci.id} className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-3.5 text-xs">
                  <div className="flex items-center gap-2 font-bold text-rose-300 mb-1">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>{ci.title}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{ci.fixGuide}</p>
                </div>
              ))}

              {warningIssues.map((wi) => (
                <div key={wi.id} className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3.5 text-xs">
                  <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>{wi.title}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{wi.fixGuide}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
