import React, { useState } from "react";
import { toast } from "react-toastify";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";
import {
  HiOutlineBookOpen,
  HiStar,
  HiOutlineCurrencyDollar,
  HiOutlineHeart,
  HiHeart,
} from "react-icons/hi2";
import Modal from "../Modal/Modal";
import BookingModal from "../BookingModal/BookingModal";
import styles from "./TeacherCard.module.css";
import jane from "../../assets/jane.png";

const TeacherCard = ({ teacher }) => {
  const { user } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [showMore, setShowMore] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const teacherData = teacher || {
    id: 1,
    name: "Sophia",
    surname: "Anderson",
    languages: ["English", "Spanish"],
    levels: [
      "A1 Beginner",
      "A2 Elementary",
      "B1 Intermediate",
      "B2 Upper-Intermediate",
    ],
    rating: 4.8,
    reviews: [
      {
        id: 1,
        reviewer_name: "Frank",
        reviewer_rating: 4.0,
        comment: "Sophia's lessons were very helpful. I made good progress.",
      },
      {
        id: 2,
        reviewer_name: "Eve",
        reviewer_rating: 5.0,
        comment: "Sophia is an amazing teacher! She is patient and supportive.",
      },
    ],
    price_per_hour: 30,
    lessons_done: 540,
    avatar_url: jane,
    lesson_info:
      "Experienced English teacher with 5+ years of teaching experience",
    conditions: "I adapt my teaching methods to your individual learning style",
    experience:
      "Sophia is an experienced and dedicated language teacher specializing in English and Spanish. She holds a Bachelor's degree in English Studies and a Master's degree in Spanish Literature. Her passion for languages and teaching has driven her to become a highly proficient and knowledgeable instructor. With over 10 years of teaching experience, Sophia has helped numerous students of various backgrounds and proficiency levels achieve their language learning goals.",
  };

  const handleFavoriteClick = async () => {
    if (!user) {
      toast.warn("Please log in to add favorites");
      return;
    }

    try {
      if (isFavorite(teacherData.id)) {
        await removeFromFavorites(teacherData.id);
        toast.success("Removed from favorites");
      } else {
        await addToFavorites(teacherData.id);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites. Please try again.");
    }
  };

  const openBookingModal = () => {
    if (!user) {
      toast.warn("Please log in to book a lesson");
      return;
    }
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.avatarSection}>
        <div className={styles.avatarWrapper}>
          <img
            src={teacherData.avatar_url}
            alt={`${teacherData.name} ${teacherData.surname}`}
            className={styles.avatar}
          />
          <div className={styles.onlineIndicator}></div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.leftSection}>
            <span className={styles.languageLabel}>Languages</span>
            <h2 className={styles.teacherName}>
              {teacherData.name} {teacherData.surname}
            </h2>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.statItem}>
              <HiOutlineBookOpen className={styles.icon} />
              <span>Lessons online</span>
            </div>
            <div className={styles.statItem}>
              <span>Lessons done: {teacherData.lessons_done}</span>
            </div>
            <div className={styles.statItem}>
              <HiStar className={styles.starIcon} />
              <span>Rating: {teacherData.rating}</span>
            </div>
            <div className={styles.statItem}>
              <span>
                Price / 1 hour:{" "}
                <span className={styles.price}>
                  ${teacherData.price_per_hour}
                </span>
              </span>
            </div>
            <button
              className={`${styles.favoriteBtn} ${
                isFavorite(teacherData.id) ? styles.favorited : ""
              }`}
              onClick={handleFavoriteClick}
            >
              {isFavorite(teacherData.id) ? <HiHeart /> : <HiOutlineHeart />}
            </button>
          </div>
        </div>

        <div className={styles.info}>
          <p>
            <span className={styles.label}>Speaks:</span>{" "}
            <span className={styles.languages}>
              {teacherData.languages.join(", ")}
            </span>
          </p>
          <p>
            <span className={styles.label}>Lesson Info:</span>{" "}
            {teacherData.lesson_info}
          </p>
          <p>
            <span className={styles.label}>Conditions:</span>{" "}
            {teacherData.conditions}
          </p>
        </div>

        {showMore && (
          <div className={styles.moreInfo}>
            <p>{teacherData.experience}</p>

            <div className={styles.reviews}>
              {teacherData.reviews.map((review, index) => (
                <div key={review.id || index} className={styles.review}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewerAvatar}>
                      {review.reviewer_name.charAt(0)}
                    </div>
                    <div className={styles.reviewerInfo}>
                      <span className={styles.reviewerName}>
                        {review.reviewer_name}
                      </span>
                      <div className={styles.reviewRating}>
                        <HiStar className={styles.starIcon} />
                        <span>{review.reviewer_rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className={styles.reviewComment}>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Levels her zaman gösterilsin */}
        <div className={styles.levels}>
          {teacherData.levels.map((level, index) => (
            <span key={index} className={styles.levelTag}>
              #{level}
            </span>
          ))}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.readMoreBtn}
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Read less" : "Read more"}
          </button>
          {showMore && (
            <button className={styles.bookLessonBtn} onClick={openBookingModal}>
              Book trial lesson
            </button>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={closeBookingModal}
        title="Book trial lesson"
      >
        <BookingModal teacher={teacherData} onClose={closeBookingModal} />
      </Modal>
    </div>
  );
};

export default TeacherCard;
