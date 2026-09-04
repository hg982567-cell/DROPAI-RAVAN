import React from 'react';
import {
  X,
  Truck,
  DollarSign,
  User,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Order, OrderLifecycleStage } from '../../types';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onUpdateStage: (newStage: OrderLifecycleStage) => void;
  onOpenAICopilot: (orderNumber: string) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onUpdateStage,
  onOpenAICopilot,
}) => {
  const stages: OrderLifecycleStage[] = [
    'RECEIVED',
    'VALIDATED',
    'SUPPLIER_DISPATCHED',
    'SHIPPED',
    'IN_TRANSIT',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
  ];

  const currentStageIndex = stages.indexOf(order.orderLifecycle);

  const formatAddress = (addr: Order['shippingAddress']) => {
    if (typeof addr === 'string') return addr;
    return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}, ${addr.country}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0B]/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-6 shadow-2xl my-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#1F1F21] pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-serif font-bold text-white">{order.orderNumber}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#D97706]/15 text-[#D97706] text-xs font-mono border border-[#D97706]/30">
                {order.storeName}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#151517] border border-[#2D2D30] text-[#94A3B8] text-[10px] font-mono">
                Stripe Direct
              </span>
            </div>
            <p className="text-xs text-[#64748B] font-mono">Placed on {order.createdAt}</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenAICopilot(order.orderNumber)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#D97706]/15 hover:bg-[#D97706]/25 text-[#D97706] border border-[#D97706]/30 text-xs font-medium cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              <span>AI Support Copilot</span>
            </button>

            <button onClick={onClose} className="p-1 rounded-lg bg-[#151517] text-[#94A3B8] hover:text-[#E2E8F0] border border-[#2D2D30] cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visual Lifecycle Stepper */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">
            Order Fulfillment Pipeline
          </div>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-1.5">
            {stages.map((st, i) => {
              const isPast = currentStageIndex >= i;
              const isCurrent = currentStageIndex === i;
              return (
                <div
                  key={st}
                  className={`p-2 rounded-lg text-center border transition-all ${
                    isCurrent
                      ? 'bg-[#D97706]/20 border-[#D97706] text-[#D97706] font-bold shadow-sm'
                      : isPast
                      ? 'bg-[#151517] border-[#1F1F21] text-[#E2E8F0]'
                      : 'bg-[#0A0A0B]/60 border-[#1F1F21]/40 text-[#64748B]'
                  }`}
                >
                  <div className="text-[9px] font-mono truncate">
                    {st.replace(/_/g, ' ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Customer & Shipping Details */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#151517] border border-[#1F1F21] space-y-2">
              <div className="flex items-center space-x-2 text-[#E2E8F0] font-bold">
                <User className="w-4 h-4 text-[#D97706]" />
                <span>Customer Profile</span>
              </div>
              <div className="space-y-1 text-[#94A3B8]">
                <div className="font-semibold text-[#E2E8F0]">{order.customerName}</div>
                <div>{order.customerEmail}</div>
                {order.customerPhone && <div className="text-[11px] font-mono">{order.customerPhone}</div>}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#151517] border border-[#1F1F21] space-y-2">
              <div className="flex items-center space-x-2 text-[#E2E8F0] font-bold">
                <MapPin className="w-4 h-4 text-[#D97706]" />
                <span>Shipping Destination</span>
              </div>
              <p className="text-[#94A3B8] leading-relaxed font-mono text-[11px]">
                {formatAddress(order.shippingAddress)}
              </p>

              <div className="pt-2 border-t border-[#1F1F21] flex justify-between font-mono text-[11px]">
                <span className="text-[#64748B]">Carrier:</span>
                <span className="text-[#D97706] font-bold">{order.carrier || 'Pending Assignment'}</span>
              </div>
              {order.trackingNumber && (
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-[#64748B]">Tracking Code:</span>
                  <span className="text-[#E2E8F0]">{order.trackingNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Economics & Profit Breakdown */}
          <div className="p-4 rounded-xl bg-[#151517] border border-[#1F1F21] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#E2E8F0] flex items-center space-x-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Financial Settlement</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400">
                {order.paymentStatus}
              </span>
            </div>

            <div className="space-y-2 font-mono text-[#94A3B8] text-xs">
              <div className="flex justify-between">
                <span>Gross Customer Total:</span>
                <span className="text-white font-bold">${order.totalRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Supplier Wholesale Cost:</span>
                <span className="text-[#94A3B8]">-${order.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Carrier Shipping Fee:</span>
                <span className="text-[#94A3B8]">-${order.shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Gateway & Platform Fee:</span>
                <span className="text-[#94A3B8]">-${order.gatewayFee.toFixed(2)}</span>
              </div>

              <div className="border-t border-[#1F1F21] pt-2 flex justify-between font-bold text-emerald-400 text-sm">
                <span>Net Operating Profit:</span>
                <span>+${order.netProfit.toFixed(2)}</span>
              </div>
            </div>

            {/* Line Items */}
            <div className="pt-3 border-t border-[#1F1F21] space-y-1.5">
              <span className="text-[10px] font-mono text-[#64748B]">LINE ITEMS</span>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[#94A3B8] text-xs">
                  <span className="truncate max-w-[200px] text-[#E2E8F0]">{item.title}</span>
                  <span className="font-mono">
                    x{item.quantity} (${item.unitPrice})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1F1F21]">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-[#64748B]">Manual Stage Override:</span>
            <select
              value={order.orderLifecycle}
              onChange={(e) => onUpdateStage(e.target.value as OrderLifecycleStage)}
              className="px-2.5 py-1.5 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#E2E8F0] text-xs focus:outline-none focus:border-[#D97706]"
            >
              {stages.map((st) => (
                <option key={st} value={st}>
                  {st.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#151517] hover:bg-[#1F1F21] text-[#94A3B8] hover:text-[#E2E8F0] border border-[#2D2D30] text-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
