"use client"

import { useState } from "react"
import "./AdminDashboard.css"

// Mock data
const mockDrivers = [
  { id: 1, name: "John Doe", rating: 4.8, vehicle: "Toyota Camry", rides: 120, status: "active" },
  { id: 2, name: "Jane Smith", rating: 4.9, vehicle: "Honda Civic", rides: 85, status: "active" },
  { id: 3, name: "Mike Johnson", rating: 4.7, vehicle: "Ford Focus", rides: 65, status: "inactive" },
  { id: 4, name: "Sarah Williams", rating: 4.6, vehicle: "Hyundai Sonata", rides: 92, status: "active" },
  { id: 5, name: "David Brown", rating: 4.9, vehicle: "Chevrolet Malibu", rides: 110, status: "active" },
]

const mockUsers = [
  { id: 1, name: "Alex Johnson", rides: 15, totalSpent: 350 },
  { id: 2, name: "Emma Wilson", rides: 8, totalSpent: 180 },
  { id: 3, name: "Michael Brown", rides: 22, totalSpent: 520 },
  { id: 4, name: "Olivia Davis", rides: 5, totalSpent: 120 },
  { id: 5, name: "William Miller", rides: 18, totalSpent: 410 },
]

const mockRides = [
  {
    id: 1,
    user: "Alex Johnson",
    driver: "John Doe",
    pickup: "123 Main St",
    destination: "456 Oak Ave",
    price: 22,
    status: "completed",
  },
  {
    id: 2,
    user: "Emma Wilson",
    driver: "Jane Smith",
    pickup: "789 Pine Rd",
    destination: "321 Elm Blvd",
    price: 18,
    status: "completed",
  },
  {
    id: 3,
    user: "Michael Brown",
    driver: "Mike Johnson",
    pickup: "555 Cedar Ln",
    destination: "777 Maple Dr",
    price: 25,
    status: "in progress",
  },
  {
    id: 4,
    user: "Olivia Davis",
    driver: "Sarah Williams",
    pickup: "888 Birch St",
    destination: "999 Walnut Ave",
    price: 30,
    status: "scheduled",
  },
]

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("overview")

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
                  {mockDrivers.map((driver) => (
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
        )
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
                  {mockUsers.map((user) => (
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
        )
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
                  {mockRides.map((ride) => (
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
        )
      default:
        return (
          <div className="admin-tab-content">
            <h2>Dashboard Overview</h2>
            <div className="stats-container">
              <div className="stat-card card">
                <h3>Total Drivers</h3>
                <p className="stat-value">{mockDrivers.length}</p>
                <p className="stat-label">Active: {mockDrivers.filter((d) => d.status === "active").length}</p>
              </div>
              <div className="stat-card card">
                <h3>Total Users</h3>
                <p className="stat-value">{mockUsers.length}</p>
                <p className="stat-label">Total rides: {mockUsers.reduce((sum, user) => sum + user.rides, 0)}</p>
              </div>
              <div className="stat-card card">
                <h3>Total Revenue</h3>
                <p className="stat-value">${mockUsers.reduce((sum, user) => sum + user.totalSpent, 0)}</p>
                <p className="stat-label">From {mockRides.length} rides</p>
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
        )
    }
  }

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
  )
}

export default AdminDashboard
