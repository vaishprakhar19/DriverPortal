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
        const [driversRes, ridesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/drivers"),
          axios.get("http://localhost:5000/api/rides"),
        ]);
        setDrivers(driversRes.data);
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
                    {/* <th>ID</th> */}
                    <th>Name</th>
                    <th>Vehicle Model</th>
                    <th>Vehicle Color</th>
                    <th>Rating</th>
                    <th>Vehicle No.</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver) => (
                    <tr key={driver.driver_id}>
                      {/* <td>{driver.driver_id}</td> */}
                      <td>{driver.driver_name}</td>
                      <td>{driver.vehicleModel}</td>
                      <td>{driver.vehicleColor}</td>
                      <td>{driver.rating}</td>
                      <td>{driver.licensePlate}</td>
                      <td>
                        <span className={`status-badge active`}>active</span>
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
                      <td>{ride.user_name}</td>
                      <td>{ride.driver_name}</td>
                      <td>{ride.pickup_address}</td>
                      <td>{ride.destination_address}</td>
                      <td>₹{ride.price}</td>
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
                {/* <p className="stat-label">Active: {drivers.filter((d) => d.status === "active").length}</p> */}
                <p className="stat-label">Active: {drivers.length}</p>
              </div>
              <div className="stat-card card">
                <h3>Total Users</h3>
                <p className="stat-value">{[...new Set(rides.map((ride) => ride.user_id))].length}</p>
                <p className="stat-label">Total rides: {rides.length}</p>
              </div>
              <div className="stat-card card">
                <h3>Total Revenue</h3>
                <p className="stat-value">₹{rides.reduce((sum, ride) => sum + parseFloat(ride.price), 0)}</p>
                <p className="stat-label">From {rides.length} rides</p>
              </div>
            </div>
            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list card">
                {rides.slice(-5).reverse().map((ride) => (
                  <div className="activity-item" key={ride.id}>
                    <span className="activity-time">{new Date(ride.created_at).toLocaleDateString()} {new Date(ride.created_at).toLocaleTimeString()}</span>
                    <span className="activity-text">
                      Ride <strong>{ride.id}</strong> is <strong>{ride.status}</strong> from <strong>{ride.pickup_address}</strong> to <strong>{ride.destination_address}</strong>
                    </span>
                  </div>
                ))}
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
            {/* <button
              className={`admin-nav-item ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button> */}
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
