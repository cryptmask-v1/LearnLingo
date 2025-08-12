import { useState, useEffect, useCallback } from "react";
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
  const [currentFilters, setCurrentFilters] = useState({
    language: "all",
    level: "all",
    price: "all",
  });

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

  useEffect(() => {
    if (user && allTeachers.length > 0) {
      if (favorites.length > 0) {
        const favoriteTeachers = allTeachers.filter((teacher) => {
          const isIncluded =
            favorites.includes(String(teacher.id)) ||
            favorites.includes(teacher.id);
          return isIncluded;
        });
        setFilteredTeachers(favoriteTeachers);
      } else {
        setFilteredTeachers([]);
      }
    } else {
      setFilteredTeachers([]);
    }
  }, [user, favorites, allTeachers]);

  useEffect(() => {
    setDisplayedTeachers(filteredTeachers.slice(0, teachersToShow));
  }, [filteredTeachers, teachersToShow]);

  const applyFilters = useCallback(
    (filters) => {
      if (!allTeachers.length) return;

      let filtered = allTeachers.filter((teacher) => {
        const isIncluded =
          favorites.includes(String(teacher.id)) ||
          favorites.includes(teacher.id);
        return isIncluded;
      });

      if (filters.language && filters.language !== "all") {
        filtered = filtered.filter((teacher) =>
          teacher.languages.some((lang) =>
            lang.toLowerCase().includes(filters.language.toLowerCase())
          )
        );
      }

      if (filters.level && filters.level !== "all") {
        filtered = filtered.filter((teacher) =>
          teacher.levels.includes(filters.level)
        );
      }

      if (filters.price && filters.price !== "all") {
        filtered = filtered.filter((teacher) => {
          const price = teacher.price_per_hour;
          const targetPrice = parseInt(filters.price);

          switch (targetPrice) {
            case 10:
              return price >= 10 && price < 20;
            case 20:
              return price >= 20 && price < 30;
            case 30:
              return price >= 30 && price < 40;
            case 40:
              return price >= 40;
            default:
              return true;
          }
        });
      }

      setFilteredTeachers(filtered);
      setTeachersToShow(4);
    },
    [allTeachers, favorites]
  );

  useEffect(() => {
    if (user && allTeachers.length > 0) {
      applyFilters(currentFilters);
    }
  }, [favorites, user, allTeachers.length, currentFilters, applyFilters]);

  const handleFilterChange = (filters) => {
    setCurrentFilters(filters);
    applyFilters(filters);
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

  if (!user) {
    return (
      <div className={styles.favorites}>
        <div className={styles.authPrompt}>
          <div className={styles.authCard}>
            <div className={styles.authIcon}>
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                  fill="#FFC531"
                />
                <path
                  d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z"
                  fill="#FFC531"
                />
              </svg>
            </div>
            <h2>Access Your Favorite Teachers</h2>
            <p>
              Sign in to save your favorite teachers and access them anytime.
              Build your personalized learning experience!
            </p>
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
        </div>

        <Modal isOpen={isLoginModalOpen} onClose={closeModals}>
          <LoginForm
            onClose={closeModals}
            onSwitchToRegister={openRegisterModal}
          />
        </Modal>

        <Modal isOpen={isRegisterModalOpen} onClose={closeModals}>
          <RegisterForm
            onClose={closeModals}
            onSwitchToLogin={openLoginModal}
          />
        </Modal>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.favorites}>
        <div className={styles.loading}>
          <p>Loading your favorite teachers...</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className={styles.favorites}>
      <FilterBar onFilterChange={handleFilterChange} />

      {filteredTeachers.length === 0 ? (
        favorites.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateCard}>
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
        ) : (
          <div className={styles.noResults}>
            <div className={styles.noResultsCard}>
              <h3>No teachers found</h3>
              <p>
                No teachers match your current filter criteria. Try adjusting
                your filters or browse all your favorite teachers.
              </p>
            </div>
          </div>
        )
      ) : (
        <>
          <div className={styles.teacherList}>
            {displayedTeachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>

          {hasMoreTeachers && (
            <div className={styles.loadMoreContainer}>
              <button
                onClick={loadMoreTeachers}
                className={styles.loadMoreButton}
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Favorites;
