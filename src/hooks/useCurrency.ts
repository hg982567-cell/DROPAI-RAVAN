import { useState, useEffect, useCallback } from 'react';
import {
  currencyService,
  CurrencyMeta,
  CurrencyFormatOptions,
  CurrencyConvertOptions,
  ConversionResult,
  MockExchangeRateProvider,
} from '../services/currencyService';

export interface UseCurrencyReturn {
  currentCurrency: string;
  setCurrency: (code: string) => void;
  baseCurrency: string;
  setBaseCurrency: (code: string) => void;
  currencies: CurrencyMeta[];
  currentMeta: CurrencyMeta;
  format: (amount: number, currency?: string, options?: CurrencyFormatOptions) => string;
  convert: (amount: number, fromCurrency: string, toCurrency?: string, options?: CurrencyConvertOptions) => Promise<number>;
  convertSync: (amount: number, fromCurrency: string, toCurrency?: string, options?: CurrencyConvertOptions) => number;
  convertDetailed: (amount: number, fromCurrency: string, toCurrency?: string, options?: CurrencyConvertOptions) => Promise<ConversionResult>;
  convertDetailedSync: (amount: number, fromCurrency: string, toCurrency?: string, options?: CurrencyConvertOptions) => ConversionResult;
  getRate: (fromCurrency: string, toCurrency?: string) => Promise<number>;
  getRateSync: (fromCurrency: string, toCurrency?: string) => number;
  getSymbol: (currency?: string) => string;
  refreshRates: () => Promise<void>;
  simulateFluctuation: (maxPercent?: number) => void;
  lastUpdated: number;
}

export function useCurrency(): UseCurrencyReturn {
  const [currentCurrency, setCurrentCurrencyState] = useState<string>(() => currencyService.getUserCurrency());
  const [baseCurrency, setBaseCurrencyState] = useState<string>(() => currencyService.getBaseCurrency());
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  useEffect(() => {
    const unsubscribe = currencyService.subscribe((event) => {
      if (event.type === 'USER_CURRENCY_CHANGED') {
        setCurrentCurrencyState(currencyService.getUserCurrency());
      } else if (event.type === 'BASE_CURRENCY_CHANGED') {
        setBaseCurrencyState(currencyService.getBaseCurrency());
      }
      setLastUpdated(Date.now());
    });

    return unsubscribe;
  }, []);

  const setCurrency = useCallback((code: string) => {
    currencyService.setUserCurrency(code);
    setCurrentCurrencyState(code.toUpperCase());
  }, []);

  const setBaseCurrency = useCallback((code: string) => {
    currencyService.setBaseCurrency(code);
    setBaseCurrencyState(code.toUpperCase());
  }, []);

  const format = useCallback((amount: number, currency?: string, options?: CurrencyFormatOptions): string => {
    return currencyService.format(amount, currency || currentCurrency, options);
  }, [currentCurrency]);

  const convert = useCallback(async (
    amount: number,
    fromCurrency: string,
    toCurrency?: string,
    options?: CurrencyConvertOptions
  ): Promise<number> => {
    return currencyService.convert(amount, fromCurrency, toCurrency || currentCurrency, options);
  }, [currentCurrency]);

  const convertSync = useCallback((
    amount: number,
    fromCurrency: string,
    toCurrency?: string,
    options?: CurrencyConvertOptions
  ): number => {
    return currencyService.convertSync(amount, fromCurrency, toCurrency || currentCurrency, options);
  }, [currentCurrency]);

  const convertDetailed = useCallback(async (
    amount: number,
    fromCurrency: string,
    toCurrency?: string,
    options?: CurrencyConvertOptions
  ): Promise<ConversionResult> => {
    return currencyService.convertDetailed(amount, fromCurrency, toCurrency || currentCurrency, options);
  }, [currentCurrency]);

  const convertDetailedSync = useCallback((
    amount: number,
    fromCurrency: string,
    toCurrency?: string,
    options?: CurrencyConvertOptions
  ): ConversionResult => {
    return currencyService.convertDetailedSync(amount, fromCurrency, toCurrency || currentCurrency, options);
  }, [currentCurrency]);

  const getRate = useCallback(async (fromCurrency: string, toCurrency?: string): Promise<number> => {
    return currencyService.getRate(fromCurrency, toCurrency || currentCurrency);
  }, [currentCurrency]);

  const getRateSync = useCallback((fromCurrency: string, toCurrency?: string): number => {
    return currencyService.getRateSync(fromCurrency, toCurrency || currentCurrency);
  }, [currentCurrency]);

  const getSymbol = useCallback((currency?: string): string => {
    return currencyService.getSymbol(currency || currentCurrency);
  }, [currentCurrency]);

  const refreshRates = useCallback(async () => {
    await currencyService.refreshRates();
    setLastUpdated(Date.now());
  }, []);

  const simulateFluctuation = useCallback((maxPercent: number = 1.5) => {
    const provider = currencyService.getProvider();
    if (provider instanceof MockExchangeRateProvider) {
      provider.simulateFluctuation(maxPercent);
      currencyService.clearCache();
      setLastUpdated(Date.now());
    }
  }, []);

  const currencies = currencyService.getAllCurrencies();
  const currentMeta = currencyService.getCurrencyMeta(currentCurrency);

  return {
    currentCurrency,
    setCurrency,
    baseCurrency,
    setBaseCurrency,
    currencies,
    currentMeta,
    format,
    convert,
    convertSync,
    convertDetailed,
    convertDetailedSync,
    getRate,
    getRateSync,
    getSymbol,
    refreshRates,
    simulateFluctuation,
    lastUpdated,
  };
}
