import React, { useState } from 'react';
import {
  Lock,
  Bell,
  Sparkles,
  Store,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Terminal,
  Search,
  ExternalLink,
} from 'lucide-react';
import { NotificationItem, StoreIntegration } from '../../types';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLockNow: () => void;
  onOpenCommand: () => void;
  stores: StoreIntegration[];
  selectedStoreId: string;
  onSelectStoreId: (id: string) => void;
  notifications: NotificationItem[];
  onMarkAllNotificationsRead: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onLockNow,
  onOpenCommand,
  stores,
  selectedStoreId,
  onSelectStoreId,
  notifications,
  onMarkAllNotificationsRead,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const currentStore = stores.find((s) => s.id === selectedStoreId);

  return (
    <header className="sticky top-0 z-30 h-20 w-full bg-[#0A0A0B]/90 backdrop-blur-md border-b border-[#1F1F21] px-4 md:px-8 flex items-center justify-between">
      {/* Left: Active Store Switcher & Global AI Prompt Bar */}
      <div className="flex items-center space-x-3 md:space-x-5 flex-1 max-w-2xl mr-4">
        <div className="relative group">
          <button
            id="store-switcher-dropdown-btn"
            className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-[#151517] border border-[#2D2D30] text-xs font-medium text-[#E2E8F0] hover:border-[#D97706]/60 transition-colors cursor-pointer"
          >
            <Store className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="max-w-[130px] md:max-w-[160px] truncate font-medium">
              {currentStore ? currentStore.name : 'All Channels'}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
              {currentStore ? currentStore.platform : 'MULTI'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
          </button>

          {/* Store Switcher Menu */}
          <div className="hidden group-hover:block absolute left-0 top-full mt-1.5 w-64 rounded-xl bg-[#111113] border border-[#1F1F21] shadow-2xl p-2 z-50">
            <div className="text-[10px] font-mono text-[#64748B] px-2 py-1 uppercase tracking-wider font-semibold">
              CONNECTED CHANNELS
            </div>
            <button
              onClick={() => onSelectStoreId('all')}
              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between hover:bg-[#1A1A1C] transition-colors cursor-pointer ${
                selectedStoreId === 'all' ? 'bg-[#1A1A1C] text-[#D97706] font-semibold border-l-2 border-[#D97706]' : 'text-[#94A3B8]'
              }`}
            >
              <span>All Connected Stores</span>
              <span className="font-mono text-[10px] text-[#64748B]">Total 2</span>
            </button>
            {stores.map((s) => (
              <button
                key={s.id}
                onClick={() => onSelectStoreId(s.id)}
                className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between hover:bg-[#1A1A1C] transition-colors cursor-pointer ${
                  selectedStoreId === s.id ? 'bg-[#1A1A1C] text-[#D97706] font-semibold border-l-2 border-[#D97706]' : 'text-[#94A3B8]'
                }`}
              >
                <div className="truncate">
                  <div className="truncate text-slate-200">{s.name}</div>
                  <div className="text-[10px] text-[#64748B] font-mono">{s.platform} • {s.status === 'CONNECTED' ? 'Synced' : 'Not setup'}</div>
                </div>
                {s.status === 'CONNECTED' && <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Sophisticated Dark Prompt / Search Bar */}
        <div className="relative group flex-1 hidden sm:block max-w-lg">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D97706] font-mono text-sm font-bold">/</span>
          <input
            type="text"
            onClick={onOpenCommand}
            readOnly
            placeholder='Ask AI Agent: "Find 5 high-margin products for Shopify..."'
            className="w-full bg-[#151517] border border-[#2D2D30] rounded-full py-2 pl-10 pr-12 text-xs text-[#E2E8F0] focus:outline-none focus:border-[#D97706] placeholder-[#64748B] hover:border-[#1F1F21] transition-all cursor-pointer"
          />
          <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-[#1A1A1C] border border-[#2D2D30] px-1.5 py-0.5 rounded text-[#94A3B8]">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls: Balance, Automation, Alerts, Lock */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* AI Credit Balance */}
        <div className="hidden xl:block text-right">
          <p className="text-[10px] text-[#64748B] uppercase tracking-widest font-semibold">AI Credit Balance</p>
          <p className="text-sm font-mono text-[#D97706] font-bold">14,204.00</p>
        </div>

        <div className="hidden xl:block h-8 w-[1px] bg-[#1F1F21]"></div>

        {/* High-Contrast "NEW AUTOMATION" Button */}
        <button
          id="nav-new-automation-header-btn"
          onClick={() => onNavigate('workflows')}
          className="px-4 py-2 bg-white text-black hover:bg-slate-200 text-xs font-bold rounded shadow-lg transition-all cursor-pointer hidden md:inline-flex items-center space-x-1.5"
        >
          <span>NEW AUTOMATION</span>
        </button>

        {/* AI Command Center Shortcut Button */}
        <button
          id="nav-command-center-header-btn"
          onClick={() => onNavigate('command')}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[#151517] border border-[#2D2D30] text-[#E2E8F0] hover:border-[#D97706] transition-all cursor-pointer"
        >
          <Terminal className="w-3.5 h-3.5 text-[#D97706]" />
          <span className="hidden md:inline">Command</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            id="notifications-toggle-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#94A3B8] hover:text-[#E2E8F0] hover:border-[#1F1F21] transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D97706] text-black font-bold text-[10px] flex items-center justify-center shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Tray Modal */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 md:w-96 rounded-2xl bg-[#111113] border border-[#1F1F21] shadow-2xl p-4 z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1F1F21] pb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-[#E2E8F0]">Alerts & Telemetry</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#151517] text-[#94A3B8]">
                    {unreadCount} unread
                  </span>
                </div>
                <button
                  onClick={onMarkAllNotificationsRead}
                  className="text-[11px] text-[#D97706] hover:underline cursor-pointer"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 pr-1 divide-y divide-[#1F1F21]">
                {notifications.map((notif) => (
                  <div key={notif.id} className="pt-2 text-left space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${notif.severity === 'CRITICAL' ? 'text-rose-400 font-bold' : notif.severity === 'WARNING' ? 'text-[#D97706]' : 'text-slate-200'}`}>
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-[#64748B] font-mono">{notif.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lock Now Action */}
        <button
          id="manual-lock-header-btn"
          onClick={onLockNow}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#94A3B8] hover:text-rose-400 hover:border-rose-900/50 transition-colors text-xs cursor-pointer"
          title="Manual Security Lock (Requires PIN to resume)"
        >
          <Lock className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-mono">Lock</span>
        </button>
      </div>
    </header>
  );
};
