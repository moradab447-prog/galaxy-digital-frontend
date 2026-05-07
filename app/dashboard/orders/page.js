'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, ShoppingBag, Package, LogOut, Search, X,
  Loader2, Store, ChevronDown, Eye, RefreshCw, Clock,
  CheckCircle2, XCircle, Truck, DollarSign, ShoppingCart
} from 'lucide-react';
import API from '@/api/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// ─── Sidebar Link ─────────────────────────────────────────────────────────────
const SideLink = ({ href, icon: Icon, label, active }) => (
  <Link href={href} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
    active ? 'bg-[#8B0000] text-white shadow-lg shadow-[#8B0000]/25' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
  }`}>
    <Icon size={17} />{label}
  </Link>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    PENDING:   { label: 'En attente', cls: 'bg-amber-50 text-amber-700 border-amber-200',   icon: Clock },
    DELIVERED: { label: 'Livré',      cls: 'bg-green-50 text-green-700 border-green-200',   icon: CheckCircle2 },
    CANCELLED: { label: 'Annulé',     cls: 'bg-red-50 text-red-600 border-red-200',         icon: XCircle },
    SHIPPED:   { label: 'Expédié',    cls: 'bg-blue-50 text-blue-700 border-blue-200',      icon: Truck },
  };
  const s = map[status] || { label: status, cls: 'bg-gray-50 text-gray-600 border-gray-200', icon: Clock };
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${s.cls}`}>
      <Icon size={11} /> {s.label}
    </span>
  );
};

