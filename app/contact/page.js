'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";
import toast from "react-hot-toast";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function Contact() {
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", sujet: "", message: "" });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom || !form.message) { toast.error("Nom et message requis"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    toast.success("Message envoyé ! Nous vous répondrons dans les 24h.");
    setForm({ nom: "", email: "", telephone: "", sujet: "", message: "" });
  };

  const inputClass = "w-full bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none p-3.5 rounded-xl text-sm transition-all placeholder:text-gray-300";

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-gray-900 to-primary/80 py-20 px-4 text-center text-white">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <Mail size={48} className="mx-auto mb-4 text-red-300" />
          <h1 className="text-3xl md:text-4xl font-black mb-4">Contactez-Nous</h1>
          <p className="text-gray-300 max-w-xl mx-auto">Notre équipe est à votre disposition. Réponse garantie dans les 24 heures.</p>
        </motion.div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-5">Informations de contact</h2>
              <div className="space-y-4">
                {[
                  { icon: <Phone size={20} className="text-primary" />, label: "Téléphone", value: "+212 6 68 83 59 94", href: "tel:+212668835994" },
                  { icon: <FaWhatsapp size={20} className="text-green-500" />, label: "WhatsApp", value: "+212 6 68 83 59 94", href: "https://wa.me/212668835994" },
                  { icon: <Mail size={20} className="text-primary" />, label: "Email", value: "contact@galaxydigital.ma", href: "mailto:contact@galaxydigital.ma" },
                  { icon: <MapPin size={20} className="text-primary" />, label: "Adresse", value: "Secteur 7, Hay Mohammadi, Agadir 80000", href: null },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-wider">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="text-sm font-bold text-gray-800 hover:text-primary transition-colors">{item.value}</a>
                      ) : (
                        <p className="text-sm font-bold text-gray-800">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
              <h3 className="font-black text-gray-800 mb-3 flex items-center gap-2"><Clock size={18} className="text-primary" /> Horaires d'ouverture</h3>
              <div className="space-y-1.5 text-sm text-gray-600">
                <div className="flex justify-between"><span>Lundi – Vendredi</span><span className="font-bold">9h00 – 20h00</span></div>
                <div className="flex justify-between"><span>Samedi</span><span className="font-bold">9h00 – 20h00</span></div>
                <div className="flex justify-between"><span>Dimanche</span><span className="font-bold">10h00 – 17h00</span></div>
              </div>
            </div>
            <div>
              <h3 className="font-black text-gray-800 mb-3">Suivez-nous</h3>
              <div className="flex gap-3">
                <a href="#" className="w-11 h-11 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition"><FaFacebook size={18} /></a>
                <a href="#" className="w-11 h-11 bg-gradient-to-tr from-pink-500 to-yellow-400 text-white rounded-full flex items-center justify-center hover:opacity-90 transition"><FaInstagram size={18} /></a>
                <a href="https://wa.me/212668835994" target="_blank" rel="noreferrer" className="w-11 h-11 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition"><FaWhatsapp size={18} /></a>
              </div>
            </div>
            <a href="https://wa.me/212668835994?text=Bonjour%20Galaxy%20Digital%2C%20je%20vous%20contacte%20depuis%20votre%20site%20web." target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 bg-green-500 text-white font-black py-4 rounded-2xl hover:bg-green-600 transition shadow-lg">
              <FaWhatsapp size={22} /> Écrire sur WhatsApp
            </a>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="lg:col-span-3">
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 mb-6">Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">Nom & Prénom *</label>
                    <input type="text" value={form.nom} onChange={set("nom")} placeholder="Mohamed Alami" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">Téléphone</label>
                    <input type="tel" value={form.telephone} onChange={set("telephone")} placeholder="0612 345 678" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">Email</label>
                  <input type="email" value={form.email} onChange={set("email")} placeholder="email@exemple.com" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">Sujet</label>
                  <select value={form.sujet} onChange={set("sujet")} className={`${inputClass} cursor-pointer`}>
                    <option value="">Choisir un sujet...</option>
                    <option value="commande">Question sur une commande</option>
                    <option value="produit">Question produit</option>
                    <option value="livraison">Suivi de livraison</option>
                    <option value="sav">Service après-vente</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">Message *</label>
                  <textarea value={form.message} onChange={set("message")} placeholder="Décrivez votre demande en détail..." rows={5} className={`${inputClass} resize-none`} />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-light disabled:bg-gray-300 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-red-100 transition-all">
                  {loading ? <><Loader2 className="animate-spin" size={20} /> Envoi...</> : <><Send size={18} /> Envoyer le message</>}
                </button>
              </form>
            </div>
            <div className="mt-6 bg-gray-100 rounded-3xl overflow-hidden h-64 relative">
              <iframe title="Galaxy Digital Agadir" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27350.28929854543!2d-9.598107!3d30.427755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3b6e9b6cef065%3A0x4aa24c4e81d8d3e4!2sAgadir!5e0!3m2!1sfr!2sma!4v1700000000000!5m2!1sfr!2sma" className="w-full h-full border-0" allowFullScreen loading="lazy" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
