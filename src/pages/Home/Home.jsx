import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import mainbg from "../../assets/orangebg.png";

const Home = () => {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1>
              Unlock your potential with the best{" "}
              <span className={styles.highlight}>language</span> tutors
            </h1>
            <p>
              Embark on an Exciting Language Journey with Expert Language
              Tutors: Elevate your language proficiency to new heights by
              connecting with highly qualified and experienced tutors.
            </p>
            <Link to="/teachers" className={styles.ctaButton}>
              Get started
            </Link>
          </div>
        </div>
        <div>
          <img src={mainbg} alt="Background" className={styles.heroImage} />
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          <div className={styles.stat}>
            <h3>32,000+</h3>
            <p>Experienced tutors</p>
          </div>
          <div className={styles.stat}>
            <h3>300,000+</h3>
            <p>5-star tutor reviews</p>
          </div>
          <div className={styles.stat}>
            <h3>120+</h3>
            <p>Subjects taught</p>
          </div>
          <div className={styles.stat}>
            <h3>200+</h3>
            <p>Tutor nationalities</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
