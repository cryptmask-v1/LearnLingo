import { useState } from "react";
import { ref, set } from "firebase/database";
import { database } from "../services/firebase";
import teachersData from "../db/teachers.json";

const DataUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const convertToFirebaseFormat = (teachers) => {
    const firebaseData = {};

    teachers.forEach((teacher, index) => {
      const teacherId = `teacher_${index + 1}`;
      firebaseData[teacherId] = {
        id: index + 1,
        name: teacher.name || "Unknown",
        surname: teacher.surname || "Teacher",
        languages: teacher.languages || ["English"],
        levels: teacher.levels || ["A1 Beginner"],
        rating: teacher.rating || 4.0,
        reviews: teacher.reviews || [],
        price_per_hour: teacher.price_per_hour || 25,
        lessons_done: teacher.lessons_done || 100,
        avatar_url:
          teacher.avatar_url || "https://ftp.goit.study/img/avatars/1.jpg",
        lesson_info: teacher.lesson_info || "Professional language lessons",
        conditions: Array.isArray(teacher.conditions)
          ? teacher.conditions
          : [teacher.conditions || "Flexible schedule"],
        experience: teacher.experience || "Experienced language teacher",
      };
    });

    return firebaseData;
  };

  const uploadTeachers = async () => {
    setUploading(true);
    setMessage("");

    try {
      console.log("Uploading teachers to Firebase...");
      console.log("Total teachers:", teachersData.length);

      const formattedData = convertToFirebaseFormat(teachersData);
      const teachersRef = ref(database, "teachers");

      await set(teachersRef, formattedData);

      setMessage(
        `Successfully uploaded ${teachersData.length} teachers to Firebase!`
      );
      console.log("Upload completed successfully!");
    } catch (error) {
      console.error("Error uploading teachers:", error);
      setMessage(`Error uploading teachers: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        zIndex: 1000,
        background: "white",
        padding: "10px",
        border: "2px solid #e0e0e0",
        borderRadius: "8px",
      }}
    >
      <button
        onClick={uploadTeachers}
        disabled={uploading}
        style={{
          padding: "8px 16px",
          background: uploading ? "#ccc" : "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: uploading ? "not-allowed" : "pointer",
        }}
      >
        {uploading ? "Uploading..." : "Upload Teachers to Firebase"}
      </button>
      {message && (
        <div
          style={{
            marginTop: "10px",
            padding: "5px",
            borderRadius: "4px",
            background: message.includes("Error") ? "#ffebee" : "#e8f5e8",
            color: message.includes("Error") ? "#c62828" : "#2e7d32",
            fontSize: "12px",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default DataUpload;
