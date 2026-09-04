import React, { useState } from 'react';
import {
  LayoutDashboard,
  Terminal,
  Package,
  ShoppingBag,
  Menu,
  X,
  Search,
  DollarSign,
  Truck,
  Store,
  GitBranch,
  Shield,
  Settings,
} from 'lucide-react';

interface MobileNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentView, onNavigate }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'command', label: 'AI Agent', icon: Terminal },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
  ];

  const drawerItems = [
    { id: 'research', label: 'Product Research', icon: Search },
    { id: 'pricing', label: 'AI Pricing Engine', icon: DollarSign },
    { id: 'suppliers', label: 'Suppliers & Routing', icon: Truck },
    { id: 'stores', label: 'Store Integrations', icon: Store },
    { id: 'workflows', label: 'Automation Workflows', icon: GitBranch },
    { id: 'admin', label: 'Admin Panel', icon: Shield },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  const handleSelect = (viewId: string) => {
    onNavigate(viewId);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Drawer Overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-[#0A0A0B]/85 backdrop-blur-sm lg:hidden">
          <div className="bg-[#111113] border-t border-[#1F1F21] rounded-t-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1F1F21] pb-3">
              <span className="font-serif italic text-[#D97706] text-base font-semibold">DropAI Extended Navigation</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#94A3B8] hover:text-[#E2E8F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {drawerItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`flex items-center space-x-2.5 p-3 rounded-xl text-xs font-medium text-left border transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#1A1A1C] border-[#D97706] text-[#D97706] font-semibold'
                        : 'bg-[#151517] border-[#2D2D30] text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#1A1A1C]'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#D97706] shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Bar for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#0D0D0F]/95 backdrop-blur-lg border-t border-[#1F1F21] px-4 flex items-center justify-around lg:hidden">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
                isActive ? 'text-[#D97706] font-semibold' : 'text-[#64748B] hover:text-[#E2E8F0]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-xl text-[#64748B] hover:text-[#E2E8F0] cursor-pointer"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px]">More</span>
        </button>
      </nav>
    </>
  );
};
