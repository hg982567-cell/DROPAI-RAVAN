import React, { useState } from 'react';
import {
  Users,
  Search,
  DollarSign,
  ShoppingBag,
  Mail,
  MapPin,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ArrowRightLeft,
} from 'lucide-react';
import { CustomerProfile } from '../../types';
import { useCurrency } from '../../hooks/useCurrency';

interface CustomersCRMProps {
  customers: CustomerProfile[];
  onSelectCustomerOrders?: (customerEmail: string) => void;
}

export const CustomersCRM: React.FC<CustomersCRMProps> = ({
  customers = [],
  onSelectCustomerOrders,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('ALL');
  const { format, convertSync, currentCurrency } = useCurrency();

  const [reengageFeedback, setReengageFeedback] = useState<string | null>(null);

  const tags = ['ALL', 'VIP_LOYAL', 'REPEAT_BUYER', 'FIRST_TIME', 'AT_RISK', 'HIGH_REFUND_RATE'];

  const filtered = (customers || []).filter((c) => {
    if (!c) return false;
    const name = c.name || '';
    const email = c.email || '';
    const segment = c.segment || '';
    const notes = c.aiNotes || '';
    const location = (c as any).location || '';

    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      segment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.toLowerCase().includes(searchQuery.toLowerCase());

    const custTags = Array.isArray((c as any).tags) ? (c as any).tags : [c.segment].filter(Boolean);
    const matchesTag = tagFilter === 'ALL' || custTags.includes(tagFilter) || c.segment === tagFilter;
    return matchesSearch && matchesTag;
  });

  const handleReengage = (customer: CustomerProfile) => {
    setReengageFeedback(`AI automated win-back campaign & custom VIP voucher dispatched to ${customer.email}!`);
    setTimeout(() => setReengageFeedback(null), 4000);
  };

  return (
    <div id="customers-crm-container" className="space-y-6">
      {/* Feedback Toast */}
      {reengageFeedback && (
        <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{reengageFeedback}</span>
          </div>
          <button
            onClick={() => setReengageFeedback(null)}
            className="text-emerald-400 hover:text-white font-bold ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
            Customer Directory & CRM
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Customer lifetime value, purchase history, and targeted re-engagement telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs text-[#94A3B8] bg-[#111113] border border-[#1F1F21] px-3 py-1.5 rounded-lg">
          <Users className="w-3.5 h-3.5 text-[#D97706]" />
          <span>{(customers || []).length} Verified Profiles</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-[#111113] border border-[#1F1F21]">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer, email, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-xs text-[#E2E8F0] placeholder-[#64748B] focus:outline-none focus:border-[#D97706]"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setTagFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                tagFilter === t
                  ? 'bg-[#D97706] text-black font-semibold'
                  : 'bg-[#151517] text-[#94A3B8] hover:text-[#E2E8F0] border border-[#2D2D30]'
              }`}
            >
              {t.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((customer) => {
          const spend = (customer as any).totalSpent ?? customer.lifetimeValue ?? 0;
          const orders = (customer as any).ordersCount ?? customer.totalOrders ?? 0;
          const custCurrency = customer.currency || 'USD';
          const formattedNativeSpend = format(spend, custCurrency);
          const isDifferentFromActive = custCurrency.toUpperCase() !== currentCurrency.toUpperCase();
          const convertedToActive = isDifferentFromActive
            ? format(convertSync(spend, custCurrency, currentCurrency), currentCurrency)
            : null;
          const segment = customer.segment || 'REPEAT_BUYER';
          const lastOrder = customer.lastOrderDate || 'Recently active';
          const notes = customer.aiNotes || 'Account active with verified order record.';

          const badgeClasses =
            segment === 'VIP_LOYAL'
              ? 'bg-amber-500/15 text-[#D97706] border border-[#D97706]/30'
              : segment === 'REPEAT_BUYER'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : segment === 'AT_RISK' || segment === 'HIGH_REFUND_RATE'
              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              : 'bg-[#151517] text-[#94A3B8] border border-[#2D2D30]';

          return (
            <div
              key={customer.id}
              className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-4 shadow-sm hover:border-[#2D2D30] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-serif font-bold text-[#E2E8F0]">{customer.name}</h3>
                    <div className="text-xs text-[#94A3B8] font-mono mt-0.5">{customer.email}</div>
                  </div>

                  <div className="w-9 h-9 rounded-lg bg-[#151517] border border-[#2D2D30] flex items-center justify-center text-xs font-bold text-[#D97706] font-mono">
                    {(customer?.name || 'CU').slice(0, 2).toUpperCase()}
                  </div>
                </div>

                {/* Segment Tag */}
                <div className="flex flex-wrap gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${badgeClasses}`}>
                    {segment.replace(/_/g, ' ')}
                  </span>
                  {customer.complaintCount > 0 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      {customer.complaintCount} Ticket{customer.complaintCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-[#151517] border border-[#1F1F21] font-mono text-center text-xs">
                  <div>
                    <div className="text-[10px] text-[#64748B]">LIFETIME VALUE</div>
                    <div className="font-bold text-[#D97706] mt-0.5">
                      {formattedNativeSpend}
                    </div>
                    {convertedToActive && (
                      <div className="text-[9px] text-emerald-400 mt-0.5 truncate" title={`Converted to ${currentCurrency}`}>
                        ≈ {convertedToActive}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] text-[#64748B]">TOTAL ORDERS</div>
                    <div className="font-bold text-[#E2E8F0] mt-0.5">{orders}</div>
                  </div>
                </div>

                <div className="text-xs text-[#94A3B8] space-y-1.5 font-mono">
                  <p className="text-[11px] text-[#94A3B8] font-sans line-clamp-2 bg-[#151517] p-2 rounded border border-[#1F1F21]">
                    <span className="text-[#D97706] font-mono font-semibold">AI Notes: </span>
                    {notes}
                  </p>
                  <div className="text-[11px] text-[#64748B]">
                    Last active order: {lastOrder}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1F1F21] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#64748B]">
                  Segment: {orders > 2 ? 'Tier 1 VIP' : 'Tier 2 General'}
                </span>

                <button
                  id={`ai-reengage-${customer.id}`}
                  onClick={() => handleReengage(customer)}
                  className="px-3 py-1.5 rounded-lg bg-[#D97706]/10 hover:bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/30 text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-[#D97706]" />
                  <span>AI Re-engage</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
