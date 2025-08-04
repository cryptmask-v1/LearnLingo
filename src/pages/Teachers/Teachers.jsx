import React from "react";
import TeacherCard from "../../components/TeacherCard/TeacherCard";
import FilterBar from "../../components/FilterBar/FilterBar";

const Teachers = () => {
  return (
    <div>
      <FilterBar />
      <TeacherCard />
    </div>
  );
};

export default Teachers;
