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
  AICommandTask,
  UserSession,
} from '../types';

export const api = {
  // Security
  async getSecurityConfig() {
    const res = await fetch('/api/security/config');
    return res.json();
  },
  async verifyPin(pin: string) {
    const res = await fetch('/api/security/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    return res.json();
  },
  async lockSystem() {
    const res = await fetch('/api/security/lock', { method: 'POST' });
    return res.json();
  },
  async updateSecuritySettings(payload: { autoLockMinutes?: number; startupAnimationEnabled?: boolean; newPin?: string }) {
    const res = await fetch('/api/security/update-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  async getSessions(): Promise<UserSession[]> {
    const res = await fetch('/api/security/sessions');
    return res.json();
  },
  async logoutAll(): Promise<{ success: boolean; sessions: UserSession[] }> {
    const res = await fetch('/api/security/logout-all', { method: 'POST' });
    return res.json();
  },

  // AI Command
  async executeCommand(command: string): Promise<AICommandTask> {
    const res = await fetch('/api/ai/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command }),
    });
    return res.json();
  },

  // AI Research
  async researchProducts(category?: string, targetMargin?: number): Promise<ResearchProduct[]> {
    const res = await fetch('/api/ai/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, targetMargin }),
    });
    return res.json();
  },

  // AI Copywriter & SEO
  async generateCopy(params: { productTitle: string; category?: string; keyBenefits?: string; tone?: string }) {
    const res = await fetch('/api/ai/copywriter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  // AI Support Copilot
  async askSupportCopilot(userQuery: string, orderNumber?: string) {
    const res = await fetch('/api/ai/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userQuery, orderNumber }),
    });
    return res.json();
  },

  // AI Pricing Engine
  async calculatePricing(params: { baseCost: number; shippingCost: number; targetMarginPct?: number; estimatedCAC?: number }) {
    const res = await fetch('/api/ai/pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  // Products
  async getProducts(): Promise<Product[]> {
    const res = await fetch('/api/products');
    return res.json();
  },
  async addProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return res.json();
  },
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },
  async deleteProduct(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    const res = await fetch('/api/orders');
    return res.json();
  },
  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  // Returns & Refunds
  async getReturns(): Promise<ReturnRefundTicket[]> {
    const res = await fetch('/api/returns');
    return res.json();
  },
  async approveRefund(id: string, pin?: string) {
    const res = await fetch(`/api/returns/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    return res.json();
  },

  // Suppliers & Stores
  async getSuppliers(): Promise<Supplier[]> {
    const res = await fetch('/api/suppliers');
    return res.json();
  },
  async getStores(): Promise<StoreIntegration[]> {
    const res = await fetch('/api/stores');
    return res.json();
  },
  async syncStore(id: string) {
    const res = await fetch(`/api/stores/${id}/sync`, { method: 'POST' });
    return res.json();
  },

  // Memory
  async getMemory(): Promise<AIMemoryItem[]> {
    const res = await fetch('/api/ai/memory');
    return res.json();
  },
  async addMemoryItem(item: Partial<AIMemoryItem>): Promise<AIMemoryItem> {
    const res = await fetch('/api/ai/memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return res.json();
  },
  async deleteMemoryItem(id: string) {
    const res = await fetch(`/api/ai/memory/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Workflows & Automation
  async getWorkflows(): Promise<AutomationWorkflow[]> {
    const res = await fetch('/api/workflows');
    return res.json();
  },
  async toggleWorkflow(id: string): Promise<AutomationWorkflow> {
    const res = await fetch(`/api/workflows/${id}/toggle`, { method: 'PATCH' });
    return res.json();
  },
  async simulateWorkflow(id: string) {
    const res = await fetch(`/api/workflows/${id}/simulate`, { method: 'POST' });
    return res.json();
  },

  // Scheduler
  async getScheduler(): Promise<ScheduledJob[]> {
    const res = await fetch('/api/scheduler');
    return res.json();
  },

  // Customers CRM
  async getCustomers(): Promise<CustomerProfile[]> {
    const res = await fetch('/api/customers');
    return res.json();
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch('/api/notifications');
    return res.json();
  },
  async markAllNotificationsRead() {
    const res = await fetch('/api/notifications/mark-all-read', { method: 'POST' });
    return res.json();
  },

  // Logs
  async getLogs(): Promise<SystemLog[]> {
    const res = await fetch('/api/logs');
    return res.json();
  },
};
