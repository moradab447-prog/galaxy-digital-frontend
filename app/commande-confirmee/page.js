'use client';

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ShoppingBag, Home, Truck } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

function OrderConfirmationInner() {
  const searchParams = useSearchParams();
  const orderNum = searchParams.get("orderNum") || "";
  const nom = searchParams.get("nom") || "";
  const ville = searchParams.get("ville") || "";
  const total = searchParams.get("total") || "";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 180 }}
        className="bg-white rounded-3xl shadow-xl border border-gray-100 max-w-lg w-full p-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 size={44} className="text-green-500" />
        </motion.div>

        <h1 className="text-2xl font-black text-gray-900 mb-2">Commande Confirmée !</h1>
        <p className="text-gray-500 text-sm mb-6">
          Merci <strong className="text-gray-800">{nom || "cher client"}</strong> ! Votre commande a bien été reçue.
          Notre équipe vous contactera dans les prochaines heures.
        </p>

        <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-sm space-y-3 text-left">
          {orderNum && (
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Numéro de commande</span>
              <span className="font-black text-primary">#{orderNum}</span>
            </div>
          )}
          {ville && (
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Ville de livraison</span>
              <span className="font-bold text-gray-800">{ville}</span>
            </div>
          )}
          {total && (
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Total à payer</span>
              <span className="font-black text-primary">{Number(total).toLocaleString()} MAD</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Mode de paiement</span>
            <span className="font-bold text-green-700">Espèces à la livraison</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Délai de livraison</span>
            <span className="font-bold text-gray-800 flex items-center gap-1">
              <Truck size={14} className="text-primary" /> 24–72 heures
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {[
            { label: "Commande reçue", done: true },
            { label: "Confirmation téléphone", done: false },
            { label: "Expédition", done: false },
            { label: "Livraison", done: false },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`text-[10px] font-bold px-2 py-1 rounded-full ${step.done ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {step.done ? "✓ " : `${i + 1}. `}{step.label}
              </div>
              {i < 3 && <span className="text-gray-300 text-xs">→</span>}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <a
            href={`https://wa.me/212668835994?text=Bonjour%20Galaxy%20Digital%2C%20j'ai%20passé%20la%20commande%20%23${orderNum}%20et%20je%20souhaite%20suivre%20ma%20livraison.`}
            target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 text-white font-bold py-3.5 rounded-2xl hover:bg-green-600 transition"
          >
            <FaWhatsapp size={20} /> Suivre via WhatsApp
          </a>
          <Link href="/products" className="flex items-center justify-center gap-2 w-full bg-primary text-white font-bold py-3.5 rounded-2xl hover:bg-primary-light transition">
            <ShoppingBag size={18} /> Continuer mes achats
          </Link>
          <Link href="/" className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-2xl hover:bg-gray-200 transition text-sm">
            <Home size={16} /> Retour à l&apos;accueil
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6 leading-relaxed">
          Un email de confirmation vous sera envoyé si une adresse e-mail a été fournie.<br />
          Pour toute question : <a href="tel:+212668835994" className="text-primary font-bold">+212 6 68 83 59 94</a>
        </p>
      </motion.div>
    </div>
  );
}

export default function OrderConfirmation() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20">Chargement...</div>}>
      <OrderConfirmationInner />
    </Suspense>
  );
}
