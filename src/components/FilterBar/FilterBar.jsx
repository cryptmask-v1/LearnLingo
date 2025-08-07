import React from "react";
import styles from "./FilterBar.module.css";

const FilterBar = () => {
  return (
    <div className={styles.filterBar}>
      <div className={styles.filterOptions}>
        <div className={`${styles.filterOption} ${styles.filterOptionLang}`}>
          <span>Languages</span>
          <select>
            <option value="french">French</option>
            <option value="english">English</option>
            <option value="german">German</option>
            <option value="ukranian">Ukranian</option>
            <option value="polish">Polish</option>
          </select>
        </div>

        <div className={`${styles.filterOption} ${styles.filterOptionLevel}`}>
          <span>Level of knowledge</span>
          <select>
            <option value="a1">A1 Beginner</option>
            <option value="a2">A2 Elementary</option>
            <option value="b1">B1 Intermediate</option>
            <option value="b2">B2 Upper-Intermediate</option>
          </select>
        </div>

        <div className={`${styles.filterOption} ${styles.filterOptionPrice}`}>
          <span>Price</span>
          <select>
            <option value="10">10 $</option>
            <option value="20">20 $</option>
            <option value="30">30 $</option>
            <option value="40">40 $</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