const PayBadge = ({ status }) => {
  const map = {
    PAID:   { label: 'Payé',       cls: 'bg-green-50 text-green-700 border-green-200' },
    UNPAID: { label: 'Non payé',   cls: 'bg-gray-50 text-gray-500 border-gray-200' },
    COD:    { label: 'COD',        cls: 'bg-purple-50 text-purple-700 border-purple-200' },
  };
  const s = map[status] || { label: status, cls: 'bg-gray-50 text-gray-500 border-gray-200' };
  return <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${s.cls}`}>{s.label}</span>;
};

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
export default function AdminOrdersPage() {
  const { logout, user } = useAuth();

  const [orders,      setOrders]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [searchTerm,  setSearchTerm]  = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating,    setUpdating]    = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/orders/all');
      setOrders(res.data?.orders || res.data || []);
    } catch {
      toast.error("Erreur de chargement des commandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleUpdateStatus = async (orderId, status, paymentStatus) => {
    setUpdating(true);
    try {
      await API.put(`/dashboard/orders/${orderId}`, { status, paymentStatus });
      toast.success("Commande mise à jour ✓");
      fetchOrders();
      setSelectedOrder(null);
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setUpdating(false);
    }
  };

  const filtered = orders.filter(o => {
    const search = searchTerm.toLowerCase();
    const matchSearch = !searchTerm ||
      String(o.id).includes(search) ||
      o.user?.name?.toLowerCase().includes(search) ||
      o.address?.toLowerCase().includes(search) ||
      o.phone?.includes(search);
    const matchStatus = !filterStatus || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const pending   = orders.filter(o => o.status === 'PENDING').length;
  const delivered = orders.filter(o => o.status === 'DELIVERED').length;
  const cancelled = orders.filter(o => o.status === 'CANCELLED').length;
  const revenue   = orders.filter(o => o.paymentStatus === 'PAID').reduce((s, o) => s + Number(o.totalPrice), 0);

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="w-60 bg-white flex flex-col py-6 px-4 border-r border-gray-100 shrink-0 shadow-sm">
        <Link href="/" className="flex items-center gap-3 px-2 mb-8 group">
          <div className="w-9 h-9 bg-[#8B0000] rounded-xl flex items-center justify-center shadow-md shadow-[#8B0000]/30">
            <Store size={17} className="text-white" />
          </div>
          <div>
            <p className="text-gray-900 font-black text-sm leading-tight">Galaxy Digital</p>
            <p className="text-gray-400 text-[10px]">Administration</p>
          </div>
        </Link>

        <nav className="flex flex-col gap-1 flex-1">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest px-4 mb-2">Navigation</p>
          <SideLink href="/dashboard"          icon={LayoutDashboard} label="Tableau de bord" />
          <SideLink href="/dashboard/products" icon={Package}         label="Produits" />
          <SideLink href="/dashboard/orders"   icon={ShoppingBag}     label="Commandes" active />
        </nav>

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
            <h1 className="text-gray-900 text-xl font-black">Gestion des Commandes</h1>
            <p className="text-gray-400 text-xs mt-0.5">{orders.length} commande{orders.length !== 1 ? 's' : ''} au total</p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors"
          >
            <RefreshCw size={15} /> Actualiser
          </button>
        </div>

        <div className="p-8 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Commandes" value={orders.length}  icon={ShoppingCart}  color="#8B0000" />
            <StatCard label="En Attente"       value={pending}        icon={Clock}         color="#f59e0b" sub="à traiter" />
            <StatCard label="Livrées"          value={delivered}      icon={CheckCircle2}  color="#22c55e" />
            <StatCard label="Chiffre d'affaires" value={`${revenue.toLocaleString()} MAD`} icon={DollarSign} color="#6366f1" sub="commandes payées" />
          </div>

          {/* Filtres */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-3 flex-1 bg-gray-50 rounded-xl px-4 py-2.5">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Rechercher par ID, nom, téléphone, adresse..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-transparent flex-1 text-gray-700 text-sm placeholder-gray-400 outline-none"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')}><X size={15} className="text-gray-400 hover:text-gray-700" /></button>
              )}
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#8B0000] cursor-pointer"
              >
                <option value="">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="SHIPPED">Expédié</option>
                <option value="DELIVERED">Livré</option>
                <option value="CANCELLED">Annulé</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Commande</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Montant</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Statut</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Paiement</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="text-center px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400">
                      <Loader2 className="animate-spin mx-auto mb-3 text-[#8B0000]" size={28} />
                      <p className="text-xs font-medium">Chargement des commandes...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400">
                      <ShoppingBag size={36} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-semibold">Aucune commande</p>
                      <p className="text-xs mt-1 text-gray-400">Les commandes apparaîtront ici</p>
                    </td>
                  </tr>
                ) : filtered.map((order, i) => (
                  <tr key={order.id} className={`border-b border-gray-50 hover:bg-[#8B0000]/[0.02] transition-colors ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
                    <td className="px-5 py-3.5">
                      <span className="font-black text-gray-800">#{order.id}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-800">{order.user?.name || 'Invité'}</p>
                      <p className="text-xs text-gray-400">{order.phone}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-black text-gray-900">{Number(order.totalPrice).toLocaleString()} MAD</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <PayBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg bg-[#8B0000]/8 text-[#8B0000] hover:bg-[#8B0000]/15 transition-colors"
                          title="Voir / Modifier"
                        >
                          <Eye size={14} />
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

      {/* ── Modal Détail Commande ──────────────────────────────────────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-gray-900 font-black text-lg">Commande #{selectedOrder.id}</h2>
                <p className="text-gray-400 text-xs mt-0.5">
                  {new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-7 space-y-5">
              {/* Client */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-1.5">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Client</p>
                <p className="font-bold text-gray-800">{selectedOrder.user?.name || 'Invité'}</p>
                {selectedOrder.user?.email && <p className="text-sm text-gray-500">{selectedOrder.user.email}</p>}
                <p className="text-sm text-gray-500">📞 {selectedOrder.phone}</p>
                <p className="text-sm text-gray-500">📍 {selectedOrder.address}</p>
              </div>

              {/* Montant */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#8B0000]/5 rounded-2xl">
                <span className="text-gray-600 font-semibold text-sm">Total commande</span>
                <span className="text-[#8B0000] font-black text-lg">{Number(selectedOrder.totalPrice).toLocaleString()} MAD</span>
              </div>

              {/* Modifier statut */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Mettre à jour</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1.5">Statut livraison</label>
                    <select
                      defaultValue={selectedOrder.status}
                      id="status-select"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#8B0000] appearance-none bg-white"
                    >
                      <option value="PENDING">En attente</option>
                      <option value="SHIPPED">Expédié</option>
                      <option value="DELIVERED">Livré</option>
                      <option value="CANCELLED">Annulé</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1.5">Statut paiement</label>
                    <select
                      defaultValue={selectedOrder.paymentStatus}
                      id="pay-select"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#8B0000] appearance-none bg-white"
                    >
                      <option value="UNPAID">Non payé</option>
                      <option value="PAID">Payé</option>
                      <option value="COD">COD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 pb-7 flex gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                disabled={updating}
                onClick={() => {
                  const status = document.getElementById('status-select').value;
                  const paymentStatus = document.getElementById('pay-select').value;
                  handleUpdateStatus(selectedOrder.id, status, paymentStatus);
                }}
                className="flex-1 py-3 bg-[#8B0000] hover:bg-[#6b0000] disabled:bg-gray-200 text-white rounded-xl font-black text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#8B0000]/20"
              >
                {updating && <Loader2 size={15} className="animate-spin" />}
                {updating ? 'Mise à jour...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
