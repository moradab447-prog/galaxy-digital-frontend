'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Truck, Star, Users, Award, Heart } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

const TEAM = [
  { name: "Karim Alami",    role: "Directeur & Fondateur",   emoji: "👨‍💼" },
  { name: "Fatima Zahra",   role: "Responsable Commerciale", emoji: "👩‍💼" },
  { name: "Youssef Benali", role: "Chef Technicien SAV",     emoji: "🔧" },
  { name: "Sara Idrissi",   role: "Service Client",          emoji: "🎧" },
];

const VALUES = [
  { icon: <Shield size={26} />, title: "Qualité",    desc: "Produits 100% originaux avec facture officielle et garantie constructeur." },
  { icon: <Heart size={26} />,  title: "Confiance",  desc: "Paiement uniquement à la livraison. Vous voyez avant de payer." },
  { icon: <Truck size={26} />,  title: "Rapidité",   desc: "Livraison 24–72h dans tout le Maroc, suivi en temps réel." },
  { icon: <Star size={26} />,   title: "Excellence", desc: "Note moyenne 4.9/5 basée sur plus de 500 avis clients vérifiés." },
  { icon: <Users size={26} />,  title: "Proximité",  desc: "Équipe locale Agadir, disponible 6j/7 par téléphone et WhatsApp." },
  { icon: <Award size={26} />,  title: "Expertise",  desc: "Plus de 5 ans dans l'électroménager, avec des conseillers formés." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-gray-900 via-primary/90 to-gray-900 py-24 px-4 text-center text-white">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <span className="bg-white/10 text-red-200 text-xs font-black px-4 py-1.5 rounded-full tracking-widest uppercase mb-6 inline-block border border-white/10">
            Notre histoire
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-5 leading-tight">
            À Propos de <br /><span className="text-red-300">Galaxy Digital</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
            Depuis 2019, Galaxy Digital est le spécialiste de l&apos;électroménager à Agadir et dans tout le Maroc.
            Notre mission : vous apporter les meilleurs produits au meilleur prix, avec un service irréprochable.
          </p>
        </motion.div>
      </section>

      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: "+5 000", label: "Clients satisfaits" },
            { num: "+3 000", label: "Produits livrés" },
            { num: "4.9/5",  label: "Note moyenne" },
            { num: "6j/7",   label: "Support disponible" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-black text-primary mb-1">{s.num}</p>
              <p className="text-sm text-gray-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="prose max-w-none">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-primary rounded-full" /> Notre Histoire
          </h2>
          <div className="space-y-5 text-gray-600 leading-relaxed">
            <p>
              <strong className="text-gray-800">Galaxy Digital</strong> a été fondé en 2019 à Agadir par Karim Alami, passionné d&apos;électronique
              et fort de 10 ans d&apos;expérience dans la distribution d&apos;appareils électroménagers. Face au constat
              que les habitants d&apos;Agadir manquaient d&apos;un spécialiste local de confiance, proposant des produits
              authentiques à prix justes et livrés rapidement, l&apos;idée est née.
            </p>
            <p>
              En quelques années, Galaxy Digital est devenu la référence régionale pour l&apos;achat d&apos;électroménager.
              Notre engagement : <strong className="text-primary">zéro compromis sur la qualité</strong>, des prix
              négociés directement avec les distributeurs officiels (Samsung, LG, Bosch, Whirlpool, Indesit…),
              et un service de livraison rapide partout au Maroc.
            </p>
            <p>
              Notre modèle COD (Cash on Delivery) — paiement à la livraison — est notre signature. Nous pensons
              que vous ne devriez jamais payer avant d&apos;avoir reçu et vérifié votre commande. C&apos;est notre promesse.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <h2 className="text-2xl font-black text-gray-900">Nos Valeurs</h2>
            <div className="h-1 w-14 bg-primary rounded-full mx-auto mt-3" />
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={i} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">{v.icon}</div>
                <h3 className="font-black text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
          <h2 className="text-2xl font-black text-gray-900">Notre Équipe</h2>
          <div className="h-1 w-14 bg-primary rounded-full mx-auto mt-3" />
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TEAM.map((m) => (
            <div key={m.name} className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-md transition-all">
              <div className="text-5xl mb-3">{m.emoji}</div>
              <h3 className="font-black text-gray-900 text-sm">{m.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary py-16 px-4 text-center text-white">
        <h2 className="text-2xl font-black mb-3">Prêt à commander ?</h2>
        <p className="text-red-200 mb-8 text-sm max-w-md mx-auto">
          Découvrez notre catalogue et bénéficiez de la livraison gratuite partout au Maroc.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/products" className="bg-white text-primary font-black px-8 py-3.5 rounded-full hover:bg-red-50 transition shadow-lg">
            Voir le catalogue
          </Link>
          <a href="https://wa.me/212668835994" target="_blank" rel="noreferrer"
            className="bg-green-500 text-white font-bold px-8 py-3.5 rounded-full hover:bg-green-600 transition flex items-center gap-2">
            <FaWhatsapp size={18} /> WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
