import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  DollarSign,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Info,
} from 'lucide-react';
import { api } from '../../services/api';
import { ResearchProduct, Product } from '../../types';

interface ProductResearchProps {
  initialProducts: ResearchProduct[];
  onImportToCatalog: (product: Partial<Product>) => void;
}

export const ProductResearch: React.FC<ProductResearchProps> = ({
  initialProducts,
  onImportToCatalog,
}) => {
  const [researchList, setResearchList] = useState<ResearchProduct[]>(initialProducts);
  const [categoryInput, setCategoryInput] = useState('All Categories');
  const [targetMargin, setTargetMargin] = useState(50);
  const [isSearching, setIsSearching] = useState(false);
  const [importedIds, setImportedIds] = useState<Record<string, boolean>>({});

  const handleRunAIResearch = async () => {
    setIsSearching(true);
    try {
      const results = await api.researchProducts(categoryInput, targetMargin);
      setResearchList(results);
    } catch (err) {
      console.error('Research error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleImport = (item: ResearchProduct) => {
    const netProfit = item.estimatedSellingPrice - item.estimatedCost - item.estimatedShipping;
    const marginPct = (netProfit / item.estimatedSellingPrice) * 100;

    onImportToCatalog({
      title: item.title,
      category: item.category,
      sku: `DA-RES-${Math.floor(1000 + Math.random() * 9000)}`,
      sellingPrice: item.estimatedSellingPrice,
      supplierCost: item.estimatedCost,
      shippingCost: item.estimatedShipping,
      netProfit: Number(netProfit.toFixed(2)),
      marginPct: Number(marginPct.toFixed(1)),
      stockTotal: 250,
      lowStockThreshold: 25,
      primarySupplierName: 'CJ Direct US',
      primarySupplierId: 'sup-1',
      backupSupplierName: 'AliExpress VIP',
      backupSupplierId: 'sup-2',
      publishedStores: ['AuraTrend Modern Lifestyle'],
      status: 'ACTIVE',
      currency: 'USD',
      imageUrl: item.imageUrl,
    });

    setImportedIds((prev) => ({ ...prev, [item.id]: true }));
  };

  return (
    <div id="product-research-container" className="space-y-6">
      {/* Research Engine Header */}
      <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-[#D97706]/10 border border-[#D97706]/30 text-[#D97706] text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              <span>MARKET DEMAND & SATURATION SCANNER</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
              AI Product Research Engine
            </h1>
            <p className="text-xs text-[#94A3B8] max-w-xl">
              Evaluate viral trends across TikTok, Instagram, and Amazon. Every suggestion includes explainable algorithmic scoring across saturation, competition, demand, and risk.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-[#94A3B8] bg-[#151517] px-3 py-2 rounded-lg border border-[#2D2D30]">
            <Info className="w-4 h-4 text-[#D97706]" />
            <span>Clearly marked: Verified Supplier Stock vs AI Trend Estimates</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="text-[11px] font-mono text-[#94A3B8] block mb-1">Niche / Category</label>
            <input
              type="text"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              placeholder="e.g. Eco Gadgets, Pet Care, Fitness"
              className="w-full px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-xs text-[#E2E8F0] focus:border-[#D97706] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-[#94A3B8] block mb-1">
              Minimum Target Margin: <span className="text-[#D97706] font-bold">{targetMargin}%</span>
            </label>
            <input
              type="range"
              min="20"
              max="75"
              value={targetMargin}
              onChange={(e) => setTargetMargin(Number(e.target.value))}
              className="w-full h-2 bg-[#151517] rounded-lg accent-[#D97706] mt-2 cursor-pointer"
            />
          </div>

          <div className="flex items-end">
            <button
              id="run-ai-research-btn"
              onClick={handleRunAIResearch}
              disabled={isSearching}
              className="w-full py-2.5 px-4 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-black font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#D97706]/20 cursor-pointer disabled:opacity-40"
            >
              {isSearching ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Scanning Market Data...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5 text-black" />
                  <span>Discover Winning Products</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Research Results Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {researchList.map((item) => {
          const isImported = importedIds[item.id];
          return (
            <div
              key={item.id}
              className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-5 shadow-sm hover:border-[#2D2D30] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-lg object-cover border border-[#1F1F21] shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-full bg-[#D97706]/10 text-[#D97706] font-mono text-[10px] border border-[#D97706]/20">
                          {item.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 font-mono text-[10px] flex items-center space-x-1">
                          <Flame className="w-3 h-3 text-rose-400" />
                          <span>{item.trendingPlatform}</span>
                        </span>
                      </div>
                      <h3 className="text-sm font-serif font-bold text-[#E2E8F0] line-clamp-2">{item.title}</h3>
                    </div>
                  </div>

                  {/* Overall Score Badge */}
                  <div className="text-center shrink-0 p-2.5 rounded-lg bg-[#151517] border border-[#1F1F21]">
                    <div className="text-[10px] text-[#64748B] font-mono">OVERALL</div>
                    <div className="text-lg font-bold text-[#D97706] font-mono">
                      {item.overallScore}
                      <span className="text-[10px] text-[#64748B]">/100</span>
                    </div>
                  </div>
                </div>

                {/* Algorithmic Scoring breakdown */}
                <div className="grid grid-cols-5 gap-2 pt-4 text-center">
                  <div className="p-2 rounded-lg bg-[#151517] border border-[#1F1F21]">
                    <div className="text-[9px] text-[#64748B] font-mono">DEMAND</div>
                    <div className="text-xs font-bold text-emerald-400 font-mono">{item.demandScore}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#151517] border border-[#1F1F21]">
                    <div className="text-[9px] text-[#64748B] font-mono">COMPETITION</div>
                    <div className="text-xs font-bold text-amber-400 font-mono">{item.competitionScore}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#151517] border border-[#1F1F21]">
                    <div className="text-[9px] text-[#64748B] font-mono">SATURATION</div>
                    <div className="text-xs font-bold text-[#E2E8F0] font-mono">{item.saturationIndex}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#151517] border border-[#1F1F21]">
                    <div className="text-[9px] text-[#64748B] font-mono">PROFIT POT.</div>
                    <div className="text-xs font-bold text-[#D97706] font-mono">{item.profitPotential}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#151517] border border-[#1F1F21]">
                    <div className="text-[9px] text-[#64748B] font-mono">RISK SCORE</div>
                    <div className={`text-xs font-bold font-mono ${item.riskScore > 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {item.riskScore}
                    </div>
                  </div>
                </div>

                {/* Economics Preview */}
                <div className="p-3 mt-3 rounded-lg bg-[#151517] border border-[#1F1F21] grid grid-cols-4 gap-2 text-center text-xs">
                  <div>
                    <div className="text-[10px] text-[#64748B] font-mono">EST. COST</div>
                    <div className="font-semibold text-[#94A3B8] font-mono">${item.estimatedCost.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#64748B] font-mono">SHIPPING</div>
                    <div className="font-semibold text-[#94A3B8] font-mono">${item.estimatedShipping.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#64748B] font-mono">SELLING PRICE</div>
                    <div className="font-bold text-[#D97706] font-mono">${item.estimatedSellingPrice.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#64748B] font-mono">EST. PROFIT</div>
                    <div className="font-bold text-emerald-400 font-mono">+${item.estimatedNetProfit.toFixed(2)}</div>
                  </div>
                </div>

                {/* AI Rationale Notes */}
                <p className="text-xs text-[#94A3B8] mt-3 leading-relaxed">
                  <span className="text-[#E2E8F0] font-medium">Why it's winning:</span> {item.notes}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-[#1F1F21] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#64748B]">
                  Status: {item.verificationStatus.replace(/_/g, ' ')}
                </span>

                <button
                  id={`import-product-${item.id}`}
                  onClick={() => handleImport(item)}
                  disabled={isImported}
                  className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    isImported
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 cursor-default'
                      : 'bg-[#D97706] hover:bg-[#B45309] text-black shadow-md shadow-[#D97706]/20'
                  }`}
                >
                  {isImported ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Imported to Catalog</span>
                    </>
                  ) : (
                    <>
                      <span>Import to Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
