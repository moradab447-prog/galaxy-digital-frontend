'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, ShoppingBag, Package, LogOut, Search, Plus, Edit,
  Trash2, X, Image as ImageIcon, Loader2, UploadCloud, Link2,
  BarChart3, TrendingUp, Tag, Archive, ChevronDown, Store
} from 'lucide-react';
import API from '@/api/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ─── Sidebar Link ─────────────────────────────────────────────────────────────
const SideLink = ({ href, icon: Icon, label, active }) => (
  <Link href={href} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
    active
      ? 'bg-[#8B0000] text-white shadow-lg shadow-[#8B0000]/25'
      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
  }`}>
    <Icon size={17} />{label}
  </Link>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: color + '18' }}>
      <Icon size={22} style={{ color }} />
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminProductsPage() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const [products,       setProducts]       = useState([]);
  const [categories,     setCategories]     = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [searchTerm,     setSearchTerm]     = useState('');
  const [isModalOpen,    setIsModalOpen]    = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [imagePreviews,  setImagePreviews]  = useState([]);
  const [submitting,     setSubmitting]     = useState(false);
  const [imageMode,      setImageMode]      = useState('file');
  const [filterCat,      setFilterCat]      = useState('');

  const [formData, setFormData] = useState({
    name: '', description: '', price: '', originalPrice: '',
    stock: '0', categoryId: '', imageUrl: '', images: [],
    marque: '', reference: '', details: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        API.get('/products?limit=500'),
        API.get('/categories')
      ]);
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data?.data || []));
      setCategories(catRes.data || []);
    } catch {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      const fileArr = Array.from(files);
      setFormData(f => ({ ...f, images: fileArr }));
      setImagePreviews(fileArr.map(f => URL.createObjectURL(f)));
    } else if (name === 'imageUrl') {
      setFormData(f => ({ ...f, imageUrl: value }));
      setImagePreviews(value ? [value] : []);
    } else {
      setFormData(f => ({ ...f, [name]: value }));
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name || '', description: product.description || '',
        price: product.price || '', originalPrice: product.originalPrice || '',
        stock: product.stock || 0, categoryId: product.categoryId || '',
        imageUrl: product.imageUrl || '', images: [],
        marque: product.marque || '', reference: product.reference || '', details: product.details || ''
      });
      const existing = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : product.imageUrl ? [product.imageUrl] : [];
      setImagePreviews(existing);
      setImageMode('url');
    } else {
      setCurrentProduct(null);
      setFormData({ name: '', description: '', price: '', originalPrice: '', stock: '0', categoryId: '', imageUrl: '', images: [] });
      setImagePreviews([]);
      setImageMode('file');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl && formData.images.length === 0) { toast.error("Image requise (URL ou fichier)"); return; }
    setSubmitting(true);
    try {
      let res;
      if (formData.images.length > 0) {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        if (formData.originalPrice) data.append('originalPrice', formData.originalPrice);
        data.append('stock', formData.stock);
        data.append('categoryId', formData.categoryId);
        if (formData.marque) data.append('marque', formData.marque);
        if (formData.reference) data.append('reference', formData.reference);
        if (formData.details) data.append('details', formData.details);
        formData.images.forEach(img => data.append('images', img));
        res = currentProduct
          ? await API.put(`/products/${currentProduct.id}`, data)
          : await API.post('/products', data);
      } else {
        // URL mode — use JSON
        const payload = {
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
          stock: Number(formData.stock),
          categoryId: Number(formData.categoryId),
          imageUrl: formData.imageUrl,
          marque: formData.marque || undefined,
          reference: formData.reference || undefined,
          details: formData.details || undefined,
        };
        res = currentProduct
          ? await API.put(`/products/${currentProduct.id}`, payload)
          : await API.post('/products', payload);
      }
      toast.success(currentProduct ? "Produit mis à jour ✓" : "Produit ajouté ✓");
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success("Produit supprimé");
      fetchData();
    } catch { toast.error("Erreur lors de la suppression"); }
  };

  const filtered = products.filter(p => {
    const matchSearch = !searchTerm || p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = !filterCat || String(p.categoryId) === filterCat;
    return matchSearch && matchCat;
  });

  const inStock   = products.filter(p => p.stock > 5).length;
  const lowStock  = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const noStock   = products.filter(p => p.stock === 0).length;

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="w-60 bg-white flex flex-col py-6 px-4 border-r border-gray-100 shrink-0 shadow-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-2 mb-8 group">
          <div className="w-9 h-9 bg-[#8B0000] rounded-xl flex items-center justify-center shadow-md shadow-[#8B0000]/30">
            <Store size={17} className="text-white" />
          </div>
          <div>
            <p className="text-gray-900 font-black text-sm leading-tight">Galaxy Digital</p>
            <p className="text-gray-400 text-[10px]">Administration</p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest px-4 mb-2">Navigation</p>
          <SideLink href="/dashboard"          icon={LayoutDashboard} label="Tableau de bord" />
          <SideLink href="/dashboard/products" icon={Package}         label="Produits" active />
          <SideLink href="/dashboard/orders"   icon={ShoppingBag}     label="Commandes" />
        </nav>

        {/* User + Logout */}
        <div className="border-t border-gray-100 pt-4 mt-2">
          {user && (
            <div className="flex items-center gap-3 px-4 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#8B0000] flex items-center justify-center text-white font-black text-xs">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-gray-700 font-bold text-xs truncate">{user.email}</p>
                <p className="text-gray-400 text-[10px]">Administrateur</p>
              </div>
            </div>
          )}
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all text-sm font-semibold">
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">

        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-gray-900 text-xl font-black">Gestion des Produits</h1>
            <p className="text-gray-400 text-xs mt-0.5">{products.length} articles dans le catalogue</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-[#8B0000] hover:bg-[#6b0000] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-[#8B0000]/20"
          >
            <Plus size={17} /> Nouveau Produit
          </button>
        </div>

        <div className="p-8 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Produits"   value={products.length}   icon={Package}    color="#8B0000" sub="dans le catalogue" />
            <StatCard label="Catégories"       value={categories.length} icon={Tag}        color="#6366f1" sub="familles de produits" />
            <StatCard label="En Stock"         value={inStock}           icon={TrendingUp} color="#22c55e" sub="stock suffisant" />
            <StatCard label="Stock Faible"     value={lowStock + noStock} icon={Archive}   color="#f59e0b" sub="à réapprovisionner" />
          </div>

          {/* Filtres & Recherche */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-3 flex-1 bg-gray-50 rounded-xl px-4 py-2.5">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Rechercher un produit ou une catégorie..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-transparent flex-1 text-gray-700 text-sm placeholder-gray-400 outline-none"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')}>
                  <X size={15} className="text-gray-400 hover:text-gray-700" />
                </button>
              )}
            </div>
            <div className="relative">
              <select
                value={filterCat}
                onChange={e => setFilterCat(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#8B0000] cursor-pointer"
              >
                <option value="">Toutes catégories</option>
                {categories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Résultats */}
          {searchTerm || filterCat ? (
            <p className="text-sm text-gray-500">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}</p>
          ) : null}

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Produit</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Catégorie</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Prix</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Stock</th>
                  <th className="text-center px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-gray-400">
                      <Loader2 className="animate-spin mx-auto mb-3 text-[#8B0000]" size={28} />
                      <p className="text-xs font-medium">Chargement des produits...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-gray-400">
                      <Package size={36} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-semibold">Aucun produit trouvé</p>
                    </td>
                  </tr>
                ) : filtered.map((p, i) => (
                  <tr key={p.id} className={`border-b border-gray-50 hover:bg-[#8B0000]/[0.02] transition-colors group ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center shrink-0 border border-gray-100">
                          {p.imageUrl
                            ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                            : <ImageIcon size={16} className="text-gray-300" />}
                        </div>
                        <span className="text-gray-800 font-semibold line-clamp-1 max-w-[220px] group-hover:text-[#8B0000] transition-colors">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="bg-[#8B0000]/8 text-[#8B0000] text-[11px] font-bold px-2.5 py-1 rounded-lg">
                        {p.category?.name || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {p.price === 0
                        ? <span className="text-gray-400 text-xs italic">Sur demande</span>
                        : <span className="text-gray-900 font-bold">{Number(p.price).toLocaleString()} MAD</span>}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg ${
                        p.stock > 5  ? 'bg-green-50 text-green-700 border border-green-100' :
                        p.stock > 0  ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                       'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.stock > 5 ? 'bg-green-500' : p.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                        {p.stock} unités
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal(p)}
                          className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-100 transition-colors"
                          title="Modifier"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── Modal ─────────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl flex overflow-hidden border border-gray-100">

            {/* Gauche — Image */}
            <div className="w-64 bg-gray-50 p-6 flex flex-col gap-4 shrink-0 border-r border-gray-100">
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">Image produit</p>
              <div className="flex-1 rounded-2xl overflow-hidden bg-white border-2 border-dashed border-gray-200 flex flex-col items-center justify-center min-h-[180px] gap-2 p-2">
                {imagePreviews.length === 0 ? (
                  <div className="text-center text-gray-300 p-4">
                    <ImageIcon size={36} className="mx-auto mb-2" />
                    <p className="text-xs">Aucune image</p>
                  </div>
                ) : imagePreviews.length === 1 ? (
                  <img src={imagePreviews[0]} alt="preview" className="w-full h-full object-contain p-2" onError={() => setImagePreviews([])} />
                ) : (
                  <>
                    <img src={imagePreviews[0]} alt="main" className="w-full h-28 object-contain" />
                    <div className="flex gap-1 flex-wrap justify-center">
                      {imagePreviews.map((src, i) => (
                        <img key={i} src={src} alt={`img-${i}`} className="w-10 h-10 object-contain border border-gray-200 rounded-lg" />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {/* Mode switch */}
              <div className="flex rounded-xl overflow-hidden border border-gray-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setImageMode('file'); setFormData(f => ({ ...f, imageUrl: '' })); }}
                  className={`flex-1 py-2 flex items-center justify-center gap-1 transition-colors ${imageMode === 'file' ? 'bg-[#8B0000] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <UploadCloud size={11} /> Fichier
                </button>
                <button
                  type="button"
                  onClick={() => { setImageMode('url'); setFormData(f => ({ ...f, image: null })); setImagePreview(null); }}
                  className={`flex-1 py-2 flex items-center justify-center gap-1 transition-colors ${imageMode === 'url' ? 'bg-[#8B0000] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <Link2 size={11} /> URL
                </button>
              </div>
              {imageMode === 'url'
                ? <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 text-xs placeholder-gray-400 outline-none focus:border-[#8B0000] w-full transition-colors"
                  />
                : <label className="relative border-2 border-dashed border-gray-200 rounded-xl px-3 py-4 text-gray-400 text-xs text-center cursor-pointer hover:border-[#8B0000]/40 transition-colors">
                    <UploadCloud size={20} className="mx-auto mb-1 text-gray-300" />
                    Choisir 1 ou plusieurs images
                    <input type="file" name="images" onChange={handleInputChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" multiple />
                  </label>
              }
            </div>

            {/* Droite — Formulaire */}
            <div className="flex-1 p-7 flex flex-col">
              {/* Header modal */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-gray-900 text-lg font-black">
                    {currentProduct ? 'Modifier le produit' : 'Nouveau produit'}
                  </h2>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {currentProduct ? `ID #${currentProduct.id}` : 'Remplissez les informations ci-dessous'}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
                {/* Nom */}
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Nom du produit *</label>
                  <input
                    required type="text" name="name" value={formData.name}
                    onChange={handleInputChange} placeholder="Ex: Samsung Galaxy A54"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none focus:border-[#8B0000] placeholder-gray-300 transition-colors"
                  />
                </div>

                {/* Prix */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Prix (MAD) *</label>
                    <input
                      required type="number" name="price" value={formData.price}
                      onChange={handleInputChange} placeholder="3490"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[#8B0000] font-black text-sm outline-none focus:border-[#8B0000] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Prix barré (MAD)</label>
                    <input
                      type="number" name="originalPrice" value={formData.originalPrice}
                      onChange={handleInputChange} placeholder="4200"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-500 text-sm outline-none focus:border-[#8B0000] transition-colors line-through"
                    />
                  </div>
                </div>

                {/* Catégorie + Stock */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Catégorie *</label>
                    <select
                      required name="categoryId" value={formData.categoryId}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 text-sm outline-none focus:border-[#8B0000] appearance-none bg-white transition-colors"
                    >
                      <option value="">Choisir...</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Stock *</label>
                    <input
                      required type="number" name="stock" value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 text-sm outline-none focus:border-[#8B0000] transition-colors"
                    />
                  </div>
                </div>

                {/* Marque + Référence */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Marque</label>
                    <input
                      type="text" name="marque" value={formData.marque}
                      onChange={handleInputChange} placeholder="Ex: Samsung, Beko..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none focus:border-[#8B0000] placeholder-gray-300 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Référence</label>
                    <input
                      type="text" name="reference" value={formData.reference}
                      onChange={handleInputChange} placeholder="Ex: BM1WFT39200BS"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none focus:border-[#8B0000] placeholder-gray-300 transition-colors"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="flex-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Description</label>
                  <textarea
                    name="description" value={formData.description}
                    onChange={handleInputChange} placeholder="Description du produit..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 text-sm outline-none focus:border-[#8B0000] resize-none h-20 placeholder-gray-300 transition-colors"
                  />
                </div>

                {/* Détails */}
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Détails du produit</label>
                  <textarea
                    name="details" value={formData.details}
                    onChange={handleInputChange} placeholder="Caractéristiques techniques, dimensions, spécifications..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 text-sm outline-none focus:border-[#8B0000] resize-none h-20 placeholder-gray-300 transition-colors"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#8B0000] hover:bg-[#6b0000] disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl font-black text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#8B0000]/20"
                >
                  {submitting && <Loader2 size={17} className="animate-spin" />}
                  {submitting ? 'Enregistrement...' : currentProduct ? 'Sauvegarder les modifications' : 'Ajouter au catalogue'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
