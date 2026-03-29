'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone, MapPin, ShoppingBag, ArrowRight, Loader2,
  ShieldCheck, User, Mail, FileText, Home,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import API from "@/api/api";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

const VILLES_MAROC = [
  "Agadir","Al Hoceïma","Asilah","Azrou","Béni Mellal","Berkane","Berrechid",
  "Bouskoura","Casablanca","Chefchaouen","Dakhla","El Jadida","El Kelaa des Sraghna",
  "Errachidia","Essaouira","Fès","Figuig","Guelmim","Ifrane","Kénitra","Khémisset",
  "Khénifra","Khouribga","Laâyoune","Larache","Marrakech","Meknès","Midelt",
  "Mohammadia","Nador","Ouarzazate","Oujda","Rabat","Safi","Salé","Sefrou",
  "Settat","Sidi Kacem","Sidi Slimane","Tan-Tan","Tanger","Taounate","Taroudant",
  "Taza","Tétouan","Tiznit","Zagora",
].sort();

const InputField = ({ icon: Icon, label, required, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-black text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-1">
      {label} {required && <span className="text-primary">*</span>}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={17} />}
      {children}
    </div>
  </div>
);

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    nom: "", telephone: "", email: "",
    adresse: "", ville: "", codePostal: "", notes: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const inputClass = "w-full bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none p-3.5 pl-11 rounded-xl text-sm transition-all placeholder:text-gray-300";
  const inputNoIcon = "w-full bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none p-3.5 rounded-xl text-sm transition-all placeholder:text-gray-300";

  const validate = () => {
    if (!form.nom.trim())       { toast.error("Nom et prénom requis"); return false; }
    if (!/^(06|07)\d{8}$/.test(form.telephone.replace(/\s/g, ""))) {
      toast.error("Téléphone invalide (ex: 0612345678)"); return false;
    }
    if (!form.adresse.trim())   { toast.error("Adresse de livraison requise"); return false; }
    if (!form.ville)            { toast.error("Veuillez choisir une ville"); return false; }
    if (cart.length === 0)      { toast.error("Votre panier est vide"); return false; }
    return true;
  };

  const handleOrder = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const res = await API.post("/orders/cod", {
        nom: form.nom,
        phone: form.telephone.replace(/\s/g, ""),
        email: form.email,
        address: `${form.adresse}, ${form.ville}${form.codePostal ? " " + form.codePostal : ""}`,
        ville: form.ville,
        notes: form.notes,
        totalPrice,
        modePaiement: "COD",
        items: cart.map((i) => ({
          productId: i.product.id,
          quantity:  i.quantity,
          price:     i.product.price,
        })),
      });

      const orderNum = res.data?.order?.id || res.data?.id || "";
      clearCart();
      const params = new URLSearchParams({
        orderNum: String(orderNum),
        nom: form.nom,
        ville: form.ville,
        total: String(totalPrice),
      });
      router.push(`/commande-confirmee?${params.toString()}`);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création de la commande. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 py-14 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-3">
            <ShoppingBag className="text-primary" /> Finaliser ma Commande
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Remplissez vos informations — paiement à la livraison</p>
          <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">✓ Paiement à la livraison</span>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">✓ Livraison gratuite</span>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">✓ Garantie officielle</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3 space-y-5">
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 space-y-5">
              <h2 className="font-black text-gray-800 text-lg border-b border-gray-100 pb-3 flex items-center gap-2">
                <User size={18} className="text-primary" /> Vos coordonnées
              </h2>
              <InputField icon={User} label="Nom et Prénom" required>
                <input type="text" placeholder="Ex: Mohamed Alami" value={form.nom} onChange={set("nom")} className={inputClass} />
              </InputField>
              <InputField icon={Phone} label="Téléphone (06 / 07)" required>
                <input type="tel" placeholder="0612 345 678" value={form.telephone} onChange={set("telephone")} maxLength={14} className={inputClass} />
              </InputField>
              <InputField icon={Mail} label="Email (pour confirmation)">
                <input type="email" placeholder="votre@email.com" value={form.email} onChange={set("email")} className={inputClass} />
              </InputField>
            </div>

            <div className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 space-y-5">
              <h2 className="font-black text-gray-800 text-lg border-b border-gray-100 pb-3 flex items-center gap-2">
                <MapPin size={18} className="text-primary" /> Adresse de livraison
              </h2>
              <InputField icon={Home} label="Adresse complète" required>
                <textarea
                  placeholder="Quartier, Rue, N° d'appartement / immeuble..." rows={3}
                  value={form.adresse} onChange={set("adresse")} className={`${inputClass} resize-none`}
                />
              </InputField>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider ml-1">
                    Ville <span className="text-primary">*</span>
                  </label>
                  <select value={form.ville} onChange={set("ville")} className={`${inputNoIcon} appearance-none cursor-pointer`}>
                    <option value="">Choisir une ville...</option>
                    {VILLES_MAROC.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <InputField label="Code Postal">
                  <input type="text" placeholder="80000" value={form.codePostal} onChange={set("codePostal")} maxLength={5} className={inputNoIcon} />
                </InputField>
              </div>
              <InputField icon={FileText} label="Notes / Instructions livraison">
                <textarea
                  placeholder="Horaires préférés, repères de livraison, étage..." rows={2}
                  value={form.notes} onChange={set("notes")} className={`${inputClass} resize-none`}
                />
              </InputField>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" /> Mode de paiement
              </h3>
              <div className="flex items-center gap-3 bg-primary/5 border-2 border-primary/20 rounded-2xl p-4">
                <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm">Paiement à la livraison (COD)</p>
                  <p className="text-xs text-gray-500">Vous payez en espèces (MAD) lors de la réception du colis</p>
                </div>
                <span className="ml-auto bg-primary text-white text-xs font-black px-3 py-1 rounded-full">Sélectionné</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }} disabled={loading || cart.length === 0}
              onClick={handleOrder}
              className="w-full bg-primary hover:bg-primary-light disabled:bg-gray-300 text-white py-5 rounded-2xl font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-red-100 transition-all"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={20} /> Traitement en cours...</>
              ) : (
                <> Confirmer ma Commande <ArrowRight size={20} /></>
              )}
            </motion.button>

            <div className="flex justify-center gap-8 text-gray-400 text-[11px] font-bold flex-wrap">
              <span className="flex items-center gap-1"><ShieldCheck size={14} /> Paiement sécurisé COD</span>
              <span className="flex items-center gap-1">🚚 Livraison 24–72h</span>
              <span>Galaxy Digital — Agadir, Maroc</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 lg:sticky lg:top-24 h-fit space-y-4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="font-black text-gray-900 mb-5 flex items-center gap-2">
                <ShoppingBag size={18} className="text-primary" /> Récapitulatif
              </h2>
              <div className="max-h-[300px] overflow-y-auto pr-1 space-y-4 mb-6">
                {cart.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">Panier vide</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gray-50 rounded-xl flex-shrink-0 p-1">
                        <img src={item.product.imageUrl} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 line-clamp-2">{item.product.name}</p>
                        <p className="text-[10px] text-gray-400 font-semibold">Qté: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-black text-primary whitespace-nowrap">
                        {(Number(item.product.price) * item.quantity).toLocaleString()} MAD
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-dashed border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Sous-total ({cart.length} article{cart.length !== 1 ? "s" : ""})</span>
                  <span>{Number(totalPrice).toLocaleString()} MAD</span>
                </div>
                <div className="flex justify-between text-sm text-green-600 font-bold">
                  <span>Livraison</span><span>GRATUITE 🚚</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="font-black text-gray-900">TOTAL À PAYER</span>
                  <span className="text-2xl font-black text-primary">{Number(totalPrice).toLocaleString()} MAD</span>
                </div>
                <p className="text-center text-xs text-gray-400 font-medium pt-1">💳 En espèces à la réception du colis</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <p className="font-black text-green-800 text-sm mb-1">Commander via WhatsApp</p>
              <p className="text-xs text-green-700 mb-3">Parlez à un conseiller et passez votre commande directement.</p>
              <a
                href="https://wa.me/212600000000?text=Bonjour%20Galaxy%20Digital%2C%20je%20souhaite%20passer%20une%20commande."
                target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 text-white text-sm font-black py-2.5 rounded-xl hover:bg-green-600 transition"
              >
                <FaWhatsapp size={18} /> Contacter sur WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
