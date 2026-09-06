import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  INITIAL_SECURITY_CONFIG,
  INITIAL_SESSIONS,
  INITIAL_SUPPLIERS,
  INITIAL_STORES,
  INITIAL_PRODUCTS,
  INITIAL_RESEARCH_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_RETURNS,
  INITIAL_WORKFLOWS,
  INITIAL_SCHEDULED_JOBS,
  INITIAL_AI_MEMORY,
  INITIAL_CUSTOMERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_LOGS,
} from './data/mockData';
import {
  Product,
  ResearchProduct,
  Supplier,
  StoreIntegration,
  Order,
  ReturnRefundTicket,
  AutomationWorkflow,
  ScheduledJob,
  AIMemoryItem,
  CustomerProfile,
  NotificationItem,
  SystemLog,
  UserSession,
} from './types';
import { api } from './services/api';

// Core Layout & Security
import { StartupAnimation3D } from './components/startup/StartupAnimation3D';
import { SecurityLockScreen } from './components/security/SecurityLockScreen';
import { PinAuthModal } from './components/security/PinAuthModal';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

// Platform Views
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { CommandCenter } from './components/command/CommandCenter';
import { ProductCatalog } from './components/products/ProductCatalog';
import { ProductResearch } from './components/products/ProductResearch';
import { PricingEngine } from './components/products/PricingEngine';
import { AICopywriterModal } from './components/products/AICopywriterModal';
import { SupplierManagement } from './components/suppliers/SupplierManagement';
import { StoreIntegrations } from './components/stores/StoreIntegrations';
import { OrderLifecycle } from './components/orders/OrderLifecycle';
import { OrderDetailsModal } from './components/orders/OrderDetailsModal';
import { ReturnsRefunds } from './components/orders/ReturnsRefunds';
import { DeadStockManager } from './components/inventory/DeadStockManager';
import { CustomersCRM } from './components/crm/CustomersCRM';
import { MarketingCampaigns } from './components/marketing/MarketingCampaigns';
import { AISupportCopilot } from './components/support/AISupportCopilot';
import { AIMemoryManager } from './components/memory/AIMemoryManager';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { WorkflowBuilder } from './components/automation/WorkflowBuilder';
import { SchedulerView } from './components/automation/SchedulerView';
import { FinanceView } from './components/finance/FinanceView';
import { SystemLogsView } from './components/monitoring/SystemLogsView';
import { AdminPanel } from './components/admin/AdminPanel';
import { SettingsView } from './components/settings/SettingsView';
import { HelpDocsView } from './components/help/HelpDocsView';

