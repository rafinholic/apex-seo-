import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Copy, 
  Check, 
  Monitor, 
  Smartphone, 
  Share2, 
  Code2, 
  Star, 
  Download, 
  RefreshCw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { MetadataPackage } from '../types/seo';

interface MetadataArchitectProps {
  metadata: MetadataPackage;
  setMetadata: React.Dispatch<React.SetStateAction<MetadataPackage>>;
  focusKeyword: string;
  brandName: string;
  onGenerateAiMetadata: (schemaType: string) => void;
  isGenerating: boolean;
  aiVariants: {
    titles: { title: string; characterCount: number; style: string }[];
    descriptions: { description: string; characterCount: number; focus: string }[];
  } | null;
}

export const MetadataArchitect: React.FC<MetadataArchitectProps> = ({
  metadata,
  setMetadata,
  focusKeyword,
  brandName,
  onGenerateAiMetadata,
  isGenerating,
  aiVariants,
}) => {
  const [copiedMeta, setCopiedMeta] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile' | 'social'>('desktop');

  // Title metrics (Google cutoff is ~60 characters or ~600px)
  const titleLen = metadata.title.length;
  const isTitleOptimal = titleLen >= 50 && titleLen <= 60;
  const titlePixelEstimate = Math.round(titleLen * 9.6);

  // Description metrics (Google cutoff is ~155-160 characters or ~960px)
  const descLen = metadata.metaDescription.length;
  const isDescOptimal = descLen >= 140 && descLen <= 160;
  const descPixelEstimate = Math.round(descLen * 6.1);

  const handleCopyMetaHtml = () => {
    const htmlCode = `<!-- Primary Meta Tags -->
<title>${metadata.title}</title>
<meta name="title" content="${metadata.title}" />
<meta name="description" content="${metadata.metaDescription}" />
<link rel="canonical" href="${metadata.canonicalUrl || metadata.url}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${metadata.url}" />
<meta property="og:title" content="${metadata.ogTitle || metadata.title}" />
<meta property="og:description" content="${metadata.ogDescription || metadata.metaDescription}" />
<meta property="og:image" content="${metadata.ogImage || 'https://example.com/og-image.jpg'}" />

<!-- Twitter / X -->
<meta property="twitter:card" content="${metadata.twitterCard}" />
<meta property="twitter:url" content="${metadata.url}" />
<meta property="twitter:title" content="${metadata.ogTitle || metadata.title}" />
<meta property="twitter:description" content="${metadata.ogDescription || metadata.metaDescription}" />
<meta property="twitter:image" content="${metadata.ogImage || 'https://example.com/og-image.jpg'}" />`;

    navigator.clipboard.writeText(htmlCode);
    setCopiedMeta(true);
    setTimeout(() => setCopiedMeta(false), 2000);
  };

  const schemaJsonString = JSON.stringify(metadata.schemaJson, null, 2);

  const handleCopySchema = () => {
    const fullScript = `<script type="application/ld+json">\n${schemaJsonString}\n</script>`;
    navigator.clipboard.writeText(fullScript);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleDownloadSchema = () => {
    const element = document.createElement('a');
    const file = new Blob([schemaJsonString], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `${metadata.schemaType.toLowerCase()}-schema.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Metadata Architect */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              SERP Snippet & Metadata Architect
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Pixel Width Precise
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Live Google SERP Simulator & Schema.org Generator
          </h2>
          <p className="text-sm text-slate-400">
            Craft high-converting meta tags without Google truncation, preview desktop & mobile search cards, and export valid JSON-LD rich snippets.
          </p>
        </div>

        {/* Generate AI Meta Action */}
        <button
          onClick={() => onGenerateAiMetadata(metadata.schemaType)}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition disabled:opacity-50"
        >
          {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Generate CTR-Optimized Variations</span>
        </button>
      </div>

      {/* Main Dual Workspace: Editor on Left, Live SERP Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Editable Meta Inputs & AI Variations (6 Cols) */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Title Tag Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Page Title Tag (&lt;title&gt;)
              </label>
              <div className="flex items-center gap-2 text-xs">
                <span className={`font-mono font-semibold ${
                  isTitleOptimal ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {titleLen} / 60 chars ({titlePixelEstimate}px)
                </span>
              </div>
            </div>

            <input
              type="text"
              value={metadata.title}
              onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />

            {/* Pixel Gauge Bar */}
            <div className="space-y-1">
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    titleLen > 60 ? 'bg-rose-500' : isTitleOptimal ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, (titleLen / 60) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>0px</span>
                <span>Optimal: 50-60 chars (~580px max)</span>
                <span>600px cutoff</span>
              </div>
            </div>
          </div>

          {/* Meta Description Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Meta Description Tag
              </label>
              <div className="flex items-center gap-2 text-xs">
                <span className={`font-mono font-semibold ${
                  isDescOptimal ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {descLen} / 160 chars ({descPixelEstimate}px)
                </span>
              </div>
            </div>

            <textarea
              value={metadata.metaDescription}
              onChange={(e) => setMetadata({ ...metadata, metaDescription: e.target.value })}
              rows={3}
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none leading-relaxed"
            />

            {/* Pixel Gauge Bar */}
            <div className="space-y-1">
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    descLen > 160 ? 'bg-rose-500' : isDescOptimal ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, (descLen / 160) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>0px</span>
                <span>Optimal: 140-160 chars (~960px max)</span>
                <span>990px cutoff</span>
              </div>
            </div>
          </div>

          {/* Canonical & Social Settings */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Canonical & OpenGraph Metadata
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Target Page URL</label>
                <input
                  type="text"
                  value={metadata.url}
                  onChange={(e) => setMetadata({ ...metadata, url: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Canonical Tag URL</label>
                <input
                  type="text"
                  value={metadata.canonicalUrl}
                  onChange={(e) => setMetadata({ ...metadata, canonicalUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">OpenGraph Title</label>
                <input
                  type="text"
                  value={metadata.ogTitle}
                  onChange={(e) => setMetadata({ ...metadata, ogTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Twitter Card Format</label>
                <select
                  value={metadata.twitterCard}
                  onChange={(e) => setMetadata({ ...metadata, twitterCard: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
                >
                  <option value="summary_large_image">summary_large_image</option>
                  <option value="summary">summary</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">Ready to install on website &lt;head&gt;</span>
              <button
                onClick={handleCopyMetaHtml}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
              >
                {copiedMeta ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMeta ? 'HTML Copied!' : 'Copy <meta> Tags'}</span>
              </button>
            </div>
          </div>

          {/* AI Variations Pill Selector */}
          {aiVariants && (
            <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-white text-sm">AI Generated High-CTR Variations</h3>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] text-slate-400 font-semibold uppercase">Alternative Titles (Click to Apply)</div>
                {aiVariants.titles.map((vt, i) => (
                  <div
                    key={i}
                    onClick={() => setMetadata({ ...metadata, title: vt.title })}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{vt.title}</div>
                      <div className="text-[10px] text-purple-400">{vt.style} • {vt.characterCount} chars</div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                      Apply
                    </span>
                  </div>
                ))}
              </div>

              {aiVariants.descriptions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">Alternative Descriptions</div>
                  {aiVariants.descriptions.map((vd, i) => (
                    <div
                      key={i}
                      onClick={() => setMetadata({ ...metadata, metaDescription: vd.description })}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition flex items-start justify-between text-xs"
                    >
                      <div className="pr-2">
                        <div className="text-slate-300 text-xs leading-relaxed">{vd.description}</div>
                        <div className="text-[10px] text-purple-400 mt-1">{vd.focus} • {vd.characterCount} chars</div>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded shrink-0">
                        Apply
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column: Interactive SERP Simulator & Schema Builder (6 Cols) */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* SERP Simulator Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Live Search Engine Result Preview
                </span>
                <div className="text-xs text-slate-500">Pixel-accurate Google SERP rendering</div>
              </div>

              {/* View Switcher: Desktop vs Mobile vs Social */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    previewDevice === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Desktop SERP"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    previewDevice === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Mobile SERP"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('social')}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    previewDevice === 'social' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Social Share Card"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Desktop Google Preview */}
            {previewDevice === 'desktop' && (
              <div className="bg-white rounded-xl p-5 text-slate-800 shadow-sm border border-slate-200 font-sans max-w-full overflow-hidden">
                {/* Header: Favicon + Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-slate-700 mb-1">
                  <div className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] text-white font-bold">
                    {brandName ? brandName[0].toUpperCase() : 'A'}
                  </div>
                  <span className="font-medium text-slate-800">{brandName || 'ApexSEO'}</span>
                  <span className="text-slate-400">›</span>
                  <span className="text-slate-500 truncate max-w-xs">{metadata.url}</span>
                </div>

                {/* Google Title */}
                <h3 className="text-lg text-[#1a0dab] hover:underline cursor-pointer font-normal leading-snug line-clamp-1 mb-1">
                  {metadata.title || 'Page Title Not Specified'}
                </h3>

                {/* Rich Snippet Stars */}
                <div className="flex items-center gap-1 text-[11px] text-slate-600 mb-1">
                  <div className="flex text-amber-500">
                    <Star className="w-3 h-3 fill-amber-500" />
                    <Star className="w-3 h-3 fill-amber-500" />
                    <Star className="w-3 h-3 fill-amber-500" />
                    <Star className="w-3 h-3 fill-amber-500" />
                    <Star className="w-3 h-3 fill-amber-500" />
                  </div>
                  <span className="font-semibold">4.9</span>
                  <span>(128 reviews)</span>
                  <span className="text-slate-400">•</span>
                  <span>Free Trial Available</span>
                </div>

                {/* Snippet Description */}
                <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                  <span className="text-slate-400 mr-1">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} —</span>
                  {metadata.metaDescription || 'Add a compelling meta description to see how your listing will appear to searchers on Google.'}
                </p>

                {/* Google Sitelinks */}
                <div className="mt-3 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#1a0dab] font-medium hover:underline block cursor-pointer">Live Demo & Features</span>
                    <span className="text-[11px] text-slate-500">Interactive product walk-through</span>
                  </div>
                  <div>
                    <span className="text-[#1a0dab] font-medium hover:underline block cursor-pointer">Pricing Plans</span>
                    <span className="text-[11px] text-slate-500">Compare tiers and team licenses</span>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Google Preview */}
            {previewDevice === 'mobile' && (
              <div className="bg-white rounded-2xl p-4 text-slate-800 shadow-sm border border-slate-200 font-sans max-w-sm mx-auto overflow-hidden">
                <div className="flex items-center gap-2 text-xs mb-1.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] text-white font-bold">
                    {brandName ? brandName[0].toUpperCase() : 'A'}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 leading-tight">{brandName || 'ApexSEO'}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[200px]">{metadata.url}</div>
                  </div>
                </div>

                <h3 className="text-base text-[#1a0dab] font-normal leading-snug line-clamp-2 mb-1">
                  {metadata.title}
                </h3>

                <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-3">
                  {metadata.metaDescription}
                </p>
              </div>
            )}

            {/* Social Share Card Preview */}
            {previewDevice === 'social' && (
              <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 text-slate-100 max-w-md mx-auto">
                <div className="w-full h-36 bg-gradient-to-tr from-emerald-600 via-teal-700 to-indigo-800 flex items-center justify-center relative">
                  <div className="text-center p-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-emerald-200 block mb-1">ApexSEO Banner</span>
                    <span className="text-sm font-bold text-white line-clamp-2">{metadata.ogTitle || metadata.title}</span>
                  </div>
                </div>
                <div className="p-3.5 bg-slate-900">
                  <div className="text-[10px] uppercase font-mono text-slate-400 truncate mb-0.5">{metadata.url.replace(/^https?:\/\//, '')}</div>
                  <div className="text-sm font-bold text-white line-clamp-1">{metadata.ogTitle || metadata.title}</div>
                  <div className="text-xs text-slate-400 line-clamp-2 mt-1">{metadata.ogDescription || metadata.metaDescription}</div>
                </div>
              </div>
            )}
          </div>

          {/* Schema.org (JSON-LD) Visual Builder */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                  Schema.org JSON-LD Structured Data
                </span>
                <div className="text-xs text-slate-500">Enables rich snippet cards, sitelinks, & knowledge graph</div>
              </div>

              {/* Schema Type Picker */}
              <select
                value={metadata.schemaType}
                onChange={(e) => {
                  const newType = e.target.value as any;
                  setMetadata({
                    ...metadata,
                    schemaType: newType,
                    schemaJson: {
                      ...metadata.schemaJson,
                      '@type': newType
                    }
                  });
                }}
                className="text-xs bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none"
              >
                <option value="Article">Article Schema</option>
                <option value="Product">Product Schema</option>
                <option value="FAQPage">FAQPage Schema</option>
                <option value="Organization">Organization Schema</option>
                <option value="LocalBusiness">LocalBusiness Schema</option>
                <option value="BreadcrumbList">BreadcrumbList Schema</option>
              </select>
            </div>

            {/* Code Block */}
            <div className="relative">
              <pre className="p-4 bg-slate-950 rounded-xl text-emerald-300 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-56 border border-slate-800/80">
                {schemaJsonString}
              </pre>
            </div>

            {/* Schema Actions: Copy & Download */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>100% Valid JSON-LD</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadSchema}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={handleCopySchema}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? 'Copied!' : 'Copy Script Tag'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
