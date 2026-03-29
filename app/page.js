'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, ChevronRight, ChevronLeft, Loader2, Star, Shield,
  Truck, Headphones, RotateCcw, Heart, BadgeCheck, Clock, Zap,
  Package, ArrowRight, Check, Phone
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import API from "@/api/api";
import toast from "react-hot-toast";
import FAQSection from "@/components/FAQSection";


// ─── Hero slides ──────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    id: 1, badge: "Livraison partout au Maroc",
    title: "ÉLECTROMÉNAGER", highlight: "PREMIUM",
    desc: "Paiement à la livraison · Garantie officielle · SAV 6j/7",
    img: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=700&q=80",
    cta: "Commander maintenant", bg: "#0d0000",
  },
  {
    id: 2, badge: "Offre à durée limitée",
    title: "MACHINES À LAVER", highlight: "ÉCONOMIQUES",
    desc: "Jusqu'à -30% sur les meilleures marques. Livraison 24–72h.",
    img: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=700&q=80",
    cta: "Voir les offres", bg: "#0a0500",
  },
  {
    id: 3, badge: "Nouvelle collection",
    title: "SMARTPHONES", highlight: "& TABLETTES",
    desc: "Samsung, Apple, OPPO — les derniers modèles au meilleur prix.",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80",
    cta: "Découvrir", bg: "#00050d",
  },
];

const WHY_US = [
  { icon: Truck,       title: "Livraison 24–72h",    desc: "Partout au Maroc. Suivi en temps réel." },
  { icon: BadgeCheck,  title: "Paiement à livraison", desc: "COD — vous payez en recevant votre commande." },
  { icon: Shield,      title: "Garantie officielle",  desc: "1 à 3 ans selon produits. SAV agréé." },
  { icon: Headphones,  title: "Support 6j/7",         desc: "Conseillers par téléphone et WhatsApp." },
  { icon: RotateCcw,   title: "Retour 7 jours",       desc: "Sans conditions. Satisfaction garantie." },
  { icon: Star,        title: "100% Authentique",     desc: "Produits originaux avec facture officielle." },
];

const STATIC_REVIEWS = [
  { id: 1, name: "Fatima Z.",  stars: 5, city: "Agadir",     text: "Super expérience ! Le réfrigérateur est arrivé en parfait état en moins de 24h. Livraison rapide et service impeccable." },
  { id: 2, name: "Mohamed B.", stars: 5, city: "Casablanca", text: "Climatiseur Inverter commandé. Prix compétitif et paiement à la livraison c'est top !" },
  { id: 3, name: "Amina L.",   stars: 5, city: "Marrakech",  text: "Machine à laver Samsung. Le vendeur a répondu à toutes mes questions sur WhatsApp. Excellent service !" },
  { id: 4, name: "Youssef K.", stars: 4, city: "Rabat",      text: "Bonne qualité produits, livraison soignée, service client réactif. Recommande Galaxy Digital." },
  { id: 5, name: "Khadija M.", stars: 5, city: "Fès",        text: "Four encastrable Bosch. Emballage protégé, produit original. Parfait !" },
  { id: 6, name: "Rachid T.",  stars: 5, city: "Agadir",     text: "Meilleur prix sur Agadir ! Galaxy Digital c'est sérieux. Reviendrai sûrement." },
];

