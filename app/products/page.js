'use client';

import React, { useState, useEffect, Suspense } from "react";
import API from "@/api/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star, ShoppingCart, Search, SlidersHorizontal, ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// ─── Carte Produit ────────────────────────────────────────────────────────────
const ProductCard = ({ product }) => {
  const [liked, setLiked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated, openLogin } = useAuth();

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Connectez-vous pour ajouter au panier");
      openLogin();
      return;
    }
    try {
      setIsAdding(true);
      await addToCart(product);
      toast.success(`Ajouté au panier !`, { icon: "🛒" });
    } catch {
      toast.error("Erreur lors de l'ajout au panier");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={() => router.push(`/products/${product.id}`)}
      className="bg-white cursor-pointer rounded-2xl overflow-hidden border border-gray-100 hover:border-[#8B0000]/30 hover:shadow-xl transition-all duration-300 flex flex-col group"
    >
      {/* Image */}
      <div className="relative bg-gray-50 aspect-square overflow-hidden flex items-center justify-center p-4">
        {discount > 0 && (
          <span className="absolute top-3 left-3 z-10 bg-[#8B0000] text-white text-[10px] font-bold px-2 py-1 rounded-lg">
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 z-10 bg-gray-700 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
            Rupture de stock
          </span>
        )}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); toast(liked ? "Retiré des favoris" : "Ajouté aux favoris ❤️"); }}
          className="absolute top-3 right-3 z-10 bg-white/90 p-2 rounded-full shadow hover:bg-red-50 transition-colors"
        >
          <Heart size={15} className={liked ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-40 w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = "https://via.placeholder.com/300x300?text=Photo"; }}
        />
      </div>

      {/* Infos */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
          {product.category?.name}
        </span>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight group-hover:text-[#8B0000] transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11} fill={i < 4 ? "currentColor" : "none"} className={i >= 4 ? "text-gray-300" : ""} />
          ))}
          <span className="text-gray-400 text-[10px] ml-1">(4.8)</span>
        </div>
        <div className="mt-auto pt-2 border-t border-gray-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-[#8B0000]">
                {product.price === 0 ? "Prix sur demande" : `${Number(product.price).toLocaleString()} MAD`}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">{Number(product.originalPrice).toLocaleString()} MAD</span>
              )}
            </div>
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              product.stock > 5  ? 'bg-green-50 text-green-700' :
              product.stock > 0  ? 'bg-amber-50 text-amber-600' :
                                   'bg-red-50 text-red-500'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                product.stock > 5 ? 'bg-green-500' :
                product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'
              }`} />
              {product.stock > 5 ? 'En stock' : product.stock > 0 ? `${product.stock} restants` : 'Indisponible'}
            </span>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={isAdding || product.stock === 0}
            onClick={handleAddToCart}
            className={`w-full py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#8B0000] text-white hover:bg-[#6b0000]'
            } disabled:opacity-70`}
          >
            {isAdding ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
            {isAdding ? "Ajout..." : product.stock === 0 ? "Indisponible" : "Ajouter au panier"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Page inner ───────────────────────────────────────────────────────────────
function ProductsPageInner() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [localSearch, setLocalSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy]     = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 12;

  const searchParams = useSearchParams();
  const searchQuery  = searchParams.get("q") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          API.get("/categories"),
          API.get("/products?limit=500"),
        ]);
        setCategories(catRes.data || []);
        setProducts(Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data?.data || []));
      } catch {
        toast.error("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery) setLocalSearch(searchQuery);
  }, [searchQuery]);

  const filtered = products.filter((p) => {
    const matchCat    = !selectedCategory || p.categoryId === Number(selectedCategory);
    const matchMin    = !minPrice || p.price >= Number(minPrice);
    const matchMax    = !maxPrice || p.price <= Number(maxPrice);
    const matchSearch = !localSearch || p.name.toLowerCase().includes(localSearch.toLowerCase());
    return matchCat && matchMin && matchMax && matchSearch;
  }).sort((a, b) => {
    if (sortBy === "price-asc")  return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return b.id - a.id;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated  = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const hasFilters = selectedCategory || minPrice || maxPrice || localSearch;

  const reset = () => {
    setSelectedCategory(""); setMinPrice(""); setMaxPrice(""); setLocalSearch(""); setSortBy("newest"); setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#8B0000] text-white py-10">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-black mb-1">Notre Boutique</h1>
          <p className="text-red-200 text-sm">
            {loading ? "Chargement..." : `${filtered.length} produit${filtered.length > 1 ? "s" : ""} disponible${filtered.length > 1 ? "s" : ""}`}
          </p>
          <div className="mt-5 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => { setLocalSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Rechercher un produit, une marque..."
              className="w-full pl-11 pr-4 py-3 rounded-xl text-gray-800 text-sm font-medium focus:outline-none"
            />
            {localSearch && (
              <button onClick={() => setLocalSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar filtres */}
        <aside className="w-60 shrink-0 hidden lg:block">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-800">Filtres</h2>
              {hasFilters && (
                <button onClick={reset} className="text-xs text-[#8B0000] font-medium hover:underline">Réinitialiser</button>
              )}
            </div>
            {/* Catégories */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Catégorie</h3>
              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedCategory(""); setCurrentPage(1); }}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg font-medium transition-colors ${!selectedCategory ? "bg-[#8B0000] text-white" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  Toutes les catégories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(String(cat.id)); setCurrentPage(1); }}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg font-medium transition-colors ${selectedCategory === String(cat.id) ? "bg-[#8B0000] text-white" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            {/* Prix */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Prix (MAD)</h3>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1); }} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B0000]" />
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B0000]" />
              </div>
            </div>
          </div>
        </aside>

        {/* Grille produits */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-500">{filtered.length} résultats</span>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#8B0000] bg-white"
            >
              <option value="newest">Nouveautés</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
              <Loader2 size={40} className="animate-spin text-[#8B0000]" />
              <p className="text-sm">Chargement des produits...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p className="text-xl font-bold mb-2">Aucun produit trouvé</p>
              <button onClick={reset} className="bg-[#8B0000] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#6b0000] mt-4">
                Voir tous les produits
              </button>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedCategory}-${sortBy}-${currentPage}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  {paginated.map((p) => <ProductCard key={p.id} product={p} />)}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 disabled:opacity-30">
                    <ChevronLeft size={18} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                    .map((page, idx, arr) => (
                      <React.Fragment key={page}>
                        {idx > 0 && arr[idx - 1] !== page - 1 && <span className="text-gray-400 px-1">...</span>}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors ${currentPage === page ? "bg-[#8B0000] text-white" : "border border-gray-200 hover:bg-gray-100 text-gray-700"}`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 disabled:opacity-30">
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20 text-gray-400"><Loader2 className="animate-spin" size={32} /></div>}>
      <ProductsPageInner />
    </Suspense>
  );
}
