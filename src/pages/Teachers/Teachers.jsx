import React, { useState, useEffect } from "react";
import TeacherCard from "../../components/TeacherCard/TeacherCard";
import FilterBar from "../../components/FilterBar/FilterBar";
import { teachersService } from "../../services/firebaseServices";
import styles from "./Teachers.module.css";

const Teachers = () => {
  const [allTeachers, setAllTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [visibleTeachers, setVisibleTeachers] = useState(4);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        setLoading(true);
        const teachers = await teachersService.getAllTeachers();
        setAllTeachers(teachers);
        setFilteredTeachers(teachers);
      } catch (err) {
        console.error("Error loading teachers:", err);
        setError("Failed to load teachers. Please try again.");

        const fallbackTeachers = [
          {
            id: 1,
            name: "Sophia",
            surname: "Anderson",
            languages: ["English"],
            levels: ["A1 Beginner", "A2 Elementary", "B1 Intermediate"],
            rating: 4.8,
            reviews: [
              {
                id: 1,
                reviewer_name: "Frank",
                reviewer_rating: 4.0,
                comment: "Great teacher!",
              },
            ],
            price_per_hour: 30,
            lessons_done: 540,
            avatar_url:
              "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
            lesson_info: "Experienced English teacher",
            conditions: "Flexible schedule",
            experience: "5+ years teaching experience",
          },
        ];
        setAllTeachers(fallbackTeachers);
        setFilteredTeachers(fallbackTeachers);
      } finally {
        setLoading(false);
      }
    };

    loadTeachers();
  }, []);

  const handleFilterChange = (filters) => {
    let filtered = [...allTeachers];

    if (filters.language && filters.language !== "all") {
      filtered = filtered.filter((teacher) =>
        teacher.languages.some((lang) =>
          lang.toLowerCase().includes(filters.language.toLowerCase())
        )
      );
    }

    if (filters.level && filters.level !== "all") {
      filtered = filtered.filter((teacher) =>
        teacher.levels.some((level) => level === filters.level)
      );
    }

    if (filters.price && filters.price !== "all") {
      filtered = filtered.filter((teacher) => {
        const price = teacher.price_per_hour;
        const targetPrice = parseInt(filters.price);

        switch (targetPrice) {
          case 10:
            return price >= 10 && price < 20;
          case 20:
            return price >= 20 && price < 30;
          case 30:
            return price >= 30 && price < 40;
          case 40:
            return price >= 40;
          default:
            return true;
        }
      });
    }

    setFilteredTeachers(filtered);
    setVisibleTeachers(4);
  };

  const handleLoadMore = () => {
    setVisibleTeachers((prev) => Math.min(prev + 4, filteredTeachers.length));
  };

  const hasMoreTeachers = visibleTeachers < filteredTeachers.length;

  return (
    <div className={styles.teachers}>
      <FilterBar onFilterChange={handleFilterChange} />

      {loading && (
        <div className={styles.loading}>
          <p>Loading teachers...</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      {!loading && (
        <>
          <div className={styles.teacherList}>
            {filteredTeachers.slice(0, visibleTeachers).map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>

          {hasMoreTeachers && (
            <div className={styles.loadMoreSection}>
              <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
                Load more
              </button>
            </div>
          )}

          {filteredTeachers.length === 0 && !loading && (
            <div className={styles.noResults}>
              <div className={styles.noResultsCard}>
                <h3>No teachers found</h3>
                <p>
                  No teachers match your current filter criteria. Try adjusting
                  your filters to find more teachers.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Teachers;
