'use client';
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Star, Truck, Shield } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function ElectromenagerAgadir() {
  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Galaxy Digital Agadir",
        "description": "Spécialiste électroménager à Agadir — livraison rapide, paiement à la livraison, garantie officielle.",
        "url": "https://galaxydigital.ma",
        "telephone": "+212668835994",
        "address": { "@type": "PostalAddress", "streetAddress": "Mag Nº 16 ET 17 IMM Oum Waraka Al Houda Agadir RDC", "addressLocality": "Agadir", "postalCode": "80000", "addressCountry": "MA" },
        "geo": { "@type": "GeoCoordinates", "latitude": 30.4278, "longitude": -9.5981 },
        "openingHours": ["Mo-Sa 09:00-20:00", "Su 10:00-17:00"],
        "priceRange": "$$"
      })}} />

      <section className="bg-gradient-to-br from-gray-900 via-primary/80 to-gray-900 py-24 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="bg-white/10 text-red-200 text-xs font-black px-4 py-1.5 rounded-full tracking-widest uppercase mb-6 inline-block border border-white/10">
              <MapPin size={12} className="inline mr-1" /> Agadir, Maroc
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-5 leading-tight">
              Électroménager à Agadir —<br /><span className="text-red-300">Galaxy Digital</span>
            </h1>
            <p className="text-gray-200 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              Le spécialiste n°1 de l'électroménager à Agadir. Réfrigérateurs, machines à laver, climatiseurs, téléviseurs et plus — livrés chez vous sous 24h. Paiement à la livraison.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/products" className="bg-primary text-white font-black px-8 py-4 rounded-full hover:bg-primary-light transition shadow-xl">Voir les produits</Link>
              <a href="https://wa.me/212668835994" target="_blank" rel="noreferrer" className="bg-green-500 text-white font-bold px-8 py-4 rounded-full hover:bg-green-600 transition flex items-center gap-2"><FaWhatsapp size={20} /> Commander sur WhatsApp</a>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl font-black text-gray-900 mb-5">Achat Électroménager à Agadir : La Référence Galaxy Digital</h2>
          <div className="prose max-w-none text-gray-600 leading-relaxed space-y-4">
            <p>Vous cherchez un magasin d'<strong className="text-gray-800">électroménager à Agadir</strong> qui propose des produits originaux, à prix compétitifs et avec une livraison rapide ? <strong className="text-primary"> Galaxy Digital</strong> est la réponse.</p>
            <p>Implantés à <strong className="text-gray-800">Agadir depuis 2019</strong>, nous proposons une large gamme d'électroménager : réfrigérateurs, machines à laver, lave-vaisselle, sèche-linge, cuisinières, fours encastrables, hottes aspirantes, et bien plus.</p>
            <p>Notre concept est simple : commandez en ligne ou par WhatsApp, et recevez votre appareil chez vous à Agadir en moins de 24 heures. <strong className="text-gray-800">Le paiement se fait uniquement à la livraison</strong>, ce qui vous garantit une totale sécurité.</p>
          </div>
        </motion.section>

        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-xl font-black text-gray-900 mb-6">Pourquoi acheter votre électroménager chez Galaxy Digital Agadir ?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: <Truck className="text-primary" />, title: "Livraison 24h Agadir", desc: "Livraison gratuite à domicile dans tout le Grand Agadir sous 24h ouvrables." },
              { icon: <Shield className="text-primary" />, title: "Produits originaux", desc: "100% authentiques, achetés auprès des distributeurs officiels au Maroc." },
              { icon: <Star className="text-yellow-400" />, title: "Meilleur prix Agadir", desc: "Prix négociés directs avec les fournisseurs. Garantie du meilleur tarif." },
              { icon: <FaWhatsapp className="text-green-500" size={20} />, title: "Commande WhatsApp", desc: "Commandez en 2 minutes via WhatsApp, nos conseillers vous guident." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-black text-gray-900 text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <div className="bg-primary rounded-3xl p-8 text-center text-white">
          <h2 className="text-xl font-black mb-3">Commandez votre électroménager à Agadir</h2>
          <p className="text-red-200 text-sm mb-6">Livraison 24h · Paiement à la livraison · Prix garantis</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/products" className="bg-white text-primary font-black px-8 py-3.5 rounded-full hover:bg-red-50 transition shadow-lg">Voir le catalogue</Link>
            <a href="https://wa.me/212668835994" target="_blank" rel="noreferrer" className="bg-green-500 text-white font-bold px-8 py-3.5 rounded-full hover:bg-green-600 transition flex items-center gap-2"><FaWhatsapp size={18} /> WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
}
