'use client';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, Phone, Shield, Truck, HelpCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const FAQ_DATA = [
  {
    category: "Commande & Paiement", icon: "💳",
    faqs: [
      { q: "Comment passer une commande sur Galaxy Digital ?", a: "Ajoutez les produits à votre panier, puis cliquez sur 'Commander maintenant'. Remplissez le formulaire avec vos coordonnées et votre adresse de livraison. Vous recevrez une confirmation, et notre équipe vous contactera pour valider la commande." },
      { q: "Quels modes de paiement acceptez-vous ?", a: "Galaxy Digital accepte uniquement le paiement en espèces (MAD) à la livraison (Cash on Delivery). Aucun paiement en ligne n'est requis." },
      { q: "Puis-je modifier ou annuler ma commande ?", a: "Oui, vous pouvez annuler ou modifier votre commande en nous contactant par téléphone ou WhatsApp dans les 2 heures suivant la passation." },
      { q: "Comment puis-je suivre ma commande ?", a: "Après confirmation, notre équipe vous envoie un SMS avec les informations de suivi. Vous pouvez aussi nous contacter via WhatsApp pour obtenir une mise à jour en temps réel." },
    ],
  },
  {
    category: "Livraison", icon: "🚚",
    faqs: [
      { q: "La livraison est-elle gratuite ?", a: "Oui, la livraison est 100% gratuite partout au Maroc, sans minimum d'achat." },
      { q: "Quels sont les délais de livraison ?", a: "Grand Agadir : 24h · Région Souss-Massa : 24–48h · Grandes villes (Casablanca, Marrakech…) : 48h · Reste du Maroc : 48–72h." },
      { q: "Livrez-vous dans toutes les villes du Maroc ?", a: "Oui, nous livrons dans toutes les villes et zones du Maroc, y compris le Sud (Laâyoune, Dakhla)." },
      { q: "Que faire si mon colis est endommagé à la livraison ?", a: "Refusez le colis et contactez-nous immédiatement. Nous organisons un remplacement sous 48h." },
    ],
  },
  {
    category: "Produits & Garantie", icon: "🛡️",
    faqs: [
      { q: "Les produits vendus sont-ils originaux ?", a: "Oui, tous nos produits sont 100% originaux, achetés auprès des distributeurs officiels au Maroc. Une facture officielle vous est remise." },
      { q: "Quelle est la durée de la garantie ?", a: "Elle varie selon la catégorie : 1 an pour TV et petit électroménager, 2 ans pour gros électroménager, 5 ans pour les compresseurs (réfrigérateurs, climatiseurs)." },
      { q: "Comment activer la garantie ?", a: "La garantie est automatiquement activée à la date d'achat (sur votre facture). En cas de panne, contactez-nous et nous vous orientons vers le centre SAV agréé." },
      { q: "Puis-je retourner un produit que je n'utilise pas ?", a: "Oui, retour possible sous 7 jours si le produit est dans son emballage d'origine, non utilisé, avec tous ses accessoires." },
    ],
  },
  {
    category: "WhatsApp & Contact", icon: "📱",
    faqs: [
      { q: "Puis-je commander via WhatsApp ?", a: "Absolument ! WhatsApp est notre canal privilégié. Envoyez-nous le nom du produit et votre adresse, et nous gérons tout." },
      { q: "Quels sont vos horaires de disponibilité ?", a: "Lundi–Samedi : 9h–20h · Dimanche : 10h–17h. En dehors des heures, laissez un message WhatsApp, nous répondons dès l'ouverture." },
      { q: "Comment obtenir un devis pour une installation ?", a: "Contactez-nous par téléphone ou WhatsApp avec les détails de votre projet. Nous vous envoyons un devis gratuit sous 24h." },
    ],
  },
];

