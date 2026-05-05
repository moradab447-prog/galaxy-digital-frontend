'use client';
import { motion } from "framer-motion";
import Link from "next/link";
import { Truck, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const VILLES_MAROC = [
  { ville: "Casablanca", delai: "48h", region: "Grand Casablanca" },
  { ville: "Rabat", delai: "48h", region: "Rabat-Salé-Kénitra" },
  { ville: "Marrakech", delai: "48h", region: "Marrakech-Safi" },
  { ville: "Fès", delai: "48–72h", region: "Fès-Meknès" },
  { ville: "Tanger", delai: "48–72h", region: "Tanger-Tétouan-Al Hoceïma" },
  { ville: "Agadir", delai: "24h", region: "Souss-Massa" },
  { ville: "Oujda", delai: "72h", region: "Oriental" },
  { ville: "Laâyoune", delai: "72–96h", region: "Laâyoune-Sakia El Hamra" },
  { ville: "Dakhla", delai: "96h", region: "Dakhla-Oued Ed-Dahab" },
  { ville: "Béni Mellal", delai: "48h", region: "Béni Mellal-Khénifra" },
];

export default function LivraisonMaroc() {
  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Service",
        "name": "Livraison Électroménager Maroc — Galaxy Digital",
        "description": "Service de livraison d'électroménager partout au Maroc. Livraison gratuite, paiement à la livraison, délais 24–96h.",
        "provider": { "@type": "LocalBusiness", "name": "Galaxy Digital", "address": { "@type": "PostalAddress", "addressLocality": "Agadir", "addressCountry": "MA" } },
        "areaServed": { "@type": "Country", "name": "Maroc" }
      })}} />

      <section className="bg-gradient-to-br from-gray-900 via-primary/80 to-gray-900 py-24 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <Truck size={52} className="mx-auto mb-5 text-red-300" />
            <h1 className="text-4xl md:text-5xl font-black mb-5 leading-tight">
              Livraison Électroménager<br /><span className="text-red-300">Partout au Maroc</span>
            </h1>
            <p className="text-gray-200 text-lg max-w-2xl mx-auto mb-8">Galaxy Digital livre votre électroménager partout au Maroc en 24 à 96h. Livraison gratuite · Paiement à la livraison · Emballage soigné.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/products" className="bg-primary text-white font-black px-8 py-4 rounded-full hover:bg-primary-light transition shadow-xl">Commander maintenant</Link>
              <a href="https://wa.me/212668835994" target="_blank" rel="noreferrer" className="bg-green-500 text-white font-bold px-8 py-4 rounded-full flex items-center gap-2 hover:bg-green-600 transition"><FaWhatsapp size={20} /> WhatsApp</a>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-14">
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl font-black text-gray-900 mb-5">Livraison d'électroménager partout au Maroc — Service Galaxy Digital</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p><strong className="text-primary">Galaxy Digital</strong> propose la <strong className="text-gray-800">livraison d'électroménager dans toutes les villes du Maroc</strong>, du Nord au Sud, de l'Est à l'Ouest.</p>
            <p>Notre réseau logistique couvre les <strong className="text-gray-800">12 régions administratives du Maroc</strong>, avec des partenaires de transport fiables et spécialisés dans le transport de gros appareils électroménagers.</p>
            <p>La livraison est <strong className="text-primary">100% gratuite</strong>, sans minimum d'achat, quelle que soit la destination.</p>
            <p><strong className="text-gray-800">Paiement à la livraison (COD)</strong> : vous payez en espèces (MAD) uniquement lorsque vous recevez votre colis et en avez vérifié le contenu.</p>
          </div>
        </motion.section>

        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-xl font-black text-gray-900 mb-6">Délais de livraison par ville au Maroc</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-5 font-black text-gray-700">Ville</th>
                  <th className="text-left py-4 px-5 font-black text-gray-700">Région</th>
                  <th className="text-center py-4 px-5 font-black text-gray-700">Délai</th>
                  <th className="text-center py-4 px-5 font-black text-gray-700">Livraison</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {VILLES_MAROC.map((v, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}>
                    <td className="py-3.5 px-5 font-bold text-gray-800 flex items-center gap-1.5"><MapPin size={13} className="text-primary" /> {v.ville}</td>
                    <td className="py-3.5 px-5 text-gray-500">{v.region}</td>
                    <td className="py-3.5 px-5 text-center"><span className="bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-lg text-xs">{v.delai}</span></td>
                    <td className="py-3.5 px-5 text-center"><span className="bg-green-100 text-green-700 font-black px-3 py-0.5 rounded-lg text-xs">GRATUITE</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-xl font-black text-gray-900 mb-6">Nos garanties de livraison</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[{ icon:"📦", title:"Emballage renforcé", desc:"Protection multicouche adaptée aux gros appareils pour éviter tout dommage." },{ icon:"📞", title:"Appel avant livraison", desc:"Votre livreur vous contacte 30 min avant pour vous prévenir de son arrivée." },{ icon:"✅", title:"Inspection à réception", desc:"Vous vérifiez l'état du produit avant de payer et de signer la livraison." }].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-black text-gray-900 text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <div className="bg-primary rounded-3xl p-8 text-center text-white">
          <Truck size={36} className="mx-auto mb-3 text-red-200" />
          <h2 className="text-xl font-black mb-3">Livraison gratuite partout au Maroc</h2>
          <p className="text-red-200 text-sm mb-6">Commandez maintenant — paiement à la réception du colis</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/products" className="bg-white text-primary font-black px-8 py-3.5 rounded-full hover:bg-red-50 transition shadow-lg">Voir les produits</Link>
            <a href="https://wa.me/212668835994" target="_blank" rel="noreferrer" className="bg-green-500 text-white font-bold px-8 py-3.5 rounded-full hover:bg-green-600 transition flex items-center gap-2"><FaWhatsapp size={18} /> Commander sur WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
}
