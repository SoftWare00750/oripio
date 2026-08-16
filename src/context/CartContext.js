import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as cartApi from "../api/cart";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const EMPTY = { items: [], subtotal: 0, deliveryFee: 0, vat: 0, total: 0 };

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(EMPTY);
      return;
    }
    setLoading(true);
    try {
      const data = await cartApi.getCart();
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(async (menuItemId, quantity = 1) => {
    const data = await cartApi.addToCart(menuItemId, quantity);
    setCart(data);
    return data;
  }, []);

  const updateItem = useCallback(async (menuItemId, quantity) => {
    const data = await cartApi.updateCartItem(menuItemId, quantity);
    setCart(data);
    return data;
  }, []);

  const removeItem = useCallback(async (menuItemId) => {
    const data = await cartApi.removeFromCart(menuItemId);
    setCart(data);
    return data;
  }, []);

  const clear = useCallback(async () => {
    const data = await cartApi.clearCart();
    setCart(data);
    return data;
  }, []);

  const itemCount = useMemo(
    () => cart.items.reduce((sum, i) => sum + i.quantity, 0),
    [cart.items]
  );

  const value = useMemo(
    () => ({ cart, loading, itemCount, refresh, addItem, updateItem, removeItem, clear }),
    [cart, loading, itemCount, refresh, addItem, updateItem, removeItem, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
