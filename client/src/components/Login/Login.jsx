"use client"
import "./Login.css"

const Login = ({ onLogin }) => {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Driver Management Portal</h1>
          <p>Select your role to continue</p>
        </div>
        <div className="login-buttons">
          <button className="login-btn user-btn" onClick={() => onLogin("user")}>
            Login as User
          </button>
          <button className="login-btn driver-btn" onClick={() => onLogin("driver")}>
            Login as Driver
          </button>
          <button className="login-btn admin-btn" onClick={() => onLogin("admin")}>
            Login as Admin
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
