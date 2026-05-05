'use client';

import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/212668835994?text=Bonjour%20Galaxy%20Digital%2C%20je%20souhaite%20commander."
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
      className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-2xl z-[999] flex items-center group whatsapp-pulse"
      aria-label="Commander via WhatsApp"
    >
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-black text-sm">
        <span className="px-3">Commander via WhatsApp</span>
      </span>
      <FaWhatsapp size={26} />
    </motion.a>
  );
}
