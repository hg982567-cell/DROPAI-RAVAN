import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  ExternalLink,
  Edit2,
  Trash2,
  Sparkles,
  ArrowUpDown,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Tag,
  Share2,
} from 'lucide-react';
import { Product, StoreIntegration } from '../../types';

interface ProductCatalogProps {
  products: Product[];
  stores: StoreIntegration[];
  onAddProduct: (product: Partial<Product>) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onOpenAICopywriter: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  stores,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onOpenAICopywriter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Electronics');
  const [newCost, setNewCost] = useState('15');
  const [newPrice, setNewPrice] = useState('45');
  const [newSupplier, setNewSupplier] = useState('CJ Direct US');

  const categories = ['ALL', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseFloat(newCost) || 10;
    const price = parseFloat(newPrice) || 30;
    const netProfit = price - cost - 4.5;
    const marginPct = (netProfit / price) * 100;

    onAddProduct({
      title: newTitle,
      category: newCategory,
      sku: `DA-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      sellingPrice: price,
      supplierCost: cost,
      shippingCost: 4.5,
      netProfit,
      marginPct,
      stockTotal: 150,
      lowStockThreshold: 20,
      primarySupplierName: newSupplier,
      primarySupplierId: 'sup-1',
      backupSupplierName: 'Shenzhen Apex',
      backupSupplierId: 'sup-2',
      publishedStores: ['AuraTrend Modern Lifestyle'],
      status: 'ACTIVE',
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    });

    setNewTitle('');
    setShowAddModal(false);
  };

  const handleQuickPriceUpdate = (product: Product, newSellingPrice: number) => {
    const netProfit = newSellingPrice - product.baseCost - product.shippingCost;
    const marginPct = (netProfit / newSellingPrice) * 100;
    onUpdateProduct(product.id, {
      sellingPrice: newSellingPrice,
      netProfit: Number(netProfit.toFixed(2)),
      targetMarginPct: Number(marginPct.toFixed(1)),
    });
  };

  return (
    <div id="product-catalog-container" className="space-y-6">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-white tracking-tight">Product Catalog</h1>
          <p className="text-xs text-[#94A3B8]">
            {products.length} active listings across connected Shopify & dropshipping channels.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="add-product-modal-btn"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-[#D97706] text-black font-bold text-xs flex items-center space-x-2 hover:bg-[#B45309] transition-all shadow-md shadow-[#D97706]/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-[#111113] border border-[#1F1F21]">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-xs text-[#E2E8F0] placeholder-[#64748B] focus:outline-none focus:border-[#D97706]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#D97706]/15 text-[#D97706] border border-[#D97706]/30 font-semibold'
                  : 'bg-[#151517] text-[#94A3B8] hover:text-[#E2E8F0] border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-xl bg-[#111113] border border-[#1F1F21] overflow-hidden shadow-sm hover:border-[#2D2D30] transition-all flex flex-col justify-between"
          >
            <div>
              {/* Product Image & Badges */}
              <div className="relative h-48 bg-[#0A0A0B] overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-[#111113]/90 backdrop-blur-md text-[10px] font-mono text-[#D97706] border border-[#1F1F21]">
                    {product.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 backdrop-blur-md text-[10px] font-mono font-bold text-emerald-400 border border-emerald-800">
                    {product.marginPct.toFixed(0)}% Margin
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono backdrop-blur-md ${
                      product.stockTotal <= product.lowStockThreshold
                        ? 'bg-amber-950/90 text-amber-300 border border-amber-700 font-bold'
                        : 'bg-[#111113]/90 text-[#94A3B8] border border-[#1F1F21]'
                    }`}
                  >
                    Stock: {product.stockTotal}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <div>
                  <div className="text-[10px] font-mono text-[#64748B] uppercase">{product.sku}</div>
                  <h3 className="text-sm font-serif font-bold text-[#E2E8F0] line-clamp-2 mt-0.5">
                    {product.title}
                  </h3>
                </div>

                {/* Financial breakdown */}
                <div className="p-3 rounded-lg bg-[#151517] border border-[#1F1F21] grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[10px] text-[#64748B] font-mono">SUPPLIER</div>
                    <div className="text-xs font-semibold text-[#94A3B8] font-mono">
                      ${product.supplierCost.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#64748B] font-mono">RETAIL</div>
                    <div className="text-xs font-bold text-[#D97706] font-mono">
                      ${product.sellingPrice.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#64748B] font-mono">NET PROFIT</div>
                    <div className="text-xs font-bold text-emerald-400 font-mono">
                      +${product.netProfit.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Suppliers & Store Info */}
                <div className="text-[11px] text-[#94A3B8] space-y-1 pt-1">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Primary Supplier:</span>
                    <span className="font-medium text-[#E2E8F0]">{product.primarySupplierName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Backup Failover:</span>
                    <span className="font-medium text-[#94A3B8]">{product.backupSupplierName || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Shopify Channel:</span>
                    <span className="text-[#D97706] truncate max-w-[140px]">
                      {product.publishedStores.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 bg-[#151517]/60 border-t border-[#1F1F21] flex items-center justify-between">
              <button
                id={`ai-copywriter-${product.id}`}
                onClick={() => onOpenAICopywriter(product)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#D97706]/15 hover:bg-[#D97706]/25 text-[#D97706] border border-[#D97706]/30 text-xs font-medium transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                <span>AI Copy & SEO</span>
              </button>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => {
                    const price = prompt('Enter new retail price ($):', product.sellingPrice.toString());
                    if (price) handleQuickPriceUpdate(product, parseFloat(price));
                  }}
                  className="p-2 rounded-lg bg-[#151517] hover:bg-[#1F1F21] text-[#94A3B8] hover:text-[#E2E8F0] border border-[#2D2D30] text-xs transition-colors cursor-pointer"
                  title="Adjust Price"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteProduct(product.id)}
                  className="p-2 rounded-lg bg-[#151517] hover:bg-rose-950 text-[#94A3B8] hover:text-rose-400 border border-[#2D2D30] text-xs transition-colors cursor-pointer"
                  title="Delete Product"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0B]/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-[#111113] border border-[#1F1F21] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1F1F21] pb-3">
              <h3 className="text-base font-serif font-bold text-[#E2E8F0]">Add New Product to Catalog</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#64748B] hover:text-[#E2E8F0] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[#94A3B8] font-medium">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Noise-Cancelling Sleep Mask"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#E2E8F0] focus:border-[#D97706] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[#94A3B8] font-medium">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#E2E8F0] focus:border-[#D97706] focus:outline-none"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                    <option value="Fitness & Wellness">Fitness & Wellness</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#94A3B8] font-medium">Supplier</label>
                  <select
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#E2E8F0] focus:border-[#D97706] focus:outline-none"
                  >
                    <option value="CJ Direct US">CJ Direct US</option>
                    <option value="AliExpress VIP">AliExpress VIP</option>
                    <option value="Shenzhen Apex">Shenzhen Apex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[#94A3B8] font-medium">Supplier Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#E2E8F0] focus:border-[#D97706] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#94A3B8] font-medium">Target Retail ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#151517] border border-[#2D2D30] text-[#E2E8F0] focus:border-[#D97706] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#1F1F21]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#151517] hover:bg-[#1F1F21] text-[#94A3B8] hover:text-[#E2E8F0] border border-[#2D2D30] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-black font-bold cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
