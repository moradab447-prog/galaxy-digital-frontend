'use client';

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShoppingCart, ArrowLeft, Plus, Minus, Star,
  ShieldCheck, Truck, RotateCcw, Loader2, User, Send, ChevronLeft, ChevronRight
} from "lucide-react";
import API from "@/api/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated, openLogin, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [zoomPos, setZoomPos] = useState({ active: false, x: 50, y: 50 });
  const [activeTab, setActiveTab] = useState("description");
  const [activeImg, setActiveImg] = useState(0);

  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productRes, reviewsRes] = await Promise.all([
          API.get(`/products/${id}`),
          API.get(`/reviews?productId=${id}`)
        ]);
        setProduct(productRes.data);
        setReviews(reviewsRes.data);
        const catId = productRes.data?.categoryId;
        if (catId) {
          const simRes = await API.get(`/products?categoryId=${catId}&limit=20`);
          const all = simRes.data?.data || simRes.data || [];
          setSimilarProducts(all.filter(p => p.id !== productRes.data.id));
        }
      } catch (err) {
        toast.error("Produit introuvable");
        router.push("/products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    toast.success("Ajouté au panier !");
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour laisser un avis");
      openLogin();
      return;
    }
    if (!newComment.trim()) {
      toast.error("Le commentaire ne peut pas être vide");
      return;
    }
    try {
      setIsSubmittingReview(true);
      const res = await API.post("/reviews", {
        productId: id,
        rating: newRating,
        comment: newComment,
      });
      const newReview = { ...res.data, user: { name: user?.name || "Vous" } };
      setReviews([newReview, ...reviews]);
      setNewComment("");
      setNewRating(5);
      toast.success("Votre avis a été publié avec succès !");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Erreur lors de la publication de l'avis";
      toast.error(errorMsg);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold text-sm"
        >
          <ArrowLeft size={18} /> RETOUR
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
        <div className="relative flex flex-col gap-4">
          {/* Main image with zoom */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative bg-gray-50 rounded-[3rem] p-12 flex items-center justify-center aspect-square overflow-hidden cursor-crosshair"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setZoomPos({
                  active: true,
                  x: Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)),
                  y: Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100)),
                });
              }}
              onMouseLeave={() => setZoomPos((p) => ({ ...p, active: false }))}
            >
              {(() => {
                const imgs = Array.isArray(product.images) && product.images.length > 0
                  ? product.images
                  : [product.imageUrl];
                return (
                  <img src={imgs[activeImg]} alt={product.name} className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl" />
                );
              })()}
              {zoomPos.active && (
                <div
                  className="absolute border-2 border-white/80 bg-white/15 pointer-events-none shadow-inner"
                  style={{
                    width: "38%", height: "38%",
                    left: `${zoomPos.x}%`, top: `${zoomPos.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}
            </motion.div>

            {zoomPos.active && (() => {
              const imgs = Array.isArray(product.images) && product.images.length > 0
                ? product.images : [product.imageUrl];
              return (
                <div
                  className="hidden lg:block absolute top-0 left-[calc(100%+2rem)] w-full aspect-square rounded-3xl border border-gray-100 shadow-2xl z-50 bg-white"
                  style={{
                    backgroundImage: `url(${imgs[activeImg]})`,
                    backgroundSize: "300%",
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundRepeat: "no-repeat",
                  }}
                />
              );
            })()}
          </div>

          {/* Thumbnails */}
          {(() => {
            const imgs = Array.isArray(product.images) && product.images.length > 1
              ? product.images : null;
            if (!imgs) return null;
            return (
              <div className="flex gap-3 justify-center flex-wrap">
                {imgs.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveImg(i); setZoomPos(p => ({ ...p, active: false })); }}
                    className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all bg-gray-50 p-1 ${
                      activeImg === i ? "border-primary shadow-md" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img src={src} alt={`vue-${i}`} className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            );
          })()}
        </div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
          <span className="text-primary font-black tracking-widest text-xs uppercase mb-4">GALAXY DIGITAL EXCLUSIF</span>
          <h1 className="text-4xl font-black text-gray-900 leading-tight mb-4 uppercase">{product.name}</h1>
          {(product.marque || product.reference) && (
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-4 border-b border-gray-100 pb-4">
              {product.marque && (
                <span>Marque : <span className="font-bold text-gray-700">{product.marque}</span></span>
              )}
              {product.marque && product.reference && <span className="text-gray-300">|</span>}
              {product.reference && (
                <span>Référence : <span className="font-bold text-gray-700">{product.reference}</span></span>
              )}
            </div>
          )}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-1 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.round(averageRating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-gray-400 font-bold text-sm">({averageRating}/5 - {reviews.length} avis)</span>
          </div>
          <div className="mb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-black text-primary">{product.price.toLocaleString()} MAD</span>
              {product.originalPrice > product.price && (
                <span className="text-xl text-gray-300 line-through font-bold">{product.originalPrice.toLocaleString()} MAD</span>
              )}
            </div>
            <p className="text-green-600 font-bold text-sm mt-2 uppercase tracking-wide">
              En stock - Livraison gratuite à Agadir
            </p>
          </div>
          <p className="text-gray-500 leading-relaxed mb-10 text-lg">
            {product.description || "Découvrez la performance et l'élégance avec ce produit sélectionné par Galaxy Digital."}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 mb-12">
            <div className="flex items-center bg-gray-100 rounded-2xl p-2 w-fit">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-white rounded-xl transition-all shadow-sm">
                <Minus size={20} />
              </button>
              <span className="px-8 font-black text-xl">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-white rounded-xl transition-all shadow-sm">
                <Plus size={20} />
              </button>
            </div>
            <button
              disabled={isAdding}
              onClick={handleAddToCart}
              className="flex-1 bg-primary hover:bg-primary-light text-white py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-xl shadow-red-100 transition-all active:scale-95"
            >
              {isAdding ? <Loader2 className="animate-spin" /> : <ShoppingCart size={22} />}
              AJOUTER AU PANIER
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg text-primary"><ShieldCheck size={20} /></div>
              <span className="text-[10px] font-black text-gray-400 uppercase">Garantie 2 ans</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg text-green-600"><Truck size={20} /></div>
              <span className="text-[10px] font-black text-gray-400 uppercase">Livraison 24h</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><RotateCcw size={20} /></div>
              <span className="text-[10px] font-black text-gray-400 uppercase">Retour Gratuit</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 border-t border-gray-100 pt-12 mb-16">
        <div className="flex gap-0 border-b border-gray-200 mb-8">
          {[
            { key: "description", label: "Description" },
            { key: "details", label: "Détails Du Produit" },
            { key: "expedition", label: "Expédition" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 font-bold text-sm transition-all border-b-2 -mb-[2px] ${
                activeTab === tab.key
                  ? "border-primary text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-gray-600 leading-relaxed text-sm max-w-4xl">
          {activeTab === "description" && (
            <p className="whitespace-pre-line">
              {product.description || "Découvrez la performance et l'élégance avec ce produit sélectionné par Galaxy Digital."}
            </p>
          )}
          {activeTab === "details" && (
            <p className="whitespace-pre-line">
              {product.description || "Aucun détail technique disponible pour ce produit."}
            </p>
          )}
          {activeTab === "expedition" && (
            <div className="space-y-3">
              <p>🚚 <strong>Livraison 24–72h</strong> partout au Maroc</p>
              <p>💳 <strong>Paiement à la livraison (COD)</strong> — vous payez en espèces à la réception</p>
              <p>🛡️ <strong>Garantie officielle</strong> 1 à 3 ans selon le produit</p>
              <p>✅ <strong>Produits 100% originaux</strong> — Galaxy Digital, Agadir</p>
              <p>📞 Commande par WhatsApp : <strong>+212 668 835 994</strong></p>
            </div>
          )}
        </div>
      </div>

      {similarProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 border-t border-gray-100 pt-12 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-900">
              {similarProducts.length} autre{similarProducts.length > 1 ? "s" : ""} produit{similarProducts.length > 1 ? "s" : ""} dans la même catégorie
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => carouselRef.current?.scrollBy({ left: -320, behavior: "smooth" })}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => carouselRef.current?.scrollBy({ left: 320, behavior: "smooth" })}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div ref={carouselRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
            {similarProducts.map((p) => {
              const disc = p.originalPrice > p.price
                ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                : 0;
              return (
                <div
                  key={p.id}
                  onClick={() => { router.push(`/products/${p.id}`); setActiveImg(0); }}
                  className="shrink-0 w-44 bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all group"
                >
                  <div className="relative bg-gray-50 aspect-square flex items-center justify-center p-3">
                    {disc > 0 && (
                      <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">-{disc}%</span>
                    )}
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold text-gray-800 line-clamp-2 mb-2">{p.name}</p>
                    <p className="text-sm font-black text-primary">{Number(p.price).toLocaleString()} MAD</p>
                    {p.originalPrice > p.price && (
                      <p className="text-[11px] text-gray-300 line-through">{Number(p.originalPrice).toLocaleString()} MAD</p>
                    )}
                    <p className="text-[10px] text-green-600 font-bold mt-1">En stock</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 border-t border-gray-100 pt-16">
        <h2 className="text-2xl font-black text-gray-900 mb-8">AVIS CLIENTS ({reviews.length})</h2>
        <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-[2rem] mb-12">
          <h3 className="font-bold text-gray-800 mb-4">Laisser un avis</h3>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star} type="button" onClick={() => setNewRating(star)}
                className={`${newRating >= star ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400 transition-colors`}
              >
                <Star size={24} fill={newRating >= star ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
          <div className="relative">
            <textarea
              rows="3"
              placeholder={isAuthenticated ? "Partagez votre expérience avec ce produit..." : "Veuillez vous connecter pour écrire un avis..."}
              className="w-full bg-white border-none p-4 rounded-2xl focus:ring-2 focus:ring-primary/30 transition-all outline-none resize-none"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!isAuthenticated || isSubmittingReview}
              onClick={() => !isAuthenticated && openLogin()}
            />
            <button
              type="submit"
              disabled={!isAuthenticated || isSubmittingReview || !newComment.trim()}
              className="absolute bottom-4 right-4 bg-primary text-white p-2 rounded-xl hover:bg-primary-light disabled:bg-gray-300 transition-colors"
            >
              {isSubmittingReview ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </form>
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Aucun avis pour le moment. Soyez le premier !</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                  <User size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900">{review.user?.name || "Utilisateur"}</h4>
                    <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-1 text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
