import React, { useState } from "react";
import styles from "./FilterBar.module.css";

const FilterBar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    language: "all",
    level: "all",
    price: "all",
  });

  const handleFilterUpdate = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value,
    };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  return (
    <div className={styles.filterBar}>
      <div className={styles.filterOptions}>
        <div className={`${styles.filterOption} ${styles.filterOptionLang}`}>
          <span>Languages</span>
          <select
            value={filters.language}
            onChange={(e) => handleFilterUpdate("language", e.target.value)}
          >
            <option value="all">All Languages</option>
            <option value="French">French</option>
            <option value="English">English</option>
            <option value="German">German</option>
            <option value="Ukrainian">Ukrainian</option>
            <option value="Polish">Polish</option>
          </select>
        </div>

        <div className={`${styles.filterOption} ${styles.filterOptionLevel}`}>
          <span>Level of knowledge</span>
          <select
            value={filters.level}
            onChange={(e) => handleFilterUpdate("level", e.target.value)}
          >
            <option value="all">All Levels</option>
            <option value="A1 Beginner">A1 Beginner</option>
            <option value="A2 Elementary">A2 Elementary</option>
            <option value="B1 Intermediate">B1 Intermediate</option>
            <option value="B2 Upper-Intermediate">B2 Upper-Intermediate</option>
          </select>
        </div>

        <div className={`${styles.filterOption} ${styles.filterOptionPrice}`}>
          <span>Price</span>
          <select
            value={filters.price}
            onChange={(e) => handleFilterUpdate("price", e.target.value)}
          >
            <option value="all">All Prices</option>
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
