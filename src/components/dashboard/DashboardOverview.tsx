import React from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  Zap,
  ArrowUpRight,
  Truck,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Product, Order, Supplier, AutomationWorkflow, StoreIntegration } from '../../types';

interface DashboardOverviewProps {
  products?: Product[];
  orders?: Order[];
  suppliers?: Supplier[];
  workflows?: AutomationWorkflow[];
  stores?: StoreIntegration[];
  onNavigate: (view: string) => void;
  onOpenOrder?: (order: Order) => void;
  onOpenProductModal?: (product: Product) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  products = [],
  orders = [],
  suppliers = [],
  workflows = [],
  stores = [],
  onNavigate,
  onOpenOrder = (_order: Order) => {},
  onOpenProductModal,
}) => {
  // Aggregate real financial KPIs
  const safeOrders = orders || [];
  const safeProducts = products || [];
  const safeStores = stores || [];
  const safeWorkflows = workflows || [];

  const totalRevenue = safeOrders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.totalRevenue : 0), 0);
  const totalNetProfit = safeOrders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.netProfit : 0), 0);
  const paidOrders = safeOrders.filter((o) => o.paymentStatus === 'PAID');
  const avgOrderValue = paidOrders.length ? totalRevenue / paidOrders.length : 0;
  const avgMarginPct = totalRevenue > 0 ? (totalNetProfit / totalRevenue) * 100 : 0;

  // Inventory stats
  const lowStockItems = safeProducts.filter((p) => p.stockTotal <= p.lowStockThreshold);

  return (
    <div id="dashboard-overview-container" className="space-y-6">
      {/* Top Welcome / AI Operating Banner */}
      <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2.5">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#D97706]/15 border border-[#D97706]/30 text-[#D97706] uppercase tracking-wider font-semibold">
              SYSTEM ONLINE
            </span>
            <span className="text-xs text-[#64748B] font-mono">• 2 Connected Stores Synced</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
            E-Commerce Command Dashboard
          </h1>
          <p className="text-xs text-[#94A3B8] max-w-2xl">
            Real-time multi-channel dropshipping automation, autonomous supplier routing, and AI margin governance.
          </p>
        </div>

        <button
          id="dashboard-open-ai-command-btn"
          onClick={() => onNavigate('command')}
          className="px-5 py-2.5 rounded-lg bg-[#D97706] text-black font-bold text-xs flex items-center space-x-2 hover:bg-[#B45309] transition-all shadow-md shadow-[#D97706]/20 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>Launch AI Command Center</span>
        </button>
      </div>

      {/* KPI Cards Grid - Sophisticated Dark Serif metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-5 space-y-2 hover:border-[#2D2D30] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">Gross Revenue</span>
            <div className="p-1.5 rounded-md bg-[#151517] border border-[#1F1F21] text-[#D97706]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-serif text-white tracking-tight">
              ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center space-x-1.5 text-emerald-400 text-xs mt-1 font-mono">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+24.6% vs last week</span>
            </div>
          </div>
        </div>

        {/* Net Profit & Margin */}
        <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-5 space-y-2 hover:border-[#2D2D30] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">Net Profit (Post-Fees)</span>
            <div className="p-1.5 rounded-md bg-[#151517] border border-[#1F1F21] text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-serif text-white tracking-tight">
              ${totalNetProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-[#94A3B8] mt-1 flex items-center space-x-2">
              <span className="font-mono text-emerald-400 font-bold">{avgMarginPct.toFixed(1)}%</span>
              <span>avg profit margin</span>
            </div>
          </div>
        </div>

        {/* Total Orders & AOV */}
        <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-5 space-y-2 hover:border-[#2D2D30] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">Active Orders</span>
            <div className="p-1.5 rounded-md bg-[#151517] border border-[#1F1F21] text-[#94A3B8]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-serif text-white tracking-tight">
              {safeOrders.length}
            </div>
            <div className="text-xs text-[#94A3B8] mt-1 font-mono">
              AOV: ${avgOrderValue.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Active AI Agent Status Card (Highlighted in Theme) */}
        <div className="rounded-xl bg-[#111113] border border-[#D97706]/40 p-5 space-y-2 hover:border-[#D97706]/70 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#D97706] uppercase tracking-wider font-semibold flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
              <span>Catalog & Health</span>
            </span>
            <div className="p-1.5 rounded-md bg-[#D97706]/15 text-[#D97706]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-serif text-white tracking-tight">
              {safeProducts.length} Products
            </div>
            <div className="text-xs mt-1">
              {lowStockItems.length > 0 ? (
                <span className="text-amber-400 flex items-center space-x-1 font-medium">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{lowStockItems.length} low stock threshold</span>
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center space-x-1 font-mono">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Stock healthy across suppliers</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Insights & Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Insights & Supplier Alerts */}
          <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <h3 className="text-sm font-semibold text-[#E2E8F0]">DropAI Live Business Insights</h3>
              </div>
              <span className="text-[10px] font-mono text-[#64748B]">Updated 5m ago</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-[#151517] border border-[#1F1F21] space-y-2">
                <div className="text-xs font-semibold text-emerald-400 flex items-center space-x-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Winning Product Momentum</span>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  "Ultrasonic Facial Sculptor" achieved 58% net margin with 142 orders last month. Recommended: scale TikTok ad budget by 15%.
                </p>
                <button
                  onClick={() => onNavigate('marketing')}
                  className="text-[11px] text-[#D97706] hover:underline flex items-center space-x-1 pt-1 cursor-pointer font-medium"
                >
                  <span>Generate TikTok Ad Copy</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-4 rounded-lg bg-[#151517] border border-[#1F1F21] space-y-2">
                <div className="text-xs font-semibold text-[#D97706] flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Supplier Stock Warning</span>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  MagSafe Laptop Phone Mount stock in CJ Direct is at 18 units. Active automation is ready to failover to backup supplier Shenzhen Apex.
                </p>
                <button
                  onClick={() => onNavigate('suppliers')}
                  className="text-[11px] text-[#D97706] hover:underline flex items-center space-x-1 pt-1 cursor-pointer font-medium"
                >
                  <span>Manage Supplier Routing</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4 text-[#D97706]" />
                <h3 className="text-sm font-semibold text-[#E2E8F0]">Recent Customer Orders</h3>
              </div>
              <button
                onClick={() => onNavigate('orders')}
                className="text-xs text-[#D97706] hover:underline font-medium cursor-pointer"
              >
                View all {safeOrders.length} orders →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1F1F21] text-[#64748B] font-mono text-[10px] uppercase tracking-wider">
                    <th className="pb-2.5">Order ID</th>
                    <th className="pb-2.5">Customer</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5">Carrier / Tracking</th>
                    <th className="pb-2.5 text-right">Revenue</th>
                    <th className="pb-2.5 text-right">Net Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1F21] text-[#94A3B8]">
                  {safeOrders.slice(0, 4).map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => onOpenOrder(order)}
                      className="hover:bg-[#151517] cursor-pointer transition-colors"
                    >
                      <td className="py-3 font-mono text-[#D97706] font-semibold">
                        {order.orderNumber}
                      </td>
                      <td className="py-3">
                        <div className="font-medium text-[#E2E8F0]">{order.customerName}</div>
                        <div className="text-[10px] text-[#64748B] truncate max-w-[140px]">{order.storeName}</div>
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            order.orderLifecycle === 'DELIVERED'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                              : order.orderLifecycle === 'IN_TRANSIT' || order.orderLifecycle === 'SHIPPED'
                              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                              : order.orderLifecycle === 'RETURN_REQUESTED'
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {order.orderLifecycle.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-[11px] text-[#94A3B8]">
                        {order.carrier ? (
                          <div className="flex items-center space-x-1 truncate max-w-[160px]">
                            <Truck className="w-3 h-3 text-[#D97706] shrink-0" />
                            <span className="truncate">{order.carrier}</span>
                          </div>
                        ) : (
                          <span className="text-[#64748B]">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 text-right font-mono font-medium text-[#E2E8F0]">
                        ${order.totalRevenue.toFixed(2)}
                      </td>
                      <td className="py-3 text-right font-mono font-semibold text-emerald-400">
                        +${order.netProfit.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Store Health & Automation Activity */}
        <div className="space-y-6">
          {/* Multi-Channel Store Integrations */}
          <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#E2E8F0]">Connected Channels</h3>
              <button
                onClick={() => onNavigate('stores')}
                className="text-xs text-[#D97706] hover:underline cursor-pointer"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2.5">
              {safeStores.slice(0, 3).map((st) => (
                <div
                  key={st.id}
                  className="p-3 rounded-lg bg-[#151517] border border-[#1F1F21] flex items-center justify-between"
                >
                  <div className="space-y-0.5 truncate mr-2">
                    <div className="text-xs font-semibold text-[#E2E8F0] truncate">{st.name}</div>
                    <div className="text-[10px] text-[#64748B] font-mono">
                      {st.platform} • {st.productsCount} items
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 ${
                      st.status === 'CONNECTED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-[#1F1F21] text-[#64748B]'
                    }`}
                  >
                    {st.status === 'CONNECTED' ? 'Synced' : 'Unconfigured'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Autonomous Workflows Activity */}
          <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-[#D97706]" />
                <h3 className="text-sm font-semibold text-[#E2E8F0]">Automation Engine</h3>
              </div>
              <button
                onClick={() => onNavigate('workflows')}
                className="text-xs text-[#D97706] hover:underline cursor-pointer"
              >
                Builder
              </button>
            </div>

            <div className="space-y-2.5">
              {safeWorkflows.map((wf) => (
                <div
                  key={wf.id}
                  className="p-3 rounded-lg bg-[#151517] border border-[#1F1F21] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#E2E8F0]">{wf.name}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        wf.isActive ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-slate-600'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-[#94A3B8] leading-relaxed">{wf.description}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] pt-1">
                    <span>Fired: {wf.executionCount} times</span>
                    <span>{wf.lastExecutedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
