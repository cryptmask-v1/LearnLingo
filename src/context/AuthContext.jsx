import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../services/firebase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Authentication functions
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success(`Welcome back, ${result.user.displayName || "User"}!`);
      return { success: true, data: result };
    } catch (error) {
      let message = "Login failed. Please check your credentials.";

      switch (error.code) {
        case "auth/user-not-found":
          message = "No account found with this email address.";
          break;
        case "auth/wrong-password":
          message = "Incorrect password. Please try again.";
          break;
        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;
        case "auth/invalid-credential":
          message = "Invalid email or password. Please try again.";
          break;
        case "auth/user-disabled":
          message = "This account has been disabled.";
          break;
        case "auth/too-many-requests":
          message = "Too many failed login attempts. Please try again later.";
          break;
        case "auth/network-request-failed":
          message = "Network error. Please check your connection.";
          break;
        default:
          message = "Login failed. Please check your credentials.";
      }

      toast.error(message);
      return { success: false, error: error.code, message };
    }
  };

  const register = async (email, password, name) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(result.user, { displayName: name });
      toast.success(`Welcome to LearnLingo, ${name}!`);
      return { success: true, data: result };
    } catch (error) {
      let message = "Registration failed. Please try again.";

      switch (error.code) {
        case "auth/email-already-in-use":
          message = "This email is already registered. Please try logging in.";
          break;
        case "auth/weak-password":
          message = "Password is too weak. Please use at least 6 characters.";
          break;
        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;
        case "auth/network-request-failed":
          message = "Network error. Please check your connection.";
          break;
        default:
          message = "Registration failed. Please try again.";
      }

      toast.error(message);
      return { success: false, error: error.code, message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.info("You have been logged out successfully.");
      return { success: true };
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      return { success: false, error: error.code, message: "Logout failed." };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
