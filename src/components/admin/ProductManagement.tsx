import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Tag,
  Loader2,
  X,
  CheckCircle,
  Boxes,
  Barcode,
  Sparkles,
  AlertTriangle,
  Layers,
  Search,
  CheckCircle2,
  Stethoscope,
} from 'lucide-react';
import { api } from '../../lib/api';
import { ProductRecord } from '../../types';

export const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Tab filter: 'all' | 'physical' | 'service'
  const [itemTypeFilter, setItemTypeFilter] = useState<'all' | 'physical' | 'service'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Rehabilitation Equipment');
  const [status, setStatus] = useState<ProductRecord['status']>('In Stock');
  const [itemType, setItemType] = useState<'physical' | 'service'>('physical');
  const [sku, setSku] = useState('');
  const [stockQuantity, setStockQuantity] = useState<number>(20);
  const [featured, setFeatured] = useState(true);
  const [contactButton, setContactButton] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminProducts();
      setProducts(data);
    } catch (err: any) {
      alert(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAdd = (defaultType: 'physical' | 'service' = 'physical') => {
    setItemType(defaultType);
    if (defaultType === 'physical') {
      setTitle('');
      setDescription('');
      setImage('/images/stress_ball.jpg');
      setPrice('PKR 1,800');
      setCategory('Rehabilitation Equipment');
      setStatus('In Stock');
      setSku('REHAB-' + Math.floor(100 + Math.random() * 900));
      setStockQuantity(25);
      setFeatured(true);
      setContactButton(true);
    } else {
      setTitle('');
      setDescription('');
      setImage('/images/physio_clinic.jpg');
      setPrice('Consultation on Request');
      setCategory('Clinical Assessment');
      setStatus('Active');
      setSku('');
      setStockQuantity(0);
      setFeatured(false);
      setContactButton(true);
    }
    setIsAdding(true);
  };

  const openEdit = (p: ProductRecord) => {
    setEditingItem(p);
    setTitle(p.title);
    setDescription(p.description);
    setImage(p.image);
    setPrice(p.price || '');
    setCategory(p.category);
    setStatus(p.status);
    setItemType(p.itemType || (p.category === 'Clinical Assessment' || p.category === 'Sports Rehabilitation' || p.category === 'Spine & Posture' ? 'service' : 'physical'));
    setSku(p.sku || '');
    setStockQuantity(p.stockQuantity !== undefined ? p.stockQuantity : 0);
    setFeatured(Boolean(p.featured));
    setContactButton(p.contactButton);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingItem) {
        await api.updateProduct(editingItem.id, {
          title,
          description,
          image,
          price,
          category,
          status,
          itemType,
          sku: sku ? sku.trim() : undefined,
          stockQuantity: itemType === 'physical' ? Number(stockQuantity) : 0,
          featured,
          contactButton,
        });
        setEditingItem(null);
      } else {
        await api.addProduct({
          title,
          description,
          image,
          price,
          category,
          status,
          itemType,
          sku: sku ? sku.trim() : undefined,
          stockQuantity: itemType === 'physical' ? Number(stockQuantity) : 0,
          featured,
          contactButton,
        });
        setIsAdding(false);
      }
      await fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteProduct(id);
      setDeleteConfirmId(null);
      await fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  // Inventory Metrics
  const physicalItems = useMemo(() => {
    return products.filter((p) => p.itemType === 'physical' || (p.category !== 'Clinical Assessment' && p.category !== 'Sports Rehabilitation' && p.category !== 'Spine & Posture'));
  }, [products]);

  const serviceItems = useMemo(() => {
    return products.filter((p) => p.itemType === 'service' || (p.category === 'Clinical Assessment' || p.category === 'Sports Rehabilitation' || p.category === 'Spine & Posture'));
  }, [products]);

  const totalStockUnits = useMemo(() => {
    return physicalItems.reduce((acc, p) => acc + (p.stockQuantity || 0), 0);
  }, [physicalItems]);

  const lowStockCount = useMemo(() => {
    return physicalItems.filter((p) => (p.stockQuantity ?? 0) > 0 && (p.stockQuantity ?? 0) <= 5).length;
  }, [physicalItems]);

  const filteredItems = useMemo(() => {
    let list = products;
    if (itemTypeFilter === 'physical') {
      list = physicalItems;
    } else if (itemTypeFilter === 'service') {
      list = serviceItems;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, itemTypeFilter, physicalItems, serviceItems, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header with Stats & Actions */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-400">
                <Boxes className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Inventory & Clinical Services
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Manage physical rehabilitation tools (Stress balls, Resistance bands, Rollers) and clinic consultation services
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => openAdd('physical')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 dark:bg-teal-700 dark:hover:bg-teal-600 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Physical Product</span>
            </button>
            <button
              onClick={() => openAdd('service')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <span>Add Clinical Service</span>
            </button>
          </div>
        </div>

        {/* Inventory KPI Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Physical Products
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {physicalItems.length} <span className="text-xs font-medium text-slate-400">SKUs</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Units in Stock
            </span>
            <div className="text-xl font-black text-teal-800 dark:text-teal-400 mt-0.5">
              {totalStockUnits} <span className="text-xs font-medium text-slate-400">units</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Low Stock Alerts
            </span>
            <div className={`text-xl font-black mt-0.5 ${lowStockCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
              {lowStockCount} <span className="text-xs font-medium text-slate-400">items</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Clinical Services
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {serviceItems.length} <span className="text-xs font-medium text-slate-400">offerings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 self-start">
          <button
            onClick={() => setItemTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              itemTypeFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Items ({products.length})
          </button>
          <button
            onClick={() => setItemTypeFilter('physical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              itemTypeFilter === 'physical'
                ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Physical Tools ({physicalItems.length})</span>
          </button>
          <button
            onClick={() => setItemTypeFilter('service')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              itemTypeFilter === 'service'
                ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Clinical Services ({serviceItems.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inventory, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-600"
          />
        </div>
      </div>

      {/* Product & Inventory List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600 dark:text-teal-400 mx-auto mb-2" />
            <p className="text-sm">Loading inventory & products...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <p>No inventory items match your search or filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredItems.map((prod) => {
              const isPhysical = prod.itemType === 'physical' || (prod.category !== 'Clinical Assessment' && prod.category !== 'Sports Rehabilitation' && prod.category !== 'Spine & Posture');
              const isLowStock = isPhysical && (prod.stockQuantity ?? 0) > 0 && (prod.stockQuantity ?? 0) <= 5;
              const isOutOfStock = isPhysical && (prod.stockQuantity === 0 || prod.status === 'Out of Stock');

              return (
                <div
                  key={prod.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={prod.image || '/images/physio_clinic.jpg'}
                      alt={prod.title}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                          {prod.title}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                          {prod.category}
                        </span>

                        {isPhysical && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                            <Boxes className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                            <span>Physical Tool</span>
                          </span>
                        )}

                        {prod.featured && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>Featured</span>
                          </span>
                        )}

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            isOutOfStock
                              ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                              : isLowStock
                              ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                              : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          {prod.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 max-w-xl">
                        {prod.description}
                      </p>

                      <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs">
                        <div className="font-semibold text-slate-700 dark:text-slate-300">
                          Pricing: <span className="text-teal-800 dark:text-teal-400 font-bold">{prod.price || 'By Consultation'}</span>
                        </div>

                        {isPhysical && prod.sku && (
                          <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono text-[11px]">
                            <Barcode className="w-3.5 h-3.5 text-slate-400" />
                            <span>SKU: {prod.sku}</span>
                          </div>
                        )}

                        {isPhysical && (
                          <div className={`font-semibold flex items-center gap-1 ${isLowStock ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'}`}>
                            {isLowStock && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                            <span>Stock: <strong>{prod.stockQuantity ?? 0}</strong> units</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => openEdit(prod)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-700 dark:text-blue-400 text-xs font-medium cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(prod.id)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-700 dark:text-rose-400 text-xs font-medium cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(isAdding || editingItem) && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setIsAdding(false);
            setEditingItem(null);
          }}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-lg">
                  {editingItem ? 'Edit Item / Inventory' : 'Add Rehabilitation Tool / Service'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingItem(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">
              {/* Type Selection Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  Item Classification *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setItemType('physical');
                      if (!category || category === 'Clinical Assessment') setCategory('Rehabilitation Equipment');
                      if (!status || status === 'Active') setStatus('In Stock');
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 cursor-pointer transition-all ${
                      itemType === 'physical'
                        ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/50 dark:border-teal-500'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Boxes className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Physical Product</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Stress ball, bands, rollers, wraps</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setItemType('service');
                      if (category === 'Rehabilitation Equipment') setCategory('Clinical Assessment');
                      if (status === 'In Stock') setStatus('Active');
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 cursor-pointer transition-all ${
                      itemType === 'service'
                        ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/50 dark:border-teal-500'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Stethoscope className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Clinical Service</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Consultation, assessment, therapy</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Product / Service Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physiotherapy Stress Ball & Hand Grip Strengthener Set"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rehabilitation Equipment"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-600"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['Rehabilitation Equipment', 'Recovery & Mobility', 'Pain Relief & Recovery', 'Ergonomic Support', 'Clinical Assessment'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCategory(c)}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 cursor-pointer"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-600"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Active">Active</option>
                    <option value="Available on Request">Available on Request</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Physical Inventory Details: Price, SKU, Stock Units */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Price / Fee
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PKR 1,800"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                {itemType === 'physical' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. STR-BALL-02"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-600 font-mono"
                    />
                  </div>
                )}

                {itemType === 'physical' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Inventory Quantity
                    </label>
                    <input
                      type="number"
                      min={0}
                      placeholder="25"
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-600"
                    />
                  </div>
                )}
              </div>

              {/* Image Input and Quick Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Product Image URL *
                </label>
                <div className="flex items-center gap-3">
                  {image && (
                    <img
                      src={image}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100"
                    />
                  )}
                  <input
                    type="text"
                    required
                    placeholder="/images/stress_ball.jpg"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Quick Preset Physical Tools Images */}
              <div>
                <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Select Quick Product Image Preset:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Stress Ball', url: '/images/stress_ball.jpg' },
                    { label: 'Resistance Bands', url: '/images/rehab_bands.jpg' },
                    { label: 'Foam Roller', url: '/images/foam_roller.jpg' },
                    { label: 'Hot/Cold Pack', url: '/images/hot_cold_pack.jpg' },
                    { label: 'Kinesiology Tape', url: '/images/kinesiology_tape.jpg' },
                    { label: 'Balance Board', url: '/images/balance_wobble_board.jpg' },
                    { label: 'Clinic Suite', url: '/images/physio_clinic.jpg' },
                    { label: 'Spine & Posture', url: '/images/spine_posture.jpg' },
                    { label: 'Sports Rehab', url: '/images/sports_rehab.jpg' },
                  ].map((p) => (
                    <button
                      key={p.url}
                      type="button"
                      onClick={() => setImage(p.url)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        image === p.url
                          ? 'bg-teal-800 text-white border-teal-800 dark:bg-teal-700 dark:border-teal-700'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Clinical specifications, therapeutic indications, material durability, and usage guidelines..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contactButton}
                    onChange={(e) => setContactButton(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Enable "Inquire / Order" button on public card
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Highlight as Featured Rehabilitation Product
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 dark:bg-teal-700 dark:hover:bg-teal-600 text-white text-xs font-bold cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Save Product & Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-center text-slate-900 dark:text-white">
              Delete Product / Service?
            </h3>
            <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-1 mb-6">
              This will remove this product and its inventory records permanently from the clinic database.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="py-2.5 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
