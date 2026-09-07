import React, { useState, useEffect, useMemo } from 'react';
import {
  DollarSign,
  ArrowRightLeft,
  RefreshCw,
  TrendingUp,
  Settings2,
  Check,
  Globe,
  Zap,
  Sliders,
  X,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { useCurrency } from '../../hooks/useCurrency';
import { currencyService, MockExchangeRateProvider } from '../../services/currencyService';

interface CurrencyConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CurrencyConverterModal: React.FC<CurrencyConverterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentCurrency,
    setCurrency,
    baseCurrency,
    currencies,
    format,
    convertSync,
    getRateSync,
    simulateFluctuation,
    lastUpdated,
  } = useCurrency();

  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [amountInput, setAmountInput] = useState<string>('100');
  const [activeTab, setActiveTab] = useState<'convert' | 'rates' | 'simulate'>('convert');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [customRateFrom, setCustomRateFrom] = useState<string>('USD');
  const [customRateTo, setCustomRateTo] = useState<string>('INR');
  const [customRateValue, setCustomRateValue] = useState<string>('86.85');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync initial To currency with user's current currency if different
  useEffect(() => {
    if (currentCurrency && currentCurrency !== fromCurrency) {
      setToCurrency(currentCurrency);
    }
  }, [currentCurrency]);

  const numAmount = parseFloat(amountInput) || 0;
  const convertedAmount = useMemo(() => {
    return convertSync(numAmount, fromCurrency, toCurrency);
  }, [numAmount, fromCurrency, toCurrency, convertSync, lastUpdated]);

  const currentRate = useMemo(() => {
    return getRateSync(fromCurrency, toCurrency);
  }, [fromCurrency, toCurrency, getRateSync, lastUpdated]);

  const inverseRate = currentRate > 0 ? 1 / currentRate : 0;

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleApplyAsDefault = (code: string) => {
    setCurrency(code);
    setToastMessage(`Default currency updated to ${code}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSimulateFluctuation = () => {
    setIsSimulating(true);
    simulateFluctuation(1.2);
    setToastMessage('Simulated FX market fluctuation applied to rates');
    setTimeout(() => {
      setIsSimulating(false);
      setTimeout(() => setToastMessage(null), 3000);
    }, 400);
  };

  const handleSetCustomMockRate = () => {
    const rateVal = parseFloat(customRateValue);
    if (!rateVal || rateVal <= 0) return;

    const provider = currencyService.getProvider();
    if (provider instanceof MockExchangeRateProvider) {
      provider.setMockRate(customRateFrom, customRateTo, rateVal);
      currencyService.clearCache();
      setToastMessage(`Mock rate set: 1 ${customRateFrom} = ${rateVal} ${customRateTo}`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleResetRates = () => {
    const provider = currencyService.getProvider();
    if (provider instanceof MockExchangeRateProvider) {
      provider.resetRates();
      currencyService.clearCache();
      setToastMessage('Exchange rates reset to default baseline');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0B]/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-[#111113] border border-[#26262B] shadow-2xl p-6 space-y-5 text-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1F1F21] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-serif font-bold text-white">
                  Multi-Currency Exchange Service
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  MockExchangeRateProvider
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Real-time triangular forex conversion, multi-currency pricing, and custom mock rates.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs flex items-center justify-between shadow-md animate-in fade-in duration-150">
            <span className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </span>
            <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-[#1F1F21] pb-2">
          <button
            onClick={() => setActiveTab('convert')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'convert'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Interactive Converter</span>
          </button>

          <button
            onClick={() => setActiveTab('rates')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'rates'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Rates Board</span>
          </button>

          <button
            onClick={() => setActiveTab('simulate')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'simulate'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Provider Control</span>
          </button>
        </div>

        {/* Tab 1: Interactive Converter */}
        {activeTab === 'convert' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 items-center">
              {/* From input */}
              <div className="sm:col-span-3 space-y-1.5">
                <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">
                  Amount & From Currency
                </label>
                <div className="flex rounded-xl bg-[#161619] border border-[#2D2D35] focus-within:border-amber-500/60 overflow-hidden">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full bg-transparent px-3 py-2.5 text-sm font-mono text-white focus:outline-none"
                    placeholder="0.00"
                  />
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="bg-[#1F1F24] border-l border-[#2D2D35] px-3 py-2 text-xs font-mono font-bold text-amber-400 focus:outline-none cursor-pointer"
                  >
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="sm:col-span-1 flex justify-center pt-5">
                <button
                  type="button"
                  onClick={handleSwapCurrencies}
                  className="p-2.5 rounded-xl bg-[#1A1A1E] hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 border border-[#2E2E36] hover:border-amber-500/40 transition cursor-pointer"
                  title="Swap Currencies"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* To input / result */}
              <div className="sm:col-span-3 space-y-1.5">
                <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">
                  Converted Result ({toCurrency})
                </label>
                <div className="flex rounded-xl bg-[#161619] border border-[#2D2D35] overflow-hidden items-center justify-between">
                  <div className="px-3 py-2.5 text-sm font-mono font-bold text-emerald-400 truncate">
                    {format(convertedAmount, toCurrency)}
                  </div>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="bg-[#1F1F24] border-l border-[#2D2D35] px-3 py-2 text-xs font-mono font-bold text-emerald-400 focus:outline-none cursor-pointer"
                  >
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Rate Details Card */}
            <div className="p-4 rounded-xl bg-[#151518] border border-[#232328] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="text-[11px] text-[#64748B]">EXCHANGE RATE FORMULA</div>
                <div className="font-mono text-slate-200">
                  1 <span className="font-bold text-amber-400">{fromCurrency}</span> ={' '}
                  <span className="font-bold text-emerald-400">{currentRate.toFixed(4)}</span> {toCurrency}
                </div>
                <div className="text-[10px] text-[#94A3B8] font-mono">
                  Inverse: 1 {toCurrency} = {inverseRate.toFixed(4)} {fromCurrency}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleApplyAsDefault(toCurrency)}
                  className="px-3 py-1.5 rounded-lg bg-[#1F1F24] hover:bg-emerald-950/60 border border-[#303038] hover:border-emerald-700/60 text-xs text-emerald-300 font-medium transition cursor-pointer flex items-center space-x-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Set {toCurrency} as App Currency</span>
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <div className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider">
                COMMON DROPSHIPPING PAIRS
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { from: 'USD', to: 'EUR' },
                  { from: 'USD', to: 'GBP' },
                  { from: 'USD', to: 'INR' },
                  { from: 'USD', to: 'CAD' },
                ].map((pair) => (
                  <button
                    key={`${pair.from}-${pair.to}`}
                    type="button"
                    onClick={() => {
                      setFromCurrency(pair.from);
                      setToCurrency(pair.to);
                    }}
                    className="p-2 rounded-lg bg-[#161619] hover:bg-[#1E1E23] border border-[#25252A] text-left transition cursor-pointer"
                  >
                    <div className="text-[11px] font-mono text-slate-300 font-semibold">
                      {pair.from} → {pair.to}
                    </div>
                    <div className="text-xs font-mono text-amber-400 mt-0.5">
                      {getRateSync(pair.from, pair.to).toFixed(4)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Rates Board */}
        {activeTab === 'rates' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-[#94A3B8]">
                Exchange rates anchored to base <span className="text-white font-mono font-bold">{baseCurrency}</span>
              </div>
              <button
                type="button"
                onClick={handleSimulateFluctuation}
                disabled={isSimulating}
                className="px-2.5 py-1 rounded bg-[#18181D] hover:bg-[#24242A] border border-[#2F2F36] text-[11px] text-amber-400 font-mono flex items-center space-x-1 transition cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
                <span>Simulate Market Movement</span>
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto pr-1 space-y-1.5 divide-y divide-[#1D1D22]">
              {currencies.map((c) => {
                const rate = getRateSync(baseCurrency, c.code);
                const isSelected = currentCurrency === c.code;

                return (
                  <div
                    key={c.code}
                    className="pt-2 flex items-center justify-between text-xs hover:bg-[#161619] p-2 rounded-lg transition"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-lg">{c.flag}</span>
                      <div>
                        <div className="font-semibold text-slate-200 flex items-center space-x-1.5">
                          <span>{c.name}</span>
                          <span className="font-mono text-[10px] text-[#64748B]">({c.code})</span>
                        </div>
                        <div className="text-[10px] text-[#94A3B8] font-mono">
                          Symbol: {c.symbol} • Decimals: {c.decimals}
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="font-mono font-bold text-amber-400">
                        {rate.toFixed(4)} {c.code}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApplyAsDefault(c.code)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded transition cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                            : 'bg-[#1F1F24] text-slate-400 hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Active Default' : 'Select'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Mock Provider Control */}
        {activeTab === 'simulate' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[#151518] border border-[#232328] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>MockExchangeRateProvider Settings</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">IN-MEMORY ACTIVE</span>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                The mock provider handles triangular conversion mathematics automatically (e.g. converting EUR to INR via intermediate USD peg). You can inject custom rates below for pricing tests or simulation.
              </p>
            </div>

            {/* Custom Rate Injection */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">
                Inject Custom Mock Pair Rate
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] text-[#64748B] block mb-1">From</label>
                  <select
                    value={customRateFrom}
                    onChange={(e) => setCustomRateFrom(e.target.value)}
                    className="w-full bg-[#18181D] border border-[#2D2D35] px-2.5 py-2 rounded-lg text-xs font-mono text-slate-200"
                  >
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-[#64748B] block mb-1">To</label>
                  <select
                    value={customRateTo}
                    onChange={(e) => setCustomRateTo(e.target.value)}
                    className="w-full bg-[#18181D] border border-[#2D2D35] px-2.5 py-2 rounded-lg text-xs font-mono text-slate-200"
                  >
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-[#64748B] block mb-1">Rate Value</label>
                  <input
                    type="number"
                    step="any"
                    value={customRateValue}
                    onChange={(e) => setCustomRateValue(e.target.value)}
                    className="w-full bg-[#18181D] border border-[#2D2D35] px-2.5 py-2 rounded-lg text-xs font-mono text-amber-400 focus:outline-none"
                    placeholder="e.g. 88.50"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleSetCustomMockRate}
                    className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs transition cursor-pointer shadow-md"
                  >
                    Apply Rate
                  </button>
                </div>
              </div>
            </div>

            {/* Provider Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-[#1F1F21]">
              <button
                type="button"
                onClick={handleResetRates}
                className="text-xs text-[#94A3B8] hover:text-rose-400 transition cursor-pointer underline"
              >
                Reset all rates to defaults
              </button>

              <button
                type="button"
                onClick={handleSimulateFluctuation}
                className="px-4 py-2 rounded-lg bg-[#18181D] hover:bg-[#25252D] border border-[#303038] text-xs font-medium text-slate-200 flex items-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Fluctuate FX Rates (±1.5%)</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-[#1F1F21] flex items-center justify-between text-xs text-[#64748B]">
          <div className="flex items-center space-x-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Cache TTL: 15 min • Synced</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1E1E22] hover:bg-[#2A2A30] text-slate-200 text-xs font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
