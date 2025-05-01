// frontend/src/DriverDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DriverDashboard.css"; // You'll need to create this CSS file

const DriverDashboard = ({ onLogout }) => {
    const [requests, setRequests] = useState([]);
    const [activeRides, setActiveRides] = useState([]);
    const [completedRides, setCompletedRides] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/requests");
                setRequests(response.data);
            } catch (error) {
                console.error("Error fetching ride requests:", error);
            }
        };

        const fetchActiveRides = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/active-rides");
                setActiveRides(response.data);
            } catch (error) {
                console.error("Error fetching active rides:", error);
            }
        };

        const fetchCompletedRides = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/completed-rides");
                setCompletedRides(response.data);
            } catch (error) {
                console.error("Error fetching completed rides:", error);
            }
        };

        fetchRequests();
        fetchActiveRides();
        fetchCompletedRides();

        // Set up interval to refresh data periodically (optional)
        const intervalId = setInterval(() => {
            fetchRequests();
            fetchActiveRides();
            fetchCompletedRides();
        }, 5000); // Refresh every 5 seconds

        return () => clearInterval(intervalId); // Clean up interval on unmount
    }, []);

    const acceptRequest = async (request) => {
        try {
            await axios.post(`http://localhost:3000/api/requests/${request.id}/accept`);
            setRequests(requests.filter((req) => req.id !== request.id));
            setActiveRides([...activeRides, { ...request, status: "active" }]);
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    const completeRide = async (ride) => {
        try {
            await axios.post(`http://localhost:3000/api/rides/${ride.id}/complete`);
            setActiveRides(activeRides.filter((r) => r.id !== ride.id));
            setCompletedRides([...completedRides, { ...ride, status: "completed" }]);
        } catch (error) {
            console.error("Error completing ride:", error);
        }
    };

    const rejectRequest = async (requestId) => {
        try {
            await axios.delete(`http://localhost:3000/api/requests/${requestId}/reject`);
            setRequests(requests.filter((req) => req.id !== requestId));
        } catch (error) {
            console.error("Error rejecting request:", error);
        }
    };

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
    );
};

export default DriverDashboard;