import { useState } from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import Login from "./components/Login/Login"
import UserDashboard from "./components/User/UserDashboard"
import DriverDashboard from "./components/Driver/DriverDashboard"
import AdminDashboard from "./components/Admin/AdminDashboard"
import PaymentPage from "./components/User/PaymentPage"
import "./App.css"
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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
const db = getFirestore(app);

function App() {
  const [userType, setUserType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (type) => {
    setUserType(type);
    setIsLoggedIn(true);
    navigate(`/${type}`);
  };

  const handleGoogleLogin = async (usertype) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User logged in:", user);
      console.log("User type:", usertype);

      // Add user to Firestore database
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { usertype });
      console.log("User added to Firestore with usertype:", usertype);

      // Update state and navigate
      setUserType(usertype);
      setIsLoggedIn(true);
      navigate(`/${usertype}`);
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleLogout = () => {
    setUserType(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={!isLoggedIn ? <Login onLogin={handleGoogleLogin} /> : <Navigate to={`/${userType}`} />} />
        <Route
          path="/user"
          element={
            isLoggedIn && userType === "user" ? <UserDashboard onLogout={handleLogout} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/driver"
          element={
            isLoggedIn && userType === "driver" ? <DriverDashboard onLogout={handleLogout} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/admin"
          element={
            isLoggedIn && userType === "admin" ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/" />
          }
        />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </div>
  );
}

export default App
