import React, { useState } from 'react';
import {
  FileText,
  Search,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Clock,
  Terminal,
  RefreshCw,
} from 'lucide-react';
import { SystemLog } from '../../types';

interface SystemLogsViewProps {
  logs: SystemLog[];
}

export const SystemLogsView: React.FC<SystemLogsViewProps> = ({ logs }) => {
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');

  const filteredLogs = logs.filter((l) => {
    const matchesLevel = filterLevel === 'ALL' || l.level === filterLevel;
    const matchesCat = filterCategory === 'ALL' || l.category === filterCategory;
    return matchesLevel && matchesCat;
  });

  return (
    <div id="system-logs-view-container" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
            Audit Ledger & System Monitoring
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Immutable audit records for all AI tool executions, payment settlements, and operator approvals.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs text-[#94A3B8] bg-[#111113] border border-[#1F1F21] px-3 py-1.5 rounded-lg">
          <Terminal className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Audit Stream: SECURE</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center space-x-3 p-4 rounded-xl bg-[#111113] border border-[#1F1F21] text-xs">
        <span className="text-[#64748B] font-mono">Filter by Level:</span>
        {['ALL', 'INFO', 'WARN', 'ERROR'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFilterLevel(lvl)}
            className={`px-3 py-1 rounded-lg font-mono text-xs transition-colors cursor-pointer ${
              filterLevel === lvl
                ? 'bg-[#D97706] text-black font-bold'
                : 'bg-[#151517] text-[#94A3B8] hover:text-[#E2E8F0] border border-[#2D2D30]'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      <div className="rounded-xl bg-[#111113] border border-[#1F1F21] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1F1F21] text-[#64748B] text-[10px] uppercase bg-[#151517]">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Category</th>
                <th className="p-4">Level</th>
                <th className="p-4">Audit Message</th>
                <th className="p-4">Log ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F21] text-[#94A3B8]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#151517]/50 transition-colors">
                  <td className="p-4 text-[#64748B] whitespace-nowrap text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="p-4 text-[#D97706]">{log.category}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.level === 'WARN'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : log.level === 'ERROR'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {log.level}
                    </span>
                  </td>
                  <td className="p-4 text-[#E2E8F0]">{log.message}</td>
                  <td className="p-4 text-[#64748B] text-[10px]">{log.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
