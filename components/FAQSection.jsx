'use client';

import { useState } from "react";
import { ChevronDown, MessageCircle, Phone, Shield, Truck, HelpCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

const faqs = [
  {
    question: "Comment puis-je passer une commande ?",
    answer: "Vous pouvez commander directement sur notre site web ou nous envoyer un message via WhatsApp. Choisissez votre produit, remplissez vos informations de livraison, et nous vous contacterons pour confirmer.",
    icon: MessageCircle,
  },
  {
    question: "Quels sont les délais et frais de livraison ?",
    answer: "La livraison est GRATUITE à Agadir et ses environs. Pour les autres villes du Maroc, les frais varient selon le poids et la destination. Le délai moyen est de 24 à 48 heures.",
    icon: Truck,
  },
  {
    question: "Puis-je payer à la livraison ?",
    answer: "Oui, nous acceptons le paiement en espèces à la livraison (Cash on Delivery) partout au Maroc. Vous ne payez que lorsque vous recevez et vérifiez votre produit.",
    icon: Shield,
  },
  {
    question: "Les produits sont-ils couverts par une garantie ?",
    answer: "Absolument. Tous nos appareils (TV, Réfrigérateurs, Machines à laver, etc.) bénéficient d'une garantie constructeur officielle de 12 à 24 mois selon la marque.",
    icon: Shield,
  },
  {
    question: "Les produits sont-ils originaux ?",
    answer: "Oui, Galaxy Digital s'engage à ne vendre que des produits 100% originaux et neufs dans leur emballage d'origine. Nous travaillons directement avec les plus grandes marques.",
    icon: HelpCircle,
  },
  {
    question: "Que faire en cas de problème avec mon appareil ?",
    answer: "Notre service après-vente est basé à Agadir. En cas de souci, contactez notre support technique via WhatsApp ou par téléphone, et nous organiserons l'intervention nécessaire.",
    icon: Phone,
  },
];

const FAQItem = ({ question, answer, isOpen, onToggle, index }) => (
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
          isOpen ? "bg-white/20 text-white" : "bg-[#8B0000]/8 text-[#8B0000]"
        }`}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className={`text-sm sm:text-[15px] font-semibold leading-snug transition-colors ${
          isOpen ? "text-white" : "text-gray-800"
        }`}>
          {question}
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
          <p className="text-red-100 text-sm leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  </div>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="py-4">
      {/* Header centré */}
      <div className="section-title mb-10">
        <span className="badge">Aide & Support</span>
        <h2>Questions Fréquentes</h2>
        <div className="underline-bar" />
        <p>Tout ce que vous devez savoir sur Galaxy Digital — livraison, garantie, paiement.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* Liste FAQ */}
        <div className="w-full lg:w-3/5 space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              index={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* Card contact */}
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
                { val: "< 2h",  label: "Réponse WhatsApp" },
                { val: "24–72h", label: "Livraison Maroc" },
                { val: "100%",  label: "Produits originaux" },
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
                href="https://wa.me/212668835994"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b957] text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-colors shadow-md shadow-green-200"
              >
                <FaWhatsapp size={18} /> Écrire sur WhatsApp
              </a>
              <a
                href="tel:+212668835994"
                className="w-full flex items-center justify-center gap-2 border-2 border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-all"
              >
                <Phone size={16} /> +212 6 68 83 59 94
              </a>
              <Link
                href="/products"
                className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold text-sm transition-colors"
              >
                Voir nos produits →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
