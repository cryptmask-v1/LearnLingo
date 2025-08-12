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

  // Firebase'den favorileri yükle
  useEffect(() => {
    const loadFavorites = async () => {
      // Auth loading tamamlanana kadar bekle
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
          // Fallback: localStorage'dan yükle
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
        // Firebase'e ekle
        await favoritesService.addToFavorites(user.uid, teacherId);

        // State'i güncelle
        const newFavorites = [...favorites, teacherId];
        setFavorites(newFavorites);

        // Backup olarak localStorage'a kaydet
        localStorage.setItem(
          `favorites_${user.uid}`,
          JSON.stringify(newFavorites)
        );
      } catch (error) {
        console.error("Error adding to favorites:", error);
        // Sadece localStorage'a kaydet
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
      // Firebase'den çıkar
      await favoritesService.removeFromFavorites(user.uid, teacherId);
      // State'i güncelle
      const newFavorites = favorites.filter((id) => id !== teacherId);
      setFavorites(newFavorites);
      // localStorage'ı güncelle
      localStorage.setItem(
        `favorites_${user.uid}`,
        JSON.stringify(newFavorites)
      );
    } catch (error) {
      console.error("Error removing from favorites:", error);
      // Sadece localStorage'dan çıkar
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
    // String ve number karşılaştırması için her ikisini de string'e çevir
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
