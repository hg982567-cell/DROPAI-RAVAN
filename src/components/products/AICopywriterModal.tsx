import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  X,
  Share2,
  Megaphone,
  Globe,
  FileText,
  Users,
} from 'lucide-react';
import { api } from '../../services/api';
import { Product } from '../../types';

interface AICopywriterModalProps {
  product: Product;
  onClose: () => void;
  onApplyCopy: (updatedFields: { title?: string; description?: string }) => void;
}

export const AICopywriterModal: React.FC<AICopywriterModalProps> = ({
  product,
  onClose,
  onApplyCopy,
}) => {
  const [tone, setTone] = useState('High-Converting & Benefit-Driven');
  const [keyBenefits, setKeyBenefits] = useState('Durable, ergonomic, instant results');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [generatedData, setGeneratedData] = useState<{
    seoTitle?: string;
    seoDescription?: string;
    bulletHighlights?: string[];
    longDescription?: string;
    adCopy?: { tiktokHook?: string; metaPrimaryText?: string; googleHeadline?: string };
    targetAudience?: string[];
  } | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = await api.generateCopy({
        productTitle: product.title,
        category: product.category,
        tone,
        keyBenefits,
      });
      setGeneratedData(data);
    } catch (err) {
      console.error('Copywriter generation failed', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0B]/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-6 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1F1F21] pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-[#D97706]/10 text-[#D97706]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#E2E8F0]">AI Copywriter & SEO Generator</h2>
              <p className="text-xs text-[#94A3B8] truncate max-w-md">{product.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-[#151517] hover:bg-[#1F1F21] text-[#94A3B8] hover:text-[#E2E8F0] border border-[#2D2D30] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Generator Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-[#94A3B8] font-medium">Brand Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#E2E8F0] focus:border-[#D97706] focus:outline-none"
            >
              <option value="High-Converting & Benefit-Driven">High-Converting & Benefit-Driven</option>
              <option value="Luxury & Minimalist">Luxury & Minimalist</option>
              <option value="Punchy TikTok Viral">Punchy TikTok Viral</option>
              <option value="Clinical & Scientific">Clinical & Scientific</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[#94A3B8] font-medium">Key Highlights / Angle</label>
            <input
              type="text"
              value={keyBenefits}
              onChange={(e) => setKeyBenefits(e.target.value)}
              placeholder="e.g. 30-day trial, cordless, eco-friendly"
              className="w-full px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#E2E8F0] focus:border-[#D97706] focus:outline-none"
            />
          </div>
        </div>

        <button
          id="generate-copy-submit-btn"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-2.5 px-4 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-black font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#D97706]/20 cursor-pointer disabled:opacity-40"
        >
          {isGenerating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Generating with Gemini AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Generate Conversion Copy & Ad Hooks</span>
            </>
          )}
        </button>

        {/* Results Stream */}
        {generatedData && (
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 text-xs text-[#94A3B8]">
            {/* SEO Section */}
            <div className="p-4 rounded-lg bg-[#151517] border border-[#1F1F21] space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px] text-[#D97706]">
                <span className="flex items-center space-x-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span>GOOGLE SEO METADATA</span>
                </span>
                <button
                  onClick={() => copyToClipboard(generatedData.seoTitle || '', 'seo')}
                  className="flex items-center space-x-1 text-[#94A3B8] hover:text-[#E2E8F0] cursor-pointer"
                >
                  {copiedKey === 'seo' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'seo' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div>
                <span className="text-[#64748B] font-mono text-[10px]">Title Tag:</span>
                <p className="font-semibold text-[#E2E8F0]">{generatedData.seoTitle}</p>
              </div>

              <div>
                <span className="text-[#64748B] font-mono text-[10px]">Meta Description:</span>
                <p className="text-[#94A3B8] leading-relaxed">{generatedData.seoDescription}</p>
              </div>
            </div>

            {/* Bullet Highlights */}
            {generatedData.bulletHighlights && (
              <div className="p-4 rounded-lg bg-[#151517] border border-[#1F1F21] space-y-2">
                <div className="flex items-center justify-between font-mono text-[11px] text-emerald-400">
                  <span className="flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>FEATURE BULLETS (SHOPIFY LISTING)</span>
                  </span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[#94A3B8]">
                  {generatedData.bulletHighlights.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ad Hooks */}
            {generatedData.adCopy && (
              <div className="p-4 rounded-lg bg-[#151517] border border-[#1F1F21] space-y-2.5">
                <div className="flex items-center justify-between font-mono text-[11px] text-[#D97706]">
                  <span className="flex items-center space-x-1">
                    <Megaphone className="w-3.5 h-3.5 text-[#D97706]" />
                    <span className="text-[#D97706]">AD CAMPAIGN CREATIVES</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[#64748B] font-mono text-[10px]">TikTok Hook:</span>
                  <p className="italic text-[#E2E8F0]">"{generatedData.adCopy.tiktokHook}"</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[#64748B] font-mono text-[10px]">Meta (Facebook/IG) Ad Copy:</span>
                  <p className="text-[#94A3B8] leading-relaxed">{generatedData.adCopy.metaPrimaryText}</p>
                </div>
              </div>
            )}

            {/* Sales Copy */}
            {generatedData.longDescription && (
              <div className="p-4 rounded-lg bg-[#151517] border border-[#1F1F21] space-y-2">
                <span className="text-[11px] font-mono text-[#D97706]">STORE SALES PAGE COPY</span>
                <p className="text-[#94A3B8] leading-relaxed whitespace-pre-line">{generatedData.longDescription}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#1F1F21]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#151517] hover:bg-[#1F1F21] text-[#94A3B8] hover:text-[#E2E8F0] border border-[#2D2D30] text-xs cursor-pointer"
          >
            Close
          </button>

          {generatedData?.seoTitle && (
            <button
              onClick={() => {
                onApplyCopy({
                  title: generatedData.seoTitle,
                  description: generatedData.longDescription,
                });
                onClose();
              }}
              className="px-5 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-black font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-[#D97706]/20 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply to Product Listing</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
