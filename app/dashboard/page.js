'use client';

import { useEffect, useState } from 'react';
import {
  LayoutDashboard, ShoppingBag, Package, LogOut, DollarSign,
  Users, TrendingUp, ArrowUpRight, Loader2, AlertCircle,
  Clock, CheckCircle2, XCircle, Store, ChevronRight,
  BarChart3, ShoppingCart
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart
} from 'recharts';
import API from '@/api/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ─── Sidebar link ─────────────────────────────────────────────────────────────
const SideLink = ({ href, icon: Icon, label, active, onClick }) => {
  const cls = `flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
    active
      ? 'bg-[#8B0000] text-white shadow-lg shadow-[#8B0000]/25'
      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
  }`;
  return onClick
    ? <button onClick={onClick} className={cls + ' w-full'}><Icon size={17} />{label}</button>
    : <Link href={href} className={cls}><Icon size={17} />{label}</Link>;
};

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, accent, sub, trend }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: accent + '18' }}>
        <Icon size={22} style={{ color: accent }} />
      </div>
      <div className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-lg">
        <TrendingUp size={11} /> {trend || '+0%'}
      </div>
    </div>
    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
    <p className="text-2xl font-black text-gray-900">{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
  </div>
);

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    PAID:      { label: 'Payé',      cls: 'bg-green-50 text-green-700 border border-green-100' },
    PENDING:   { label: 'En attente', cls: 'bg-amber-50 text-amber-700 border border-amber-100' },
    CANCELLED: { label: 'Annulé',    cls: 'bg-red-50 text-red-600 border border-red-100' },
    DELIVERED: { label: 'Livré',     cls: 'bg-blue-50 text-blue-700 border border-blue-100' },
  };
  const s = map[status] || { label: status, cls: 'bg-gray-50 text-gray-600' };
  return <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${s.cls}`}>{s.label}</span>;
};

// ─── Custom chart tooltip ──────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-100 shadow-xl rounded-xl px-4 py-3 text-sm">
        <p className="font-bold text-gray-700 mb-1">{label}</p>
        <p className="text-[#8B0000] font-black">{payload[0].value} vendu{payload[0].value > 1 ? 's' : ''}</p>
      </div>
    );
  }
  return null;
};

// ─── Main dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { logout, user } = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        setError(false);
        const res = await API.get('/dashboard/stats');
        setData(res.data);
      } catch {
        setError(true);
        toast.error("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  // ── Loading ──
  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 bg-[#8B0000]/10 rounded-2xl flex items-center justify-center">
          <Loader2 className="animate-spin text-[#8B0000]" size={28} />
        </div>
        <p className="text-gray-500 font-medium text-sm">Chargement du tableau de bord...</p>
      </div>
    </div>
  );

  // ── Error ──
  if (error) return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-50 gap-4">
      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
        <AlertCircle size={32} className="text-[#8B0000]" />
      </div>
      <h2 className="text-xl font-black text-gray-900">Erreur de connexion</h2>
      <p className="text-gray-500 text-sm">Vérifiez que le backend est bien démarré.</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-6 py-2.5 bg-[#8B0000] text-white rounded-xl font-bold text-sm hover:bg-[#6b0000] transition-colors"
      >
        Réessayer
      </button>
    </div>
  );

  const stats = data?.stats || {};
  const statsCards = [
    {
      title: "Chiffre d'affaires", value: `${Number(stats.revenue || 0).toLocaleString()} MAD`,
      icon: DollarSign, accent: '#8B0000', sub: 'Ce mois-ci', trend: '+12%'
    },
    {
      title: 'Commandes', value: stats.orders || 0,
      icon: ShoppingBag, accent: '#6366f1', sub: 'Total reçues', trend: '+5%'
    },
    {
      title: 'Clients', value: stats.users || 0,
      icon: Users, accent: '#22c55e', sub: 'Comptes actifs', trend: '+8%'
    },
    {
      title: 'Produits', value: stats.products || 0,
      icon: Package, accent: '#f59e0b', sub: 'Dans le catalogue', trend: '—'
    },
  ];

  // Préparer données chart
  const chartData = (data?.topProducts || []).map(p => ({
    name: p.name?.length > 14 ? p.name.slice(0, 14) + '…' : p.name,
    ventes: p.totalSold || 0,
  }));

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="w-60 bg-white flex flex-col py-6 px-4 border-r border-gray-100 shrink-0 shadow-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-2 mb-8">
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
          <SideLink href="/dashboard"          icon={LayoutDashboard} label="Tableau de bord" active />
          <SideLink href="/dashboard/products" icon={Package}         label="Produits" />
          <SideLink href="/dashboard/orders"   icon={ShoppingBag}     label="Commandes" />
        </nav>

        {/* User + logout */}
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
            <h1 className="text-gray-900 text-xl font-black">Tableau de bord</h1>
            <p className="text-gray-400 text-xs mt-0.5 capitalize">{today}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/products" className="flex items-center gap-2 bg-[#8B0000] hover:bg-[#6b0000] text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-[#8B0000]/20">
              <Package size={15} /> Gérer les produits
            </Link>
          </div>
        </div>

        <div className="p-8 space-y-6">

          {/* Bienvenue */}
          <div className="bg-gradient-to-r from-[#8B0000] to-[#5a0000] rounded-2xl p-6 flex items-center justify-between overflow-hidden relative">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 60%)' }} />
            <div className="z-10">
              <p className="text-red-200 text-xs font-bold uppercase tracking-widest mb-1">Bienvenue</p>
              <h2 className="text-white font-black text-2xl leading-tight">Galaxy Digital</h2>
              <p className="text-red-200 text-sm mt-1">Votre boutique tourne correctement · {stats.products || 0} produits en ligne</p>
            </div>
            <div className="z-10 hidden sm:flex items-center gap-3">
              <div className="text-center bg-white/10 rounded-xl px-4 py-3 border border-white/10">
                <p className="text-white font-black text-xl">{stats.orders || 0}</p>
                <p className="text-red-200 text-[10px] font-bold uppercase">Commandes</p>
              </div>
              <div className="text-center bg-white/10 rounded-xl px-4 py-3 border border-white/10">
                <p className="text-white font-black text-xl">{stats.users || 0}</p>
                <p className="text-red-200 text-[10px] font-bold uppercase">Clients</p>
              </div>
              <div className="text-center bg-white/10 rounded-xl px-4 py-3 border border-white/10">
                <p className="text-white font-black text-xl">{Number(stats.revenue || 0).toLocaleString()}</p>
                <p className="text-red-200 text-[10px] font-bold uppercase">MAD CA</p>
              </div>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((card, i) => (
              <StatCard key={i} {...card} />
            ))}
          </div>

          {/* Charts + Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Bar chart — Top produits */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-gray-900 font-black text-base">Top 5 Produits vendus</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Classement par nombre de ventes</p>
                </div>
                <div className="w-9 h-9 bg-[#8B0000]/8 rounded-xl flex items-center justify-center">
                  <BarChart3 size={18} className="text-[#8B0000]" />
                </div>
              </div>

              {chartData.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barSize={36}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        dataKey="name"
                        stroke="#9ca3af"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#6b7280', fontWeight: 600 }}
                      />
                      <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#9ca3af' }} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fef2f2', radius: 8 }} />
                      <Bar dataKey="ventes" fill="#8B0000" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-300">
                  <BarChart3 size={48} strokeWidth={1} className="mb-3" />
                  <p className="text-sm font-medium text-gray-400">Aucune donnée de vente</p>
                </div>
              )}
            </div>

            {/* Dernières commandes */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-gray-900 font-black text-base">Dernières commandes</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Activité récente</p>
                </div>
                <Link href="/dashboard/orders" className="text-[#8B0000] text-xs font-bold flex items-center gap-1 hover:underline">
                  Voir tout <ChevronRight size={13} />
                </Link>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto max-h-64 pr-1">
                {data?.recentOrders?.length > 0 ? (
                  data.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#8B0000]/20 transition-colors">
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 text-sm truncate">{order.user?.name || 'Client'}</p>
                        <p className="text-[#8B0000] font-black text-xs mt-0.5">{Number(order.totalPrice).toLocaleString()} MAD</p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                    <ShoppingCart size={40} strokeWidth={1} className="mb-3" />
                    <p className="text-sm font-medium text-gray-400 text-center">Aucune commande pour le moment</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Raccourcis rapides */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/dashboard/products"
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:border-[#8B0000]/30 hover:shadow-md transition-all group">
              <div className="w-11 h-11 bg-[#8B0000]/8 rounded-xl flex items-center justify-center group-hover:bg-[#8B0000] transition-colors">
                <Package size={20} className="text-[#8B0000] group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="font-black text-gray-800 text-sm">Gérer les produits</p>
                <p className="text-gray-400 text-xs">{stats.products || 0} articles</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 ml-auto group-hover:text-[#8B0000] transition-colors" />
            </Link>

            <Link href="/dashboard/orders"
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:border-[#8B0000]/30 hover:shadow-md transition-all group">
              <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                <ShoppingBag size={20} className="text-indigo-500 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="font-black text-gray-800 text-sm">Voir les commandes</p>
                <p className="text-gray-400 text-xs">{stats.orders || 0} commandes</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 ml-auto group-hover:text-indigo-500 transition-colors" />
            </Link>

            <Link href="/"
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:border-[#8B0000]/30 hover:shadow-md transition-all group">
              <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-colors">
                <Store size={20} className="text-green-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="font-black text-gray-800 text-sm">Voir la boutique</p>
                <p className="text-gray-400 text-xs">Ouvrir le site public</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 ml-auto group-hover:text-green-500 transition-colors" />
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
