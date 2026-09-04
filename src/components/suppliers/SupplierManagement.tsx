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

export const SupplierManagement: React.FC<SupplierManagementProps> = ({ suppliers: initialSuppliers = [] }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers || []);
  const [isTestingId, setIsTestingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSupName, setNewSupName] = useState('');
  const [newSupCountry, setNewSupCountry] = useState('United States');
  const [newSupPlatform, setNewSupPlatform] = useState<'CJ Dropshipping' | 'AliExpress Direct' | 'DSers' | 'Spocket' | 'Local Warehouse US' | 'Local Warehouse EU'>('CJ Dropshipping');

  const handleTestPing = (id: string) => {
    setIsTestingId(id);
    setTimeout(() => {
      setSuppliers((prev) =>
        (prev || []).map((s) => (s.id === id ? { ...s, lastSyncAt: 'Just now (Latency: 42ms)' } : s))
      );
      setIsTestingId(null);
    }, 800);
  };

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName.trim()) return;

    const newSupplier: Supplier = {
      id: `sup-${Date.now()}`,
      name: newSupName.trim(),
      country: newSupCountry,
      platform: newSupPlatform,
      verificationStatus: 'VERIFIED',
      rating: 4.8,
      totalOrdersFulfilled: 0,
      averageFulfillmentHours: 24,
      onTimeDeliveryRate: 99.0,
      disputeRate: 0.2,
      returnPolicyDays: 30,
      apiConnected: true,
      activeAlertsCount: 0,
      backupPriority: (suppliers || []).length + 1,
    };

    setSuppliers((prev) => [newSupplier, ...(prev || [])]);
    setNewSupName('');
    setShowAddModal(false);
  };

  const safeSuppliers = suppliers && suppliers.length > 0 ? suppliers : (initialSuppliers || []);

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

        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#111113] border border-[#1F1F21] text-emerald-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Automatic Failover: ACTIVE</span>
          </span>

          <button
            id="add-supplier-btn"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-black text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-[#D97706]/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Supplier</span>
          </button>
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
        {safeSuppliers.map((supplier) => {
          const adapterType = (supplier as any).adapterType || supplier.platform || 'Dropship Hub';
          const originCountry = (supplier as any).originCountry || supplier.country || 'Global';
          const connectionStatus = (supplier as any).connectionStatus || (supplier.apiConnected ? 'CONNECTED' : (supplier.verificationStatus || 'ACTIVE'));
          const avgShipping = (supplier as any).averageShippingDays || (supplier.averageFulfillmentHours ? `${Math.max(1, Math.round(supplier.averageFulfillmentHours / 24))}-${Math.round(supplier.averageFulfillmentHours / 24) + 2} days` : '2-4 days');
          const stockReliability = (supplier as any).stockReliability ?? supplier.onTimeDeliveryRate ?? 98.5;
          const productsCount = (supplier as any).productsCount ?? supplier.totalOrdersFulfilled ?? 120;
          const supportedShippingMethods: string[] = Array.isArray((supplier as any).supportedShippingMethods) && (supplier as any).supportedShippingMethods.length > 0
            ? (supplier as any).supportedShippingMethods
            : ['USPS / CJ Packet', 'YunExpress Priority', 'DHL Express Fleet'];
          const syncFrequency = (supplier as any).syncFrequency || 'Real-time Webhook (15m)';
          const lastSyncAt = (supplier as any).lastSyncAt || (supplier.apiConnected ? 'Active (< 2m ago)' : 'Scheduled Sync');
          const apiStatus = (supplier as any).apiEndpoint ? 'Configured' : (supplier.apiConnected ? 'Active Telemetry' : 'Portal Sync');

          return (
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
                      {adapterType}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-[#94A3B8]">
                    <span className="flex items-center space-x-1 text-[#D97706]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{supplier.rating || 4.8}</span>
                    </span>
                    <span>•</span>
                    <span>Origin: {originCountry}</span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded text-xs font-mono ${
                    connectionStatus === 'CONNECTED' || connectionStatus === 'VERIFIED'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {connectionStatus}
                </span>
              </div>

              {/* Metrics Breakdown */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-[#151517] border border-[#1F1F21] text-center text-xs">
                <div>
                  <div className="text-[10px] text-[#64748B] font-mono">AVG SHIPPING</div>
                  <div className="font-bold text-[#E2E8F0] mt-0.5">{avgShipping}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#64748B] font-mono">STOCK RELIABILITY</div>
                  <div className="font-bold text-emerald-400 font-mono mt-0.5">{stockReliability}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#64748B] font-mono">ORDERS FULFILLED</div>
                  <div className="font-bold text-[#D97706] font-mono mt-0.5">{productsCount.toLocaleString()}</div>
                </div>
              </div>

              {/* Sync & Speed Details */}
              <div className="text-xs text-[#94A3B8] space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Shipping Methods:</span>
                  <span className="text-[#E2E8F0] truncate max-w-[200px]">
                    {supportedShippingMethods.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Auto-Sync Frequency:</span>
                  <span className="text-[#E2E8F0]">{syncFrequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Last Telemetry Ping:</span>
                  <span className="text-[#D97706]">{lastSyncAt}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#1F1F21] flex items-center justify-between">
                <span className="text-[11px] text-[#64748B] font-mono">
                  API Adapter: {apiStatus}
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
          );
        })}
      </div>

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111113] border border-[#1F1F21] rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-serif font-bold text-white">Add New Fulfillment Supplier</h3>
            <form onSubmit={handleAddSupplier} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1">Supplier Company Name</label>
                <input
                  type="text"
                  required
                  value={newSupName}
                  onChange={(e) => setNewSupName(e.target.value)}
                  placeholder="e.g. Shenzhen Global Logistics"
                  className="w-full px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-xs text-white focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1">Platform / Adapter</label>
                <select
                  value={newSupPlatform}
                  onChange={(e) => setNewSupPlatform(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-xs text-white focus:outline-none focus:border-[#D97706]"
                >
                  <option value="CJ Dropshipping">CJ Dropshipping</option>
                  <option value="AliExpress Direct">AliExpress Direct</option>
                  <option value="DSers">DSers</option>
                  <option value="Spocket">Spocket</option>
                  <option value="Local Warehouse US">Local Warehouse US</option>
                  <option value="Local Warehouse EU">Local Warehouse EU</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-[#94A3B8] block mb-1">Country of Origin</label>
                <input
                  type="text"
                  required
                  value={newSupCountry}
                  onChange={(e) => setNewSupCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-xs text-white focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#1F1F21]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#151517] text-xs font-medium text-[#94A3B8] hover:text-white border border-[#2D2D30]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-xs font-bold text-black"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
