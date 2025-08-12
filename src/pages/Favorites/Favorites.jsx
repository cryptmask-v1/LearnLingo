import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { teachersService } from "../../services/firebaseServices";
import TeacherCard from "../../components/TeacherCard/TeacherCard";
import FilterBar from "../../components/FilterBar/FilterBar";
import Modal from "../../components/Modal/Modal";
import LoginForm from "../../components/LoginForm/LoginForm";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import styles from "./Favorites.module.css";

const Favorites = () => {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const [allTeachers, setAllTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [displayedTeachers, setDisplayedTeachers] = useState([]);
  const [teachersToShow, setTeachersToShow] = useState(4);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Firebase'den tüm öğretmenleri yükle
  useEffect(() => {
    const loadTeachers = async () => {
      try {
        setLoading(true);
        const teachers = await teachersService.getAllTeachers();
        setAllTeachers(teachers);
      } catch (err) {
        console.error("Error loading teachers:", err);
        setError("Failed to load teachers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadTeachers();
  }, []);

  // Favori öğretmenleri filtrele
  useEffect(() => {
    if (user && favorites.length > 0 && allTeachers.length > 0) {
      const favoriteTeachers = allTeachers.filter((teacher) => {
        // String ve number karşılaştırması için her ikisini de string'e çevir
        const isIncluded =
          favorites.includes(String(teacher.id)) ||
          favorites.includes(teacher.id);
        return isIncluded;
      });
      setFilteredTeachers(favoriteTeachers);
    } else {
      setFilteredTeachers([]);
    }
  }, [user, favorites, allTeachers]);

  // Gösterilen öğretmenleri güncelle
  useEffect(() => {
    setDisplayedTeachers(filteredTeachers.slice(0, teachersToShow));
  }, [filteredTeachers, teachersToShow]);

  const handleFilterChange = (filters) => {
    if (!allTeachers.length || !favorites.length) return;

    let filtered = allTeachers.filter((teacher) =>
      favorites.includes(teacher.id)
    );

    if (filters.language && filters.language !== "") {
      filtered = filtered.filter((teacher) =>
        teacher.languages.some((lang) =>
          lang.toLowerCase().includes(filters.language.toLowerCase())
        )
      );
    }

    if (filters.level && filters.level !== "") {
      filtered = filtered.filter((teacher) =>
        teacher.levels.includes(filters.level)
      );
    }

    if (filters.price && filters.price !== "all") {
      filtered = filtered.filter((teacher) => {
        const price = teacher.price_per_hour;
        const targetPrice = parseInt(filters.price);
        return price === targetPrice;
      });
    }

    setFilteredTeachers(filtered);
    setTeachersToShow(4); // Reset to show first 4
  };

  const loadMoreTeachers = () => {
    setTeachersToShow((prev) => Math.min(prev + 4, filteredTeachers.length));
  };

  const hasMoreTeachers = teachersToShow < filteredTeachers.length;

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const closeModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  // Kullanıcı giriş yapmamışsa
  if (!user) {
    return (
      <div className={styles.favorites}>
        <div className={styles.authPrompt}>
          <h2>Please log in to view your favorite teachers</h2>
          <p>Sign in to save your favorite teachers and access them anytime.</p>
          <div className={styles.authButtons}>
            <button onClick={openLoginModal} className={styles.loginButton}>
              Log In
            </button>
            <button
              onClick={openRegisterModal}
              className={styles.registerButton}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Login Modal */}
        <Modal isOpen={isLoginModalOpen} onClose={closeModals}>
          <LoginForm
            onClose={closeModals}
            onSwitchToRegister={openRegisterModal}
          />
        </Modal>

        {/* Register Modal */}
        <Modal isOpen={isRegisterModalOpen} onClose={closeModals}>
          <RegisterForm
            onClose={closeModals}
            onSwitchToLogin={openLoginModal}
          />
        </Modal>
      </div>
    );
  }

  // Loading durumu
  if (loading) {
    return (
      <div className={styles.favorites}>
        <div className={styles.loading}>
          <p>Loading your favorite teachers...</p>
        </div>
      </div>
    );
  }

  // Error durumu
  if (error) {
    return (
      <div className={styles.favorites}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  // Favori öğretmen yoksa
  if (filteredTeachers.length === 0) {
    return (
      <div className={styles.favorites}>
        <div className={styles.emptyState}>
          <h2>No favorite teachers yet</h2>
          <p>
            You haven't added any teachers to your favorites yet. Browse our
            teachers and add some to your favorites!
          </p>
          <Link to="/teachers" className={styles.browseButton}>
            Browse Teachers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.favorites}>
      <FilterBar onFilterChange={handleFilterChange} />

      <div className={styles.teacherList}>
        {displayedTeachers.map((teacher) => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>

      {hasMoreTeachers && (
        <div className={styles.loadMoreContainer}>
          <button onClick={loadMoreTeachers} className={styles.loadMoreButton}>
            Load more
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorites;
