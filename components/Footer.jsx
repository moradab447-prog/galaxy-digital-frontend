'use client';

import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, Facebook, Instagram, Youtube } from "lucide-react";
import { FaWhatsapp, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-8">
      {/* Top strip */}
      <div className="bg-primary/10 border-y border-primary/20 py-4 mb-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-wrap gap-6 justify-around items-center text-sm">
          <div className="flex items-center gap-2 font-semibold text-white">
            <span className="text-2xl">🚚</span> Livraison partout au Maroc
          </div>
          <div className="flex items-center gap-2 font-semibold text-white">
            <span className="text-2xl">💳</span> Paiement à la livraison (COD)
          </div>
          <div className="flex items-center gap-2 font-semibold text-white">
            <span className="text-2xl">🛡️</span> Garantie officielle
          </div>
          <div className="flex items-center gap-2 font-semibold text-white">
            <span className="text-2xl">📞</span> SAV 6j/7
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <div>
                <h2 className="text-white font-black text-lg tracking-tight leading-none">GALAXY DIGITAL</h2>
                <p className="text-[10px] text-gray-500 font-semibold tracking-widest uppercase">Agadir · Maroc</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Votre destination premium pour l&apos;électroménager à Agadir. Livraison rapide dans tout le Maroc, paiement à la livraison et service après-vente de qualité.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram size={16} />
              </a>
              <a href="https://wa.me/212668835994" target="_blank" rel="noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors">
                <FaWhatsapp size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <Youtube size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                <FaTiktok size={16} />
              </a>
            </div>
          </div>

          {/* Boutique */}
          <div>
            <h3 className="text-white font-bold mb-5 uppercase text-xs tracking-widest">Boutique</h3>
            <ul className="space-y-3 text-sm">
              {[
                ["Réfrigérateurs & Congélateurs", "/products?cat=refrigerateurs"],
                ["Machines à Laver", "/products?cat=machines-laver"],
                ["Climatiseurs", "/products?cat=climatisation"],
                ["TV & Écrans", "/products?cat=tv"],
                ["Petit Électroménager", "/products?cat=petit-electromenager"],
                ["Fours & Encastrables", "/products?cat=fours"],
                ["Promotions du moment", "/products?promo=1"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white hover:pl-1 transition-all flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service client */}
          <div>
            <h3 className="text-white font-bold mb-5 uppercase text-xs tracking-widest">Service Client</h3>
            <ul className="space-y-3 text-sm">
              {[
                ["Livraison & Paiement COD",  "/livraison-paiement"],
                ["Garantie & Retours",         "/garantie-retour"],
                ["FAQ",                        "/faq"],
                ["Contact",                    "/contact"],
                ["À Propos de nous",           "/a-propos"],
                ["Électroménager Agadir",      "/electromenager-agadir"],
                ["Blog & Conseils",            "/blog"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white hover:pl-1 transition-all flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-5 uppercase text-xs tracking-widest">Nous Contacter</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <span>Secteur 7, Hay Mohammadi<br />Agadir 80000, Maroc</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <a href="tel:+212668835994" className="hover:text-white transition-colors">+212 6 68 83 59 94</a>
              </li>
              <li className="flex items-center gap-3">
                <FaWhatsapp size={18} className="text-green-400 flex-shrink-0" />
                <a href="https://wa.me/212668835994" target="_blank" rel="noreferrer"
                  className="hover:text-white transition-colors">+212 6 68 83 59 94</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <a href="mailto:contact@galaxydigital.ma" className="hover:text-white transition-colors">contact@galaxydigital.ma</a>
              </li>
            </ul>
            <div className="mt-6 bg-gray-900 rounded-2xl p-4 text-xs">
              <p className="text-white font-bold mb-1">Heures d&apos;ouverture</p>
              <p className="text-gray-400">Lun – Sam : 9h00 – 20h00</p>
              <p className="text-gray-400">Dimanche : 10h00 – 17h00</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 <span className="text-white font-bold">GALAXY DIGITAL</span>. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-4 items-center">
            <Link href="/electromenager-agadir" className="hover:text-gray-300 transition-colors">Électroménager Agadir</Link>
            <span>·</span>
            <Link href="/livraison-electromenager-maroc" className="hover:text-gray-300 transition-colors">Livraison Maroc</Link>
            <span>·</span>
            <span>Paiement 100% à la livraison</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
