import React from 'react';
import {
  PieChart,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Truck,
  Activity,
  Calendar,
} from 'lucide-react';
import { Order, Product } from '../../types';

interface AnalyticsDashboardProps {
  orders: Order[];
  products: Product[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ orders, products }) => {
  const paidOrders = orders.filter((o) => o.paymentStatus === 'PAID');
  const totalGross = paidOrders.reduce((acc, o) => acc + o.totalRevenue, 0);
  const totalCost = paidOrders.reduce((acc, o) => acc + o.supplierCost, 0);
  const totalShipping = paidOrders.reduce((acc, o) => acc + o.shippingCost, 0);
  const totalFees = paidOrders.reduce((acc, o) => acc + o.platformFee, 0);
  const totalNet = paidOrders.reduce((acc, o) => acc + o.netProfit, 0);
  const avgMargin = totalGross > 0 ? (totalNet / totalGross) * 100 : 0;

  // Top products by sales
  const sortedProducts = [...products].sort((a, b) => b.salesLast30Days - a.salesLast30Days);

  return (
    <div id="analytics-dashboard-container" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
            Financial Analytics & Business Intelligence
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Realized P&L, carrier transit times, product contribution margins, and marketing CAC efficiency.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs text-[#94A3B8] bg-[#111113] border border-[#1F1F21] px-3 py-1.5 rounded-lg">
          <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Trailing 30 Days (Consolidated)</span>
        </div>
      </div>

      {/* P&L Breakdown Summary Bar */}
      <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1F1F21] pb-3">
          <span className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider">
            Consolidated Dropshipping P&L Ledger
          </span>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            Average Net Margin: {avgMargin.toFixed(1)}%
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-lg bg-[#151517] border border-[#1F1F21]">
            <div className="text-[10px] font-mono text-[#64748B]">GROSS SALES</div>
            <div className="text-base font-bold text-white font-mono mt-0.5">
              ${totalGross.toFixed(2)}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#151517] border border-[#1F1F21]">
            <div className="text-[10px] font-mono text-[#64748B]">WHOLESALE COGS</div>
            <div className="text-base font-bold text-[#94A3B8] font-mono mt-0.5">
              -${totalCost.toFixed(2)}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#151517] border border-[#1F1F21]">
            <div className="text-[10px] font-mono text-[#64748B]">SHIPPING EXPENSE</div>
            <div className="text-base font-bold text-[#94A3B8] font-mono mt-0.5">
              -${totalShipping.toFixed(2)}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#151517] border border-[#1F1F21]">
            <div className="text-[10px] font-mono text-[#64748B]">GATEWAY & APPS</div>
            <div className="text-base font-bold text-[#94A3B8] font-mono mt-0.5">
              -${totalFees.toFixed(2)}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#151517] border border-emerald-500/40 col-span-2 sm:col-span-1">
            <div className="text-[10px] font-mono text-emerald-400 font-bold">NET TAKE-HOME</div>
            <div className="text-base font-black text-emerald-400 font-mono mt-0.5">
              +${totalNet.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Visual percentage distribution bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-[11px] font-mono text-[#94A3B8]">
            <span>Capital Allocation</span>
            <span>Net Margin: {avgMargin.toFixed(0)}%</span>
          </div>
          <div className="h-3 w-full bg-[#151517] rounded-full overflow-hidden flex border border-[#1F1F21]">
            <div style={{ width: '32%' }} className="bg-[#D97706]" title="Wholesale COGS (32%)" />
            <div style={{ width: '12%' }} className="bg-slate-500" title="Shipping (12%)" />
            <div style={{ width: '6%' }} className="bg-amber-600" title="Payment Fees (6%)" />
            <div style={{ width: '50%' }} className="bg-emerald-500" title="Net Profit (50%)" />
          </div>
          <div className="flex flex-wrap gap-4 text-[10px] font-mono text-[#64748B] pt-1">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#D97706]" />
              <span>COGS</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              <span>Carrier Shipping</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              <span>Payment Fees</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Net Profit</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Product Performers */}
        <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-4">
          <h3 className="text-sm font-serif font-bold text-white">Top Revenue Generators</h3>

          <div className="space-y-3">
            {sortedProducts.map((prod, idx) => (
              <div
                key={prod.id}
                className="p-3.5 rounded-lg bg-[#151517] border border-[#1F1F21] flex items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3 truncate">
                  <span className="text-xs font-mono font-bold text-[#D97706] w-5">#{idx + 1}</span>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-[#E2E8F0] truncate">{prod.title}</div>
                    <div className="text-[10px] text-[#64748B] font-mono">
                      {prod.salesLast30Days} units sold • {prod.marginPct.toFixed(0)}% Margin
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono shrink-0">
                  <div className="text-xs font-bold text-emerald-400">
                    +${(prod.salesLast30Days * prod.netProfit).toFixed(2)}
                  </div>
                  <div className="text-[10px] text-[#64748B]">Net Contrib.</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carrier Performance & Delivery Reliability */}
        <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-4">
          <h3 className="text-sm font-serif font-bold text-white">Fulfillment & Carrier Speed</h3>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#151517] border border-[#1F1F21] space-y-2 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-[#E2E8F0]">USPS Domestic Express</span>
                <span className="text-emerald-400 font-bold">2.4 Days Avg</span>
              </div>
              <div className="h-1.5 bg-[#111113] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-[95%]" />
              </div>
              <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
                <span>99.2% on-time delivery rate</span>
                <span>CJ Direct Fulfillment</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#151517] border border-[#1F1F21] space-y-2 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-[#E2E8F0]">YunExpress Standard Global</span>
                <span className="text-[#D97706] font-bold">7.8 Days Avg</span>
              </div>
              <div className="h-1.5 bg-[#111113] rounded-full overflow-hidden">
                <div className="h-full bg-[#D97706] w-[84%]" />
              </div>
              <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
                <span>94.5% on-time delivery rate</span>
                <span>Shenzhen Apex Hub</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#151517] border border-[#1F1F21] space-y-2 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-[#E2E8F0]">AliExpress Standard Shipping</span>
                <span className="text-amber-400 font-bold">11.2 Days Avg</span>
              </div>
              <div className="h-1.5 bg-[#111113] rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 w-[78%]" />
              </div>
              <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
                <span>88.1% on-time delivery rate</span>
                <span>Global Transit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
