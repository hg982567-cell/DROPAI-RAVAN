import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Calculator,
  Percent,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
} from 'lucide-react';
import { api } from '../../services/api';
import { useCurrency } from '../../hooks/useCurrency';

export const PricingEngine: React.FC = () => {
  const [baseCost, setBaseCost] = useState(14.5);
  const [shippingCost, setShippingCost] = useState(3.8);
  const [estimatedCAC, setEstimatedCAC] = useState(12.0);
  const [targetMarginPct, setTargetMarginPct] = useState(52);
  const [pricingResult, setPricingResult] = useState<any>(null);
  const { convertSync, format, currentCurrency } = useCurrency();


  useEffect(() => {
    // Run real pricing calculation through backend formula
    api.calculatePricing({
      baseCost,
      shippingCost,
      estimatedCAC,
      targetMarginPct,
    }).then((res) => {
      setPricingResult(res);
    });
  }, [baseCost, shippingCost, estimatedCAC, targetMarginPct]);

  return (
    <div id="pricing-engine-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 shadow-xl space-y-2">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-[#D97706]/10 border border-[#D97706]/30 text-[#D97706] text-xs font-mono">
          <Calculator className="w-3.5 h-3.5 text-[#D97706]" />
          <span>UNIT ECONOMICS & PRICING FORMULA</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
          AI Pricing & Margin Engine
        </h1>
        <p className="text-xs text-[#94A3B8] max-w-xl">
          Exact formula: Product Cost + Shipping + Gateway Fee (2.9% + $0.30) + Platform Fee (2%) + CAC + Target Net Profit = Recommended Selling Price.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#1F1F21] pb-3">
            <h2 className="text-sm font-serif font-bold text-[#E2E8F0]">Cost & Marketing Parameters</h2>
            <div className="flex items-center space-x-1">
              {[35, 50, 65].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTargetMarginPct(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    targetMarginPct === preset
                      ? 'bg-[#D97706] text-black font-bold'
                      : 'bg-[#151517] text-[#94A3B8] hover:text-[#E2E8F0] border border-[#2D2D30]'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Base Supplier Cost */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono">
                <span className="text-[#94A3B8] font-medium">Supplier Product Cost ($)</span>
                <span className="text-[#D97706] font-bold">${baseCost.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="2"
                max="100"
                step="0.5"
                value={baseCost}
                onChange={(e) => setBaseCost(Number(e.target.value))}
                className="w-full h-2 bg-[#151517] rounded-lg accent-[#D97706] cursor-pointer"
              />
            </div>

            {/* Shipping Cost */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono">
                <span className="text-[#94A3B8] font-medium">Estimated Carrier Shipping ($)</span>
                <span className="text-[#D97706] font-bold">${shippingCost.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="0.5"
                value={shippingCost}
                onChange={(e) => setShippingCost(Number(e.target.value))}
                className="w-full h-2 bg-[#151517] rounded-lg accent-[#D97706] cursor-pointer"
              />
            </div>

            {/* Ad Spend CAC */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono">
                <span className="text-[#94A3B8] font-medium">Estimated CAC (Meta/TikTok Ad Spend) ($)</span>
                <span className="text-[#D97706] font-bold">${estimatedCAC.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="2"
                max="50"
                step="1"
                value={estimatedCAC}
                onChange={(e) => setEstimatedCAC(Number(e.target.value))}
                className="w-full h-2 bg-[#151517] rounded-lg accent-[#D97706] cursor-pointer"
              />
            </div>

            {/* Target Net Margin */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono">
                <span className="text-[#94A3B8] font-medium">Target Net Profit Margin (%)</span>
                <span className="text-emerald-400 font-bold">{targetMarginPct}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="75"
                step="1"
                value={targetMarginPct}
                onChange={(e) => setTargetMarginPct(Number(e.target.value))}
                className="w-full h-2 bg-[#151517] rounded-lg accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Automatic Platform Fees Disclosure */}
          <div className="p-4 rounded-lg bg-[#151517] border border-[#1F1F21] space-y-2 text-[11px] text-[#94A3B8]">
            <div className="flex items-center space-x-1.5 text-[#E2E8F0] font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Real Fee Governance Embedded</span>
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-[#64748B]">
              <div>• Gateway Fee: 2.9% + $0.30/txn</div>
              <div>• Shopify Channel Fee: 2.0%</div>
            </div>
          </div>
        </div>

        {/* Right Output Card (5 cols) */}
        <div className="lg:col-span-5 rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-6 flex flex-col justify-between shadow-2xl">
          {pricingResult ? (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#64748B]">RECOMMENDED RETAIL</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold">
                    Target Verified
                  </span>
                </div>

                <div>
                  <div className="text-4xl font-bold text-[#D97706] font-mono tracking-tight">
                    ${pricingResult.recommendedPrice.toFixed(2)}
                  </div>
                  <div className="text-xs text-[#64748B] mt-1 font-mono">
                    Suggested Compare-at Price: ${pricingResult.compareAtPrice.toFixed(2)} (Save 31%)
                  </div>
                </div>

                {/* Breakdown Ledger */}
                <div className="p-4 rounded-lg bg-[#151517] border border-[#1F1F21] space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Product Cost:</span>
                    <span className="text-[#E2E8F0]">${pricingResult.productCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Shipping Cost:</span>
                    <span className="text-[#E2E8F0]">${pricingResult.shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Ad CAC Allowance:</span>
                    <span className="text-[#E2E8F0]">${pricingResult.estimatedCAC.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Payment Gateway (2.9%+$0.30):</span>
                    <span className="text-[#E2E8F0]">${pricingResult.gatewayFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Platform Fee (2%):</span>
                    <span className="text-[#E2E8F0]">${pricingResult.platformFee.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-[#1F1F21] pt-2 flex justify-between font-bold text-[#E2E8F0]">
                    <span>Total Cost & Fees:</span>
                    <span>${pricingResult.totalExpenses.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-[#1F1F21] pt-2 flex justify-between font-bold text-emerald-400 text-sm">
                    <span>Net Profit Per Unit:</span>
                    <span>+${pricingResult.netProfit.toFixed(2)}</span>
                  </div>
                </div>

                {/* Efficiency ROAS */}
                <div className="flex items-center justify-between text-xs font-mono p-3 rounded-lg bg-[#151517] border border-[#1F1F21]">
                  <span className="text-[#94A3B8]">Break-even Ad ROAS:</span>
                  <span className="text-[#D97706] font-bold">{pricingResult.breakEvenROAS}x</span>
                </div>

                {/* Multi-Currency Global Selling Prices */}
                <div className="p-3.5 rounded-lg bg-[#151517] border border-[#1F1F21] space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      <span>Multi-Currency Retail Prices</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">Auto-Synced</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded bg-[#111113] border border-[#232328] flex justify-between">
                      <span className="text-[#94A3B8]">🇪🇺 EUR:</span>
                      <span className="text-white font-bold">
                        {format(convertSync(pricingResult.recommendedPrice, 'USD', 'EUR'), 'EUR')}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-[#111113] border border-[#232328] flex justify-between">
                      <span className="text-[#94A3B8]">🇬🇧 GBP:</span>
                      <span className="text-white font-bold">
                        {format(convertSync(pricingResult.recommendedPrice, 'USD', 'GBP'), 'GBP')}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-[#111113] border border-[#232328] flex justify-between">
                      <span className="text-[#94A3B8]">🇮🇳 INR:</span>
                      <span className="text-white font-bold">
                        {format(convertSync(pricingResult.recommendedPrice, 'USD', 'INR'), 'INR')}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-[#111113] border border-[#232328] flex justify-between">
                      <span className="text-[#94A3B8]">🇦🇺 AUD:</span>
                      <span className="text-white font-bold">
                        {format(convertSync(pricingResult.recommendedPrice, 'USD', 'AUD'), 'AUD')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-[#64748B] font-mono text-center">
                Formula complies with standard commercial dropshipping accounting.
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-[#64748B] text-xs">
              Calculating unit economics...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
