import { useEffect, useState } from "react";

const STORAGE_KEY = "purrconnect_favorites";

export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(favorites)
    );
  }, [favorites]);

  const isFavorite = (catId) => {
    return favorites.includes(String(catId));
  };

  const toggleFavorite = (catId) => {
    const id = String(catId);

    setFavorites((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      return [...current, id];
    });
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  };
}