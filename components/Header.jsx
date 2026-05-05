'use client';

import React, { useState, useEffect, useRef } from "react";
import {
  Search, ShoppingCart, User, Menu, X,
  LogOut, Settings, LayoutDashboard, ChevronDown,
  ShoppingBag, Plus, Minus, Trash2, Phone, Grid3X3,
  Coffee, Refrigerator, Wind, Tv, Brush, Heart,
  Laptop, Smartphone, Gamepad2, UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { FaWhatsapp } from "react-icons/fa";

const CATEGORIES = [
  { name: "Petit Électroménager",          icon: Coffee,          slug: "Petit+%C3%89lectrom%C3%A9nager" },
  { name: "Gros Électroménager",           icon: Refrigerator,    slug: "Gros+%C3%89lectrom%C3%A9nager" },
  { name: "Climatisation",                 icon: Wind,            slug: "Climatisation" },
  { name: "TV, Vidéo & Audio",             icon: Tv,              slug: "TV%2C+Vid%C3%A9o+%26+Audio" },
  { name: "Entretien & Soin de la Maison", icon: Brush,           slug: "Entretien+%26+Soin+de+la+Maison" },
  { name: "Beauté & Santé",                icon: Heart,           slug: "Beaut%C3%A9+%26+Sant%C3%A9" },
  { name: "Informatique",                  icon: Laptop,          slug: "Informatique" },
  { name: "Smartphone & Tablette",         icon: Smartphone,      slug: "Smartphone+%26+Tablette" },
  { name: "Gaming",                        icon: Gamepad2,        slug: "Gaming" },
  { name: "L'Encastrable",                 icon: UtensilsCrossed, slug: "L%27Encastrable" },
];

const NAV_LINKS = [
  { label: "Accueil",    to: "/" },
  { label: "Boutique",   to: "/products" },
  { label: "Promotions", to: "/products?promo=1" },
  { label: "Blog",       to: "/blog" },
  { label: "À Propos",   to: "/a-propos" },
  { label: "Contact",    to: "/contact" },
];

const Header = () => {
  const { user, openLogin, logout, isAuthenticated } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openCart,       setOpenCart]       = useState(false);
  const [mobileMenu,     setMobileMenu]     = useState(false);
  const [scrolled,       setScrolled]       = useState(false);
  const [searchTerm,     setSearchTerm]     = useState("");
  const [catMenuOpen,    setCatMenuOpen]    = useState(false);
  const [mobileCatOpen,  setMobileCatOpen]  = useState(false);
  const { cart, removeFromCart, totalPrice, updateQuantity } = useCart();
  const dropdownRef = useRef(null);
  const catMenuRef  = useRef(null);
  const router      = useRouter();
  const pathname    = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsDropdownOpen(false);
      if (catMenuRef.current && !catMenuRef.current.contains(e.target))
        setCatMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    router.push(`/products?q=${encodeURIComponent(searchTerm)}`);
    setMobileMenu(false);
  };

  const navLinkClass = (to) => {
    const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to.split("?")[0]);
    return `text-sm font-semibold transition-colors relative py-1
     after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-full after:bg-primary after:transition-all
     ${isActive ? "text-primary after:w-full" : "text-gray-700 hover:text-primary after:w-0 hover:after:w-full"}`;
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary text-white text-xs py-1.5 text-center font-medium tracking-wide">
        🚚 Livraison partout au Maroc · Paiement à la livraison (COD) ·
        <a href="tel:+212668835994" className="underline ml-1 hover:no-underline">+212 6 68 83 59 94</a>
      </div>

      {/* Main header */}
      <header className={`w-full bg-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? "shadow-lg" : "border-b border-gray-100"}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="bg-primary p-1.5 rounded-lg text-white">
                <ShoppingCart size={18} />
              </div>
              <div className="leading-tight">
                <span className="text-lg sm:text-xl font-black text-primary tracking-tight block">
                  GALAXY DIGITAL
                </span>
                <span className="text-[9px] text-gray-400 font-semibold tracking-widest uppercase -mt-1 block">
                  Électroménager · Agadir
                </span>
              </div>
            </Link>

            {/* Desktop search */}
            <div className="hidden md:flex flex-1 max-w-lg">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Rechercher un produit, une marque..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full bg-gray-100 rounded-full py-2.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <Search
                  onClick={handleSearch}
                  className="absolute left-4 top-2.5 text-gray-400 cursor-pointer hover:text-primary transition-colors"
                  size={18}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* WhatsApp shortcut */}
              <a
                href="https://wa.me/212668835994"
                target="_blank"
                rel="noreferrer"
                className="hidden lg:flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-green-600 transition-colors"
              >
                <FaWhatsapp size={14} /> Commander
              </a>

              {/* Auth */}
              {!isAuthenticated ? (
                <button
                  onClick={openLogin}
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-primary transition"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">Connexion</span>
                </button>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-red-400 flex items-center justify-center text-white font-bold text-xs">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-[100]">
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <p className="text-sm font-black text-gray-900 truncate">{user?.name}</p>
                        <p className="text-[10px] text-primary font-bold uppercase">{user?.role}</p>
                      </div>
                      <div className="p-1">
                        {user?.role === "ADMIN" && (
                          <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 rounded-lg transition">
                            <LayoutDashboard size={16} /> Dashboard Admin
                          </Link>
                        )}
                        <Link href="/orders" onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 rounded-lg transition">
                          <ShoppingBag size={16} /> Mes Commandes
                        </Link>
                        <button onClick={logout}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-bold">
                          <LogOut size={16} /> Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="w-px h-7 bg-gray-200 hidden sm:block" />

              {/* Cart */}
              <button
                onClick={() => setOpenCart(true)}
                className="relative hover:scale-110 transition-transform"
              >
                <ShoppingCart size={24} className="text-primary" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-white min-w-[18px] text-center">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                {mobileMenu ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Desktop nav bar */}
          <nav className="hidden lg:flex items-center gap-6 pb-3">
            {/* Catégories mega-dropdown */}
            <div className="relative" ref={catMenuRef}>
              <button
                onClick={() => setCatMenuOpen((v) => !v)}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors relative py-1
                  after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-full after:bg-primary after:transition-all
                  ${catMenuOpen ? "text-primary after:w-full" : "text-gray-700 hover:text-primary after:w-0 hover:after:w-full"}`}
              >
                <Grid3X3 size={15} />
                Catégories
                <ChevronDown size={14} className={`transition-transform ${catMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {catMenuOpen && (
                <div className="absolute top-full left-0 mt-3 w-[520px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-[100]">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                    Toutes les catégories
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {CATEGORIES.map(({ name, icon: Icon, slug }) => (
                      <Link
                        key={name}
                        href={`/products?category=${slug}`}
                        onClick={() => setCatMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 hover:text-primary transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center flex-shrink-0 transition-colors">
                          <Icon size={15} className="text-gray-500 group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors leading-tight">
                          {name}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 mt-3 pt-3">
                    <Link
                      href="/products"
                      onClick={() => setCatMenuOpen(false)}
                      className="flex items-center justify-center gap-2 text-sm font-black text-primary hover:underline"
                    >
                      Voir tous les produits →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {NAV_LINKS.map((link) => (
              <Link key={link.to} href={link.to} className={navLinkClass(link.to)}>
                {link.label}
              </Link>
            ))}
            <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
              <Phone size={13} className="text-primary" />
              <span className="font-bold text-gray-700">+212 6 68 83 59 94</span>
            </div>
          </nav>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 shadow-xl">
            {/* Mobile search */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { handleSearch(); setMobileMenu(false); } }}
                className="w-full bg-gray-100 rounded-full py-2.5 pl-12 pr-4 text-sm outline-none"
              />
              <Search className="absolute left-4 top-2.5 text-gray-400" size={18} />
            </div>

            {/* Mobile nav links */}
            <div className="space-y-1 mb-2">
              {NAV_LINKS.map((link) => {
                const isActive = link.to === "/" ? pathname === "/" : pathname.startsWith(link.to.split("?")[0]);
                return (
                  <Link
                    key={link.to}
                    href={link.to}
                    onClick={() => setMobileMenu(false)}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${isActive ? "bg-red-50 text-primary" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile categories accordion */}
            <div className="border-t border-gray-100 pt-3">
              <button
                onClick={() => setMobileCatOpen((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Grid3X3 size={16} className="text-primary" /> Catégories
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${mobileCatOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileCatOpen && (
                <div className="mt-1 ml-2 space-y-0.5">
                  {CATEGORIES.map(({ name, icon: Icon, slug }) => (
                    <Link
                      key={name}
                      href={`/products?category=${slug}`}
                      onClick={() => { setMobileMenu(false); setMobileCatOpen(false); }}
                      className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-red-50 hover:text-primary transition-colors"
                    >
                      <Icon size={15} className="text-gray-400 flex-shrink-0" />
                      {name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <a
              href="https://wa.me/212668835994"
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-center gap-2 bg-green-500 text-white text-sm font-bold py-3 rounded-xl hover:bg-green-600 transition"
            >
              <FaWhatsapp size={18} /> Commander via WhatsApp
            </a>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      {openCart && (
        <div className="fixed inset-0 z-[200] flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setOpenCart(false)} />
          <div className="w-full max-w-[380px] bg-white h-full shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <ShoppingCart size={20} className="text-primary" /> VOTRE PANIER
              </h2>
              <button onClick={() => setOpenCart(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-56 text-gray-400 gap-3">
                  <ShoppingCart size={48} strokeWidth={1} />
                  <p className="font-medium">Votre panier est vide</p>
                  <button
                    onClick={() => { setOpenCart(false); router.push("/products"); }}
                    className="mt-2 px-6 py-2 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-light transition"
                  >
                    Voir les produits
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-gray-50 pb-4">
                    <img
                      src={item.product.imageUrl}
                      className="w-20 h-20 object-cover rounded-2xl bg-gray-50 p-1"
                      alt={item.product.name}
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-800 line-clamp-2">{item.product.name}</h4>
                      <p className="text-primary font-bold text-sm my-1">{Number(item.product.price).toLocaleString()} MAD</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 hover:bg-white rounded-md transition disabled:opacity-30"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-sm font-black">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-white rounded-md transition"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition p-1">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 font-bold text-sm">TOTAL</span>
                  <span className="text-2xl font-black text-primary">{Number(totalPrice).toLocaleString()} MAD</span>
                </div>
                <div className="text-center text-xs text-gray-400 mb-3 font-medium">
                  🛡️ Paiement à la livraison · Livraison gratuite
                </div>
                <button
                  onClick={() => { setOpenCart(false); router.push("/checkout"); }}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm hover:bg-primary-light transition-all shadow-lg shadow-red-100 active:scale-95"
                >
                  Commander maintenant
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
