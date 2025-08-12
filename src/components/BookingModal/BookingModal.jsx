import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { bookingsService } from "../../services/firebaseServices";
import styles from "./BookingModal.module.css";

// Validation schema
const schema = yup.object({
  reason: yup.string().required("Please select a reason for learning"),
  fullName: yup
    .string()
    .min(2, "Full name must be at least 2 characters")
    .required("Full name is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  phone: yup
    .string()
    .min(10, "Please enter a valid phone number")
    .required("Phone number is required"),
});

const BookingModal = ({ teacher, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: user?.displayName || "",
      email: user?.email || "",
    },
  });

  const learningReasons = [
    "Career and business",
    "Lesson for kids",
    "Living abroad",
    "Exams and coursework",
    "Culture, travel or hobby",
  ];

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Firebase'e booking kaydı yap
      const bookingData = {
        teacherId: teacher.id,
        teacherName: `${teacher.name} ${teacher.surname}`,
        userId: user?.uid,
        userEmail: user?.email,
        reason: data.reason,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        status: "pending",
      };

      await bookingsService.createBooking(bookingData);

      toast.success(
        `Trial lesson booked with ${teacher.name} ${teacher.surname}! We'll contact you soon.`
      );
      onClose();
    } catch (error) {
      console.error("Booking error:", error);
      setError("root", {
        type: "manual",
        message: "Failed to book the lesson. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.bookingModal}>
      <div className={styles.teacherInfo}>
        <img
          src={teacher.avatar_url}
          alt={`${teacher.name} ${teacher.surname}`}
          className={styles.teacherAvatar}
        />
        <div className={styles.teacherDetails}>
          <p className={styles.bookingText}>Book trial lesson</p>
          <h3 className={styles.teacherName}>
            {teacher.name} {teacher.surname}
          </h3>
        </div>
      </div>

      <p className={styles.description}>
        Our experienced tutor will assess your current language level, discuss
        your learning goals, and tailor the lesson to your specific needs.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            What is your main reason for learning English?
          </label>
          <div className={styles.radioGroup}>
            {learningReasons.map((reason) => (
              <label key={reason} className={styles.radioLabel}>
                <input
                  type="radio"
                  value={reason}
                  className={styles.radioInput}
                  {...register("reason")}
                />
                <span className={styles.radioCustom}></span>
                {reason}
              </label>
            ))}
          </div>
          {errors.reason && (
            <span className={styles.errorMessage}>{errors.reason.message}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Full name"
            className={`${styles.input} ${
              errors.fullName ? styles.inputError : ""
            }`}
            {...register("fullName")}
          />
          {errors.fullName && (
            <span className={styles.errorMessage}>
              {errors.fullName.message}
            </span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="email"
            placeholder="Email"
            className={`${styles.input} ${
              errors.email ? styles.inputError : ""
            }`}
            {...register("email")}
          />
          {errors.email && (
            <span className={styles.errorMessage}>{errors.email.message}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="tel"
            placeholder="Phone number"
            className={`${styles.input} ${
              errors.phone ? styles.inputError : ""
            }`}
            {...register("phone")}
          />
          {errors.phone && (
            <span className={styles.errorMessage}>{errors.phone.message}</span>
          )}
        </div>

        {errors.root && (
          <div className={styles.generalError}>{errors.root.message}</div>
        )}

        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? "Booking..." : "Book trial lesson"}
        </button>
      </form>
    </div>
  );
};

export default BookingModal;
