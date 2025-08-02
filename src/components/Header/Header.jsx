import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Header.module.css";

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
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
              <button className={styles.loginBtn}>Log in</button>
              <button className={styles.registerBtn}>Registration</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
