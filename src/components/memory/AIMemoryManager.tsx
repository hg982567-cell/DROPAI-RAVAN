import React, { useState } from 'react';
import {
  BrainCircuit,
  Plus,
  Trash2,
  ShieldCheck,
  Sparkles,
  Tag,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { AIMemoryItem } from '../../types';
import { api } from '../../services/api';

interface AIMemoryManagerProps {
  memoryItems: AIMemoryItem[];
  onRefreshMemory?: () => void;
}

export const AIMemoryManager: React.FC<AIMemoryManagerProps> = ({
  memoryItems: initialItems,
  onRefreshMemory,
}) => {
  const [items, setItems] = useState<AIMemoryItem[]>(initialItems);
  const [showAddModal, setShowAddModal] = useState(false);
  const [category, setCategory] = useState<'BRAND_VOICE' | 'SUPPLIER_PREFERENCE' | 'PRICING_RULE' | 'FORBIDDEN_ACTION' | 'OPERATIONAL_PREFERENCE'>('PRICING_RULE');
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');

  const handleDelete = async (id: string) => {
    try {
      await api.deleteMemoryItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (onRefreshMemory) onRefreshMemory();
    } catch (err) {
      console.error('Delete memory failed', err);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim() || !valueInput.trim()) return;

    try {
      const created = await api.addMemoryItem({
        category,
        key: keyInput,
        value: valueInput,
        confidence: 0.98,
      });
      setItems((prev) => [created, ...prev]);
      setShowAddModal(false);
      setKeyInput('');
      setValueInput('');
      if (onRefreshMemory) onRefreshMemory();
    } catch (err) {
      console.error('Add memory failed', err);
    }
  };

  return (
    <div id="ai-memory-manager-container" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
            AI Operating Memory & Guardrails
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Persistent learned constraints, pricing boundaries, brand tone guidelines, and forbidden autonomous actions.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-black font-bold text-xs flex items-center space-x-2 transition-all shadow-md shadow-[#D97706]/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Add Custom Memory Rule</span>
        </button>
      </div>

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-4 shadow-sm hover:border-[#2D2D30] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                    item.category === 'FORBIDDEN_ACTION'
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      : item.category === 'PRICING_RULE'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : item.category === 'BRAND_VOICE'
                      ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                      : 'bg-amber-500/15 text-[#D97706] border border-[#D97706]/30'
                  }`}
                >
                  {item.category.replace(/_/g, ' ')}
                </span>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg bg-[#151517] hover:bg-rose-950/40 text-[#64748B] hover:text-rose-400 border border-[#2D2D30] text-xs transition-colors cursor-pointer"
                  title="Remove memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h3 className="text-sm font-serif font-bold text-[#E2E8F0]">{item.key}</h3>
                <div className="p-3 mt-2 rounded-lg bg-[#151517] border border-[#1F1F21] text-xs text-[#94A3B8] font-mono leading-relaxed">
                  "{item.value}"
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1F1F21] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
              <span>Confidence: {(item.confidence * 100).toFixed(0)}%</span>
              <span>Last Used: {item.lastUsedAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1F1F21] pb-3">
              <h3 className="text-base font-serif font-bold text-white">Add AI Memory Rule</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#64748B] hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[#94A3B8] font-medium">Rule Category</label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#E2E8F0] focus:border-[#D97706] focus:outline-none"
                >
                  <option value="PRICING_RULE">PRICING_RULE</option>
                  <option value="BRAND_VOICE">BRAND_VOICE</option>
                  <option value="FORBIDDEN_ACTION">FORBIDDEN_ACTION</option>
                  <option value="SUPPLIER_PREFERENCE">SUPPLIER_PREFERENCE</option>
                  <option value="OPERATIONAL_PREFERENCE">OPERATIONAL_PREFERENCE</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#94A3B8] font-medium">Rule Title / Key</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Minimum Profit Margin Guardrail"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#E2E8F0] placeholder-[#64748B] focus:border-[#D97706] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#94A3B8] font-medium">Rule Value / Directive</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Never publish any product where net margin is less than 35%."
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#E2E8F0] placeholder-[#64748B] focus:border-[#D97706] focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#1F1F21]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#151517] hover:bg-[#1F1F21] text-[#94A3B8] hover:text-[#E2E8F0] border border-[#2D2D30] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-black font-bold cursor-pointer"
                >
                  Save Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
