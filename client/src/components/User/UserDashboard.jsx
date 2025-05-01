import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import RideForm from "./RideForm";
import DriverList from "./DriverList";
import "./UserDashboard.css";

const UserDashboard = ({ onLogout }) => {
  const { userId } = useContext(AppContext);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [showDrivers, setShowDrivers] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeRide, setActiveRide] = useState(null);

  useEffect(() => {
    if (userId) {
      loadRides()
        .then(() => console.log("Rides loaded successfully"))
        .catch((err) => console.error("Error loading rides:", err));
    }
  }, [userId]);

  const loadRides = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:5000/api/rides`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Loaded rides data:", data); // Log the loaded rides data
      setRides(data);
    } catch (err) {
      console.error("Error loading rides:", err);
      setError("Failed to load ride history.");
    } finally {
      setLoading(false);
    }
  };

  const handleFindDrivers = async (pickupLocation, destinationLocation) => {
    setPickup(pickupLocation);
    setDestination(destinationLocation);
    setError("");

    if (pickupLocation && destinationLocation) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/find-drivers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pickup: pickupLocation, destination: destinationLocation }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDrivers(data);
        setShowDrivers(true);
      } catch (err) {
        setError("Failed to load available drivers. Please try again.");
        console.error("Error loading drivers:", err);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please enter both pickup and destination locations.");
    }
  };

  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver);
  };

  const confirmBooking = async () => {
    console.log(selectedDriver,userId)
    if (!selectedDriver || !userId) return;
    setLoading(true);
    setError("");

    const estimatedPrice = Math.floor(Math.random() * 300) + 10; // Example
    const newRide = {
      pickup,
      destination,
      price: estimatedPrice,
      driver: selectedDriver,
      status: "active",
    };
    console.log("New Ride:", newRide);
    
    try {
      await fetch("http://localhost:5000/api/rides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          pickup,
          destination,
          price: estimatedPrice,
          driverId: selectedDriver.id,
          status: "active",
        }),
      });

      setActiveRide(newRide);
      setBookingConfirmed(true);
      setShowDrivers(false);
    } catch (err) {
      setError("Failed to book ride. Please try again.");
      console.error("Error booking ride:", err);
    } finally {
      setLoading(false);
    }
  };

  const newRide = () => {
    setPickup("");
    setDestination("");
    setShowDrivers(false);
    setSelectedDriver(null);
    setBookingConfirmed(false);
    setActiveRide(null);
  };

  return (
    <div className="user-dashboard">
      <header className="header">
        <h1>Ride Booking Portal</h1>
        <button className="btn-danger" onClick={onLogout}>
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        {activeRide ? (
          <div className="active-ride-section card">
            <h2>Your Active Ride</h2>
            <div className="ride-details">
              <p>
                <strong>Pickup:</strong> {activeRide.pickup}
              </p>
              <p>
                <strong>Destination:</strong> {activeRide.destination}
              </p>
              <p>
                <strong>Status:</strong> {activeRide.status}
              </p>
              <p>
                <strong>Price:</strong> ${activeRide.price}
              </p>
              {activeRide.driver && (
                <p>
                  <strong>Driver:</strong> {activeRide.driver.name}
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            {!bookingConfirmed ? (
              <>
                <div className="ride-section">
                  <h2>Book a Ride</h2>
                  <RideForm onFindDrivers={handleFindDrivers} />
                </div>

                {showDrivers && (
                  <div className="drivers-section">
                    <h2>Available Drivers</h2>
                    {loading ? (
                      <p>Loading available drivers...</p>
                    ) : drivers.length > 0 ? (
                      <>
                        <DriverList
                          drivers={drivers}
                          onSelect={handleDriverSelect}
                          selectedDriver={selectedDriver}
                        />
                        {selectedDriver && (
                          <div className="booking-actions">
                            <button
                              className="btn-success"
                              onClick={confirmBooking}
                              disabled={loading}
                            >
                              {loading ? "Processing..." : "Confirm Booking"}
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="no-drivers">
                        No drivers available for the specified locations.
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="booking-confirmed card">
                <div className="confirmation-message">
                  <h2>Booking Confirmed!</h2>
                  <p>
                    Your ride from <strong>{pickup}</strong> to{" "}
                    <strong>{destination}</strong> has been booked.
                  </p>
                  <p>
                    Estimated fare: <strong>${activeRide?.price}</strong>
                  </p>
                  <p>We are finding a driver for you. Please wait...</p>
                  <button className="btn-primary" onClick={newRide}>
                    Book Another Ride
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <div className="ride-history-section">
          <h2>Your Ride History</h2>
          {loading && !rides.length > 0 ? (
            <p>Loading ride history...</p>
          ) : rides.length > 0 ? (
            <div className="ride-history-list">
              {rides
                .filter((ride) => ride.user_id == userId) // Filter rides by user_id
                .map((ride) => (
                  <div key={ride.id} className="ride-history-item card"> {/* Updated key to use `id` */}
                    <div className="ride-history-details">
                      <p>
                        <strong>From:</strong> {ride.pickup_address} {/* Updated field name */}
                      </p>
                      <p>
                        <strong>To:</strong> {ride.destination_address} {/* Updated field name */}
                      </p>
                      <p>
                        <strong>Price:</strong> ${ride.price}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span className={`status-badge ${ride.status}`}>
                          {ride.status}
                        </span>
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(ride.created_at).toLocaleString()} {/* Updated field name */}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="no-history">You haven't taken any rides yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;