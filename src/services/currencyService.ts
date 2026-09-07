/**
 * CurrencyService & ExchangeRateProvider Architecture
 * 
 * Provides comprehensive multi-currency support, conversion calculations,
 * rate caching with TTL, formatting utilities, and customizable rate providers.
 */

export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'INR'
  | 'CAD'
  | 'AUD'
  | 'JPY'
  | 'SGD'
  | 'AED'
  | 'CNY'
  | 'BRL'
  | 'CHF'
  | 'HKD'
  | 'NZD'
  | 'SEK'
  | 'KRW'
  | string;

export interface CurrencyMeta {
  code: string;
  name: string;
  symbol: string;
  decimals: number;
  flag: string;
  locale: string;
  symbolPosition: 'before' | 'after';
}

export interface CurrencyConvertOptions {
  decimals?: number;
  round?: boolean;
  forceRefresh?: boolean;
}

export interface CurrencyFormatOptions {
  decimals?: number;
  showCode?: boolean;
  showSymbol?: boolean;
  locale?: string;
  useGrouping?: boolean;
}

export interface ConversionResult {
  originalAmount: number;
  convertedAmount: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  inverseRate: number;
  formattedOriginal: string;
  formattedConverted: string;
  timestamp: number;
  provider: string;
}

export interface ExchangeRateResult {
  from: string;
  to: string;
  rate: number;
  timestamp: number;
  provider: string;
}

export type CurrencyEventListener = (event: {
  type: 'RATES_UPDATED' | 'PROVIDER_CHANGED' | 'USER_CURRENCY_CHANGED' | 'BASE_CURRENCY_CHANGED';
  payload?: any;
}) => void;

/**
 * Standard interface for any exchange rate data provider.
 * Can be implemented for real FX APIs (e.g. OpenExchangeRates, Fixer, ECB, Coinbase)
 * or mock / test providers.
 */
export interface ExchangeRateProvider {
  readonly name: string;
  getRate(from: string, to: string): Promise<number>;
  getRates(base: string): Promise<Record<string, number>>;
  getSupportedCurrencies(): Promise<string[]> | string[];
  setMockRate?(from: string, to: string, rate: number): void;
  resetRates?(): void;
}

/**
 * Registry of global currency metadata and display formatting rules.
 */
