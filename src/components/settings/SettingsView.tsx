import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Save,
  Eye,
  EyeOff,
  Cpu,
} from 'lucide-react';
import { api } from '../../services/api';
import { UserSession } from '../../types';

interface SettingsViewProps {
  startupAnimationEnabled: boolean;
  onToggleStartupAnimation: (enabled: boolean) => void;
  autoLockMinutes: number;
  pinHint: string;
  onUpdateSecuritySettings: (settings: { autoLockMinutes?: number; startupAnimationEnabled?: boolean; newPin?: string }) => void;
  sessions: UserSession[];
  onLogoutAllSessions: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  startupAnimationEnabled,
  onToggleStartupAnimation,
  autoLockMinutes,
  pinHint,
  onUpdateSecuritySettings,
  sessions,
  onLogoutAllSessions,
}) => {
  const [selectedAutoLock, setSelectedAutoLock] = useState(autoLockMinutes);
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinFeedback, setPinFeedback] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // External Adapter Keys state
  const [shopifyToken, setShopifyToken] = useState('shpat_live_8918239847192837');
  const [cjedToken, setCjToken] = useState('cj_api_prod_77218392182');
  const [stripeSecret, setStripeSecret] = useState('sk_live_9921839218238');
  const [showKeys, setShowKeys] = useState(false);

  const handleSaveSecurity = async () => {
    setPinFeedback('');
    if (newPinInput) {
      if (newPinInput.length !== 4 || isNaN(Number(newPinInput))) {
        setPinFeedback('PIN must be exactly 4 digits.');
        return;
      }
      if (newPinInput !== confirmPinInput) {
        setPinFeedback('PIN confirmation does not match.');
        return;
      }
    }

    onUpdateSecuritySettings({
      autoLockMinutes: selectedAutoLock,
      startupAnimationEnabled,
      newPin: newPinInput || undefined,
    });

    setSaveSuccess(true);
    setNewPinInput('');
    setConfirmPinInput('');
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div id="settings-view-container" className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
            Settings & Operational Guardrails
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Configure system auto-lock, 3D experience, security PIN, and external API adapter credentials.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-900 text-xs font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      {/* 3D Startup Experience Toggle */}
      <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#D97706]/10 text-[#D97706]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-[#E2E8F0]">3D Cinematic Startup Experience</h2>
              <p className="text-xs text-[#94A3B8]">
                Displays the WebGL Three.js interactive neural initialization when opening DropAI.
              </p>
            </div>
          </div>

          <button
            id="toggle-startup-settings-btn"
            onClick={() => onToggleStartupAnimation(!startupAnimationEnabled)}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              startupAnimationEnabled
                ? 'bg-[#D97706] text-black shadow-md shadow-[#D97706]/20 hover:bg-[#B45309]'
                : 'bg-[#151517] text-[#94A3B8] hover:text-[#E2E8F0] border border-[#2D2D30]'
            }`}
          >
            {startupAnimationEnabled ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>
      </div>

      {/* Auto-Lock & Security PIN */}
      <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-6">
        <div className="flex items-center space-x-3 border-b border-[#1F1F21] pb-4">
          <div className="p-2 rounded-lg bg-[#D97706]/10 text-[#D97706]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-serif font-bold text-[#E2E8F0]">Security PIN & Inactivity Auto-Lock</h2>
            <p className="text-xs text-[#94A3B8]">
              Protects sensitive dropshipping actions (e.g. refunds {'>'} $100 and bank transfers).
            </p>
          </div>
        </div>

        {/* Auto Lock Options */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#E2E8F0]">Inactivity Timeout Before Auto-Lock</label>
          <div className="flex flex-wrap gap-2">
            {[1, 3, 5, 10, 30].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setSelectedAutoLock(mins)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  selectedAutoLock === mins
                    ? 'bg-[#D97706] text-black font-bold'
                    : 'bg-[#151517] text-[#94A3B8] hover:text-[#E2E8F0] border border-[#2D2D30]'
                }`}
              >
                {mins} Minutes
              </button>
            ))}
          </div>
        </div>

        {/* Change PIN Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs text-[#94A3B8]">New 4-Digit Security PIN</label>
            <input
              type="password"
              maxLength={4}
              placeholder="e.g. 1234"
              value={newPinInput}
              onChange={(e) => setNewPinInput(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#E2E8F0] font-mono text-center tracking-widest text-lg focus:outline-none focus:border-[#D97706]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-[#94A3B8]">Confirm 4-Digit Security PIN</label>
            <input
              type="password"
              maxLength={4}
              placeholder="e.g. 1234"
              value={confirmPinInput}
              onChange={(e) => setConfirmPinInput(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#E2E8F0] font-mono text-center tracking-widest text-lg focus:outline-none focus:border-[#D97706]"
            />
          </div>
        </div>

        {pinFeedback && (
          <div className="text-xs text-rose-400 font-mono flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{pinFeedback}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-[#1F1F21]">
          <span className="text-[11px] text-[#64748B] font-mono">Current Hint: {pinHint}</span>
          <button
            onClick={handleSaveSecurity}
            className="px-5 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-black font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-[#D97706]/20 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Security Settings</span>
          </button>
        </div>
      </div>

      {/* Active Sessions & Devices */}
      <div className="rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1F1F21] pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#D97706]/10 text-[#D97706]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-[#E2E8F0]">Authorized Sessions & Devices</h2>
              <p className="text-xs text-[#94A3B8]">Inspect active sessions across your dropshipping team.</p>
            </div>
          </div>

          <button
            onClick={onLogoutAllSessions}
            className="px-3.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-900 text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate Other Sessions</span>
          </button>
        </div>

        <div className="space-y-3">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="p-3.5 rounded-lg bg-[#151517] border border-[#1F1F21] flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[#E2E8F0]">{sess.device}</span>
                  {sess.isCurrent && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/30">
                      THIS DEVICE
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#64748B] font-mono">
                  {sess.ipAddress} • {sess.location} • Last active: {sess.lastActive}
                </div>
              </div>

              <span className="text-[10px] font-mono text-emerald-400">ACTIVE</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
