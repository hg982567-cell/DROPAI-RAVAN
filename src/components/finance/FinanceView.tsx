import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  ArrowRightLeft,
  Globe,
} from 'lucide-react';
import { Order } from '../../types';
import { useCurrency } from '../../hooks/useCurrency';
import { CurrencyConverterModal } from '../currency/CurrencyConverterModal';

interface FinanceViewProps {
  orders: Order[];
}

export const FinanceView: React.FC<FinanceViewProps> = ({ orders }) => {
  const [showConverter, setShowConverter] = useState(false);
  const { currentCurrency, format, convertSync, currentMeta } = useCurrency();

  const totalPaidRevenue = orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.totalRevenue, 0);

  const totalNetProfit = orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.netProfit, 0);

  const payoutBalanceUsd = totalNetProfit * 0.85;
  const merchantFeesUsd = totalPaidRevenue * 0.049;

  return (
    <div id="finance-view-container" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
              Financial Ledger & Payment Gateways
            </h1>
            <button
              onClick={() => setShowConverter(true)}
              className="px-2.5 py-1 rounded-lg bg-[#18181D] hover:bg-[#25252D] border border-[#2F2F36] hover:border-amber-500/50 text-[11px] font-mono text-amber-400 flex items-center space-x-1.5 transition cursor-pointer"
            >
              <span>{currentMeta.flag}</span>
              <span>{currentCurrency} Active</span>
              <ArrowRightLeft className="w-3 h-3 text-[#64748B]" />
            </button>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Realized cash flow, multi-currency payouts, platform transaction fees, and bank transfers.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs text-emerald-400 bg-[#111113] border border-[#1F1F21] px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Stripe Payouts: Scheduled Daily</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#94A3B8]">Available Payout Balance</span>
            <span className="text-[10px] font-mono text-[#64748B]">USD Base: ${payoutBalanceUsd.toFixed(2)}</span>
          </div>
          <div className="text-3xl font-black text-[#D97706] font-mono">
            {format(convertSync(payoutBalanceUsd, 'USD', currentCurrency), currentCurrency)}
          </div>
          <p className="text-[11px] text-[#64748B] font-mono">Next transfer scheduled tomorrow at 06:00 UTC</p>
        </div>

        <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#94A3B8]">Total Net Operating Profit</span>
            <span className="text-[10px] font-mono text-[#64748B]">USD Base: ${totalNetProfit.toFixed(2)}</span>
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {format(convertSync(totalNetProfit, 'USD', currentCurrency), currentCurrency)}
          </div>
          <p className="text-[11px] text-[#64748B] font-mono">Net of COGS, shipping, and merchant fees</p>
        </div>

        <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#94A3B8]">Merchant Fees Deducted</span>
            <span className="text-[10px] font-mono text-[#64748B]">USD Base: ${merchantFeesUsd.toFixed(2)}</span>
          </div>
          <div className="text-3xl font-black text-[#E2E8F0] font-mono">
            {format(convertSync(merchantFeesUsd, 'USD', currentCurrency), currentCurrency)}
          </div>
          <p className="text-[11px] text-[#64748B] font-mono">Stripe 2.9%+$0.30 + Shopify 2% platform fee</p>
        </div>
      </div>

      {/* Connected Gateways */}
      <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-4">
        <h2 className="text-sm font-serif font-bold text-white">Configured Payment Processors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[#151517] border border-[#1F1F21] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-[#111113] border border-[#2D2D30] text-[#D97706] flex items-center justify-center font-serif font-bold">
                S
              </div>
              <div>
                <div className="font-semibold text-[#E2E8F0] text-xs">Stripe Direct Gateway</div>
                <div className="text-[10px] text-[#64748B] font-mono">Visa, MC, Amex, Apple Pay</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">CONNECTED</span>
          </div>

          <div className="p-4 rounded-lg bg-[#151517] border border-[#1F1F21] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-[#111113] border border-[#2D2D30] text-[#D97706] flex items-center justify-center font-serif font-bold">
                P
              </div>
              <div>
                <div className="font-semibold text-[#E2E8F0] text-xs">PayPal Commerce Platform</div>
                <div className="text-[10px] text-[#64748B] font-mono">PayPal Checkout & Venmo</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">CONNECTED</span>
          </div>
        </div>
      </div>

      {/* Multi-Currency FX Converter Modal */}
      <CurrencyConverterModal
        isOpen={showConverter}
        onClose={() => setShowConverter(false)}
      />
    </div>
  );
};