export const CURRENCY_METADATA: Record<string, CurrencyMeta> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2, flag: '🇺🇸', locale: 'en-US', symbolPosition: 'before' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2, flag: '🇪🇺', locale: 'de-DE', symbolPosition: 'before' },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', decimals: 2, flag: '🇬🇧', locale: 'en-GB', symbolPosition: 'before' },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', decimals: 2, flag: '🇮🇳', locale: 'en-IN', symbolPosition: 'before' },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', decimals: 2, flag: '🇨🇦', locale: 'en-CA', symbolPosition: 'before' },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$', decimals: 2, flag: '🇦🇺', locale: 'en-AU', symbolPosition: 'before' },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimals: 0, flag: '🇯🇵', locale: 'ja-JP', symbolPosition: 'before' },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'SG$', decimals: 2, flag: '🇸🇬', locale: 'en-SG', symbolPosition: 'before' },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'AED', decimals: 2, flag: '🇦🇪', locale: 'ar-AE', symbolPosition: 'after' },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', decimals: 2, flag: '🇨🇳', locale: 'zh-CN', symbolPosition: 'before' },
  BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', decimals: 2, flag: '🇧🇷', locale: 'pt-BR', symbolPosition: 'before' },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', decimals: 2, flag: '🇨🇭', locale: 'de-CH', symbolPosition: 'after' },
  HKD: { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', decimals: 2, flag: '🇭🇰', locale: 'zh-HK', symbolPosition: 'before' },
  NZD: { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', decimals: 2, flag: '🇳🇿', locale: 'en-NZ', symbolPosition: 'before' },
  SEK: { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', decimals: 2, flag: '🇸🇪', locale: 'sv-SE', symbolPosition: 'after' },
  KRW: { code: 'KRW', name: 'South Korean Won', symbol: '₩', decimals: 0, flag: '🇰🇷', locale: 'ko-KR', symbolPosition: 'before' },
};

/**
 * Baseline USD-anchored rates for dropshipping e-commerce operations.
 */
export const DEFAULT_USD_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 86.85,
  CAD: 1.38,
  AUD: 1.54,
  JPY: 154.20,
  SGD: 1.34,
  AED: 3.67,
  CNY: 7.24,
  BRL: 5.65,
  CHF: 0.89,
  HKD: 7.82,
  NZD: 1.68,
  SEK: 10.62,
  KRW: 1385.0,
};

/**
 * MockExchangeRateProvider
 * 
 * In-memory provider that simulates real-time forex conversions, triangular arbitrage,
 * simulated network latency, rate fluctuations, and manual overrides.
 */
export class MockExchangeRateProvider implements ExchangeRateProvider {
  public readonly name: string = 'MockExchangeRateProvider';

  private baseRates: Record<string, number> = { ...DEFAULT_USD_RATES };
  private customPairRates: Map<string, number> = new Map();
  private simulatedLatencyMs: number = 0;
  private shouldSimulateFailure: boolean = false;
  private failureMessage: string = 'Simulated FX provider failure';

  constructor(initialRates?: Record<string, number>) {
    if (initialRates) {
      this.baseRates = { ...DEFAULT_USD_RATES, ...initialRates };
    }
  }

  /**
   * Set a custom rate for any direct pair (e.g. 'EUR' to 'GBP')
   */
  public setMockRate(from: string, to: string, rate: number): void {
    const f = from.toUpperCase();
    const t = to.toUpperCase();
    if (rate <= 0) throw new Error(`Invalid exchange rate: ${rate}`);
    this.customPairRates.set(`${f}:${t}`, rate);
    this.customPairRates.set(`${t}:${f}`, 1 / rate);
  }

  /**
   * Overwrite rates anchored to USD
   */
  public setBaseRates(rates: Record<string, number>): void {
    this.baseRates = { ...this.baseRates, ...rates };
  }

  /**
   * Set simulated async latency for realistic testing
   */
  public setSimulatedLatency(ms: number): void {
    this.simulatedLatencyMs = Math.max(0, ms);
  }

  /**
   * Toggle error simulation
   */
  public setSimulatedFailure(shouldFail: boolean, message?: string): void {
    this.shouldSimulateFailure = shouldFail;
    if (message) this.failureMessage = message;
  }

  /**
   * Randomly fluctuates current rates by a max percentage (e.g. +/- 1.5%)
   */
  public simulateFluctuation(maxPercent: number = 1.5): Record<string, number> {
    const newRates: Record<string, number> = { USD: 1.0 };
    for (const [code, rate] of Object.entries(this.baseRates)) {
      if (code === 'USD') continue;
      const deltaPercent = (Math.random() * 2 - 1) * (maxPercent / 100);
      const updated = +(rate * (1 + deltaPercent)).toFixed(4);
      newRates[code] = updated;
    }
    this.baseRates = newRates;
    return { ...this.baseRates };
  }

  /**
   * Reset rates back to default initial values
   */
  public resetRates(): void {
    this.baseRates = { ...DEFAULT_USD_RATES };
    this.customPairRates.clear();
    this.shouldSimulateFailure = false;
  }

  /**
   * Returns list of supported ISO currency codes
   */
  public getSupportedCurrencies(): string[] {
    return Object.keys(this.baseRates);
  }

  /**
   * Calculates rate synchronously using triangular math or direct overrides
   */
  public getDirectRate(from: string, to: string): number {
    const f = from.toUpperCase();
    const t = to.toUpperCase();

    if (f === t) return 1.0;

    // 1. Check custom overrides
    const directKey = `${f}:${t}`;
    if (this.customPairRates.has(directKey)) {
      return this.customPairRates.get(directKey)!;
    }

    // 2. Triangular conversion via USD
    const fromToUsd = this.baseRates[f];
    const toToUsd = this.baseRates[t];

    if (!fromToUsd) {
      throw new Error(`Unsupported source currency: ${f}`);
    }
    if (!toToUsd) {
      throw new Error(`Unsupported target currency: ${t}`);
    }

    // USD: baseRates[code] = units of currency per 1 USD
    // Example: 1 USD = 0.92 EUR, 1 USD = 86.85 INR
    // Rate EUR -> INR = 86.85 / 0.92 = 94.402
    return toToUsd / fromToUsd;
  }

  /**
   * Async getRate implementing ExchangeRateProvider
   */
  public async getRate(from: string, to: string): Promise<number> {
    if (this.simulatedLatencyMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.simulatedLatencyMs));
    }

    if (this.shouldSimulateFailure) {
      throw new Error(this.failureMessage);
    }

    return this.getDirectRate(from, to);
  }

  /**
   * Async getRates for a given base currency
   */
  public async getRates(base: string): Promise<Record<string, number>> {
    if (this.simulatedLatencyMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.simulatedLatencyMs));
    }

    if (this.shouldSimulateFailure) {
      throw new Error(this.failureMessage);
    }

    const b = base.toUpperCase();
    const result: Record<string, number> = {};

    for (const code of this.getSupportedCurrencies()) {
      result[code] = +(this.getDirectRate(b, code)).toFixed(6);
    }

    return result;
  }
}

