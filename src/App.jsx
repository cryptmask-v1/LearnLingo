import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Teachers from "./pages/Teachers/Teachers";
import Favorites from "./pages/Favorites/Favorites";
import "react-toastify/dist/ReactToastify.css";
import "./styles/toast.css";
import "./App.css";

// Suppress Firebase console errors globally
const originalError = console.error;
console.error = (...args) => {
  const message = args[0]?.toString() || "";
  if (
    message.includes("identitytoolkit.googleapis.com") ||
    message.includes("400 (Bad Request)") ||
    message.includes("POST https://identitytoolkit")
  ) {
    return; // Don't log Firebase auth API errors
  }
  originalError.apply(console, args);
};

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <div className="App">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </main>
          </div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
