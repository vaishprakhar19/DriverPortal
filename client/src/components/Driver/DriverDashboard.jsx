"use client"

import { useState } from "react"
import "./DriverDashboard.css"

// Mock data for ride requests
const mockRequests = [
  { id: 1, user: "Alex Johnson", pickup: "123 Main St", destination: "456 Oak Ave", price: 22 },
  { id: 2, user: "Emma Wilson", pickup: "789 Pine Rd", destination: "321 Elm Blvd", price: 18 },
  { id: 3, user: "Michael Brown", pickup: "555 Cedar Ln", destination: "777 Maple Dr", price: 25 },
]

const DriverDashboard = ({ onLogout }) => {
  const [requests, setRequests] = useState(mockRequests)
  const [activeRides, setActiveRides] = useState([])
  const [completedRides, setCompletedRides] = useState([])

  const acceptRequest = (request) => {
    setRequests(requests.filter((req) => req.id !== request.id))
    setActiveRides([...activeRides, { ...request, status: "active" }])
  }

  const rejectRequest = (requestId) => {
    setRequests(requests.filter((req) => req.id !== requestId))
  }

  const completeRide = (ride) => {
    setActiveRides(activeRides.filter((r) => r.id !== ride.id))
    setCompletedRides([...completedRides, { ...ride, status: "completed" }])
  }

  return (
    <div className="driver-dashboard">
      <header className="header">
        <h1>Driver Dashboard</h1>
        <button className="btn-danger" onClick={onLogout}>
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>New Ride Requests</h2>
          {requests.length > 0 ? (
            <div className="request-list">
              {requests.map((request) => (
                <div key={request.id} className="request-card card">
                  <div className="request-details">
                    <h3>Request from {request.user}</h3>
                    <div className="location-details">
                      <p>
                        <strong>Pickup:</strong> {request.pickup}
                      </p>
                      <p>
                        <strong>Destination:</strong> {request.destination}
                      </p>
                    </div>
                    <p className="request-price">
                      <strong>Fare:</strong> ${request.price}
                    </p>
                  </div>
                  <div className="request-actions">
                    <button className="btn-success" onClick={() => acceptRequest(request)}>
                      Accept
                    </button>
                    <button className="btn-danger" onClick={() => rejectRequest(request.id)}>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data-message">No new ride requests available.</p>
          )}
        </div>

        <div className="dashboard-section">
          <h2>Active Rides</h2>
          {activeRides.length > 0 ? (
            <div className="active-rides-list">
              {activeRides.map((ride) => (
                <div key={ride.id} className="active-ride-card card">
                  <div className="ride-details">
                    <h3>Ride with {ride.user}</h3>
                    <div className="location-details">
                      <p>
                        <strong>Pickup:</strong> {ride.pickup}
                      </p>
                      <p>
                        <strong>Destination:</strong> {ride.destination}
                      </p>
                    </div>
                    <p className="ride-price">
                      <strong>Fare:</strong> ${ride.price}
                    </p>
                  </div>
                  <button className="btn-primary" onClick={() => completeRide(ride)}>
                    Complete Ride
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data-message">No active rides.</p>
          )}
        </div>

        <div className="dashboard-section">
          <h2>Completed Rides</h2>
          {completedRides.length > 0 ? (
            <div className="completed-rides-list">
              {completedRides.map((ride) => (
                <div key={ride.id} className="completed-ride-card card">
                  <div className="ride-details">
                    <h3>Ride with {ride.user}</h3>
                    <div className="location-details">
                      <p>
                        <strong>Pickup:</strong> {ride.pickup}
                      </p>
                      <p>
                        <strong>Destination:</strong> {ride.destination}
                      </p>
                    </div>
                    <p className="ride-price">
                      <strong>Fare:</strong> ${ride.price}
                    </p>
                    <p className="ride-status">Status: Completed</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data-message">No completed rides yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DriverDashboard
