import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

  // localStorage'dan favorileri yükle
  useEffect(() => {
    if (user) {
      const savedFavorites = localStorage.getItem(`favorites_${user.uid}`);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  // Favorileri localStorage'a kaydet
  const saveFavorites = (newFavorites) => {
    if (user) {
      localStorage.setItem(
        `favorites_${user.uid}`,
        JSON.stringify(newFavorites)
      );
    }
  };

  const addToFavorites = (teacher) => {
    const newFavorites = [...favorites, teacher];
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const removeFromFavorites = (teacherId) => {
    const newFavorites = favorites.filter(
      (teacher) => teacher.id !== teacherId
    );
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const isFavorite = (teacherId) => {
    return favorites.some((teacher) => teacher.id === teacherId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
