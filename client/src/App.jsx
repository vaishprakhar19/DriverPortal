"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login/Login"
import UserDashboard from "./components/User/UserDashboard"
import DriverDashboard from "./components/Driver/DriverDashboard"
import AdminDashboard from "./components/Admin/AdminDashboard"
import "./App.css"

function App() {
  const [userType, setUserType] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = (type) => {
    setUserType(type)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setUserType(null)
    setIsLoggedIn(false)
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to={`/${userType}`} />} />
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
        </Routes>
      </div>
    </Router>
  )
}

export default App