interface CacheEntry {
  rate: number;
  timestamp: number;
  expiresAt: number;
  provider: string;
}

/**
 * CurrencyService
 * 
 * High-performance currency management engine. Handles conversion, formatting,
 * rate caching with TTL, currency metadata, and reactive subscription updates.
 */
export class CurrencyService {
  private provider: ExchangeRateProvider;
  private cacheTtlMs: number;
  private rateCache: Map<string, CacheEntry> = new Map();
  private baseCurrency: string = 'USD';
  private userCurrency: string = 'USD';
  private listeners: Set<CurrencyEventListener> = new Set();

  constructor(
    provider?: ExchangeRateProvider,
    options?: {
      cacheTtlMs?: number;
      baseCurrency?: string;
      userCurrency?: string;
    }
  ) {
    this.provider = provider || new MockExchangeRateProvider();
    this.cacheTtlMs = options?.cacheTtlMs ?? 15 * 60 * 1000; // 15 minutes default
    if (options?.baseCurrency) this.baseCurrency = options.baseCurrency.toUpperCase();
    if (options?.userCurrency) this.userCurrency = options.userCurrency.toUpperCase();
  }

  // --- Provider Management ---

  public setProvider(provider: ExchangeRateProvider): void {
    this.provider = provider;
    this.clearCache();
    this.notify({ type: 'PROVIDER_CHANGED', payload: { providerName: provider.name } });
  }

  public getProvider(): ExchangeRateProvider {
    return this.provider;
  }

  public setCacheTtl(ttlMs: number): void {
    this.cacheTtlMs = Math.max(0, ttlMs);
  }

  public clearCache(): void {
    this.rateCache.clear();
  }

  // --- Active Currency State ---

  public getBaseCurrency(): string {
    return this.baseCurrency;
  }

  public setBaseCurrency(code: string): void {
    const c = code.toUpperCase();
    if (this.baseCurrency !== c) {
      this.baseCurrency = c;
      this.notify({ type: 'BASE_CURRENCY_CHANGED', payload: { baseCurrency: c } });
    }
  }

  public getUserCurrency(): string {
    return this.userCurrency;
  }

  public setUserCurrency(code: string): void {
    const c = code.toUpperCase();
    if (this.userCurrency !== c) {
      this.userCurrency = c;
      this.notify({ type: 'USER_CURRENCY_CHANGED', payload: { userCurrency: c } });
    }
  }

  // --- Exchange Rate Retrieval ---

  /**
   * Asynchronously retrieves exchange rate from `from` to `to`, checking in-memory cache first.
   */
  public async getRate(
    from: string,
    to: string,
    options?: { forceRefresh?: boolean }
  ): Promise<number> {
    const f = from.toUpperCase();
    const t = to.toUpperCase();

    if (f === t) return 1.0;

    const cacheKey = `${f}:${t}`;
    const now = Date.now();

    if (!options?.forceRefresh) {
      const cached = this.rateCache.get(cacheKey);
      if (cached && cached.expiresAt > now) {
        return cached.rate;
      }
    }

    const rate = await this.provider.getRate(f, t);

    this.rateCache.set(cacheKey, {
      rate,
      timestamp: now,
      expiresAt: now + this.cacheTtlMs,
      provider: this.provider.name,
    });

    // Also cache reciprocal rate if not already present
    const reciprocalKey = `${t}:${f}`;
    if (rate > 0 && (!this.rateCache.has(reciprocalKey) || options?.forceRefresh)) {
      this.rateCache.set(reciprocalKey, {
        rate: 1 / rate,
        timestamp: now,
        expiresAt: now + this.cacheTtlMs,
        provider: this.provider.name,
      });
    }

    return rate;
  }

