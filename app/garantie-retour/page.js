'use client';
import { motion } from "framer-motion";
import { Shield, RotateCcw, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const WARRANTY_TABLE = [
  { categorie: "Réfrigérateurs", garantie: "2 ans", compresseur: "5 ans" },
  { categorie: "Machines à laver", garantie: "2 ans", compresseur: "—" },
  { categorie: "Climatiseurs", garantie: "2 ans", compresseur: "5 ans" },
  { categorie: "Téléviseurs", garantie: "1 an", compresseur: "—" },
  { categorie: "Fours encastrables", garantie: "2 ans", compresseur: "—" },
  { categorie: "Petit Électroménager", garantie: "1 an", compresseur: "—" },
];

export default function Warranty() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-gray-900 to-primary/80 py-20 px-4 text-center text-white">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <Shield size={48} className="mx-auto mb-4 text-red-300" />
          <h1 className="text-3xl md:text-4xl font-black mb-4">Garantie & Retours</h1>
          <p className="text-gray-300 max-w-xl mx-auto">Tous nos produits sont couverts par la garantie officielle constructeur. Retour possible sous 7 jours sans questions.</p>
        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2"><Shield className="text-primary" /> Durées de Garantie par Catégorie</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-4 px-5 font-black text-gray-700">Catégorie</th>
                  <th className="text-center py-4 px-5 font-black text-gray-700">Garantie pièces & MO</th>
                  <th className="text-center py-4 px-5 font-black text-gray-700">Compresseur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {WARRANTY_TABLE.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="py-4 px-5 font-semibold text-gray-800">{row.categorie}</td>
                    <td className="py-4 px-5 text-center"><span className="bg-primary/10 text-primary font-black px-3 py-0.5 rounded-lg text-xs">{row.garantie}</span></td>
                    <td className="py-4 px-5 text-center text-xs font-bold text-gray-600">{row.compresseur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-3xl p-7">
              <h3 className="font-black text-green-800 text-lg mb-4 flex items-center gap-2"><CheckCircle2 className="text-green-600" /> Couvert par la garantie</h3>
              <ul className="space-y-3 text-sm text-green-700">
                {["Défauts de fabrication","Pannes électriques ou mécaniques","Dysfonctionnements à l'usage normal","Pièces défectueuses d'origine","Main-d'œuvre chez le réparateur agréé"].map((item) => (
                  <li key={item} className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500 flex-shrink-0" /> {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-3xl p-7">
              <h3 className="font-black text-red-800 text-lg mb-4 flex items-center gap-2"><XCircle className="text-red-500" /> Non couvert</h3>
              <ul className="space-y-3 text-sm text-red-700">
                {["Dommages causés par une mauvaise utilisation","Chutes, chocs, liquides","Modifications non autorisées","Usure normale (joints, filtres…)","Dommages suite à une surtension électrique"].map((item) => (
                  <li key={item} className="flex items-center gap-2"><XCircle size={14} className="text-red-400 flex-shrink-0" /> {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2"><RotateCcw className="text-primary" /> Politique de Retour — 7 Jours</h2>
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-5">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
              <p className="font-black text-primary text-lg">✓ Retour gratuit sous 7 jours</p>
              <p className="text-sm text-gray-600 mt-1">Si vous n'êtes pas satisfait pour quelque raison que ce soit, vous pouvez retourner votre produit dans les 7 jours suivant la réception.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><AlertCircle size={18} className="text-orange-500" /> Conditions du retour</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {["Produit dans son emballage d'origine, non utilisé","Tous les accessoires, câbles et notices inclus","Facture d'achat obligatoire","Délai de retour : 7 jours après la date de livraison","Remboursement : bon d'achat ou échange produit"].map((c) => (
                  <li key={c} className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" /> {c}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Comment procéder ?</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[{ step:"1", icon:"📞", text:"Contactez-nous par téléphone ou WhatsApp" },{ step:"2", icon:"📦", text:"Préparez le colis avec l'emballage original" },{ step:"3", icon:"🚚", text:"Nous organisons le ramassage chez vous" }].map((s) => (
                  <div key={s.step} className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">{s.icon}</div>
                    <p className="text-xs font-bold text-gray-700">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <div className="bg-primary rounded-3xl p-8 text-center text-white">
          <h2 className="text-xl font-black mb-3">Besoin d'un SAV ?</h2>
          <p className="text-red-200 text-sm mb-6">Notre équipe technique vous guide et planifie une intervention agréée.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="tel:+212600000000" className="bg-white text-primary font-black px-6 py-3 rounded-full hover:bg-red-50 transition">📞 Appeler le SAV</a>
            <a href="https://wa.me/212600000000" target="_blank" rel="noreferrer" className="bg-green-500 text-white font-bold px-6 py-3 rounded-full hover:bg-green-600 transition flex items-center gap-2"><FaWhatsapp size={16} /> WhatsApp SAV</a>
          </div>
        </div>
      </div>
    </div>
  );
}
