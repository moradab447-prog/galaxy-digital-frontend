'use client';

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "galaxy_cart";

const loadCart = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(loadCart());
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let updated;
      if (existing) {
        updated = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [
          ...prev,
          { id: `${product.id}-${Date.now()}`, product, quantity },
        ];
      }
      saveCart(updated);
      return updated;
    });
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      );
      saveCart(updated);
      return updated;
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== cartItemId);
      saveCart(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    saveCart([]);
  };

  const totalPrice = cart.reduce((acc, item) => {
    const price = Number(item?.product?.price) || 0;
    const qty = Number(item?.quantity) || 0;
    return acc + price * qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalPrice,
        fetchCart: () => {},
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
