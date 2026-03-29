'use client';

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ChevronRight } from "lucide-react";
import { BLOG_POSTS } from "@/data/blogPosts";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const CATEGORIES = ["Toutes", ...new Set(BLOG_POSTS.map((p) => p.category))];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("Toutes");

  const filtered = activeCategory === "Toutes"
    ? BLOG_POSTS
    : BLOG_POSTS.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-gray-900 via-primary/80 to-gray-900 py-20 px-4 text-center text-white">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <span className="bg-white/10 text-red-200 text-xs font-black px-4 py-1.5 rounded-full tracking-widest uppercase mb-5 inline-block border border-white/10">
            📝 Blog Galaxy Digital
          </span>
          <h1 className="text-3xl md:text-4xl font-black mb-4">Conseils & Guides Électroménager</h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Des guides pratiques, comparatifs et conseils d&apos;experts pour faire les meilleurs choix électroménager.
          </p>
        </motion.div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex gap-3 flex-wrap mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-md shadow-red-100"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length > 0 && (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12">
            <Link href={`/blog/${filtered[0].slug}`} className="group block">
              <div className="grid md:grid-cols-2 gap-0 bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all">
                <div className="aspect-video md:aspect-auto overflow-hidden">
                  <img src={filtered[0].image} alt={filtered[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span className="bg-primary/10 text-primary text-xs font-black px-3 py-1 rounded-full w-fit mb-4">
                    {filtered[0].category}
                  </span>
                  <h2 className="text-xl font-black text-gray-900 mb-3 group-hover:text-primary transition-colors leading-tight">
                    {filtered[0].title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">{filtered[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-5">
                    <span className="flex items-center gap-1"><Clock size={12} /> {filtered[0].readTime}</span>
                    <span>{filtered[0].date}</span>
                  </div>
                  <span className="flex items-center gap-1 text-primary font-bold text-sm group-hover:gap-2 transition-all">
                    Lire l&apos;article <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.slice(1).map((post) => (
            <motion.div key={post.slug} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <Link href={`/blog/${post.slug}`} className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all">
                <div className="aspect-video overflow-hidden">
                  <img src={post.image} alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full">{post.category}</span>
                  <h3 className="font-black text-gray-900 mt-3 mb-2 line-clamp-2 group-hover:text-primary transition-colors text-sm leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
