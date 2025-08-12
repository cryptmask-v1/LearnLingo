import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";
import styles from "./RegisterForm.module.css";

// Validation schema
const schema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const RegisterForm = ({ onClose, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    const result = await registerUser(data.email, data.password, data.name);

    if (result.success) {
      onClose();
    } else if (result.error === "auth/email-already-in-use") {
      // Form'da email field'ında göstermek için
      setError("email", {
        type: "manual",
        message: "This email is already registered.",
      });
    }
    // Diğer hatalar toast ile gösterildi

    setIsLoading(false);
  };

  return (
    <div className={styles.registerForm}>
      <p className={styles.description}>
        Thank you for your interest in our platform! In order to register, we
        need some information. Please provide us with the following information.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Name"
            className={`${styles.input} ${
              errors.name ? styles.inputError : ""
            }`}
            {...register("name")}
          />
          {errors.name && (
            <span className={styles.errorMessage}>{errors.name.message}</span>
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
          <div className={styles.passwordInputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`${styles.input} ${styles.passwordInput} ${
                errors.password ? styles.inputError : ""
              }`}
              {...register("password")}
            />
            <button
              type="button"
              className={styles.togglePassword}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <HiEyeSlash size={20} /> : <HiEye size={20} />}
            </button>
          </div>
          {errors.password && (
            <span className={styles.errorMessage}>
              {errors.password.message}
            </span>
          )}
        </div>

        {errors.root && (
          <div className={styles.generalError}>{errors.root.message}</div>
        )}

        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <div className={styles.switchForm}>
        <span>Already have an account? </span>
        <button
          type="button"
          className={styles.switchBtn}
          onClick={onSwitchToLogin}
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
