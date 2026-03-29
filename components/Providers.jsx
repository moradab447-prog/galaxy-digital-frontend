'use client';

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <Toaster position="top-center" containerStyle={{ top: 70 }} />
      </CartProvider>
    </AuthProvider>
  );
}
