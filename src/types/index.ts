export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type UserRole = 'SUPER_ADMIN' | 'STORE_MANAGER' | 'OPERATIONS' | 'SUPPORT_AGENT';

export interface UserSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface SecurityConfig {
  isLocked: boolean;
  pinHash: string; // simulated PIN code
  pinHint: string;
  autoLockMinutes: number; // 0 for disabled
  biometricEnabled: boolean;
  failedAttempts: number;
  lockoutUntil: number | null;
  requireApprovalForRefundsAbove: number;
  startupAnimationEnabled: boolean;
}

export interface AIPlanningStep {
  id: string;
  label: string;
  tool: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'WAITING_APPROVAL' | 'FAILED';
  risk: RiskLevel;
  outputSummary?: string;
  timestamp?: string;
}

export interface AICommandTask {
  id: string;
  command: string;
  timestamp: string;
  status: 'PLANNING' | 'EXECUTING' | 'WAITING_APPROVAL' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  riskLevel: RiskLevel;
  plan: AIPlanningStep[];
  approvalPayload?: {
    actionType: string;
    description: string;
    financialImpact?: number;
    itemsCount?: number;
    targetStore?: string;
    reversible: boolean;
  };
  resultSummary?: string;
  logs: string[];
}

export interface AIMemoryItem {
  id: string;
  category: 'USER_PREFERENCE' | 'STORE_PREFERENCE' | 'PRODUCT_HISTORY' | 'SUPPLIER_HISTORY' | 'WORKFLOW_DECISION' | 'AUTOMATION_PREF';
  key: string;
  value: string;
  context: string;
  confidence: number;
  createdAt: string;
  lastUsedAt: string;
}

export interface ProductSupplierQuote {
  supplierId: string;
  supplierName: string;
  costPrice: number;
  shippingPrice: number;
  shippingDays: string;
  inStock: number;
  isPrimary: boolean;
  isBackup: boolean;
  reliabilityRating: number; // 0-5
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  category: string;
  tags: string[];
  imageUrl: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED' | 'PAUSED';
  baseCost: number;
  shippingCost: number;
  sellingPrice: number;
  compareAtPrice: number;
  targetMarginPct: number;
  netProfit: number;
  stockTotal: number;
  lowStockThreshold: number;
  syncStatus: 'SYNCED' | 'OUT_OF_SYNC' | 'PENDING' | 'NOT_CONNECTED';
  connectedStoreId?: string;
  suppliers: ProductSupplierQuote[];
  demandScore: number; // 0-100
  competitionScore: number; // 0-100
  opportunityScore: number; // 0-100
  createdAt: string;
  salesLast30Days: number;
  isTrending?: boolean;
}

export interface ResearchProduct {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  estimatedCost: number;
  estimatedSellingPrice: number;
  estimatedShipping: number;
  estimatedNetProfit: number;
  profitPotential: number; // 0-100
  demandScore: number; // 0-100
  competitionScore: number; // 0-100
  saturationIndex: number; // 0-100
  riskScore: number; // 0-100
  overallScore: number; // 0-100
  trendingPlatform: 'TikTok' | 'Instagram' | 'Amazon Best-Seller' | 'Pinterest' | 'AliExpress Direct';
  supplierCount: number;
  verificationStatus: 'ESTIMATED_MARKET_DATA' | 'VERIFIED_SUPPLIER_QUOTES';
  notes: string;
  recommendedKeywords: string[];
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  platform: 'CJ Dropshipping' | 'AliExpress Direct' | 'DSers' | 'Spocket' | 'Local Warehouse US' | 'Local Warehouse EU';
  verificationStatus: 'VERIFIED' | 'PENDING_AUDIT' | 'FLAGGED';
  rating: number; // 0-5
  totalOrdersFulfilled: number;
  averageFulfillmentHours: number;
  onTimeDeliveryRate: number; // e.g. 98.4%
  disputeRate: number; // e.g. 0.8%
  returnPolicyDays: number;
  apiConnected: boolean;
  activeAlertsCount: number;
  backupPriority: number; // 1 = highest
}

export interface StoreIntegration {
  id: string;
  name: string;
  platform: 'Shopify' | 'WooCommerce' | 'Amazon' | 'Flipkart' | 'eBay' | 'Etsy';
  storeUrl: string;
  status: 'CONNECTED' | 'INTEGRATION_NOT_CONFIGURED' | 'ERROR' | 'SYNCING';
  lastSyncAt: string | null;
  productsCount: number;
  ordersCount: number;
  apiKeyConfigured: boolean;
  currency: string;
  autoFulfillment: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  supplierId: string;
  supplierName: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  storeId: string;
  storeName: string;
  items: OrderItem[];
  totalRevenue: number;
  totalCost: number;
  shippingFee: number;
  gatewayFee: number;
  netProfit: number;
  currency: string;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED' | 'PARTIALLY_REFUNDED' | 'FAILED';
  orderLifecycle: 'RECEIVED' | 'VALIDATED' | 'SUPPLIER_DISPATCHED' | 'SHIPPED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURN_REQUESTED';
  supplierOrderStatus: 'NOT_SENT' | 'ORDER_PLACED' | 'AWAITING_TRACKING' | 'TRACKING_RECEIVED';
  trackingNumber?: string;
  carrier?: string;
  carrierTrackingUrl?: string;
  estimatedDeliveryDate?: string;
  createdAt: string;
  isHighValue: boolean;
}

