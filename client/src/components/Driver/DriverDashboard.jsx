// frontend/src/DriverDashboard.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../AppContext";
import "./DriverDashboard.css"; // You'll need to create this CSS file

const DriverDashboard = ({ onLogout }) => {
    const { userId, driverId } = useContext(AppContext);
    const [rides, setRides] = useState([]);
    const [activeRides, setActiveRides] = useState([]);
    const [completedRides, setCompletedRides] = useState([]);
    const [inProgressRides, setInProgressRides] = useState([]);

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/rides");
                const ridesData = response.data;

                // Filter rides based on status and driver_id
                setRides(ridesData);
                setActiveRides(ridesData.filter((ride) => ride.status === "active" && ride.driver_id === driverId));
                setInProgressRides(ridesData.filter((ride) => ride.status === "in-progress" && ride.driver_id === driverId));
                setCompletedRides(ridesData.filter((ride) => ride.status === "completed" && ride.driver_id === driverId));
            } catch (error) {
                console.error("Error fetching rides:", error);
            }
        };

        fetchRides();
    }, [userId]);

    const acceptRide = async (ride) => {
        try {
            await axios.post(`http://localhost:5000/api/rides/${ride.id}/accept`);
            setActiveRides(activeRides.filter((r) => r.id !== ride.id));
            setInProgressRides([...inProgressRides, { ...ride, status: "in-progress" }]);
        } catch (error) {
            console.error("Error accepting ride:", error);
        }
    };

    const completeRide = async (ride) => {
        try {
            await axios.post(`http://localhost:5000/api/rides/${ride.id}/complete`);
            setInProgressRides(inProgressRides.filter((r) => r.id !== ride.id));
            setCompletedRides([...completedRides, { ...ride, status: "completed" }]);
        } catch (error) {
            console.error("Error completing ride:", error);
        }
    };

    const rejectRide = async (ride) => {
        try {
            await axios.post(`http://localhost:5000/api/rides/${ride.id}/reject`);
            setActiveRides(activeRides.filter((r) => r.id !== ride.id));
        } catch (error) {
            console.error("Error rejecting ride:", error);
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
                    {activeRides.length > 0 ? (
                        <div className="request-list">
                            {activeRides.map((ride) => (
                                <div key={ride.id} className="request-card card">
                                    <div className="request-details">
                                        <h3>Request from {ride.user_name}</h3>
                                        <div className="location-details">
                                            <p>
                                                <strong>Pickup:</strong> {ride.pickup_address}
                                            </p>
                                            <p>
                                                <strong>Destination:</strong> {ride.destination_address}
                                            </p>
                                        </div>
                                        <p className="request-price">
                                            <strong>Fare:</strong> ${ride.price}
                                        </p>
                                    </div>
                                    <div className="request-actions">
                                        <button className="btn-success" onClick={() => acceptRide(ride)}>
                                            Accept
                                        </button>
                                        <button className="btn-danger" onClick={() => rejectRide(ride)}>
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
                    {inProgressRides.length > 0 ? (
                        <div className="active-rides-list">
                            {inProgressRides.map((ride) => (
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