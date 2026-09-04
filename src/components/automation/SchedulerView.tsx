import React from 'react';
import {
  CalendarClock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';
import { ScheduledJob } from '../../types';

interface SchedulerViewProps {
  jobs: ScheduledJob[];
}

export const SchedulerView: React.FC<SchedulerViewProps> = ({ jobs }) => {
  return (
    <div id="scheduler-view-container" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
            Autonomous Job Scheduler
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Real-time cron scheduler managing stock polling, carrier tracking webhooks, and catalog sync.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs text-[#94A3B8] bg-[#111113] border border-[#1F1F21] px-3 py-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Internal Cron Daemon: ACTIVE</span>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="rounded-xl bg-[#111113] border border-[#1F1F21] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1F1F21] text-[#64748B] font-mono text-[10px] uppercase bg-[#151517]">
                <th className="p-4">Job Name</th>
                <th className="p-4">Frequency / Cron</th>
                <th className="p-4">Status</th>
                <th className="p-4">Next Execution</th>
                <th className="p-4">Last Run Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F21] text-[#94A3B8]">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-[#151517]/50 transition-colors">
                  <td className="p-4">
                    <div className="font-serif font-bold text-white">{job.name}</div>
                    <div className="text-[10px] text-[#64748B] font-mono mt-0.5">{job.id}</div>
                  </td>

                  <td className="p-4 font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#151517] text-[#D97706] border border-[#2D2D30] text-[11px]">
                      {job.frequency}
                    </span>
                  </td>

                  <td className="p-4 font-mono">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] ${
                        job.status === 'ACTIVE'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
                          : 'bg-[#151517] border border-[#2D2D30] text-[#64748B]'
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>

                  <td className="p-4 font-mono text-[#D97706] text-xs">
                    {job.nextRunIn}
                  </td>

                  <td className="p-4 font-mono text-xs">
                    <div className="flex items-center space-x-1.5 text-[#E2E8F0]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{job.lastRunStatus}</span>
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => alert(`Manual trigger initiated for ${job.name}`)}
                      className="px-3 py-1 rounded-lg bg-[#151517] hover:bg-[#1F1F21] text-[#E2E8F0] border border-[#2D2D30] text-xs font-medium transition-colors cursor-pointer"
                    >
                      Run Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