export type OrderLifecycleStage = Order['orderLifecycle'];

export interface ReturnRefundTicket {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  reason: 'DAMAGED_ITEM' | 'WRONG_PRODUCT' | 'NOT_AS_DESCRIBED' | 'BUYER_REMORSE' | 'LATE_DELIVERY';
  itemValue: number;
  requestedRefundAmount: number;
  approvedRefundAmount: number;
  restockingFee: number;
  status: 'PENDING_INSPECTION' | 'WAITING_ADMIN_PIN' | 'APPROVED' | 'REJECTED' | 'REFUNDED_VIA_GATEWAY';
  supplierNotified: boolean;
  evidenceImageUrl?: string;
  customerNote: string;
  requiresPinApproval: boolean;
  createdAt: string;
}

export interface WorkflowNode {
  id: string;
  type: 'TRIGGER' | 'CONDITION' | 'ACTION' | 'DELAY';
  title: string;
  description: string;
  config: Record<string, any>;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  triggerType: 'SUPPLIER_STOCK_LOW' | 'NEW_ORDER_PAID' | 'SHIPPING_DELAY_DETECTED' | 'MARGIN_DROP' | 'RETURN_SUBMITTED';
  nodes: WorkflowNode[];
  executionCount: number;
  lastExecutedAt?: string;
  simulationResult?: {
    impactedProducts: number;
    estimatedCostSaved: number;
    riskSummary: string;
  };
}

export interface ScheduledJob {
  id: string;
  name: string;
  cronExpression: string; // e.g. "0 9 * * *"
  scheduleDescription: string;
  action: string;
  status: 'SCHEDULED' | 'PAUSED' | 'RUNNING';
  timezone: string;
  lastRunAt: string | null;
  nextRunAt: string;
}

export interface SystemLog {
  id: string;
  category: 'AI_AGENT' | 'AUTOMATION' | 'SECURITY' | 'STORE_SYNC' | 'PAYMENT' | 'SUPPLIER';
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  lifetimeValue: number;
  currency: string;
  segment: 'VIP_LOYAL' | 'REPEAT_BUYER' | 'FIRST_TIME' | 'AT_RISK' | 'HIGH_REFUND_RATE';
  complaintCount: number;
  aiNotes: string;
  lastOrderDate: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'ORDERS' | 'SUPPLIERS' | 'SECURITY' | 'AUTOMATION' | 'SYSTEM';
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
}

// --- CYBERSECURITY ARCHITECTURE & API SECURITY TYPES ---

export type ApiKeyScope =
  | 'products:read'
  | 'products:write'
  | 'orders:read'
  | 'orders:write'
  | 'suppliers:read'
  | 'suppliers:write'
  | 'analytics:read'
  | 'ai:use'
  | 'shopify:read'
  | 'shopify:write'
  | 'admin:read'
  | 'admin:write';

export type ApiKeyStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED' | 'DISABLED';

export interface ApiKeyMetadata {
  id: string;
  name: string;
  prefix: string; // e.g. "DAI_live_x8F...2a9c"
  scopes: ApiKeyScope[];
  status: ApiKeyStatus;
  createdAt: string;
  expiresAt: string | null;
  lastUsedAt: string | null;
  usageCount: number;
  environment: 'LIVE' | 'TEST';
  rateLimitPerMin: number;
}

export interface CreatedApiKeyResponse {
  key: ApiKeyMetadata;
  secret: string; // Plaintext secret displayed only once at creation
}

export type SecurityFindingSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface SecurityFinding {
  id: string;
  title: string;
  severity: SecurityFindingSeverity;
  affectedComponent: string;
  whyItMatters: string;
  evidence: string;
  recommendedFix: string;
  securityTest: string;
  status: 'RESOLVED' | 'VERIFIED' | 'NEEDS_ATTENTION';
}

export interface PenTestResult {
  id: string;
  name: string;
  category:
    | 'AUTHENTICATION'
    | 'AUTHORIZATION_IDOR'
    | 'API_KEY_SCOPES'
    | 'RATE_LIMITING'
    | 'INPUT_VALIDATION'
    | 'SQL_INJECTION'
    | 'XSS'
    | 'SSRF'
    | 'WEBHOOK_HMAC'
    | 'SECURITY_HEADERS';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  weaknessTested: string;
  payload: string;
  status: 'PASS' | 'FAIL';
  httpStatus: number;
  responsePreview: string;
  explanation: string;
  remediation: string;
  timestamp: string;
}

export interface SecurityDashboardStatus {
  securityScore: number;
  activeKeysCount: number;
  expiringSoonCount: number;
  revokedKeysCount: number;
  securityEventsToday: number;
  highRiskEventsToday: number;
  integrations: {
    id: string;
    name: string;
    status: 'PROTECTED' | 'WARNING';
    type: string;
    details: string;
  }[];
  protections: {
    id: string;
    name: string;
    active: boolean;
    detail: string;
  }[];
  lastAuditAt: string;
}