const FAQItem = ({ q, a, index, isOpen, onToggle }) => (
  <div
    className={`rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
      isOpen
        ? "bg-[#8B0000] shadow-xl shadow-[#8B0000]/20"
        : "bg-white border border-gray-100 hover:border-[#8B0000]/30 hover:shadow-sm"
    }`}
    onClick={onToggle}
  >
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="flex items-center gap-3 min-w-0">
        <span className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-colors ${
          isOpen ? "bg-white/20 text-white" : "bg-[#8B0000]/10 text-[#8B0000]"
        }`}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className={`text-sm sm:text-[15px] font-semibold leading-snug transition-colors ${
          isOpen ? "text-white" : "text-gray-800"
        }`}>
          {q}
        </h3>
      </div>
      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
        isOpen ? "bg-white/20 rotate-180" : "bg-gray-100"
      }`}>
        <ChevronDown size={14} className={isOpen ? "text-white" : "text-gray-400"} />
      </div>
    </div>

    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-56" : "max-h-0"}`}>
      <div className="px-5 pb-5 pt-0">
        <div className="ml-11 border-t border-white/20 pt-3">
          <p className="text-red-100 text-sm leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  </div>
);

export default function FAQ() {
  const [openMap, setOpenMap] = useState({});

  const toggle = (catIdx, faqIdx) => {
    const key = `${catIdx}-${faqIdx}`;
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#8B0000] to-[#4a0000] py-20 px-4 text-center text-white">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle size={32} className="text-white" />
          </div>
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase">
            Aide & Support
          </span>
          <h1 className="text-3xl md:text-4xl font-black mb-4">
            Questions Fréquemment Posées
          </h1>
          <p className="text-red-200 max-w-xl mx-auto text-sm">
            Tout ce que vous devez savoir sur Galaxy Digital — livraison, garantie, paiement.
          </p>

          {/* Stats rapides */}
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {[
              { val: "< 2h",   label: "Réponse WhatsApp" },
              { val: "24–72h", label: "Livraison Maroc" },
              { val: "100%",   label: "Produits originaux" },
            ].map(({ val, label }) => (
              <div key={label} className="bg-white/10 rounded-xl py-3 px-2">
                <p className="text-white font-black text-lg">{val}</p>
                <p className="text-red-200 text-[10px] font-medium leading-tight mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* FAQ Categories */}
          <div className="w-full lg:w-3/5 space-y-10">
            {FAQ_DATA.map((cat, catIdx) => (
              <motion.section
                key={cat.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  {cat.category}
                  <div className="flex-1 h-px bg-gray-200 ml-2" />
                </h2>
                <div className="space-y-3">
                  {cat.faqs.map((faq, faqIdx) => (
                    <FAQItem
                      key={faq.q}
                      q={faq.q}
                      a={faq.a}
                      index={faqIdx}
                      isOpen={!!openMap[`${catIdx}-${faqIdx}`]}
                      onToggle={() => toggle(catIdx, faqIdx)}
                    />
                  ))}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Contact card */}
          <div className="w-full lg:w-2/5 lg:sticky lg:top-24">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">

              {/* Header rouge */}
              <div className="bg-gradient-to-br from-[#8B0000] to-[#4a0000] px-6 py-7 text-center">
                <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <HelpCircle size={26} className="text-white" />
                </div>
                <h3 className="text-white font-black text-xl leading-tight">Une question ?</h3>
                <p className="text-red-200 text-xs mt-1.5 font-medium">Notre équipe répond en moins de 2h</p>
              </div>

              {/* Stats rapides */}
              <div className="bg-[#f9f9f9] px-6 py-4 grid grid-cols-3 gap-2 text-center border-b border-gray-100">
                {[
                  { val: "< 2h",   label: "Réponse WhatsApp" },
                  { val: "24–72h", label: "Livraison Maroc" },
                  { val: "100%",   label: "Produits originaux" },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <p className="text-[#8B0000] font-black text-sm">{val}</p>
                    <p className="text-gray-500 text-[10px] font-medium leading-tight">{label}</p>
                  </div>
                ))}
              </div>

              {/* Boutons */}
              <div className="bg-white p-5 space-y-3">
                <a
                  href="https://wa.me/212600000000"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b957] text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-colors shadow-md shadow-green-200"
                >
                  <FaWhatsapp size={18} /> Écrire sur WhatsApp
                </a>
                <a
                  href="tel:+212600000000"
                  className="w-full flex items-center justify-center gap-2 border-2 border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-all"
                >
                  <Phone size={16} /> +212 600 000 000
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
