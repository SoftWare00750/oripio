import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "oripio_favorites";
const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState({}); // { [menuItemId]: item }
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setFavorites(JSON.parse(raw));
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = useCallback(async (next) => {
    setFavorites(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const isFavorite = useCallback((id) => !!favorites[id], [favorites]);

  const toggleFavorite = useCallback(
    (item) => {
      const next = { ...favorites };
      if (next[item.id]) {
        delete next[item.id];
      } else {
        next[item.id] = item;
      }
      persist(next);
    },
    [favorites, persist]
  );

  const value = useMemo(
    () => ({
      favorites: Object.values(favorites),
      loaded,
      isFavorite,
      toggleFavorite,
    }),
    [favorites, loaded, isFavorite, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
