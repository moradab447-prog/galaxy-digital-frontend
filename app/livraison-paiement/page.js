'use client';
import { motion } from "framer-motion";
import { Truck, Clock, MapPin, ShieldCheck, Package, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const ZONES = [
  { zone: "Grand Agadir", delai: "24h", prix: "GRATUITE" },
  { zone: "Souss-Massa (région)", delai: "24–48h", prix: "GRATUITE" },
  { zone: "Marrakech / Casablanca", delai: "48h", prix: "GRATUITE" },
  { zone: "Rabat / Fès / Meknès", delai: "48–72h", prix: "GRATUITE" },
  { zone: "Nord (Tanger, Nador)", delai: "48–72h", prix: "GRATUITE" },
  { zone: "Sud (Laâyoune, Dakhla)", delai: "72–96h", prix: "GRATUITE" },
];

export default function DeliveryPayment() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-gray-900 to-primary/80 py-20 px-4 text-center text-white">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <Truck size={48} className="mx-auto mb-4 text-red-300" />
          <h1 className="text-3xl md:text-4xl font-black mb-4">Livraison & Paiement</h1>
          <p className="text-gray-300 max-w-xl mx-auto">Livraison gratuite partout au Maroc · Paiement uniquement à la livraison (COD) · 100% sécurisé</p>
        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2"><ShieldCheck className="text-primary" /> Mode de Paiement</h2>
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8">
            <div className="flex items-start gap-5">
              <div className="text-5xl flex-shrink-0">💳</div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Cash On Delivery (COD) — Paiement à la livraison</h3>
                <p className="text-gray-600 leading-relaxed mb-4"><strong className="text-primary">Galaxy Digital n'accepte que le paiement en espèces (MAD) à la réception de votre colis.</strong> Vous payez uniquement lorsque vous recevez votre commande et que vous en avez vérifié le contenu. Aucun paiement en ligne, aucune carte bancaire requise.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  {["Commandez en ligne ou par WhatsApp","Recevez votre colis chez vous","Vérifiez le contenu avant de payer","Payez en espèces (MAD) au livreur"].map((step, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-primary text-white rounded-full text-xs font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2"><MapPin className="text-primary" /> Zones de Livraison</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-4 px-5 font-black text-gray-700">Région / Ville</th>
                  <th className="text-center py-4 px-5 font-black text-gray-700">Délai estimé</th>
                  <th className="text-center py-4 px-5 font-black text-gray-700">Frais de livraison</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ZONES.map((z, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="py-4 px-5 font-semibold text-gray-800 flex items-center gap-2"><MapPin size={14} className="text-primary flex-shrink-0" /> {z.zone}</td>
                    <td className="py-4 px-5 text-center"><span className="bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-lg text-xs">{z.delai}</span></td>
                    <td className="py-4 px-5 text-center"><span className="bg-green-100 text-green-700 font-black px-3 py-0.5 rounded-lg text-xs">{z.prix}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">* Délais indicatifs pour jours ouvrables. Zones rurales : +24h.</p>
        </motion.section>

        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2"><Package className="text-primary" /> Comment fonctionne la livraison ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[{ icon:"🛒", title:"1. Commandez", desc:"Ajoutez au panier et remplissez le formulaire de livraison." },{ icon:"📞", title:"2. Confirmation", desc:"Notre équipe vous contacte par téléphone pour confirmer." },{ icon:"🚚", title:"3. Expédition", desc:"Votre colis est emballé soigneusement et expédié." },{ icon:"✅", title:"4. Livraison", desc:"Réception à domicile, vérification, puis paiement." }].map((s, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-5 text-center hover:bg-primary/5 transition-colors">
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="font-black text-gray-900 text-sm mb-2">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <div className="bg-primary rounded-3xl p-8 text-center text-white">
          <Phone size={32} className="mx-auto mb-3 text-red-200" />
          <h2 className="text-xl font-black mb-2">Une question sur votre livraison ?</h2>
          <p className="text-red-200 text-sm mb-6">Contactez-nous par téléphone ou WhatsApp, nous répondons rapidement.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="tel:+212668835994" className="bg-white text-primary font-black px-6 py-3 rounded-full hover:bg-red-50 transition">📞 +212 6 68 83 59 94</a>
            <a href="https://wa.me/212668835994" target="_blank" rel="noreferrer" className="bg-green-500 text-white font-bold px-6 py-3 rounded-full hover:bg-green-600 transition flex items-center gap-2"><FaWhatsapp size={16} /> WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
}
