import React from 'react';
import {
  Boxes,
  AlertTriangle,
  Sparkles,
  TrendingDown,
  ArrowRight,
  ShieldAlert,
  Percent,
  RefreshCw,
} from 'lucide-react';
import { Product } from '../../types';

interface DeadStockManagerProps {
  products: Product[];
  onApplyAIAction?: (productId: string, action: string) => void;
}

export const DeadStockManager: React.FC<DeadStockManagerProps> = ({ products, onApplyAIAction }) => {
  // Identify low-performing or dead stock (< 20 sales last 30 days)
  const deadStockItems = products.filter((p) => p.salesLast30Days < 25);
  const healthyItems = products.filter((p) => p.salesLast30Days >= 25);

  return (
    <div id="dead-stock-manager-container" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
            Inventory Governance & Dead-Stock Recovery
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Real-time supplier inventory sync, stock velocity scoring, and automated inventory clearance strategies.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs text-[#D97706] bg-[#D97706]/10 border border-[#D97706]/30 px-3 py-1.5 rounded-lg">
          <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
          <span>{deadStockItems.length} Products Need Liquidation</span>
        </div>
      </div>

      {/* Dead Stock Recommendations Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-serif font-bold text-[#E2E8F0]">
          Detected Slow-Moving & Dead Inventory
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {deadStockItems.map((prod) => (
            <div
              key={prod.id}
              className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-4 shadow-sm hover:border-[#2D2D30] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <img
                      src={prod.imageUrl}
                      alt={prod.title}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-lg object-cover border border-[#1F1F21] shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-mono text-[#64748B]">{prod.sku}</span>
                      <h3 className="text-sm font-serif font-bold text-[#E2E8F0] line-clamp-1">{prod.title}</h3>
                      <div className="text-xs text-rose-400 font-mono mt-0.5 flex items-center space-x-1">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>Only {prod.salesLast30Days} units sold in last 30d</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/30 shrink-0">
                    Velocity: Slow
                  </span>
                </div>

                {/* AI Clearance Prescription */}
                <div className="p-3.5 rounded-lg bg-[#151517] border border-[#1F1F21] space-y-2 text-xs">
                  <div className="flex items-center space-x-1.5 text-[#D97706] font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>DropAI Clearance Recommendation</span>
                  </div>
                  <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                    Product velocity has declined 40%. Suggested remedy: Apply automated 20% flash discount and bundle as an upsell at checkout with top-selling "Ultrasonic Facial Sculptor".
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#1F1F21] flex items-center justify-between">
                <span className="text-xs font-mono text-[#94A3B8]">
                  Current Retail: <span className="text-[#E2E8F0]">${prod.sellingPrice.toFixed(2)}</span>
                </span>

                <button
                  onClick={() => alert(`Cleared: Applied 20% flash discount to ${prod.title} on Shopify store.`)}
                  className="px-4 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-black font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-[#D97706]/20 cursor-pointer"
                >
                  <Percent className="w-3.5 h-3.5 text-black" />
                  <span>Execute Flash Clearance</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
