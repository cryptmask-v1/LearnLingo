import { ref, set } from "firebase/database";
import { database } from "../services/firebase.js";
import teachersData from "../db/teachers.json";

// JSON verisini Firebase formatına dönüştür
const convertToFirebaseFormat = (teachers) => {
  const firebaseData = {};

  teachers.forEach((teacher, index) => {
    // Eksik alanları tamamla ve id ekle
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

// Firebase'e veri yükle
export const uploadTeachersToFirebase = async () => {
  try {
    console.log("Starting data upload to Firebase...");

    const firebaseFormattedData = convertToFirebaseFormat(teachersData);
    const teachersRef = ref(database, "teachers");

    await set(teachersRef, firebaseFormattedData);

    console.log("Teachers data uploaded successfully!");
    console.log(
      `Uploaded ${Object.keys(firebaseFormattedData).length} teachers`
    );

    return true;
  } catch (error) {
    console.error("Error uploading teachers data:", error);
    throw error;
  }
};

// Tek öğretmen verisi örneği
export const uploadSingleTeacher = async (teacherData, teacherId) => {
  try {
    const teacherRef = ref(database, `teachers/${teacherId}`);
    await set(teacherRef, teacherData);
    console.log(`Teacher ${teacherId} uploaded successfully!`);
  } catch (error) {
    console.error("Error uploading teacher:", error);
    throw error;
  }
};

// Development için test fonksiyonu
export const testFirebaseConnection = async () => {
  try {
    const testRef = ref(database, "test");
    await set(testRef, {
      message: "Firebase connection works!",
      timestamp: Date.now(),
    });
    console.log("Firebase connection test successful!");
    return true;
  } catch (error) {
    console.error("Firebase connection test failed:", error);
    return false;
  }
};
