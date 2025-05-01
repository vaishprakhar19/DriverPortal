import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [drivers, setDrivers] = useState([]);
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversRes, usersRes, ridesRes] = await Promise.all([
          axios.get("http://localhost:3000/api/drivers"),
          axios.get("http://localhost:3000/api/users"),
          axios.get("http://localhost:3000/api/rides"),
        ]);
        setDrivers(driversRes.data);
        setUsers(usersRes.data);
        setRides(ridesRes.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };
    fetchData();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "drivers":
        return (
          <div className="admin-tab-content">
            <h2>Manage Drivers</h2>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Vehicle</th>
                    <th>Rating</th>
                    <th>Rides</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver) => (
                    <tr key={driver.id}>
                      <td>{driver.id}</td>
                      <td>{driver.name}</td>
                      <td>{driver.vehicle}</td>
                      <td>{driver.rating}</td>
                      <td>{driver.rides}</td>
                      <td>
                        <span className={`status-badge ${driver.status}`}>{driver.status}</span>
                      </td>
                      <td>
                        <button className="btn-small btn-primary">Edit</button>
                        <button className="btn-small btn-danger">Deactivate</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "users":
        return (
          <div className="admin-tab-content">
            <h2>Manage Users</h2>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Total Rides</th>
                    <th>Total Spent</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.rides}</td>
                      <td>${user.totalSpent}</td>
                      <td>
                        <button className="btn-small btn-primary">View Details</button>
                        <button className="btn-small btn-danger">Block</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "rides":
        return (
          <div className="admin-tab-content">
            <h2>Ride History</h2>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Driver</th>
                    <th>Pickup</th>
                    <th>Destination</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rides.map((ride) => (
                    <tr key={ride.id}>
                      <td>{ride.id}</td>
                      <td>{ride.user}</td>
                      <td>{ride.driver}</td>
                      <td>{ride.pickup}</td>
                      <td>{ride.destination}</td>
                      <td>${ride.price}</td>
                      <td>
                        <span className={`status-badge ${ride.status.replace(" ", "-")}`}>{ride.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return (
          <div className="admin-tab-content">
            <h2>Dashboard Overview</h2>
            <div className="stats-container">
              <div className="stat-card card">
                <h3>Total Drivers</h3>
                <p className="stat-value">{drivers.length}</p>
                <p className="stat-label">Active: {drivers.filter((d) => d.status === "active").length}</p>
              </div>
              <div className="stat-card card">
                <h3>Total Users</h3>
                <p className="stat-value">{users.length}</p>
                <p className="stat-label">Total rides: {users.reduce((sum, user) => sum + user.rides, 0)}</p>
              </div>
              <div className="stat-card card">
                <h3>Total Revenue</h3>
                <p className="stat-value">${users.reduce((sum, user) => sum + user.totalSpent, 0)}</p>
                <p className="stat-label">From {rides.length} rides</p>
              </div>
            </div>
            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list card">
                <div className="activity-item">
                  <span className="activity-time">10:30 AM</span>
                  <span className="activity-text">
                    New ride booked by <strong>Alex Johnson</strong>
                  </span>
                </div>
                <div className="activity-item">
                  <span className="activity-time">09:45 AM</span>
                  <span className="activity-text">
                    Driver <strong>Jane Smith</strong> completed a ride
                  </span>
                </div>
                <div className="activity-item">
                  <span className="activity-time">09:15 AM</span>
                  <span className="activity-text">
                    New user <strong>William Miller</strong> registered
                  </span>
                </div>
                <div className="activity-item">
                  <span className="activity-time">08:50 AM</span>
                  <span className="activity-text">
                    Driver <strong>Mike Johnson</strong> went online
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="header">
        <h1>Admin Dashboard</h1>
        <button className="btn-danger" onClick={onLogout}>
          Logout
        </button>
      </header>

      <div className="admin-content">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <button
              className={`admin-nav-item ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`admin-nav-item ${activeTab === "drivers" ? "active" : ""}`}
              onClick={() => setActiveTab("drivers")}
            >
              Drivers
            </button>
            <button
              className={`admin-nav-item ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
            <button
              className={`admin-nav-item ${activeTab === "rides" ? "active" : ""}`}
              onClick={() => setActiveTab("rides")}
            >
              Rides
            </button>
          </nav>
        </div>
        <div className="admin-main">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