export default function App() {
  // App Lifecycle States
  const [hasCompletedStartup, setHasCompletedStartup] = useState<boolean>(false);
  const [startupAnimationEnabled, setStartupAnimationEnabled] = useState<boolean>(true);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedStoreId, setSelectedStoreId] = useState<string>('store-1');

  // Security Configuration
  const [securityPin, setSecurityPin] = useState<string>('881062');
  const [pinHint, setPinHint] = useState<string>('Default PIN is 881062');
  const [autoLockMinutes, setAutoLockMinutes] = useState<number>(10);
  const [sessions, setSessions] = useState<UserSession[]>(INITIAL_SESSIONS);

  // High-Risk Operator PIN Gate State
  const [pinGateModal, setPinGateModal] = useState<{
    isOpen: boolean;
    actionDescription: string;
    onAuthorized: () => void;
  }>({
    isOpen: false,
    actionDescription: '',
    onAuthorized: () => {},
  });

  // Domain Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [researchProducts, setResearchProducts] = useState<ResearchProduct[]>(INITIAL_RESEARCH_PRODUCTS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [stores, setStores] = useState<StoreIntegration[]>(INITIAL_STORES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [returns, setReturns] = useState<ReturnRefundTicket[]>(INITIAL_RETURNS);
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>(INITIAL_WORKFLOWS);
  const [jobs, setJobs] = useState<ScheduledJob[]>(INITIAL_SCHEDULED_JOBS);
  const [memoryItems, setMemoryItems] = useState<AIMemoryItem[]>(INITIAL_AI_MEMORY);
  const [customers, setCustomers] = useState<CustomerProfile[]>(INITIAL_CUSTOMERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [logs, setLogs] = useState<SystemLog[]>(INITIAL_LOGS);

  // Active Modals & Selected Entities
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copywriterModalProduct, setCopywriterModalProduct] = useState<Product | null>(null);
  const [supportCopilotTargetOrder, setSupportCopilotTargetOrder] = useState<string>('');

  // Inactivity Auto-Lock detection
  const lastActivityRef = useRef<number>(Date.now());

  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  useEffect(() => {
    const handleUserEvent = () => resetActivity();
    window.addEventListener('mousemove', handleUserEvent);
    window.addEventListener('keydown', handleUserEvent);
    window.addEventListener('click', handleUserEvent);
    window.addEventListener('scroll', handleUserEvent);

    const interval = setInterval(() => {
      if (autoLockMinutes > 0 && !isLocked && hasCompletedStartup) {
        const inactiveDurationMs = Date.now() - lastActivityRef.current;
        if (inactiveDurationMs > autoLockMinutes * 60 * 1000) {
          setIsLocked(true);
        }
      }
    }, 15000);

    return () => {
      window.removeEventListener('mousemove', handleUserEvent);
      window.removeEventListener('keydown', handleUserEvent);
      window.removeEventListener('click', handleUserEvent);
      window.removeEventListener('scroll', handleUserEvent);
      clearInterval(interval);
    };
  }, [autoLockMinutes, isLocked, hasCompletedStartup, resetActivity]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K opens AI Command Center
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCurrentView('command');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch initial state from backend if available
  useEffect(() => {
    const loadBackendData = async () => {
      try {
        const secConfig = await api.getSecurityConfig();
        if (secConfig) {
          if (secConfig.startupAnimationEnabled !== undefined) {
            setStartupAnimationEnabled(secConfig.startupAnimationEnabled);
          }
          if (secConfig.autoLockMinutes !== undefined) {
            setAutoLockMinutes(secConfig.autoLockMinutes);
          }
          if (secConfig.pinHint) {
            setPinHint(secConfig.pinHint);
          }
        }
      } catch {
        // Fallback gracefully to default state
      }
    };
    loadBackendData();
  }, []);

  // Handlers
  const handleStartupComplete = () => {
    setHasCompletedStartup(true);
    resetActivity();
  };

  const handleUnlock = () => {
    setIsLocked(false);
    resetActivity();
  };

  const handleLockNow = () => {
    setIsLocked(true);
    api.lockSystem().catch(() => {});
  };

  const handleOpenPinGate = (actionDescription: string, onAuthorized: () => void) => {
    setPinGateModal({
      isOpen: true,
      actionDescription,
      onAuthorized: () => {
        setPinGateModal({ isOpen: false, actionDescription: '', onAuthorized: () => {} });
        onAuthorized();
      },
    });
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleUpdateOrder = (id: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updates } : o))
    );
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const handleSecuritySettingsUpdate = async (settings: {
    autoLockMinutes?: number;
    startupAnimationEnabled?: boolean;
    newPin?: string;
  }) => {
    if (settings.autoLockMinutes !== undefined) {
      setAutoLockMinutes(settings.autoLockMinutes);
    }
    if (settings.startupAnimationEnabled !== undefined) {
      setStartupAnimationEnabled(settings.startupAnimationEnabled);
    }
    if (settings.newPin) {
      setSecurityPin(settings.newPin);
      setPinHint(`PIN updated on ${new Date().toLocaleDateString()}`);
    }
    try {
      await api.updateSecuritySettings(settings);
    } catch {
      // Handled locally
    }
  };

  const handleLogoutAllSessions = async () => {
    try {
      const res = await api.logoutAll();
      if (res.sessions) {
        setSessions(res.sessions);
      }
    } catch {
      setSessions((prev) => prev.filter((s) => s.isCurrent));
    }
  };

  // 1. Show Startup Animation if enabled and not yet completed
  if (startupAnimationEnabled && !hasCompletedStartup) {
    return <StartupAnimation3D onComplete={handleStartupComplete} />;
  }

  // 2. Show Security Lock Screen if locked
  if (isLocked) {
    return (
      <SecurityLockScreen
        isLocked={isLocked}
        onUnlock={handleUnlock}
        pinHint={pinHint}
        biometricEnabled={true}
      />
    );
  }

  // 3. Render Main DropAI Operating System
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E2E8F0] flex flex-col antialiased selection:bg-[#D97706] selection:text-black">
      {/* Top Header */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        onLockNow={handleLockNow}
        onOpenCommand={() => setCurrentView('command')}
        stores={stores}
        selectedStoreId={selectedStoreId}
        onSelectStoreId={setSelectedStoreId}
        notifications={notifications}
        onMarkAllNotificationsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        }
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar currentView={currentView} onNavigate={setCurrentView} />
        </div>

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* View Switching */}
            {currentView === 'dashboard' && (
              <DashboardOverview
                onNavigate={setCurrentView}
                onOpenProductModal={(p) => setCopywriterModalProduct(p)}
                products={products}
                orders={orders}
                stores={stores}
                workflows={workflows}
                suppliers={suppliers}
                onOpenOrder={(order) => setSelectedOrder(order)}
              />
            )}

            {currentView === 'command' && (
              <CommandCenter
                onExecuteHighRiskPinAuth={handleOpenPinGate}
                onNavigate={setCurrentView}
                activeStoreId={selectedStoreId}
              />
            )}

            {currentView === 'products' && (
              <ProductCatalog
                products={products}
                stores={stores}
                onAddProduct={(newProd) =>
                  setProducts((prev) => [
                    {
                      id: `prod-${Date.now()}`,
                      title: newProd.title || 'Untitled Listing',
                      handle: (newProd.title || 'listing').toLowerCase().replace(/\s+/g, '-'),
                      description: newProd.description || '',
                      seoTitle: newProd.title || '',
                      seoDescription: '',
                      category: newProd.category || 'General',
                      tags: ['New', 'Auto-Draft'],
                      imageUrl: newProd.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
                      status: 'DRAFT',
                      baseCost: newProd.baseCost || 15,
                      shippingCost: newProd.shippingCost || 4.5,
                      sellingPrice: newProd.sellingPrice || 49.99,
                      compareAtPrice: (newProd.sellingPrice || 49.99) * 1.5,
                      targetMarginPct: 55,
                      netProfit: 25,
                      stockTotal: 100,
                      lowStockThreshold: 20,
                      syncStatus: 'SYNCED',
                      suppliers: [],
                      demandScore: 80,
                      competitionScore: 40,
                      opportunityScore: 78,
                      createdAt: new Date().toISOString(),
                      salesLast30Days: 0,
                    },
                    ...prev,
                  ])
                }
                onUpdateProduct={(id, updates) =>
                  setProducts((prev) =>
                    prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
                  )
                }
                onDeleteProduct={(id) =>
                  setProducts((prev) => prev.filter((p) => p.id !== id))
                }
                onOpenAICopywriter={(p) => setCopywriterModalProduct(p)}
              />
            )}

            {currentView === 'research' && (
              <ProductResearch
                researchProducts={researchProducts}
                onImportProduct={(p) => {
                  setProducts((prev) => [p, ...prev]);
                  setCurrentView('products');
                }}
              />
            )}

            {currentView === 'pricing' && (
              <PricingEngine
                products={products}
                onSavePriceOverride={(productId, newPrice) => {
                  setProducts((prev) =>
                    prev.map((p) =>
                      p.id === productId ? { ...p, sellingPrice: newPrice } : p
                    )
                  );
                }}
              />
            )}

            {currentView === 'suppliers' && (
              <SupplierManagement suppliers={suppliers} />
            )}

            {currentView === 'stores' && (
              <StoreIntegrations
                stores={stores}
                onRefreshStores={() => {}}
              />
            )}

            {(currentView === 'orders' || currentView === 'shipping') && (
              <OrderLifecycle
                orders={orders}
                onOpenOrder={(order) => setSelectedOrder(order)}
                onUpdateOrder={handleUpdateOrder}
              />
            )}

            {currentView === 'returns' && (
              <ReturnsRefunds
                returns={returns}
                onRequirePin={handleOpenPinGate}
              />
            )}

            {currentView === 'inventory' && (
              <DeadStockManager products={products} />
            )}

            {currentView === 'crm' && (
              <CustomersCRM customers={customers} />
            )}

            {currentView === 'marketing' && (
              <MarketingCampaigns products={products} />
            )}

            {currentView === 'support' && (
              <AISupportCopilot
                orders={orders}
                initialOrderNumber={supportCopilotTargetOrder}
                onOpenOrderModal={(order) => setSelectedOrder(order)}
              />
            )}

            {currentView === 'memory' && (
              <AIMemoryManager memoryItems={memoryItems} />
            )}

            {currentView === 'analytics' && (
              <AnalyticsDashboard orders={orders} products={products} />
            )}

            {currentView === 'workflows' && (
              <WorkflowBuilder workflows={workflows} />
            )}

            {currentView === 'scheduler' && (
              <SchedulerView jobs={jobs} />
            )}

            {(currentView === 'finance' || currentView === 'billing') && (
              <FinanceView orders={orders} />
            )}

            {currentView === 'logs' && (
              <SystemLogsView logs={logs} />
            )}

            {currentView === 'admin' && (
              <AdminPanel />
            )}

            {currentView === 'settings' && (
              <SettingsView
                startupAnimationEnabled={startupAnimationEnabled}
                onToggleStartupAnimation={(enabled) => {
                  setStartupAnimationEnabled(enabled);
                  handleSecuritySettingsUpdate({ startupAnimationEnabled: enabled });
                }}
                autoLockMinutes={autoLockMinutes}
                pinHint={pinHint}
                onUpdateSecuritySettings={handleSecuritySettingsUpdate}
                sessions={sessions}
                onLogoutAllSessions={handleLogoutAllSessions}
              />
            )}

            {currentView === 'help' && (
              <HelpDocsView />
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav currentView={currentView} onNavigate={setCurrentView} />

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStage={(newStage) =>
            handleUpdateOrder(selectedOrder.id, { orderLifecycle: newStage })
          }
          onOpenAICopilot={(ordNum) => {
            setSupportCopilotTargetOrder(ordNum);
            setSelectedOrder(null);
            setCurrentView('support');
          }}
        />
      )}

      {/* AI Copywriter Modal */}
      {copywriterModalProduct && (
        <AICopywriterModal
          product={copywriterModalProduct}
          onClose={() => setCopywriterModalProduct(null)}
          onApplyCopy={(newTitle, newDesc) => {
            handleUpdateProduct({
              ...copywriterModalProduct,
              title: newTitle,
              description: newDesc,
            });
            setCopywriterModalProduct(null);
          }}
        />
      )}

      {/* High-Risk Security PIN Authorization Gate */}
      {pinGateModal.isOpen && (
        <PinAuthModal
          actionDescription={pinGateModal.actionDescription}
          onAuthorized={pinGateModal.onAuthorized}
          onCancel={() =>
            setPinGateModal({
              isOpen: false,
              actionDescription: '',
              onAuthorized: () => {},
            })
          }
        />
      )}
    </div>
  );
}
