'use client';

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Mail, Lock, User as UserIcon, Loader2, X, ShieldCheck, Truck, Star, BadgeCheck } from "lucide-react";
import API from "@/api/api";
import toast from "react-hot-toast";

function AuthModal() {
  const { showLogin, closeLogin, login: setAuthStatus } = useAuth();
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  if (!showLogin) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas !");
      setLoading(false);
      return;
    }

    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
      const response = await API.post(endpoint, formData);
      const data = response.data;

      if (isLogin) {
        setAuthStatus(data.user, data.token);
        toast.success("Connexion réussie !");
        if (data.user.role === "ADMIN") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
        closeLogin();
      } else {
        toast.success("Compte créé avec succès ! Veuillez vous connecter.");
        setIsLogin(true);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Une erreur est survenue. Veuillez réessayer.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-[460px] md:max-w-[900px] rounded-2xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row max-h-[95vh]">

        {/* Close Button */}
        <button
          onClick={closeLogin}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all z-20"
        >
          <X size={18} />
        </button>

        {/* ── Left side ── */}
        <div className="hidden md:flex flex-col justify-between w-[45%] bg-gradient-to-br from-[#8B0000] to-[#3a0000] p-10 text-white relative overflow-hidden">

          {/* Background circles */}
          <div className="absolute top-[-60px] right-[-60px] w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 bg-white/5 rounded-full" />

          {/* Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-[#8B0000] font-black text-lg">GD</span>
              </div>
              <div>
                <p className="font-black text-white text-base leading-tight">GALAXY DIGITAL</p>
                <p className="text-red-300 text-[11px] font-medium tracking-wider uppercase">Électroménager · Agadir</p>
              </div>
            </div>

            <h2 className="text-3xl font-black leading-tight mb-3">
              {isLogin ? "Bon retour\nchez vous !" : "Rejoignez\nGalaxy Digital"}
            </h2>
            <p className="text-red-200 text-sm leading-relaxed">
              {isLogin
                ? "Connectez-vous pour suivre vos commandes et profiter d'offres exclusives."
                : "Créez votre compte et bénéficiez d'offres réservées à nos membres."}
            </p>
          </div>

          {/* Trust badges */}
          <div className="relative z-10 space-y-3 mt-8">
            {[
              { icon: Truck,       text: "Livraison 24–72h partout au Maroc" },
              { icon: BadgeCheck,  text: "Paiement à la livraison (COD)" },
              { icon: ShieldCheck, text: "Garantie officielle 1 à 3 ans" },
              { icon: Star,        text: "Produits 100% originaux" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-white" />
                </div>
                <span className="text-red-100 text-xs font-medium">{text}</span>
              </div>
            ))}
          </div>

          {/* Bottom strip */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/15">
            <p className="text-red-300 text-[11px]">© 2025 Galaxy Digital — Agadir, Maroc</p>
          </div>
        </div>

        {/* ── Right side ── */}
        <div className="w-full md:w-[55%] p-8 md:p-10 overflow-y-auto bg-white">

          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-[#8B0000] rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">GD</span>
            </div>
            <span className="font-black text-[#8B0000] text-base">GALAXY DIGITAL</span>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                isLogin ? "bg-[#8B0000] text-white shadow-md" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                !isLogin ? "bg-[#8B0000] text-white shadow-md" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Créer un compte
            </button>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl font-black text-gray-900">
              {isLogin ? "Se connecter" : "Nouveau compte"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {isLogin ? "Accédez à votre espace client Galaxy Digital" : "Rejoignez des milliers de clients satisfaits"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Nom complet</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    name="name"
                    type="text"
                    required
                    onChange={handleChange}
                    placeholder="Votre nom et prénom"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000] focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Adresse e-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  name="email"
                  type="email"
                  required
                  onChange={handleChange}
                  placeholder="exemple@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000] focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Mot de passe</label>
                {isLogin && (
                  <button type="button" className="text-xs text-[#8B0000] font-semibold hover:underline">Mot de passe oublié ?</button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  name="password"
                  type="password"
                  required
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000] focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    onChange={handleChange}
                    placeholder="Répétez votre mot de passe"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000] focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#8B0000] hover:bg-[#6e0000] active:bg-[#5a0000] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#8B0000]/25 flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Chargement...</>
                : isLogin ? "Se connecter →" : "Créer mon compte →"
              }
            </button>
          </form>

          {/* Trust mini-badges (mobile) */}
          <div className="md:hidden mt-6 grid grid-cols-2 gap-2">
            {[
              { icon: Truck, text: "Livraison 24–72h" },
              { icon: BadgeCheck, text: "Paiement à livraison" },
              { icon: ShieldCheck, text: "Garantie officielle" },
              { icon: Star, text: "100% Authentique" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <Icon size={13} className="text-[#8B0000] shrink-0" />
                <span className="text-[11px] text-gray-600 font-medium">{text}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 text-xs mt-6">
            En continuant, vous acceptez nos{" "}
            <span className="text-[#8B0000] font-semibold cursor-pointer hover:underline">Conditions d'utilisation</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
