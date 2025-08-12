import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LuLogIn } from "react-icons/lu";
import Modal from "../Modal/Modal";
import LoginForm from "../LoginForm/LoginForm";
import RegisterForm from "../RegisterForm/RegisterForm";
import ukraineLogo from "../../assets/ukraine.png";
import styles from "./Header.module.css";

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
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

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img src={ukraineLogo} alt="LearnLingo" className={styles.logoIcon} />
          LearnLingo
        </Link>

        <nav className={styles.nav}>
          <Link
            to="/"
            className={location.pathname === "/" ? styles.active : ""}
          >
            Home
          </Link>
          <Link
            to="/teachers"
            className={location.pathname === "/teachers" ? styles.active : ""}
          >
            Teachers
          </Link>
          {user && (
            <Link
              to="/favorites"
              className={
                location.pathname === "/favorites" ? styles.active : ""
              }
            >
              Favorites
            </Link>
          )}
        </nav>

        <div className={styles.authButtons}>
          {user ? (
            <div className={styles.userInfo}>
              <span>Welcome, {user.displayName || user.email}</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Log out
              </button>
            </div>
          ) : (
            <div className={styles.authGroup}>
              <button className={styles.loginBtn} onClick={openLoginModal}>
                <LuLogIn className={styles.loginIcon} />
                Log in
              </button>
              <button
                className={styles.registerBtn}
                onClick={openRegisterModal}
              >
                Registration
              </button>
            </div>
          )}
        </div>
      </div>

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
    </header>
  );
};

export default Header;