  /**
   * Synchronous rate getter using cached values or direct fallback.
   * Ideal for UI rendering loops where async promises would introduce flicker.
   */
  public getRateSync(from: string, to: string): number {
    const f = from.toUpperCase();
    const t = to.toUpperCase();
    if (f === t) return 1.0;

    const cacheKey = `${f}:${t}`;
    const cached = this.rateCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.rate;
    }

    // If provider is MockExchangeRateProvider, leverage synchronous direct calculation
    if (this.provider instanceof MockExchangeRateProvider) {
      try {
        const rate = this.provider.getDirectRate(f, t);
        const now = Date.now();
        this.rateCache.set(cacheKey, {
          rate,
          timestamp: now,
          expiresAt: now + this.cacheTtlMs,
          provider: this.provider.name,
        });
        return rate;
      } catch (err) {
        console.warn(`Could not compute sync rate for ${f}->${t}:`, err);
      }
    }

    // Fallback to default USD rates if available
    const fromRate = DEFAULT_USD_RATES[f];
    const toRate = DEFAULT_USD_RATES[t];
    if (fromRate && toRate) {
      return toRate / fromRate;
    }

    return 1.0;
  }

  /**
   * Pre-fetches and warms cache for a base currency against all supported targets.
   */
  public async refreshRates(base: string = this.baseCurrency): Promise<Record<string, number>> {
    const b = base.toUpperCase();
    const rates = await this.provider.getRates(b);
    const now = Date.now();

    for (const [target, rate] of Object.entries(rates)) {
      this.rateCache.set(`${b}:${target}`, {
        rate,
        timestamp: now,
        expiresAt: now + this.cacheTtlMs,
        provider: this.provider.name,
      });
    }

    this.notify({ type: 'RATES_UPDATED', payload: { base: b, rates } });
    return rates;
  }

  // --- Conversion Operations ---

  /**
   * Converts an amount from one currency to another asynchronously.
   */
  public async convert(
    amount: number,
    from: string,
    to: string,
    options?: CurrencyConvertOptions
  ): Promise<number> {
    if (isNaN(amount)) return 0;
    const f = from.toUpperCase();
    const t = to.toUpperCase();

    if (f === t) {
      return this.roundAmount(amount, t, options);
    }

    const rate = await this.getRate(f, t, { forceRefresh: options?.forceRefresh });
    const converted = amount * rate;
    return this.roundAmount(converted, t, options);
  }

  /**
   * Converts an amount synchronously using cached or direct rates.
   */
  public convertSync(
    amount: number,
    from: string,
    to: string,
    options?: CurrencyConvertOptions
  ): number {
    if (isNaN(amount)) return 0;
    const f = from.toUpperCase();
    const t = to.toUpperCase();

    if (f === t) {
      return this.roundAmount(amount, t, options);
    }

    const rate = this.getRateSync(f, t);
    const converted = amount * rate;
    return this.roundAmount(converted, t, options);
  }

  /**
   * Full detailed conversion returning rates, formatted strings, and audit metadata.
   */
  public async convertDetailed(
    amount: number,
    from: string,
    to: string,
    options?: CurrencyConvertOptions
  ): Promise<ConversionResult> {
    const f = from.toUpperCase();
    const t = to.toUpperCase();
    const rate = await this.getRate(f, t, { forceRefresh: options?.forceRefresh });
    const convertedAmount = this.roundAmount(amount * rate, t, options);

    return {
      originalAmount: amount,
      convertedAmount,
      fromCurrency: f,
      toCurrency: t,
      rate,
      inverseRate: rate > 0 ? 1 / rate : 0,
      formattedOriginal: this.format(amount, f),
      formattedConverted: this.format(convertedAmount, t),
      timestamp: Date.now(),
      provider: this.provider.name,
    };
  }

  /**
   * Synchronous detailed conversion.
   */
  public convertDetailedSync(
    amount: number,
    from: string,
    to: string,
    options?: CurrencyConvertOptions
  ): ConversionResult {
    const f = from.toUpperCase();
    const t = to.toUpperCase();
    const rate = this.getRateSync(f, t);
    const convertedAmount = this.roundAmount(amount * rate, t, options);

    return {
      originalAmount: amount,
      convertedAmount,
      fromCurrency: f,
      toCurrency: t,
      rate,
      inverseRate: rate > 0 ? 1 / rate : 0,
      formattedOriginal: this.format(amount, f),
      formattedConverted: this.format(convertedAmount, t),
      timestamp: Date.now(),
      provider: this.provider.name,
    };
  }

  /**
   * Batch conversion utility
   */
  public async batchConvert(
    items: Array<{ amount: number; from: string; to: string; options?: CurrencyConvertOptions }>
  ): Promise<number[]> {
    return Promise.all(
      items.map((item) => this.convert(item.amount, item.from, item.to, item.options))
    );
  }

  // --- Formatting Utilities ---

  /**
   * Formats an amount with proper locale, currency symbol, and precision.
   */
  public format(amount: number, currency: string, options?: CurrencyFormatOptions): string {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return this.format(0, currency, options);
    }

    const c = currency.toUpperCase();
    const meta = this.getCurrencyMeta(c);
    const decimals = options?.decimals ?? meta.decimals;
    const locale = options?.locale ?? meta.locale;

    try {
      if (options?.showSymbol === false) {
        return new Intl.NumberFormat(locale, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
          useGrouping: options?.useGrouping ?? true,
        }).format(amount);
      }

      const formatted = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: c,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: options?.useGrouping ?? true,
      }).format(amount);

      if (options?.showCode) {
        return `${formatted} ${c}`;
      }
      return formatted;
    } catch {
      // Fallback formatting
      const symbol = meta.symbol;
      const numStr = amount.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

      if (meta.symbolPosition === 'after') {
        return options?.showCode ? `${numStr} ${symbol} (${c})` : `${numStr} ${symbol}`;
      }
      return options?.showCode ? `${symbol}${numStr} ${c}` : `${symbol}${numStr}`;
    }
  }

  /**
   * Formats an amount and shows both original and converted values.
   * Example: "$100.00 (~€92.00)"
   */
  public async formatWithConversion(
    amount: number,
    from: string,
    to: string,
    options?: CurrencyFormatOptions & { showBoth?: boolean; showRate?: boolean }
  ): Promise<string> {
    const f = from.toUpperCase();
    const t = to.toUpperCase();
    const formattedOriginal = this.format(amount, f, options);

    if (f === t) return formattedOriginal;

    const converted = await this.convert(amount, f, t);
    const formattedConverted = this.format(converted, t, options);

    if (options?.showBoth === false) {
      return formattedConverted;
    }

    if (options?.showRate) {
      const rate = await this.getRate(f, t);
      return `${formattedOriginal} (${formattedConverted} @ ${rate.toFixed(4)})`;
    }

    return `${formattedOriginal} (~${formattedConverted})`;
  }

  // --- Metadata & Currencies ---

  public getCurrencyMeta(currency: string): CurrencyMeta {
    const c = currency.toUpperCase();
    return (
      CURRENCY_METADATA[c] || {
        code: c,
        name: `${c} Currency`,
        symbol: c,
        decimals: 2,
        flag: '🌐',
        locale: 'en-US',
        symbolPosition: 'before',
      }
    );
  }

  public getSymbol(currency: string): string {
    return this.getCurrencyMeta(currency).symbol;
  }

  public getAllCurrencies(): CurrencyMeta[] {
    return Object.values(CURRENCY_METADATA);
  }

  public getSupportedCurrencies(): string[] {
    if (this.provider instanceof MockExchangeRateProvider) {
      return this.provider.getSupportedCurrencies();
    }
    return Object.keys(CURRENCY_METADATA);
  }

  // --- Reactive Subscription ---

  public subscribe(listener: CurrencyEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(event: {
    type: 'RATES_UPDATED' | 'PROVIDER_CHANGED' | 'USER_CURRENCY_CHANGED' | 'BASE_CURRENCY_CHANGED';
    payload?: any;
  }): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in currency listener:', err);
      }
    }
  }

  // --- Internal Helpers ---

  private roundAmount(
    val: number,
    targetCurrency: string,
    options?: CurrencyConvertOptions
  ): number {
    if (options?.round === false) return val;
    const decimals = options?.decimals ?? this.getCurrencyMeta(targetCurrency).decimals;
    const factor = Math.pow(10, decimals);
    return Math.round(val * factor) / factor;
  }
}

/**
 * Pre-configured singleton instance for convenient application-wide use.
 */
export const currencyService = new CurrencyService(new MockExchangeRateProvider());
