import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import RideForm from "./RideForm";
import DriverList from "./DriverList";
import "./UserDashboard.css";

const UserDashboard = ({ onLogout }) => {
  const { userId, user } = useContext(AppContext);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [showDrivers, setShowDrivers] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]); // New state for filtered rides
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeRide, setActiveRide] = useState(null);
  const [driverPrices, setDriverPrices] = useState({}); // State for driver prices


  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      loadRides()
        .then(() => console.log("Rides loaded successfully"))
        .catch((err) => console.error("Error loading rides:", err));
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      setFilteredRides(rides.filter((ride) => ride.user_id === userId)); // Update filtered rides when rides or userId changes
    }
  }, [rides, userId]);

  useEffect(() => {
    // Generate random prices for each driver
    const prices = {};
    drivers.forEach((driver) => {
      prices[driver.driver_id] = Math.floor(Math.random() * 100) + 70;
    });
    setDriverPrices(prices);
  }, [drivers]);

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

  console.log("New Ride:", selectedDriver);
  const confirmBooking = async () => {
    if (!selectedDriver || !userId) return;
    setLoading(true);
    setError("");

    const estimatedPrice = driverPrices[selectedDriver.driver_id]; // Use the calculated price
    const newRide = {
      pickup,
      destination,
      price: estimatedPrice,
      driverName: selectedDriver.driver_name,
      status: "active",
      userName: user.displayName,
    };

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
          driverName: selectedDriver.driver_name,
          userName: user.displayName,
          status: "active",
          driverId: selectedDriver.driver_id,
        }),
      });

      setActiveRide(newRide);
      // setBookingConfirmed(true);
      navigate("/payment", { state: { estimatedPrice } })
      setShowDrivers(false);
    } catch (err) {
      setError("Failed to book ride. Please try again.");
      console.error("Error booking ride:", err);
    } finally {
      setLoading(false);
    }
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
          <>
          <button className="btn-danger">Book Another</button>
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
              <p>
                <strong>Driver:</strong> {activeRide.driverName}
              </p>
            </div>
          </div>
          </>
        ) : (
          <>
            {!bookingConfirmed && (
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
                          driverPrices={driverPrices} // Pass driver prices to DriverList
                        />
                        {selectedDriver && (
                          <div className="booking-actions">
                            <p>
                              <strong>Estimated Fare:</strong> ₹{driverPrices[selectedDriver.driver_id]}
                            </p>
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
            )}
          </>
        )}

        <div className="ride-history-section">
          <h2>Your Ride History</h2>
          {loading && !filteredRides.length > 0 ? (
            <p>Loading ride history...</p>
          ) : filteredRides.length > 0 ? (
            <div className="ride-history-list">
              {filteredRides.map((ride) => (
                <div key={ride.id} className="ride-history-item card"> {/* Updated key to use `id` */}
                  <div className="ride-history-details">
                    <p>
                      <strong>From:</strong> {ride.pickup_address} {/* Updated field name */}
                    </p>
                    <p>
                      <strong>To:</strong> {ride.destination_address} {/* Updated field name */}
                    </p>
                    <p>
                      <strong>Price:</strong> ₹{ride.price}
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