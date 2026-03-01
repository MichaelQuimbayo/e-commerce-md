import React, { createContext, useState, useContext, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Cargar favoritos desde localStorage al iniciar
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('user_favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Error al cargar favoritos desde localStorage", error);
    }
  }, []);

  // Guardar favoritos en localStorage cada vez que cambien
  useEffect(() => {
    try {
      localStorage.setItem('user_favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error("Error al guardar favoritos en localStorage", error);
    }
  }, [favorites]);

  const addToFavorites = (productId) => {
    setFavorites((prev) => [...prev, productId]);
  };

  const removeFromFavorites = (productId) => {
    setFavorites((prev) => prev.filter((id) => id !== productId));
  };

  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  const toggleFavorite = (productId) => {
    if (isFavorite(productId)) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(productId);
    }
  };

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
