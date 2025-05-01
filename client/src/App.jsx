import { useContext } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext";
import Login from "./components/Login/Login";
import UserDashboard from "./components/User/UserDashboard";
import DriverDashboard from "./components/Driver/DriverDashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";
import PaymentPage from "./components/User/PaymentPage";
import DriverRegistration from "./components/Driver/DriverRegistration";
import "./App.css";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDtvg87YoIjsyYi-WrzAYaEzHlCWTiESts",
  authDomain: "driverportal-511ad.firebaseapp.com",
  projectId: "driverportal-511ad",
  storageBucket: "driverportal-511ad.firebasestorage.app",
  messagingSenderId: "77611118425",
  appId: "1:77611118425:web:8fde7c92b25d487b0de648"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function App() {
  const { setUserType, setIsLoggedIn, setUserId, setDriverId, user, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleRegisteration = async () => {
    try {
      setUserType("driver");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setIsLoggedIn(true);
      setUserId(user.uid);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/register-driver");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleGoogleLogin = async (usertype) => {
    try {
      setUserType(usertype);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUserId(user.uid);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      console.log("User logged in:", user);
      console.log("User type:", usertype);

      if (usertype === "user") {
        navigate("/user");
      } else if (usertype === "admin") {
        navigate("/admin");
      } else if (usertype === "driver") {
        setDriverId(user.uid);
        navigate(`/driver`);
      }
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleLogout = () => {
    setUserType(null);
    setIsLoggedIn(false);
    setUserId(null);
    setDriverId(null);
    navigate("/");
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Login onLogin={handleGoogleLogin} onRegister={handleRegisteration} />} />
        <Route path="/user" element={<UserDashboard onLogout={handleLogout} />} />
        <Route path="/register-driver" element={<DriverRegistration />} />
        <Route path="/driver" element={<DriverDashboard onLogout={handleLogout} />} />
        <Route path="/admin" element={<AdminDashboard onLogout={handleLogout} />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </div>
  );
}

export default App;
