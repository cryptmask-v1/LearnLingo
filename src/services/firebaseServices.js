import {
  ref,
  get,
  set,
  push,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { database } from "./firebase";

// Teachers Service
export const teachersService = {
  // Tüm öğretmenleri getir
  getAllTeachers: async () => {
    try {
      const teachersRef = ref(database, "teachers");
      const snapshot = await get(teachersRef);

      if (snapshot.exists()) {
        const teachersData = snapshot.val();
        // Object'i array'e çevir ve id'leri ekle
        return Object.keys(teachersData).map((key) => ({
          id: key,
          ...teachersData[key],
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching teachers:", error);
      throw error;
    }
  },

  // Belirli bir öğretmeni getir
  getTeacherById: async (teacherId) => {
    try {
      const teacherRef = ref(database, `teachers/${teacherId}`);
      const snapshot = await get(teacherRef);

      if (snapshot.exists()) {
        return {
          id: teacherId,
          ...snapshot.val(),
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching teacher:", error);
      throw error;
    }
  },

  // Dile göre öğretmenleri filtrele
  getTeachersByLanguage: async (language) => {
    try {
      const teachersRef = ref(database, "teachers");
      const snapshot = await get(teachersRef);

      if (snapshot.exists()) {
        const teachersData = snapshot.val();
        const filteredTeachers = Object.keys(teachersData)
          .map((key) => ({
            id: key,
            ...teachersData[key],
          }))
          .filter((teacher) =>
            teacher.languages.some((lang) =>
              lang.toLowerCase().includes(language.toLowerCase())
            )
          );

        return filteredTeachers;
      }
      return [];
    } catch (error) {
      console.error("Error fetching teachers by language:", error);
      throw error;
    }
  },

  // Öğretmen ekle (admin için)
  addTeacher: async (teacherData) => {
    try {
      const teachersRef = ref(database, "teachers");
      const newTeacherRef = push(teachersRef);
      await set(newTeacherRef, teacherData);
      return newTeacherRef.key;
    } catch (error) {
      console.error("Error adding teacher:", error);
      throw error;
    }
  },
};

// Bookings Service
export const bookingsService = {
  // Rezervasyon oluştur
  createBooking: async (bookingData) => {
    try {
      const bookingsRef = ref(database, "bookings");
      const newBookingRef = push(bookingsRef);

      const booking = {
        ...bookingData,
        id: newBookingRef.key,
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      await set(newBookingRef, booking);
      return booking;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },

  // Kullanıcının rezervasyonlarını getir
  getUserBookings: async (userId) => {
    try {
      const bookingsRef = ref(database, "bookings");
      const userBookingsQuery = query(
        bookingsRef,
        orderByChild("userId"),
        equalTo(userId)
      );
      const snapshot = await get(userBookingsQuery);

      if (snapshot.exists()) {
        const bookingsData = snapshot.val();
        return Object.keys(bookingsData).map((key) => ({
          id: key,
          ...bookingsData[key],
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      throw error;
    }
  },

  // Öğretmenin rezervasyonlarını getir
  getTeacherBookings: async (teacherId) => {
    try {
      const bookingsRef = ref(database, "bookings");
      const teacherBookingsQuery = query(
        bookingsRef,
        orderByChild("teacherId"),
        equalTo(teacherId)
      );
      const snapshot = await get(teacherBookingsQuery);

      if (snapshot.exists()) {
        const bookingsData = snapshot.val();
        return Object.keys(bookingsData).map((key) => ({
          id: key,
          ...bookingsData[key],
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching teacher bookings:", error);
      throw error;
    }
  },
};

// Favorites Service (Firebase'e kaydedilecek)
export const favoritesService = {
  // Kullanıcının favorilerini getir
  getUserFavorites: async (userId) => {
    try {
      const favoritesRef = ref(database, `favorites/${userId}`);
      const snapshot = await get(favoritesRef);

      if (snapshot.exists()) {
        return Object.keys(snapshot.val());
      }
      return [];
    } catch (error) {
      console.error("Error fetching favorites:", error);
      throw error;
    }
  },

  // Favorilere ekle
  addToFavorites: async (userId, teacherId) => {
    try {
      const favoriteRef = ref(database, `favorites/${userId}/${teacherId}`);
      await set(favoriteRef, true);
    } catch (error) {
      console.error("Error adding to favorites:", error);
      throw error;
    }
  },

  // Favorilerden çıkar
  removeFromFavorites: async (userId, teacherId) => {
    try {
      const favoriteRef = ref(database, `favorites/${userId}/${teacherId}`);
      await set(favoriteRef, null);
    } catch (error) {
      console.error("Error removing from favorites:", error);
      throw error;
    }
  },
};
