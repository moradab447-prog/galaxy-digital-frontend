'use client';

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Tag, ArrowLeft } from "lucide-react";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import { BLOG_POSTS } from "@/data/blogPosts";

function applyInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="text-gray-800 font-bold">{part.slice(2, -2)}</strong>;
    return part;
  });
}

function renderMarkdown(text) {
  if (!text) return null;
  return text.trim().split("\n").map((line, i) => {
    if (line.startsWith("## "))
      return <h2 key={i} className="text-xl font-black text-gray-900 mt-8 mb-3">{line.slice(3)}</h2>;
    if (line.startsWith("### "))
      return <h3 key={i} className="text-lg font-black text-gray-800 mt-6 mb-2">{line.slice(4)}</h3>;
    if (/^\|[-| :]+\|$/.test(line)) return null;
    if (line.startsWith("|") && line.endsWith("|")) {
      const cells = line.slice(1, -1).split("|").map((c, ci) => (
        <td key={ci} className="border border-gray-200 px-4 py-2 text-sm">{c.trim()}</td>
      ));
      return <tr key={i}>{cells}</tr>;
    }
    if (/^[-*] /.test(line))
      return <li key={i} className="text-gray-600 text-sm leading-relaxed">{applyInline(line.slice(2))}</li>;
    if (/^\d+\. /.test(line))
      return <li key={i} className="text-gray-600 text-sm leading-relaxed list-decimal ml-5">{applyInline(line.replace(/^\d+\. /, ""))}</li>;
    if (line.trim() === "") return <br key={i} />;
    return <p key={i} className="text-gray-600 text-sm leading-relaxed">{applyInline(line)}</p>;
  });
}

export default function BlogPost() {
  const { slug } = useParams();
  const router = useRouter();
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  const related = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Article introuvable.</p>
        <Link href="/blog" className="text-primary font-bold hover:underline">← Retour au blog</Link>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-4xl mx-auto">
          <span className="bg-primary text-white text-xs font-black px-3 py-1 rounded-full mb-3 inline-block">{post.category}</span>
          <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">{post.title}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-wrap items-center gap-4 border-b border-gray-100">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition">
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex items-center gap-1 text-sm text-gray-500 ml-auto">
          <Clock size={14} /> {post.readTime}
        </div>
        <span className="text-sm text-gray-500">{post.date}</span>
        <span className="text-sm text-gray-500">{post.author}</span>
        <div className="flex gap-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(post.title + " " + shareUrl)}`}
            target="_blank" rel="noreferrer"
            className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-green-600 transition"
          >
            <FaWhatsapp size={12} /> Partager
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank" rel="noreferrer"
            className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-blue-700 transition"
          >
            <FaFacebook size={12} /> Facebook
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-gray-600 text-base leading-relaxed mb-8 font-medium border-l-4 border-primary pl-4 bg-gray-50 py-3 pr-4 rounded-r-xl">
          {post.excerpt}
        </p>
        <div className="prose-galaxy space-y-1">{renderMarkdown(post.content)}</div>
        <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
          {post.tags.map((tag) => (
            <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Tag size={10} /> {tag}
            </span>
          ))}
        </div>
        <div className="mt-10 bg-primary/5 border border-primary/20 rounded-3xl p-7 text-center">
          <p className="font-black text-gray-900 text-lg mb-2">Prêt à acheter ?</p>
          <p className="text-gray-500 text-sm mb-5">Découvrez notre sélection avec livraison gratuite au Maroc, paiement à la livraison.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/products" className="bg-primary text-white font-black px-6 py-3 rounded-full hover:bg-primary-light transition shadow-md">
              Voir les produits
            </Link>
            <a href="https://wa.me/212668835994" target="_blank" rel="noreferrer"
              className="bg-green-500 text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-green-600 transition">
              <FaWhatsapp size={16} /> Demander conseil
            </a>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="bg-gray-50 py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-black text-gray-900 mb-6">Articles similaires</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {related.map((rPost) => (
                <Link key={rPost.slug} href={`/blog/${rPost.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-primary/20 transition-all">
                  <div className="aspect-video overflow-hidden">
                    <img src={rPost.image} alt={rPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-black text-gray-900 text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">{rPost.title}</h3>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock size={10} /> {rPost.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
