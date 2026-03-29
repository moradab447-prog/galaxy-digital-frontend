'use client';
import { motion } from "framer-motion";
import Link from "next/link";
import { Star } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function MagasinAgadir() {
  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Store",
        "name": "Galaxy Digital — Magasin Électroménager Agadir",
        "description": "Magasin électroménager à Agadir. Livraison 24h, paiement à la livraison, garantie officielle.",
        "url": "https://galaxydigital.ma/magasin-electromenager-agadir",
        "telephone": "+212600000000",
        "address": { "@type": "PostalAddress", "streetAddress": "Secteur 7, Hay Mohammadi", "addressLocality": "Agadir", "postalCode": "80000", "addressCountry": "MA" }
      })}} />

      <section className="bg-gradient-to-br from-gray-900 via-primary/80 to-gray-900 py-24 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <h1 className="text-4xl md:text-5xl font-black mb-5 leading-tight">
              Magasin Électroménager Agadir — <span className="text-red-300">Galaxy Digital</span>
            </h1>
            <p className="text-gray-200 text-lg max-w-2xl mx-auto mb-8">Votre magasin d'électroménager de confiance à Agadir. Commandez en ligne — livraison gratuite à domicile, paiement à la réception.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/products" className="bg-primary text-white font-black px-8 py-4 rounded-full hover:bg-primary-light transition shadow-xl">Boutique en ligne</Link>
              <a href="https://wa.me/212600000000" target="_blank" rel="noreferrer" className="bg-green-500 text-white font-bold px-8 py-4 rounded-full flex items-center gap-2"><FaWhatsapp size={20} /> WhatsApp</a>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl font-black text-gray-900 mb-5">Galaxy Digital : Le meilleur magasin d'électroménager à Agadir</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>Vous cherchez un <strong className="text-gray-800">magasin d'électroménager à Agadir</strong> qui allie qualité, prix compétitifs et service de confiance ? <strong className="text-primary">Galaxy Digital</strong> est le choix évident pour les habitants d'Agadir et de la région Souss-Massa.</p>
            <p>Depuis 2019, nous proposons des centaines de références : réfrigérateurs, machines à laver, sèche-linge, cuisinières, climatiseurs, téléviseurs, petits électroménagers et accessoires. Toutes les grandes marques sont représentées : Samsung, LG, Bosch, Whirlpool, Arçelik, Beko, Sharp, Hisense.</p>
            <p><strong className="text-primary">Le paiement se fait toujours à la livraison</strong>, en espèces, ce qui signifie que vous ne prenez aucun risque. Vérifiez votre produit, puis payez.</p>
          </div>
        </motion.section>

        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-xl font-black text-gray-900 mb-5">Nos Marques Partenaires à Agadir</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {["Samsung","LG","Bosch","Whirlpool","Beko","Sharp","Hisense","Electrolux","Indesit","Arçelik","Candy","Haier"].map((brand) => (
              <div key={brand} className="bg-gray-50 border border-gray-100 rounded-xl py-3 px-2 text-center text-xs font-bold text-gray-700 hover:border-primary/30 hover:bg-primary/5 transition">{brand}</div>
            ))}
          </div>
        </motion.section>

        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-xl font-black text-gray-900 mb-5">Avis clients — Galaxy Digital Agadir</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: "Rachid T.", city: "Agadir", text: "Meilleur magasin d'électroménager à Agadir ! Prix imbattables et livraison ultra rapide.", stars: 5 },
              { name: "Nadia B.", city: "Inzegan", text: "Commandé un Samsung depuis Galaxy Digital. Livré le lendemain matin. Parfait !", stars: 5 },
              { name: "Hassan M.", city: "Agadir", text: "Service client top, conseillers disponibles sur WhatsApp. Je recommande vivement.", stars: 5 },
              { name: "Amira K.", city: "Temsia", text: "Produits originaux, garantie officielle, paiement à la livraison. Que demander de plus ?", stars: 5 },
            ].map((r) => (
              <div key={r.name} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex gap-1 mb-2">{[...Array(r.stars)].map((_, i) => <Star key={i} size={12} fill="#fbbf24" className="text-yellow-400" />)}</div>
                <p className="text-sm text-gray-700 mb-3">"{r.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-xs">{r.name.charAt(0)}</div>
                  <span className="text-xs font-bold text-gray-600">{r.name} · {r.city}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <div className="bg-primary rounded-3xl p-8 text-center text-white">
          <h2 className="text-xl font-black mb-3">Visitez notre magasin ou commandez en ligne</h2>
          <p className="text-red-200 text-sm mb-6">Secteur 7, Hay Mohammadi, Agadir · Ouvert 6j/7</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact" className="bg-white text-primary font-black px-8 py-3.5 rounded-full hover:bg-red-50 transition">Nous trouver</Link>
            <Link href="/products" className="bg-primary-light text-white font-black px-8 py-3.5 rounded-full hover:bg-primary transition border border-white/20">Boutique en ligne</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
