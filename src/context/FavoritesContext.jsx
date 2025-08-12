import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import { favoritesService } from "../services/firebaseServices";

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
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const loadFavorites = async () => {
      if (authLoading) {
        return;
      }

      if (user) {
        try {
          setLoading(true);
          const userFavorites = await favoritesService.getUserFavorites(
            user.uid
          );
          setFavorites(userFavorites);
        } catch (error) {
          console.error("Error loading favorites:", error);

          const savedFavorites = localStorage.getItem(`favorites_${user.uid}`);
          if (savedFavorites) {
            const parsed = JSON.parse(savedFavorites);
            setFavorites(parsed);
          }
        } finally {
          setLoading(false);
        }
      } else {
        setFavorites([]);
      }
    };

    loadFavorites();
  }, [user, authLoading]);

  const addToFavorites = async (teacherId) => {
    if (!favorites.includes(teacherId)) {
      try {
        await favoritesService.addToFavorites(user.uid, teacherId);

        const newFavorites = [...favorites, teacherId];
        setFavorites(newFavorites);

        localStorage.setItem(
          `favorites_${user.uid}`,
          JSON.stringify(newFavorites)
        );
      } catch (error) {
        console.error("Error adding to favorites:", error);

        const newFavorites = [...favorites, teacherId];
        setFavorites(newFavorites);
        localStorage.setItem(
          `favorites_${user.uid}`,
          JSON.stringify(newFavorites)
        );
        toast.warning("Added to favorites (offline mode)");
      }
    }
  };

  const removeFromFavorites = async (teacherId) => {
    try {
      await favoritesService.removeFromFavorites(user.uid, teacherId);

      const newFavorites = favorites.filter((id) => id !== teacherId);
      setFavorites(newFavorites);

      localStorage.setItem(
        `favorites_${user.uid}`,
        JSON.stringify(newFavorites)
      );
    } catch (error) {
      console.error("Error removing from favorites:", error);

      const newFavorites = favorites.filter((id) => id !== teacherId);
      setFavorites(newFavorites);
      localStorage.setItem(
        `favorites_${user.uid}`,
        JSON.stringify(newFavorites)
      );
      toast.warning("Removed from favorites (offline mode)");
    }
  };

  const isFavorite = (teacherId) => {
    return (
      favorites.includes(String(teacherId)) || favorites.includes(teacherId)
    );
  };

  const toggleFavorite = async (teacherId) => {
    if (isFavorite(teacherId)) {
      await removeFromFavorites(teacherId);
    } else {
      await addToFavorites(teacherId);
    }
  };

  const value = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
