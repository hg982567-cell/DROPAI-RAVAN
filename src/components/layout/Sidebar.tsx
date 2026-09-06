import React from 'react';
import {
  LayoutDashboard,
  Terminal,
  Package,
  Search,
  DollarSign,
  Truck,
  Store,
  ShoppingBag,
  Send,
  RotateCcw,
  Users,
  Megaphone,
  Headphones,
  GitBranch,
  CalendarClock,
  Boxes,
  PieChart,
  BrainCircuit,
  FileText,
  CreditCard,
  Shield,
  ShieldCheck,
  Settings,
  HelpCircle,
  Activity,
  Cpu,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

interface NavGroup {
  label: string;
  items: {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navGroups: NavGroup[] = [
    {
      label: 'CORE OS',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'command', label: 'AI Command Center', icon: Terminal, badge: 'Agent' },
      ],
    },
    {
      label: 'COMMERCE ENGINE',
      items: [
        { id: 'products', label: 'Product Catalog', icon: Package },
        { id: 'research', label: 'Product Research', icon: Search, badge: 'AI' },
        { id: 'pricing', label: 'AI Pricing Engine', icon: DollarSign },
        { id: 'suppliers', label: 'Suppliers & Routing', icon: Truck },
        { id: 'stores', label: 'Store Integrations', icon: Store },
        { id: 'orders', label: 'Order Lifecycle', icon: ShoppingBag },
        { id: 'shipping', label: 'Shipping Logistics', icon: Send },
        { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw, badge: 'PIN' },
        { id: 'inventory', label: 'Inventory & Dead-Stock', icon: Boxes },
      ],
    },
    {
      label: 'INTELLIGENCE & CRM',
      items: [
        { id: 'crm', label: 'Customers CRM', icon: Users },
        { id: 'marketing', label: 'AI Marketing & Ads', icon: Megaphone },
        { id: 'support', label: 'AI Support Copilot', icon: Headphones },
        { id: 'memory', label: 'AI Memory & Prefs', icon: BrainCircuit },
        { id: 'analytics', label: 'Analytics & BI', icon: PieChart },
      ],
    },
    {
      label: 'AUTONOMOUS WORKFLOWS',
      items: [
        { id: 'workflows', label: 'Workflow Builder', icon: GitBranch, badge: 'Live' },
        { id: 'scheduler', label: 'Job Scheduler', icon: CalendarClock },
      ],
    },
    {
      label: 'OPERATIONS & SYSTEM',
      items: [
        { id: 'security', label: 'Security & API Gateway', icon: ShieldCheck, badge: '96%' },
        { id: 'finance', label: 'Payments & P&L', icon: Activity },
        { id: 'billing', label: 'Billing & Token Usage', icon: CreditCard },
        { id: 'logs', label: 'Monitoring & Logs', icon: FileText },
        { id: 'admin', label: 'Admin Panel (RBAC)', icon: Shield },
        { id: 'settings', label: 'Settings & API Keys', icon: Settings },
        { id: 'help', label: 'Help & Documentation', icon: HelpCircle },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#0D0D0F] border-r border-[#1F1F21] flex flex-col justify-between h-screen sticky top-0 overflow-y-auto select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#1F1F21]/70">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#D97706] flex items-center justify-center text-black font-black shadow-md shadow-[#D97706]/20">
            <Cpu className="w-4 h-4 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-serif italic tracking-tight text-[#D97706]">DropAI</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#64748B] font-semibold mt-0.5">
              Production System v2.1
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Group Items */}
      <div className="flex-1 px-3 py-4 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            <div className="px-3 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-[#64748B] mb-1">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`sidebar-nav-${item.id}`}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#1A1A1C] text-white rounded-lg border-l-2 border-[#D97706] font-semibold'
                        : 'text-[#94A3B8] hover:bg-[#151517] hover:text-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D97706]' : 'text-[#64748B]'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          item.badge === 'Agent'
                            ? 'bg-[#D97706]/15 text-[#D97706] border border-[#D97706]/30'
                            : item.badge === 'PIN'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : item.badge === 'Live'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-[#1F1F21] text-[#94A3B8]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Operator User Card & System Status */}
      <div className="p-4 border-t border-[#1F1F21] bg-[#0A0A0B]/80 space-y-3">
        <div className="flex items-center space-x-3 p-2.5 bg-[#151517] border border-[#1F1F21] rounded-xl">
          <div className="w-8 h-8 rounded-full bg-[#D97706] flex items-center justify-center text-xs font-bold text-black shrink-0">
            OP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate text-[#E2E8F0]">Jonathan Doe</p>
            <p className="text-[10px] text-emerald-400 font-mono flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1.5 animate-pulse" />
              System Active
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] px-1">
          <span>AI Node: Online</span>
          <span className="text-[#D97706]">99.98%</span>
        </div>
      </div>
    </aside>
  );
};