const CAT_DATA = {
  "Petit Électroménager":           { img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80", color: "#fff3e0" },
  "Gros Électroménager":            { img: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80", color: "#e8eaf6" },
  "Climatisation":                  { img: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=600&q=80", color: "#e0f7fa" },
  "TV, Vidéo & Audio":              { img: "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=600&q=80", color: "#f3e5f5" },
  "Informatique":                   { img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80", color: "#e8f5e9" },
  "Smartphone & Tablette":          { img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80", color: "#fff8e1" },
  "Montres & Wearables":            { img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80", color: "#fce4ec" },
  "Accessoires":                    { img: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=600&q=80", color: "#f1f8e9" },
  "Entretien & Soin de la Maison":  { img: "https://images.unsplash.com/photo-1527515545081-5db817172677?auto=format&fit=crop&w=600&q=80", color: "#e0f2f1" },
  "Beauté & Santé":                 { img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80", color: "#fce4ec" },
  "Gaming":                         { img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80", color: "#311b92" },
  "L'Encastrable":                  { img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80", color: "#efebe9" },
};

// ─── Countdown ────────────────────────────────────────────────────────────────
function useCountdown(target) {
  const calc = () => {
    const d = target - Date.now();
    if (d <= 0) return { h: 0, m: 0, s: 0 };
    return { h: Math.floor(d / 3600000), m: Math.floor((d % 3600000) / 60000), s: Math.floor((d % 60000) / 1000) };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); });
  return t;
}

// ─── Mini ProductCard ─────────────────────────────────────────────────────────
const MiniCard = ({ product }) => {
  const [liked, setLiked] = useState(false);
  const [adding, setAdding] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated, openLogin } = useAuth();

  const discount = product.originalPrice && Number(product.originalPrice) > Number(product.price)
    ? Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100) : 0;

  const handleAdd = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!isAuthenticated) { openLogin(); return; }
    setAdding(true);
    try { await addToCart(product); toast.success("Ajouté au panier !", { icon: "🛒" }); }
    catch { toast.error("Erreur"); }
    finally { setAdding(false); }
  };

  return (
    <div
      onClick={() => router.push(`/products/${product.id}`)}
      className="cursor-pointer bg-white rounded-2xl border border-gray-100 hover:border-[#8B0000]/20 hover:shadow-lg transition-all duration-300 flex flex-col group w-44 sm:w-52 shrink-0"
    >
      <div className="relative bg-gray-50 rounded-t-2xl overflow-hidden flex items-center justify-center" style={{ height: 140 }}>
        {discount > 0 && <span className="absolute top-2 left-2 z-10 bg-[#8B0000] text-white text-[9px] font-black px-2 py-0.5 rounded-full">-{discount}%</span>}
        <button type="button" onClick={(e) => { e.stopPropagation(); setLiked(!liked); }} className="absolute top-2 right-2 z-10 bg-white/80 p-1.5 rounded-full">
          <Heart size={13} className={liked ? "fill-red-500 text-red-500" : "text-gray-300"} />
        </button>
        <img src={product.imageUrl} alt={product.name} className="h-32 w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 p-2"
          onError={e => e.target.src = "https://via.placeholder.com/200x200?text=Photo"} />
      </div>
      <div className="p-3 flex flex-col flex-1 gap-1.5">
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{product.category?.name}</p>
        <h4 className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-[#8B0000] transition-colors">{product.name}</h4>
        <div className="flex gap-0.5 mt-0.5">
          {[...Array(5)].map((_, i) => <Star key={i} size={9} fill={i < 4 ? "#fbbf24" : "none"} className={i < 4 ? "text-yellow-400" : "text-gray-200"} />)}
        </div>
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-sm font-black text-[#8B0000]">
              {Number(product.price) === 0 ? "Sur demande" : `${Number(product.price).toLocaleString()} MAD`}
            </span>
            {Number(product.originalPrice) > Number(product.price) && (
              <span className="text-[10px] text-gray-400 line-through">{Number(product.originalPrice).toLocaleString()}</span>
            )}
          </div>
          <button onClick={handleAdd} disabled={adding}
            className="w-full py-1.5 rounded-xl text-[11px] font-bold bg-[#8B0000] text-white hover:bg-[#6b0000] disabled:bg-gray-200 transition-colors flex items-center justify-center gap-1">
            {adding ? <Loader2 size={11} className="animate-spin" /> : <ShoppingCart size={11} />}
            {adding ? "..." : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Category Section ─────────────────────────────────────────────────────────
const CategorySection = ({ category, products }) => {
  const scrollRef = useRef(null);
  const router = useRouter();
  const d = CAT_DATA[category.name] || { img: "", color: "#f5f5f5" };

  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="mb-10 sm:mb-14">
      {/* Header catégorie — centré */}
      <div className="text-center mb-5 px-4">
        <div className="inline-flex items-center gap-2 mb-1">
          <div className="w-5 h-0.5 bg-[#8B0000] rounded-full" />
          <span className="text-[#8B0000] text-[10px] font-black uppercase tracking-widest">Catégorie</span>
          <div className="w-5 h-0.5 bg-[#8B0000] rounded-full" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900">{category.name}</h2>
        <div className="flex items-center justify-center gap-4 mt-2">
          <span className="text-xs text-gray-400 font-medium">{products.length} produits</span>
          <button
            onClick={() => router.push(`/products?category=${category.id}`)}
            className="text-[#8B0000] font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all underline-offset-2 hover:underline"
          >
            Voir tout <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Scroll container */}
      <div className="relative group/section">
        {/* Bouton gauche — desktop uniquement */}
        <button
          onClick={() => scroll(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white shadow-lg rounded-full hidden md:flex items-center justify-center text-gray-700 opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-[#8B0000] hover:text-white border border-gray-100"
        >
          <ChevronLeft size={18} />
        </button>
        {/* Bouton droite — desktop uniquement */}
        <button
          onClick={() => scroll(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white shadow-lg rounded-full hidden md:flex items-center justify-center text-gray-700 opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-[#8B0000] hover:text-white border border-gray-100"
        >
          <ChevronRight size={18} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide carousel-scroll px-3 sm:px-4 lg:px-8 pb-3"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Carte bannière catégorie */}
          <div
            onClick={() => router.push(`/products?category=${category.id}`)}
            className="shrink-0 w-36 sm:w-44 rounded-2xl overflow-hidden cursor-pointer relative flex flex-col justify-end"
            style={{ background: `linear-gradient(135deg, ${d.color} 0%, #fff 100%)`, height: 240, minHeight: 240 }}
          >
            {d.img && (
              <img src={d.img} alt={category.name} className="absolute inset-0 w-full h-full object-cover opacity-20" />
            )}
            <div className="relative z-10 p-3 sm:p-4">
              <p className="font-black text-gray-900 text-xs sm:text-sm leading-tight mb-1">{category.name}</p>
              <p className="text-[9px] text-gray-500 mb-2 sm:mb-3">{products.length} articles</p>
              <span className="text-[9px] sm:text-[10px] font-black text-[#8B0000] flex items-center gap-1">Voir tout <ArrowRight size={10} /></span>
            </div>
          </div>

          {/* Produits */}
          {products.slice(0, 10).map(p => <MiniCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function GalaxyHome() {
  const [categories,       setCategories]       = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [reviews,          setReviews]          = useState(STATIC_REVIEWS);
  const [loading,          setLoading]          = useState(true);
  const [heroIdx,          setHeroIdx]          = useState(0);
  const [reviewIdx,        setReviewIdx]        = useState(0);
  const router = useRouter();

  const offerEnd  = useState(() => Date.now() + 48 * 3600 * 1000)[0];
  const countdown = useCountdown(offerEnd);

  // Auto-advance hero
  useEffect(() => {
    const id = setInterval(() => setHeroIdx(i => (i + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(id);
  }, []);

  // Auto-advance reviews (show 1 on mobile, 3 on desktop — cycle through groups)
  useEffect(() => {
    const id = setInterval(() => setReviewIdx(i => (i + 1) % reviews.length), 4500);
    return () => clearInterval(id);
  }, [reviews.length]);

  useEffect(() => {
    (async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          API.get("/categories"),
          API.get("/products?limit=500"),
        ]);
        const cats = catRes.data || [];
        const prods = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data?.data || []);

        setCategories(cats);
        setFeaturedProducts(prods.slice(0, 8));

        // Grouper les produits par catégorie
        const grouped = {};
        cats.forEach(cat => {
          grouped[cat.id] = prods.filter(p => p.categoryId === cat.id);
        });
        setProductsByCategory(grouped);
      } catch {
        toast.error("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f8f8]">

      {/* ── HERO SLIDER ───────────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-6 pt-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
          {/* Slider principal */}
          <div className="rounded-2xl overflow-hidden shadow-xl relative" style={{ minHeight: 380 }}>
            {HERO_SLIDES.map((s, idx) => (
              <div
                key={s.id}
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: idx === heroIdx ? 1 : 0, zIndex: idx === heroIdx ? 10 : 0, pointerEvents: idx === heroIdx ? 'auto' : 'none' }}
              >
                <div className="flex flex-col md:flex-row items-center px-8 md:px-14 py-12 min-h-[380px] relative overflow-hidden h-full"
                  style={{ background: `linear-gradient(130deg, ${s.bg} 0%, #1a0000 60%, #300000 100%)` }}>
                  <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_top_right,_#ff0000,_transparent)]" />
                  <div className="flex-1 z-10 text-center md:text-left">
                    <span className="inline-block bg-[#8B0000]/40 border border-[#8B0000] text-red-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                      🚚 {s.badge}
                    </span>
                    <h1 className="text-white text-4xl md:text-5xl font-black leading-tight uppercase">{s.title}</h1>
                    <h2 className="text-[#e87070] text-4xl md:text-5xl font-black leading-tight uppercase mb-4">{s.highlight}</h2>
                    <p className="text-gray-400 text-sm mb-7 max-w-sm">{s.desc}</p>
                    <div className="flex gap-3 flex-wrap justify-center md:justify-start">
                      <button onClick={() => router.push("/products")}
                        className="bg-[#8B0000] hover:bg-[#a50000] text-white px-7 py-3 rounded-full font-black text-sm transition-all shadow-lg shadow-red-900/40">
                        {s.cta}
                      </button>
                      <a href="https://wa.me/212600000000" target="_blank" rel="noreferrer"
                        className="bg-[#25D366] text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-[#20b957] transition-all">
                        <FaWhatsapp size={16} /> WhatsApp
                      </a>
                    </div>
                    <div className="flex gap-4 mt-6 justify-center md:justify-start">
                      {["💳 COD", "🛡️ Garantie", "↩️ 7 jours"].map(t => (
                        <span key={t} className="text-gray-500 text-[10px] font-medium">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 flex justify-center items-center mt-8 md:mt-0 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#8B0000]/20 rounded-full blur-3xl scale-150" />
                      <img src={s.img} alt={s.title} className="relative max-h-64 w-full object-contain drop-shadow-2xl" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {HERO_SLIDES.map((_, i) => (
                <button key={i} onClick={() => setHeroIdx(i)}
                  className="h-2 rounded-full transition-all"
                  style={{ width: i === heroIdx ? 20 : 8, background: i === heroIdx ? 'white' : 'rgba(255,255,255,0.4)' }}
                />
              ))}
            </div>
            {/* Arrows */}
            <button onClick={() => setHeroIdx(i => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setHeroIdx(i => (i + 1) % HERO_SLIDES.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Bandeaux droite */}
          <div className="hidden lg:flex flex-col gap-4">
            <div onClick={() => router.push("/products")} className="cursor-pointer bg-gradient-to-br from-[#8B0000] to-[#3a0000] rounded-2xl p-5 flex-1 flex flex-col justify-between hover:shadow-xl transition-all group">
              <div>
                <span className="text-red-300 text-[10px] font-black uppercase tracking-widest">⚡ Offre Flash</span>
                <h3 className="text-white font-black text-lg mt-1 leading-tight">Jusqu'à<br/><span className="text-3xl">-30%</span></h3>
                <p className="text-red-300 text-xs mt-1">Sur les Smartphones</p>
              </div>
              <span className="text-white/60 text-xs flex items-center gap-1 group-hover:text-white transition-colors">Voir les offres <ChevronRight size={12} /></span>
            </div>
            <div onClick={() => router.push("/products")} className="cursor-pointer bg-white rounded-2xl p-5 flex-1 flex flex-col justify-between hover:shadow-xl transition-all group border border-gray-100">
              <div>
                <Truck size={28} className="text-[#8B0000] mb-2" />
                <h3 className="font-black text-gray-900 text-sm leading-tight">Livraison<br/>Gratuite</h3>
                <p className="text-gray-400 text-xs mt-1">Partout au Maroc</p>
              </div>
              <span className="text-[#8B0000] text-xs flex items-center gap-1 font-bold group-hover:gap-2 transition-all">En savoir plus <ChevronRight size={12} /></span>
            </div>
            <div className="bg-[#25D366] rounded-2xl p-5 flex-1 flex flex-col justify-between hover:shadow-xl transition-all cursor-pointer group" onClick={() => window.open("https://wa.me/212600000000", "_blank")}>
              <div>
                <FaWhatsapp size={28} className="text-white mb-2" />
                <h3 className="text-white font-black text-sm leading-tight">Commandez<br/>sur WhatsApp</h3>
              </div>
              <span className="text-white/70 text-xs">Réponse en &lt; 5 min</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── BARRE AVANTAGES ───────────────────────────────────────────────────── */}
      <div className="bg-white border-y border-gray-100 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck,      label: "Livraison 24–72h",   sub: "Partout au Maroc" },
              { icon: BadgeCheck, label: "Paiement à livraison", sub: "COD — Zéro risque" },
              { icon: Shield,     label: "Garantie officielle", sub: "1 à 3 ans" },
              { icon: Headphones, label: "Support 6j/7",        sub: "Tel & WhatsApp" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#8B0000]/8 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-[#8B0000]" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{label}</p>
                  <p className="text-gray-400 text-[11px]">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CATÉGORIES RAPIDES ────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-6 py-10">
        <div className="section-title">
          <span className="badge">Toutes les familles</span>
          <h2>Nos Catégories</h2>
          <div className="underline-bar" />
        </div>

        {loading ? (
          <div className="flex justify-center py-6"><Loader2 className="animate-spin text-[#8B0000]" size={32} /></div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {categories.map(cat => {
              const d = CAT_DATA[cat.name] || { img: "", color: "#f5f5f5" };
              return (
                <button
                  key={cat.id}
                  onClick={() => router.push(`/products?category=${cat.id}`)}
                  className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-gray-100 hover:border-[#8B0000]/30 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: d.color }}>
                    {d.img && <img src={d.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />}
                  </div>
                  <p className="text-[10px] font-bold text-gray-700 text-center leading-tight line-clamp-2 group-hover:text-[#8B0000] transition-colors">
                    {cat.name}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ── FLASH DEALS ──────────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-6 mb-10">
        <div className="bg-gradient-to-r from-[#8B0000] to-[#c0392b] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 rounded-xl p-3">
              <Zap size={28} className="text-yellow-300" />
            </div>
            <div>
              <p className="text-red-200 text-xs font-bold uppercase tracking-widest mb-0.5">Offres Flash</p>
              <h3 className="text-white font-black text-xl">Promotions du Moment</h3>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {[{ val: countdown.h, label: "H" }, { val: countdown.m, label: "M" }, { val: countdown.s, label: "S" }].map(({ val, label }, i) => (
              <React.Fragment key={label}>
                {i > 0 && <span className="text-white/50 font-black text-xl mb-2">:</span>}
                <div className="flex flex-col items-center">
                  <div className="bg-white/15 text-white font-black text-2xl w-14 h-14 flex items-center justify-center rounded-xl border border-white/20">
                    {String(val).padStart(2, "0")}
                  </div>
                  <span className="text-white/60 text-[9px] font-bold mt-1 uppercase">{label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          <button onClick={() => router.push("/products")}
            className="bg-white text-[#8B0000] px-6 py-3 rounded-full font-black text-sm hover:bg-red-50 transition-all shadow-lg whitespace-nowrap">
            Voir les promos →
          </button>
        </div>
      </section>

      {/* ── SECTIONS PAR CATÉGORIE ─────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto py-4">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#8B0000]" size={40} /></div>
        ) : (
          categories.map(cat => (
            <CategorySection
              key={cat.id}
              category={cat}
              products={productsByCategory[cat.id] || []}
            />
          ))
        )}
      </div>

      {/* ── POURQUOI GALAXY DIGITAL ───────────────────────────────────────── */}
      <section className="bg-white border-t border-gray-100 py-16 mt-4">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
          <div className="section-title mb-12">
            <span className="badge">Nos engagements</span>
            <h2>Pourquoi choisir Galaxy Digital ?</h2>
            <div className="underline-bar" />
            <p>La référence électroménager à Agadir depuis plus de 5 ans. Qualité, prix et service.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_US.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="flex gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#8B0000]/20 hover:bg-white hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-[#8B0000]/8 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#8B0000] transition-colors">
                  <Icon size={22} className="text-[#8B0000] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 mb-1">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVIS CLIENTS ──────────────────────────────────────────────────── */}
      <section className="bg-[#f8f8f8] py-16">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
          <div className="section-title mb-10">
            <span className="badge">Témoignages</span>
            <h2>Ce que disent nos clients</h2>
            <div className="underline-bar" />
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#fbbf24" className="text-yellow-400" />)}
              </div>
              <span className="font-black text-gray-800 text-sm">4.9/5</span>
              <span className="text-gray-400 text-sm">· +500 avis vérifiés</span>
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[reviews[reviewIdx % reviews.length], reviews[(reviewIdx + 1) % reviews.length], reviews[(reviewIdx + 2) % reviews.length]].map((r, i) => (
                <div key={`${reviewIdx}-${i}`} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-1 mb-3">
                    {[...Array(r.stars)].map((_, j) => <Star key={j} size={14} fill="#fbbf24" className="text-yellow-400" />)}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-4">&quot;{r.text}&quot;</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                    <div className="w-9 h-9 rounded-full bg-[#8B0000]/10 flex items-center justify-center text-[#8B0000] font-black text-sm">
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{r.name}</p>
                      <p className="text-[11px] text-gray-400">{r.city} · <span className="text-green-500">Client vérifié ✓</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {reviews.map((_, i) => (
                <button key={i} onClick={() => setReviewIdx(i)}
                  className="h-2 rounded-full transition-all"
                  style={{ width: i === reviewIdx % reviews.length ? 20 : 8, background: i === reviewIdx % reviews.length ? '#8B0000' : '#d1d5db' }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA WHATSAPP ──────────────────────────────────────────────────── */}
      <section className="bg-[#111] py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-[#25D366] rounded-2xl flex items-center justify-center mx-auto mb-5">
            <FaWhatsapp size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Besoin d&apos;un conseil ?</h2>
          <p className="text-gray-400 text-sm mb-7">Nos conseillers répondent en quelques minutes sur WhatsApp.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="https://wa.me/212600000000?text=Bonjour%20Galaxy%20Digital"
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-black px-8 py-3.5 rounded-full hover:bg-[#20b957] transition-all shadow-xl">
              <FaWhatsapp size={20} /> Commander via WhatsApp
            </a>
            <a href="tel:+212600000000"
              className="inline-flex items-center gap-2 bg-white/10 text-white font-bold px-6 py-3.5 rounded-full hover:bg-white/20 transition-all border border-white/20">
              <Phone size={18} /> +212 600 000 000
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-6 py-16">
        <FAQSection />
      </section>

    </div>
  );
}
