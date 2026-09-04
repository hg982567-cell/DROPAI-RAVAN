import React, { useState } from 'react';
import {
  GitBranch,
  Play,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { AutomationWorkflow } from '../../types';
import { api } from '../../services/api';

interface WorkflowBuilderProps {
  workflows: AutomationWorkflow[];
  onRefreshWorkflows?: () => void;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  workflows: initialWorkflows,
  onRefreshWorkflows,
}) => {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>(initialWorkflows);
  const [simulatingId, setSimulatingId] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const handleToggle = async (id: string) => {
    try {
      const updated = await api.toggleWorkflow(id);
      setWorkflows((prev) => prev.map((w) => (w.id === id ? updated : w)));
      if (onRefreshWorkflows) onRefreshWorkflows();
    } catch (err) {
      console.error('Toggle failed', err);
    }
  };

  const handleSimulate = async (id: string) => {
    setSimulatingId(id);
    setSimulationResult(null);
    try {
      const result = await api.simulateWorkflow(id);
      setSimulationResult(result);
    } catch (err) {
      console.error('Simulation error', err);
    } finally {
      setSimulatingId(null);
    }
  };

  return (
    <div id="workflow-builder-container" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
            Autonomous Workflows & Automation Engine
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Event-driven triggers, conditional logic gates, and autonomous dropshipping actions.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs text-emerald-400 bg-[#111113] border border-[#1F1F21] px-3 py-1.5 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Worker Node: Polling Every 60s</span>
        </div>
      </div>

      {/* Simulation Result Drawer (if active) */}
      {simulationResult && (
        <div className="p-5 rounded-xl bg-[#151517] border border-[#D97706]/40 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1F1F21] pb-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#D97706]" />
              <span className="text-sm font-serif font-bold text-white">
                Dry-Run Simulation: {simulationResult.workflowName}
              </span>
            </div>
            <button
              onClick={() => setSimulationResult(null)}
              className="text-xs text-[#64748B] hover:text-white cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 text-[#94A3B8]">
              <div>
                <span className="text-[#64748B] font-mono">Trigger Event:</span>{' '}
                <span className="font-bold text-[#E2E8F0]">{simulationResult.trigger}</span>
              </div>
              <div>
                <span className="text-[#64748B] font-mono">Impacted Items:</span>{' '}
                <span className="text-[#D97706]">
                  {simulationResult.impactedEntities[0]?.name}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] font-mono">Automated Action:</span>{' '}
                <span className="text-emerald-400 font-semibold">
                  {simulationResult.impactedEntities[0]?.actionTaken}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#111113] border border-[#1F1F21] space-y-1 font-mono text-[11px]">
              <div className="text-emerald-400 font-bold">
                Financial Impact: {simulationResult.estimatedFinancialImpact}
              </div>
              <div className="text-[#94A3B8]">{simulationResult.riskAnalysis}</div>
            </div>
          </div>
        </div>
      )}

      {/* Workflows Cards */}
      <div className="space-y-6">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-5 shadow-sm hover:border-[#2D2D30] transition-all"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#D97706]">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-serif font-bold text-white">{wf.name}</h3>
                </div>
                <p className="text-xs text-[#94A3B8] pl-11">{wf.description}</p>
              </div>

              {/* Status & Toggle */}
              <div className="flex items-center space-x-3 self-end sm:self-auto">
                <button
                  id={`simulate-wf-${wf.id}`}
                  onClick={() => handleSimulate(wf.id)}
                  disabled={simulatingId === wf.id}
                  className="px-3 py-1.5 rounded-lg bg-[#151517] hover:bg-[#1F1F21] text-[#E2E8F0] border border-[#2D2D30] text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-40"
                >
                  <Play className={`w-3.5 h-3.5 text-[#D97706] ${simulatingId === wf.id ? 'animate-spin' : ''}`} />
                  <span>{simulatingId === wf.id ? 'Simulating...' : 'Simulate Dry-Run'}</span>
                </button>

                <button
                  id={`toggle-wf-${wf.id}`}
                  onClick={() => handleToggle(wf.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    wf.isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-[#151517] border border-[#2D2D30] text-[#94A3B8] hover:text-[#E2E8F0]'
                  }`}
                >
                  {wf.isActive ? 'ACTIVE' : 'PAUSED'}
                </button>
              </div>
            </div>

            {/* Visual Node Chain */}
            <div className="p-4 rounded-lg bg-[#151517] border border-[#1F1F21]">
              <div className="text-[10px] font-mono text-[#64748B] mb-2">EXECUTION PIPELINE</div>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                {wf.nodes.map((node, i) => (
                  <React.Fragment key={node.id}>
                    <div
                      className={`p-3 rounded-lg border flex-1 space-y-1 ${
                        node.type === 'TRIGGER'
                          ? 'bg-[#111113] border-[#D97706]/40 text-[#D97706]'
                          : node.type === 'CONDITION'
                          ? 'bg-[#111113] border-amber-500/40 text-amber-300'
                          : 'bg-[#111113] border-emerald-500/40 text-emerald-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9px] font-mono font-bold uppercase tracking-wider">
                        <span>{node.type}</span>
                        <span>NODE #{i + 1}</span>
                      </div>
                      <div className="text-xs font-semibold text-white">{node.label}</div>
                      <div className="text-[10px] opacity-75 font-mono truncate text-[#94A3B8]">
                        {node.actionTarget || 'Rule condition'}
                      </div>
                    </div>

                    {i < wf.nodes.length - 1 && (
                      <div className="hidden md:flex text-[#64748B]">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Footer telemetry */}
            <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] pt-1">
              <span>Total Automated Executions: {wf.executionCount}</span>
              <span>Last Run: {wf.lastExecutedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
