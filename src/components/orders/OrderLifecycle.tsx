import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  DollarSign,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Order, OrderLifecycleStage } from '../../types';

interface OrderLifecycleProps {
  orders: Order[];
  onOpenOrder: (order: Order) => void;
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
}

export const OrderLifecycle: React.FC<OrderLifecycleProps> = ({
  orders,
  onOpenOrder,
  onUpdateOrder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');

  const lifecycleStages = [
    'ALL',
    'RECEIVED',
    'VALIDATED',
    'SUPPLIER_DISPATCHED',
    'SHIPPED',
    'IN_TRANSIT',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'RETURN_REQUESTED',
  ];

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStage = stageFilter === 'ALL' || o.orderLifecycle === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div id="order-lifecycle-container" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
            Order Lifecycle & Automated Fulfillment
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Real-time stage tracking from customer checkout to supplier dispatch and final delivery.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs text-[#94A3B8] bg-[#111113] border border-[#1F1F21] px-3 py-1.5 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Carrier Tracking Webhook: Listening</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-[#111113] border border-[#1F1F21]">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order #, customer name, tracking #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-xs text-[#E2E8F0] placeholder-[#64748B] focus:outline-none focus:border-[#D97706]"
          />
        </div>

        {/* Stage Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {lifecycleStages.map((stage) => (
            <button
              key={stage}
              onClick={() => setStageFilter(stage)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                stageFilter === stage
                  ? 'bg-[#D97706]/15 text-[#D97706] border border-[#D97706]/30 font-semibold'
                  : 'bg-[#151517] text-[#94A3B8] hover:text-[#E2E8F0] border border-transparent'
              }`}
            >
              {stage.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl bg-[#111113] border border-[#1F1F21] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1F1F21] text-[#64748B] font-mono text-[10px] uppercase bg-[#151517] tracking-wider">
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer & Store</th>
                <th className="p-4">Lifecycle Stage</th>
                <th className="p-4">Supplier Routing</th>
                <th className="p-4">Carrier & Tracking</th>
                <th className="p-4 text-right">Revenue / Profit</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F21] text-[#94A3B8]">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => onOpenOrder(order)}
                  className="hover:bg-[#151517] cursor-pointer transition-colors"
                >
                  <td className="p-4">
                    <div className="font-mono font-bold text-[#D97706]">{order.orderNumber}</div>
                    <div className="text-[10px] text-[#64748B] font-mono mt-0.5">{order.createdAt}</div>
                  </td>

                  <td className="p-4">
                    <div className="font-semibold text-[#E2E8F0]">{order.customerName}</div>
                    <div className="text-[10px] text-[#64748B] truncate max-w-[160px]">{order.storeName}</div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-medium ${
                        order.orderLifecycle === 'DELIVERED'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : order.orderLifecycle === 'IN_TRANSIT' || order.orderLifecycle === 'SHIPPED'
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          : order.orderLifecycle === 'RETURN_REQUESTED'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {order.orderLifecycle.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="p-4 font-mono text-[11px]">
                    <div className="text-[#E2E8F0]">{order.items?.[0]?.supplierName || 'CJ Direct US'}</div>
                    <div className="text-[10px] text-[#64748B]">Auto-Dispatched</div>
                  </td>

                  <td className="p-4 font-mono text-[11px]">
                    {order.trackingNumber ? (
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1 text-[#E2E8F0]">
                          <Truck className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>{order.carrier}</span>
                        </div>
                        <div className="text-[10px] text-[#64748B]">{order.trackingNumber}</div>
                      </div>
                    ) : (
                      <span className="text-[#64748B] italic">Processing dispatch...</span>
                    )}
                  </td>

                  <td className="p-4 text-right font-mono">
                    <div className="font-bold text-[#E2E8F0]">${order.totalRevenue.toFixed(2)}</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">+${order.netProfit.toFixed(2)}</div>
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenOrder(order);
                      }}
                      className="p-1.5 rounded-lg bg-[#151517] hover:bg-[#1F1F21] text-[#94A3B8] hover:text-[#E2E8F0] border border-[#2D2D30] transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
