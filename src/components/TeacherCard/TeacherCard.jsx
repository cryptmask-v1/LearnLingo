import React from "react";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";
import styles from "./TeacherCard.module.css";

const TeacherCard = ({ teacher }) => {
  const { user } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  // Demo data for development
  const teacherData = teacher || {
    id: 1,
    name: "Sophia",
    surname: "Anderson",
    languages: ["English", "Spanish"],
    levels: ["A1 Beginner", "A2 Elementary", "B1 Intermediate"],
    rating: 4.8,
    reviews: 127,
    price_per_hour: 30,
    lessons_done: 540,
    avatar_url:
      "https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=150&h=150&fit=crop&crop=face",
    lesson_info:
      "Experienced English teacher with 5+ years of teaching experience",
    conditions: "I adapt my teaching methods to your individual learning style",
    experience:
      "5 years of teaching experience with students from around the world",
  };

  const handleFavoriteClick = () => {
    if (!user) {
      alert("Please log in to add favorites");
      return;
    }

    if (isFavorite(teacherData.id)) {
      removeFromFavorites(teacherData.id);
    } else {
      addToFavorites(teacherData);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.avatarSection}>
        <img
          src={teacherData.avatar_url}
          alt={`${teacherData.name} ${teacherData.surname}`}
          className={styles.avatar}
        />
        <div className={styles.onlineIndicator}></div>
      </div>

      <div className={styles.details}>
        <div className={styles.header}>
          <span className={styles.languageLabel}>Languages</span>
          <div className={styles.headerRight}>
            <div className={styles.stats}>
              <span>📚 Lessons done: {teacherData.lessons_done}</span>
              <span>⭐ Rating: {teacherData.rating}</span>
              <span>
                💰 Price / 1 lesson:{" "}
                <span className={styles.price}>
                  {teacherData.price_per_hour}$
                </span>
              </span>
            </div>
            <button
              className={`${styles.favoriteBtn} ${
                isFavorite(teacherData.id) ? styles.favorited : ""
              }`}
              onClick={handleFavoriteClick}
            >
              ❤️
            </button>
          </div>
        </div>

        <h3 className={styles.teacherName}>
          {teacherData.name} {teacherData.surname}
        </h3>

        <div className={styles.info}>
          <p>
            <strong>Speaks:</strong> {teacherData.languages.join(", ")}
          </p>
          <p>
            <strong>Lesson Info:</strong> {teacherData.lesson_info}
          </p>
          <p>
            <strong>Conditions:</strong> {teacherData.conditions}
          </p>
        </div>

        <div className={styles.actions}>
          <button className={styles.readMoreBtn}>Read more</button>
          <button className={styles.bookLessonBtn}>Book trial lesson</button>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;
