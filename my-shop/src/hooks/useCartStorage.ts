// src/hooks/useCartStorage.ts
import { useEffect, useState, useCallback } from "react";
import type { CartItem } from "../types";

const STORAGE_KEY = "cartItems";

export function useCartStorage(initial: CartItem[] = []) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return initial;
      const parsed = JSON.parse(raw) as CartItem[];
      // 간단 검증: quantity 정수화
      return parsed.map(ci => ({ ...ci, quantity: Math.max(1, Math.trunc(ci.quantity || 1)) }));
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  const clearCart = useCallback(() => setCartItems([]), []);

  return { cartItems, setCartItems, clearCart };
}
