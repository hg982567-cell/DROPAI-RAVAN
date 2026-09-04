import React, { useState } from 'react';
import {
  Truck,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Plus,
  CheckCircle2,
  Clock,
  Star,
  Activity,
  ArrowRightLeft,
} from 'lucide-react';
import { Supplier } from '../../types';

interface SupplierManagementProps {
  suppliers: Supplier[];
}

export const SupplierManagement: React.FC<SupplierManagementProps> = ({ suppliers: initialSuppliers }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [isTestingId, setIsTestingId] = useState<string | null>(null);

  const handleTestPing = (id: string) => {
    setIsTestingId(id);
    setTimeout(() => {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, lastSyncAt: 'Just now' } : s))
      );
      setIsTestingId(null);
    }, 800);
  };

  return (
    <div id="supplier-management-container" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
            Suppliers & Intelligent Routing
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Automated stock monitoring, carrier speed grading, and dynamic supplier failover routing.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#111113] border border-[#1F1F21] text-emerald-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Automatic Failover: ACTIVE</span>
          </span>
        </div>
      </div>

      {/* Failover Architecture Banner */}
      <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-lg bg-[#D97706]/10 text-[#D97706] shrink-0">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-serif font-bold text-[#E2E8F0]">Smart Supplier Failover Engine</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-xl">
              If a primary supplier's inventory falls below safety threshold (e.g. 20 units) or fulfillment delays exceed 48 hours, DropAI automatically switches order routing to configured backup fulfillment hubs without disrupting customer checkout.
            </p>
          </div>
        </div>
      </div>

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-5 shadow-sm hover:border-[#2D2D30] transition-all"
          >
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-serif font-bold text-[#E2E8F0]">{supplier.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#151517] text-[#94A3B8] border border-[#2D2D30]">
                    {supplier.adapterType}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-[#94A3B8]">
                  <span className="flex items-center space-x-1 text-[#D97706]">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{supplier.rating}</span>
                  </span>
                  <span>•</span>
                  <span>Origin: {supplier.originCountry}</span>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded text-xs font-mono ${
                  supplier.connectionStatus === 'CONNECTED'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}
              >
                {supplier.connectionStatus}
              </span>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-[#151517] border border-[#1F1F21] text-center text-xs">
              <div>
                <div className="text-[10px] text-[#64748B] font-mono">AVG SHIPPING</div>
                <div className="font-bold text-[#E2E8F0] mt-0.5">{supplier.averageShippingDays}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#64748B] font-mono">STOCK RELIABILITY</div>
                <div className="font-bold text-emerald-400 font-mono mt-0.5">{supplier.stockReliability}%</div>
              </div>
              <div>
                <div className="text-[10px] text-[#64748B] font-mono">LINKED PRODUCTS</div>
                <div className="font-bold text-[#D97706] font-mono mt-0.5">{supplier.productsCount}</div>
              </div>
            </div>

            {/* Sync & Speed Details */}
            <div className="text-xs text-[#94A3B8] space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Shipping Methods:</span>
                <span className="text-[#E2E8F0] truncate max-w-[200px]">
                  {supplier.supportedShippingMethods.join(', ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Auto-Sync Frequency:</span>
                <span className="text-[#E2E8F0]">{supplier.syncFrequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Last Telemetry Ping:</span>
                <span className="text-[#D97706]">{supplier.lastSyncAt}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#1F1F21] flex items-center justify-between">
              <span className="text-[11px] text-[#64748B] font-mono">
                API Adapter: {supplier.apiEndpoint ? 'Configured' : 'Portal Sync'}
              </span>

              <button
                id={`test-supplier-btn-${supplier.id}`}
                onClick={() => handleTestPing(supplier.id)}
                disabled={isTestingId === supplier.id}
                className="px-3.5 py-1.5 rounded-lg bg-[#151517] hover:bg-[#1F1F21] text-[#94A3B8] hover:text-[#E2E8F0] border border-[#2D2D30] text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-40"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTestingId === supplier.id ? 'animate-spin' : ''}`} />
                <span>{isTestingId === supplier.id ? 'Testing...' : 'Test Ping'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
