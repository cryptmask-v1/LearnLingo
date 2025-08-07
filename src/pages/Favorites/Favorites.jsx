import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import TeacherCard from "../../components/TeacherCard/TeacherCard";
import FilterBar from "../../components/FilterBar/FilterBar";
import Modal from "../../components/Modal/Modal";
import LoginForm from "../../components/LoginForm/LoginForm";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import styles from "./Favorites.module.css";

// Demo öğretmen verileri (daha sonra Firebase'den gelecek)
const demoTeachers = [
  {
    id: 1,
    name: "Alessandra",
    surname: "Rossi",
    languages: ["Italian"],
    levels: [
      "A1 Beginner",
      "A2 Elementary",
      "B1 Intermediate",
      "B2 Upper-Intermediate",
    ],
    rating: 4.8,
    reviews: 120,
    price_per_hour: 25,
    lessons_done: 1240,
    avatar_url:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    lesson_info:
      "I have been teaching Italian for over 8 years to students of all levels. My lessons are interactive and fun, focusing on real-life conversations.",
    conditions: [
      "Speaks fluent English",
      "Interactive lessons",
      "Homework provided",
      "Flexible schedule",
    ],
  },
  {
    id: 2,
    name: "Diego",
    surname: "Hernandez",
    languages: ["Spanish"],
    levels: [
      "A1 Beginner",
      "A2 Elementary",
      "B1 Intermediate",
      "B2 Upper-Intermediate",
      "C1 Advanced",
    ],
    rating: 4.9,
    reviews: 89,
    price_per_hour: 30,
    lessons_done: 890,
    avatar_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    lesson_info:
      "Native Spanish speaker from Mexico with 6 years of teaching experience. I specialize in conversational Spanish and Latin American culture.",
    conditions: [
      "Native speaker",
      "Cultural insights",
      "Conversation focused",
      "Business Spanish available",
    ],
  },
  {
    id: 3,
    name: "Marie",
    surname: "Dubois",
    languages: ["French"],
    levels: [
      "A2 Elementary",
      "B1 Intermediate",
      "B2 Upper-Intermediate",
      "C1 Advanced",
      "C2 Proficient",
    ],
    rating: 4.7,
    reviews: 156,
    price_per_hour: 28,
    lessons_done: 1560,
    avatar_url:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    lesson_info:
      "Certified French teacher with Master's degree in French Literature. I help students achieve fluency through structured lessons and cultural immersion.",
    conditions: [
      "Certified teacher",
      "Literature focus",
      "Grammar expertise",
      "Exam preparation",
    ],
  },
  {
    id: 4,
    name: "Hans",
    surname: "Mueller",
    languages: ["German"],
    levels: [
      "A1 Beginner",
      "A2 Elementary",
      "B1 Intermediate",
      "B2 Upper-Intermediate",
    ],
    rating: 4.6,
    reviews: 203,
    price_per_hour: 32,
    lessons_done: 2030,
    avatar_url:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    lesson_info:
      "Experienced German tutor with 10 years of teaching experience. I focus on practical German for daily life and business situations.",
    conditions: [
      "Business German",
      "Daily conversations",
      "Grammar focus",
      "Pronunciation training",
    ],
  },
  {
    id: 5,
    name: "Yuki",
    surname: "Tanaka",
    languages: ["Japanese"],
    levels: ["A1 Beginner", "A2 Elementary", "B1 Intermediate"],
    rating: 4.9,
    reviews: 78,
    price_per_hour: 35,
    lessons_done: 780,
    avatar_url:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    lesson_info:
      "Native Japanese speaker living in Tokyo. I teach modern Japanese with focus on anime culture, daily conversations, and business Japanese.",
    conditions: [
      "Native speaker",
      "Anime culture",
      "Modern Japanese",
      "Hiragana/Katakana focus",
    ],
  },
  {
    id: 6,
    name: "Elena",
    surname: "Petrov",
    languages: ["Russian"],
    levels: [
      "A1 Beginner",
      "A2 Elementary",
      "B1 Intermediate",
      "B2 Upper-Intermediate",
      "C1 Advanced",
    ],
    rating: 4.8,
    reviews: 134,
    price_per_hour: 26,
    lessons_done: 1340,
    avatar_url:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    lesson_info:
      "Professional Russian teacher with linguistics background. I help students master Russian grammar and develop natural speaking skills.",
    conditions: [
      "Linguistics expert",
      "Grammar mastery",
      "Speaking practice",
      "Cultural context",
    ],
  },
];

const Favorites = () => {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [displayedTeachers, setDisplayedTeachers] = useState([]);
  const [teachersToShow, setTeachersToShow] = useState(4);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Favori öğretmenleri filtrele
  useEffect(() => {
    if (user && favorites.length > 0) {
      const favoriteTeachers = demoTeachers.filter((teacher) =>
        favorites.includes(teacher.id)
      );
      setFilteredTeachers(favoriteTeachers);
    } else {
      setFilteredTeachers([]);
    }
  }, [user, favorites]);

  // Gösterilen öğretmenleri güncelle
  useEffect(() => {
    setDisplayedTeachers(filteredTeachers.slice(0, teachersToShow));
  }, [filteredTeachers, teachersToShow]);

  const handleFilterChange = (filters) => {
    let filtered = demoTeachers.filter((teacher) =>
      favorites.includes(teacher.id)
    );

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
        switch (filters.price) {
          case "low":
            return price <= 20;
          case "medium":
            return price > 20 && price <= 30;
          case "high":
            return price > 30;
          default:
            return true;
        }
      });
    }

    setFilteredTeachers(filtered);
    setTeachersToShow(4);
  };

  const loadMoreTeachers = () => {
    setTeachersToShow((prev) => prev + 4);
  };

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
        <div className={styles.notLoggedIn}>
          <div className={styles.messageCard}>
            <h2>Favorites</h2>
            <p>You need to be logged in to view your favorite teachers.</p>
            <button className={styles.loginBtn} onClick={openLoginModal}>
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Favori öğretmen yoksa
  if (filteredTeachers.length === 0) {
    return (
      <div className={styles.favorites}>
        <FilterBar onFilterChange={handleFilterChange} />
        <div className={styles.noFavorites}>
          <div className={styles.messageCard}>
            <h2>No Favorite Teachers Yet</h2>
            <p>
              You haven't added any teachers to your favorites yet. Browse our
              teachers and add your favorites!
            </p>
            <Link to="/teachers" className={styles.browseBtn}>
              Browse Teachers
            </Link>
          </div>
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

      {displayedTeachers.length < filteredTeachers.length && (
        <div className={styles.loadMoreSection}>
          <button className={styles.loadMoreBtn} onClick={loadMoreTeachers}>
            Load more
          </button>
        </div>
      )}

      {/* Login Modal */}
      <Modal isOpen={isLoginModalOpen} onClose={closeModals} title="Log In">
        <LoginForm
          onClose={closeModals}
          onSwitchToRegister={openRegisterModal}
        />
      </Modal>

      {/* Register Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={closeModals}
        title="Registration"
      >
        <RegisterForm onClose={closeModals} onSwitchToLogin={openLoginModal} />
      </Modal>
    </div>
  );
};

export default Favorites;
