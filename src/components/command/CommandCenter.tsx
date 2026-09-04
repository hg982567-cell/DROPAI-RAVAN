import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal,
  Send,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
  Layers,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { api } from '../../services/api';
import { AICommandTask, RiskLevel } from '../../types';

interface CommandCenterProps {
  onHighRiskAuthRequired: (actionDesc: string, onAuthorized: () => void) => void;
  onRefreshData?: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ onHighRiskAuthRequired, onRefreshData }) => {
  const [inputCommand, setInputCommand] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTask, setActiveTask] = useState<AICommandTask | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const sampleCommands = [
    'Find 5 products with expected profit above $25 (₹2,000) and prepare them for my Shopify store.',
    'Check supplier stock for MagSafe phone mount and prepare backup routing if stock < 25.',
    'Audit dispute ticket #ret-1 for Order #DA-84913 and prepare high-value refund.',
    'Calculate recommended pricing for high-converting pet supplies to hit 55% net margin.',
  ];

  const handleExecute = async (cmdText?: string) => {
    const command = cmdText || inputCommand;
    if (!command.trim()) return;

    setIsRunning(true);
    setActiveTask(null);
    setCurrentStepIndex(0);

    try {
      const taskResult = await api.executeCommand(command);
      setActiveTask(taskResult);

      // Animate through steps sequentially
      if (taskResult.plan && taskResult.plan.length > 0) {
        for (let i = 0; i < taskResult.plan.length; i++) {
          setCurrentStepIndex(i);
          // Wait briefly for live stepping effect
          await new Promise((r) => setTimeout(r, 600));
        }
      }
    } catch (err) {
      console.error('Command execution failed', err);
    } finally {
      setIsRunning(false);
      if (onRefreshData) onRefreshData();
    }
  };

  const handleApprove = () => {
    if (!activeTask || !activeTask.approvalPayload) return;

    // If High Risk, invoke security PIN approval modal
    if (activeTask.riskLevel === 'HIGH') {
      onHighRiskAuthRequired(activeTask.approvalPayload.description, () => {
        if (activeTask) {
          setActiveTask({
            ...activeTask,
            status: 'COMPLETED',
            logs: [...activeTask.logs, `[Security PIN Verified] High-risk action authorized by operator.`, `[Execution Engine] Action committed successfully.`],
            resultSummary: `Approved and verified via Security PIN: ${activeTask.approvalPayload?.description}`,
            approvalPayload: undefined,
          });
        }
        if (onRefreshData) onRefreshData();
      });
    } else {
      // Medium risk approval directly
      setActiveTask({
        ...activeTask,
        status: 'COMPLETED',
        logs: [...activeTask.logs, `[Operator Approved] Action authorized. Staged changes committed to connected store.`],
        resultSummary: `Successfully approved: ${activeTask.approvalPayload.description}`,
        approvalPayload: undefined,
      });
      if (onRefreshData) onRefreshData();
    }
  };

  const handleReject = () => {
    if (!activeTask) return;
    setActiveTask({
      ...activeTask,
      status: 'CANCELLED',
      logs: [...activeTask.logs, `[Operator Rejected] Action aborted by operator. No store or financial state changed.`],
      resultSummary: 'Task was cancelled by operator request.',
      approvalPayload: undefined,
    });
  };

  return (
    <div id="ai-command-center-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-[#D97706]/15 border border-[#D97706]/30 text-[#D97706] text-xs font-mono font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              <span>AUTONOMOUS AGENT ORCHESTRATION</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
              AI Command Center
            </h1>
            <p className="text-xs text-[#94A3B8] max-w-xl leading-relaxed">
              Issue natural language operational commands. The agent plans multi-step tool calls, validates supplier data, checks risk tiers, and halts for operator authorization on sensitive actions.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="px-3 py-1.5 rounded-lg bg-[#151517] border border-[#1F1F21] text-[11px] font-mono text-emerald-400 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Tool Gateway: 12 Active</span>
            </span>
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecute();
            }}
            className="flex items-center space-x-2"
          >
            <div className="relative flex-1">
              <Terminal className="w-4 h-4 text-[#D97706] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="command-center-input"
                type="text"
                value={inputCommand}
                onChange={(e) => setInputCommand(e.target.value)}
                placeholder="Instruct the agent (e.g. Find 5 products with expected profit above $25 and prepare them for Shopify)..."
                disabled={isRunning}
                className="w-full pl-11 pr-4 py-3.5 rounded-lg bg-[#151517] border border-[#2D2D30] text-sm text-[#E2E8F0] placeholder-[#64748B] focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]/20 transition-all font-sans"
              />
            </div>

            <button
              id="submit-command-btn"
              type="submit"
              disabled={isRunning || !inputCommand.trim()}
              className="px-6 py-3.5 rounded-lg bg-[#D97706] text-black font-bold text-xs uppercase tracking-wider flex items-center space-x-2 hover:bg-[#B45309] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-[#D97706]/20 shrink-0"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Planning...</span>
                </>
              ) : (
                <>
                  <span>Execute</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Prompts */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-[#64748B]">Quick Prompts:</span>
            {sampleCommands.map((cmd, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputCommand(cmd);
                  handleExecute(cmd);
                }}
                disabled={isRunning}
                className="text-xs px-2.5 py-1 rounded-lg bg-[#151517] hover:bg-[#1F1F21] text-[#94A3B8] hover:text-[#E2E8F0] border border-[#1F1F21] transition-colors text-left truncate max-w-xs cursor-pointer disabled:opacity-40"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Agent Execution Box */}
      <AnimatePresence>
        {activeTask && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-6 shadow-2xl"
          >
            {/* Task Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1F1F21] pb-4 gap-2">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-[#64748B]">TASK ID: {activeTask.id}</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      activeTask.riskLevel === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : activeTask.riskLevel === 'MEDIUM'
                        ? 'bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {activeTask.riskLevel} RISK
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      activeTask.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : activeTask.status === 'WAITING_APPROVAL'
                        ? 'bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/30 animate-pulse'
                        : 'bg-[#151517] text-[#94A3B8] border border-[#1F1F21]'
                    }`}
                  >
                    STATUS: {activeTask.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-sm font-semibold text-[#E2E8F0]">
                  "{activeTask.command}"
                </div>
              </div>

              <div className="text-xs font-mono text-[#64748B]">
                Started {activeTask.timestamp}
              </div>
            </div>

            {/* Structured Step Progress Flow */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-[#64748B] uppercase tracking-wider font-semibold">
                Execution Steps & Tool Pipeline ({activeTask.plan.length} Steps)
              </div>

              <div className="space-y-2.5">
                {activeTask.plan.map((step, idx) => {
                  const isCurrent = idx === currentStepIndex && isRunning;
                  const isDone = idx < currentStepIndex || (!isRunning && step.status === 'COMPLETED');
                  const isWaiting = step.status === 'WAITING_APPROVAL';

                  return (
                    <div
                      key={step.id}
                      className={`p-3.5 rounded-lg border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                        isWaiting
                          ? 'bg-[#151517] border-[#D97706]/50 text-[#D97706]'
                          : isDone
                          ? 'bg-[#151517] border-[#1F1F21] text-[#E2E8F0]'
                          : isCurrent
                          ? 'bg-[#151517] border-[#D97706]/40 text-[#E2E8F0]'
                          : 'bg-[#0D0D0F] border-[#1F1F21] text-[#64748B]'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : isWaiting ? (
                            <AlertTriangle className="w-4 h-4 text-[#D97706] animate-bounce" />
                          ) : isCurrent ? (
                            <div className="w-4 h-4 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Clock className="w-4 h-4 text-[#64748B]" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs text-[#64748B]">Step {idx + 1}:</span>
                            <span className="text-xs font-medium text-[#E2E8F0]">{step.label}</span>
                          </div>
                          {step.outputSummary && (
                            <div className="text-[11px] text-[#94A3B8] mt-1 font-mono">
                              {step.outputSummary}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-end md:self-auto shrink-0 font-mono text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-[#1F1F21] text-[#94A3B8]">
                          tool: {step.tool}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded ${
                            step.risk === 'HIGH'
                              ? 'bg-rose-950/60 text-rose-400 border border-rose-900/50'
                              : step.risk === 'MEDIUM'
                              ? 'bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/30'
                              : 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/50'
                          }`}
                        >
                          {step.risk}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Approval Gate (If Waiting for Approval) */}
            {activeTask.approvalPayload && (
              <div className="rounded-lg bg-[#151517] border border-[#D97706]/50 p-5 space-y-4">
                <div className="flex items-start space-x-3">
                  <ShieldAlert className="w-6 h-6 text-[#D97706] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-serif text-[#E2E8F0]">
                      Operator Authorization Required ({activeTask.riskLevel} Risk Action)
                    </h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      {activeTask.approvalPayload.description}
                    </p>
                    {activeTask.approvalPayload.financialImpact && (
                      <div className="text-xs font-mono font-bold text-rose-400">
                        Direct Financial Impact: ${activeTask.approvalPayload.financialImpact.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2 border-t border-[#1F1F21]">
                  <button
                    id="reject-approval-btn"
                    onClick={handleReject}
                    className="px-4 py-2 rounded-lg text-xs font-medium bg-[#1F1F21] hover:bg-[#2D2D30] text-[#94A3B8] hover:text-[#E2E8F0] transition-colors cursor-pointer"
                  >
                    Reject & Cancel
                  </button>

                  <button
                    id="approve-action-btn"
                    onClick={handleApprove}
                    className="px-5 py-2 rounded-lg text-xs font-bold bg-[#D97706] hover:bg-[#B45309] text-black flex items-center space-x-1.5 transition-all shadow-md shadow-[#D97706]/20 cursor-pointer"
                  >
                    {activeTask.riskLevel === 'HIGH' && <Lock className="w-3.5 h-3.5 text-black" />}
                    <span>{activeTask.riskLevel === 'HIGH' ? 'Authorize with Security PIN' : 'Approve & Commit'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Result Summary */}
            {activeTask.resultSummary && !activeTask.approvalPayload && (
              <div className="rounded-lg bg-[#151517] border border-emerald-500/40 p-4 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-300">Task Completed Successfully</div>
                  <div className="text-xs text-[#94A3B8] mt-0.5 leading-relaxed">{activeTask.resultSummary}</div>
                </div>
              </div>
            )}

            {/* Live Terminal Logs Drawer */}
            <div className="rounded-lg bg-[#0A0A0B] border border-[#1F1F21] p-4 font-mono text-xs text-[#94A3B8] space-y-1 max-h-40 overflow-y-auto">
              <div className="text-[10px] text-[#64748B] pb-1 border-b border-[#1F1F21] flex items-center justify-between">
                <span>AUDIT TELEMETRY STREAM</span>
                <span>UTC TIMESTAMP</span>
              </div>
              {activeTask.logs.map((log, i) => (
                <div key={i} className="text-[11px] leading-relaxed">
                  <span className="text-[#D97706]">›</span> {log}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
