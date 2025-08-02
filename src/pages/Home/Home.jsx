import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <h1>
          Unlock your potential with the best <span>language</span> tutors
        </h1>
        <p>
          Embark on an Exciting Language Journey with Expert Language Tutors:
          Elevate your language proficiency to new heights by connecting with
          highly qualified and experienced tutors.
        </p>
        <Link to="/teachers" className={styles.ctaButton}>
          Get started
        </Link>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <h3>32,000</h3>
          <p>Experienced tutors</p>
        </div>
        <div className={styles.feature}>
          <h3>300,000</h3>
          <p>5-star tutor reviews</p>
        </div>
        <div className={styles.feature}>
          <h3>120</h3>
          <p>Subjects taught</p>
        </div>
        <div className={styles.feature}>
          <h3>200</h3>
          <p>Tutor nationalities</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
