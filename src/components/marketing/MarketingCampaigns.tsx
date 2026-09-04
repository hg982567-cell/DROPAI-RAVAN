import React, { useState } from 'react';
import {
  Megaphone,
  Sparkles,
  DollarSign,
  TrendingUp,
  Copy,
  Check,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { Product } from '../../types';
import { api } from '../../services/api';

interface MarketingCampaignsProps {
  products: Product[];
}

export const MarketingCampaigns: React.FC<MarketingCampaignsProps> = ({ products }) => {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [platform, setPlatform] = useState<'TIKTOK' | 'META' | 'GOOGLE'>('TIKTOK');
  const [angle, setAngle] = useState('VIRAL_PROBLEM_SOLUTION');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const [generatedHooks, setGeneratedHooks] = useState<string[]>([
    "Stop wasting $200 at the aesthetician. This viral skincare wand gives you sculpted cheekbones in 5 minutes.",
    "If your morning face looks puffy and tired, you need to see what this does in 60 seconds.",
    "TikTok made this sell out 3 times this month. Here's the honest dermatologist review.",
  ]);

  const [generatedCopy, setGeneratedCopy] = useState(
    "The 7-in-1 Ultrasonic Sculptor uses micro-current stimulation and red light therapy to contour jawlines and tighten skin without needles. 40,000+ happy customers worldwide. Free Express Shipping today only."
  );

  const handleGenerate = async () => {
    if (!selectedProduct) return;
    setIsGenerating(true);
    try {
      const result = await api.generateCopy({
        productTitle: selectedProduct.title,
        category: selectedProduct.category,
        tone: angle,
      });
      if (result.hooks && result.hooks.length > 0) {
        setGeneratedHooks(result.hooks);
      }
      if (result.body || result.description) {
        setGeneratedCopy(result.body || result.description);
      }
    } catch (err) {
      console.error('Marketing generation failed', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div id="marketing-campaigns-container" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
            AI Ad Creatives & Marketing Engine
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Generate viral TikTok hooks, Meta ad copy variants, and audience targeting formulas.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs text-[#94A3B8] bg-[#111113] border border-[#1F1F21] px-3 py-1.5 rounded-lg">
          <Megaphone className="w-3.5 h-3.5 text-[#D97706]" />
          <span>ROAS Optimization: Active</span>
        </div>
      </div>

      {/* Generator Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-4">
          <h3 className="text-sm font-serif font-bold text-[#E2E8F0]">Campaign Blueprint</h3>

          <div className="space-y-1.5">
            <label className="text-xs text-[#94A3B8] font-medium">Target Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-xs text-[#E2E8F0] focus:border-[#D97706] focus:outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} (${p.sellingPrice})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-[#94A3B8] font-medium">Ad Platform Format</label>
            <div className="grid grid-cols-3 gap-2">
              {(['TIKTOK', 'META', 'GOOGLE'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    platform === p
                      ? 'bg-[#D97706] text-black shadow-sm'
                      : 'bg-[#151517] border border-[#2D2D30] text-[#94A3B8] hover:text-[#E2E8F0]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-[#94A3B8] font-medium">Psychological Hook Angle</label>
            <select
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-xs text-[#E2E8F0] font-mono focus:border-[#D97706] focus:outline-none"
            >
              <option value="VIRAL_PROBLEM_SOLUTION">Problem - Solution Agitation</option>
              <option value="FOMO_SCARCITY">FOMO & Extreme Scarcity</option>
              <option value="LUXURY_MINIMALIST">Quiet Luxury / High Perceived Value</option>
              <option value="TIKTOK_UGC">Raw Organic UGC Testimonial</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-2.5 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-black font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-[#D97706]/20 transition-all cursor-pointer disabled:opacity-40"
          >
            <Sparkles className={`w-4 h-4 text-black ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing Creatives...' : 'Generate High-Converting Ads'}</span>
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F1F21] pb-3">
              <span className="text-xs font-mono text-[#D97706] font-bold">
                GENERATED HOOKS (FIRST 3 SECONDS)
              </span>
              <span className="text-[10px] text-[#64748B] font-mono">Platform: {platform}</span>
            </div>

            <div className="space-y-2.5">
              {generatedHooks.map((hook, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-[#151517] border border-[#1F1F21] flex items-start justify-between gap-3 text-xs"
                >
                  <p className="text-[#E2E8F0] leading-relaxed font-mono">"{hook}"</p>
                  <button
                    onClick={() => copyToClipboard(hook, idx)}
                    className="p-1.5 rounded-lg bg-[#111113] hover:bg-[#1F1F21] border border-[#2D2D30] text-[#94A3B8] hover:text-[#E2E8F0] shrink-0 cursor-pointer"
                    title="Copy hook"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#1F1F21] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#D97706] font-bold">
                  PRIMARY AD BODY & CALL TO ACTION
                </span>
                <button
                  onClick={() => copyToClipboard(generatedCopy, 99)}
                  className="text-xs text-[#94A3B8] hover:text-[#E2E8F0] flex items-center space-x-1 font-mono cursor-pointer"
                >
                  {copiedIndex === 99 ? (
                    <span className="text-emerald-400">Copied</span>
                  ) : (
                    <span>Copy Body</span>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-lg bg-[#151517] border border-[#1F1F21] text-xs text-[#94A3B8] leading-relaxed font-mono">
                {generatedCopy}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
