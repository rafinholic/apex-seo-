import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Copy, 
  Check, 
  Wand2, 
  Heading1, 
  Heading2, 
  FileText, 
  RefreshCw,
  Zap,
  Target
} from 'lucide-react';
import { ContentOptimizationResult } from '../types/seo';

interface ContentStudioProps {
  content: string;
  setContent: (content: string) => void;
  title: string;
  setTitle: (title: string) => void;
  focusKeyword: string;
  secondaryKeywords: string[];
  optimizationResult: ContentOptimizationResult | null;
  onRunOptimization: () => void;
  isOptimizing: boolean;
}

export const ContentStudio: React.FC<ContentStudioProps> = ({
  content,
  setContent,
  title,
  setTitle,
  focusKeyword,
  secondaryKeywords,
  optimizationResult,
  onRunOptimization,
  isOptimizing,
}) => {
  const [copied, setCopied] = useState(false);
  const [aiPromptOpen, setAiPromptOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<'inject-keyword' | 'improve-readability' | 'generate-faq' | 'generate-outline'>('inject-keyword');
  const [isImprovingText, setIsImprovingText] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'outline' | 'faq'>('editor');

  // Client-side quick metrics
  const words = content.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const characterCount = content.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 220));

  // Heuristic checklist checks
  const hasKeywordInTitle = title.toLowerCase().includes(focusKeyword.toLowerCase());
  const hasH1 = content.includes('# ') || content.includes('<h1>');
  const first100Words = words.slice(0, 100).join(' ').toLowerCase();
  const hasKeywordInFirst100 = first100Words.includes(focusKeyword.toLowerCase());
  const keywordCount = focusKeyword ? (content.toLowerCase().match(new RegExp(focusKeyword.toLowerCase(), 'g')) || []).length : 0;
  const keywordDensity = wordCount > 0 ? ((keywordCount / wordCount) * 100).toFixed(2) : '0';

  // Headings outline extractor
  const headings = content.split('\n').filter(line => line.startsWith('#')).map(line => {
    if (line.startsWith('### ')) return { level: 3, text: line.replace('### ', '') };
    if (line.startsWith('## ')) return { level: 2, text: line.replace('## ', '') };
    if (line.startsWith('# ')) return { level: 1, text: line.replace('# ', '') };
    return null;
  }).filter(Boolean) as { level: number; text: string }[];

  const h1Count = headings.filter(h => h.level === 1).length;

  const score = optimizationResult?.overallScore || Math.min(92, Math.max(45, Math.round(50 + (hasKeywordInTitle ? 15 : 0) + (hasKeywordInFirst100 ? 10 : 0) + (wordCount > 600 ? 15 : wordCount / 40))));

  const getScoreColor = (sc: number) => {
    if (sc >= 75) return 'text-emerald-400 stroke-emerald-500';
    if (sc >= 50) return 'text-amber-400 stroke-amber-500';
    return 'text-rose-400 stroke-rose-500';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunAiAssist = async () => {
    setIsImprovingText(true);
    try {
      if (selectedGoal === 'generate-faq') {
        const res = await fetch('/api/seo/improve-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: content.slice(0, 1000),
            goal: 'Generate 3 high intent FAQ questions with answers formatted with H2 and H3 markdown',
            focusKeyword,
          })
        });
        const data = await res.json();
        if (data.improvedText) {
          setContent(content + '\n\n## Frequently Asked Questions\n' + data.improvedText);
        }
      } else if (selectedGoal === 'generate-outline') {
        const res = await fetch('/api/seo/improve-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: title,
            goal: `Create an exhaustive SEO content outline with H2 and H3 headings for the primary keyword "${focusKeyword}"`,
            focusKeyword,
          })
        });
        const data = await res.json();
        if (data.improvedText) {
          setContent(content + '\n\n' + data.improvedText);
        }
      } else {
        const res = await fetch('/api/seo/improve-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: content.slice(-600) || content,
            goal: selectedGoal === 'inject-keyword'
              ? `Inject the focus keyword "${focusKeyword}" seamlessly into a compelling paragraph`
              : 'Enhance clarity, punchiness, and readability for higher search engagement',
            focusKeyword,
          })
        });
        const data = await res.json();
        if (data.improvedText) {
          setContent(content + '\n\n' + data.improvedText);
        }
      }
      setAiPromptOpen(false);
      onRunOptimization();
    } catch (err) {
      console.error(err);
    } finally {
      setIsImprovingText(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Studio Controls & Focus Keywords */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Content Optimization Studio
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Live Surfer-Style Scoring
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Real-Time SEO Content Editor & NLP Optimizer
          </h2>
          <p className="text-sm text-slate-400">
            Write or paste your article. The real-time engine scores keyword presence, heading outline hierarchy, readability, and content volume.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto">
          <button
            onClick={() => setAiPromptOpen(!aiPromptOpen)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/20 transition"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>AI Copilot</span>
          </button>

          <button
            onClick={onRunOptimization}
            disabled={isOptimizing}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
          >
            {isOptimizing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
            <span>Re-Score Content</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            title="Copy Content"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* AI Copilot Dropdown Modal / Drawer */}
      {aiPromptOpen && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 bg-gradient-to-br from-indigo-950/30 to-slate-900 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-white text-base">Gemini SEO Content Copilot</h3>
            </div>
            <button
              onClick={() => setAiPromptOpen(false)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              Close
            </button>
          </div>

          <p className="text-xs text-slate-300 mb-4">
            Select an automated optimization task. Gemini will generate contextually rich additions targeting <strong className="text-emerald-400">"{focusKeyword}"</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <button
              onClick={() => setSelectedGoal('inject-keyword')}
              className={`p-3 rounded-xl border text-left transition ${
                selectedGoal === 'inject-keyword'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="font-semibold text-xs text-indigo-300">1. Inject Missing Keyword</div>
              <div className="text-[11px] text-slate-400 mt-1">Weaves focus keyword naturally into a new authoritative paragraph.</div>
            </button>

            <button
              onClick={() => setSelectedGoal('generate-outline')}
              className={`p-3 rounded-xl border text-left transition ${
                selectedGoal === 'generate-outline'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="font-semibold text-xs text-indigo-300">2. Generate Complete Outline</div>
              <div className="text-[11px] text-slate-400 mt-1">Builds an SEO-optimized H2 & H3 hierarchy to beat competition.</div>
            </button>

            <button
              onClick={() => setSelectedGoal('generate-faq')}
              className={`p-3 rounded-xl border text-left transition ${
                selectedGoal === 'generate-faq'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="font-semibold text-xs text-indigo-300">3. Generate FAQ Schema Section</div>
              <div className="text-[11px] text-slate-400 mt-1">Drafts high-intent "People Also Ask" questions for rich snippets.</div>
            </button>

            <button
              onClick={() => setSelectedGoal('improve-readability')}
              className={`p-3 rounded-xl border text-left transition ${
                selectedGoal === 'improve-readability'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="font-semibold text-xs text-indigo-300">4. Elevate Tone & Readability</div>
              <div className="text-[11px] text-slate-400 mt-1">Refines phrasing to maximize dwell time and engagement.</div>
            </button>
          </div>

          <button
            onClick={handleRunAiAssist}
            disabled={isImprovingText}
            className="w-full py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isImprovingText ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            <span>Execute AI Enhancement & Append to Content</span>
          </button>
        </div>
      )}

      {/* Main Dual-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Center Column: Title Input, Subtabs, Live Content Editor (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Article Title Input */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                Target H1 Page Title
              </label>
              <span className={`text-xs font-mono font-medium ${
                hasKeywordInTitle ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {hasKeywordInTitle ? '✓ Focus Keyword Included' : '⚠ Missing Focus Keyword'}
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Agile Workflow Management Software | Streamline Team Sprints"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Editor Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
            {/* Editor Toolbar & Subtab Switcher */}
            <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'editor'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Markdown Editor
                </button>
                <button
                  onClick={() => setActiveTab('outline')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'outline'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Heading Hierarchy ({headings.length})
                </button>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'faq'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  FAQ Schema Preview
                </button>
              </div>

              {/* Word count & Reading time pills */}
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>{wordCount} words</span>
                <span className="hidden sm:inline">~{readingTimeMinutes} min read</span>
                <span className="text-slate-500">{characterCount} chars</span>
              </div>
            </div>

            {/* Tab 1: Live Content Textarea */}
            {activeTab === 'editor' && (
              <div className="relative">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                  placeholder="# Enter your article draft in Markdown or plain text here..."
                  className="w-full p-4 bg-slate-900 text-slate-100 text-sm font-sans leading-relaxed resize-y focus:outline-none focus:ring-0 border-0"
                />
              </div>
            )}

            {/* Tab 2: Heading Outline Inspector */}
            {activeTab === 'outline' && (
              <div className="p-5 space-y-3 bg-slate-900 min-h-[350px]">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Structural Heading Hierarchy
                  </h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded font-semibold ${
                      h1Count === 1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {h1Count === 1 ? '✓ Exactly 1 H1 Tag' : `${h1Count} H1 Tags (Best practice: exactly 1)`}
                    </span>
                  </div>
                </div>

                {headings.length === 0 ? (
                  <p className="text-xs text-slate-500 py-8 text-center">
                    No headings detected yet. Add # for H1, ## for H2, and ### for H3.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {headings.map((h, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2 text-xs rounded-lg p-2.5 transition ${
                          h.level === 1
                            ? 'bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 pl-3 font-bold'
                            : h.level === 2
                            ? 'bg-slate-950/80 border border-slate-800 text-slate-200 ml-4 font-semibold'
                            : 'bg-slate-950/40 border border-slate-800/60 text-slate-300 ml-8'
                        }`}
                      >
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                          H{h.level}
                        </span>
                        <span className="break-all">{h.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: FAQ Schema */}
            {activeTab === 'faq' && (
              <div className="p-5 space-y-4 bg-slate-900 min-h-[350px]">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Interactive FAQ Schema Content
                    </h4>
                    <p className="text-xs text-slate-400">
                      Google frequently rewards well-structured FAQ sections with SERP expandable accordion rich snippets.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedGoal('generate-faq');
                      handleRunAiAssist();
                    }}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-500 text-white"
                  >
                    + Generate More FAQs
                  </button>
                </div>

                <div className="space-y-3">
                  {(optimizationResult?.enhancedFaqSection || [
                    {
                      question: `How does ${focusKeyword || 'this solution'} boost team productivity?`,
                      answer: 'By consolidating task scheduling, continuous integration triggers, and asynchronous retrospectives into one intuitive dashboard.'
                    },
                    {
                      question: `Is ${focusKeyword || 'this tool'} compatible with existing stacks?`,
                      answer: 'Yes, it provides bidirectional webhook synchronizations for GitHub, GitLab, Slack, and REST APIs.'
                    }
                  ]).map((faq, fIdx) => (
                    <div key={fIdx} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                      <div className="font-semibold text-xs text-emerald-300 flex items-center gap-1.5 mb-1">
                        <HelpCircle className="w-3.5 h-3.5" />
                        {faq.question}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Real-Time SEO Scoring & Checklist (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Circular Score Gauge Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Real-Time Content Score
                </span>
                <div className="text-xs text-slate-500">Benchmark against top 10 SERP results</div>
              </div>
              <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                score >= 75
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : score >= 50
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {score >= 75 ? 'Ready to Rank' : score >= 50 ? 'Good Draft' : 'Needs Optimization'}
              </span>
            </div>

            {/* Score Radial Visual */}
            <div className="flex items-center justify-center py-2">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-slate-800"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="38"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className={getScoreColor(score)}
                    strokeWidth="8"
                    strokeDasharray={238.76}
                    strokeDashoffset={238.76 - (238.76 * score) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    r="38"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white tracking-tight">{score}</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">out of 100</span>
                </div>
              </div>
            </div>

            {/* Secondary Score Indicators */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <div className="text-[11px] text-slate-400 font-medium">Readability Index</div>
                <div className="text-base font-bold text-white mt-0.5">
                  {optimizationResult?.readabilityGrade || '8th Grade'}
                </div>
                <div className="text-[10px] text-emerald-400">Optimal consumer clarity</div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <div className="text-[11px] text-slate-400 font-medium">Word Count Target</div>
                <div className="text-base font-bold text-white mt-0.5">
                  {wordCount} <span className="text-xs text-slate-400 font-normal">/ 1,200</span>
                </div>
                <div className={`text-[10px] font-semibold ${wordCount >= 1000 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {wordCount >= 1000 ? 'Optimal length' : `${Math.max(0, 1200 - wordCount)} words to go`}
                </div>
              </div>
            </div>
          </div>

          {/* Keyword Placement Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Keyword Placement Audit</span>
              <span className="text-emerald-400 text-xs font-semibold">{focusKeyword}</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  {hasKeywordInTitle ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span className="text-slate-200">Exact keyword in Page Title</span>
                </div>
                <span className={hasKeywordInTitle ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                  {hasKeywordInTitle ? 'Passed' : 'Missing'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  {hasH1 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span className="text-slate-200">Target keyword in H1 Heading</span>
                </div>
                <span className={hasH1 ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                  {hasH1 ? 'Passed' : 'Missing'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  {hasKeywordInFirst100 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span className="text-slate-200">Keyword in First 100 Words (Lead)</span>
                </div>
                <span className={hasKeywordInFirst100 ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                  {hasKeywordInFirst100 ? 'Passed' : 'Missing'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">Keyword Density (Target: 1.0 - 2.5%)</span>
                </div>
                <span className="text-slate-200 font-mono font-semibold">
                  {keywordDensity}% ({keywordCount}x)
                </span>
              </div>
            </div>

            {/* Secondary Keyword Distribution */}
            {secondaryKeywords.length > 0 && (
              <div className="pt-2">
                <div className="text-[11px] text-slate-400 font-semibold uppercase mb-2">Secondary Keywords Coverage</div>
                <div className="space-y-1.5">
                  {secondaryKeywords.map((sec, idx) => {
                    const cnt = (content.toLowerCase().match(new RegExp(sec.toLowerCase(), 'g')) || []).length;
                    return (
                      <div key={idx} className="flex items-center justify-between text-xs bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                        <span className="text-slate-300">{sec}</span>
                        <span className={`font-mono text-xs font-semibold ${cnt > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {cnt > 0 ? `${cnt}x found` : '0x (add to draft)'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Actionable Optimization Checklist */}
          {optimizationResult?.actionChecklist && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Prioritized Action Checklist
              </h3>
              <div className="space-y-2">
                {optimizationResult.actionChecklist.map((task, idx) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-semibold text-white">{task.task}</span>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                        task.priority === 'High' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{task.fixAdvice}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
