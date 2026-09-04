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
} from 'lucide-react';
import { CustomerProfile } from '../../types';

interface CustomersCRMProps {
  customers: CustomerProfile[];
  onSelectCustomerOrders?: (customerEmail: string) => void;
}

export const CustomersCRM: React.FC<CustomersCRMProps> = ({
  customers,
  onSelectCustomerOrders,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('ALL');

  const tags = ['ALL', 'VIP', 'REPEAT_BUYER', 'AT_RISK_DISPUTE', 'NEW'];

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = tagFilter === 'ALL' || c.tags.includes(tagFilter);
    return matchesSearch && matchesTag;
  });

  return (
    <div id="customers-crm-container" className="space-y-6">
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
          <span>{customers.length} Verified Profiles</span>
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
        {filtered.map((customer) => (
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

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {(customer.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      tag === 'VIP'
                        ? 'bg-amber-500/15 text-[#D97706] border border-[#D97706]/30'
                        : tag === 'REPEAT_BUYER'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : tag === 'AT_RISK_DISPUTE'
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        : 'bg-[#151517] text-[#94A3B8] border border-[#2D2D30]'
                    }`}
                  >
                    {tag.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-[#151517] border border-[#1F1F21] font-mono text-center text-xs">
                <div>
                  <div className="text-[10px] text-[#64748B]">TOTAL SPEND</div>
                  <div className="font-bold text-[#D97706] mt-0.5">
                    ${customer.totalSpent.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#64748B]">LIFETIME ORDERS</div>
                  <div className="font-bold text-[#E2E8F0] mt-0.5">{customer.ordersCount}</div>
                </div>
              </div>

              <div className="text-xs text-[#94A3B8] space-y-1 font-mono">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
                  <span className="truncate">{customer.location}</span>
                </div>
                <div className="text-[11px] text-[#64748B]">
                  Last active purchase: {customer.lastOrderDate}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1F1F21] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#64748B]">
                Segment: Tier {customer.ordersCount > 2 ? '1' : '2'}
              </span>

              <button
                onClick={() => alert(`Triggered AI win-back offer email to ${customer.email}`)}
                className="px-3 py-1.5 rounded-lg bg-[#D97706]/10 hover:bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/30 text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#D97706]" />
                <span>AI Re-engage</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
