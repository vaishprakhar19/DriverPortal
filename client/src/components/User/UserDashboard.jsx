"use client"

import { useState } from "react"
import RideForm from "./RideForm"
import DriverList from "./DriverList"
import "./UserDashboard.css"

// Mock data for available drivers
const mockDrivers = [
  { id: 1, name: "John Doe", rating: 4.8, vehicle: "Toyota Camry", price: 25 },
  { id: 2, name: "Jane Smith", rating: 4.9, vehicle: "Honda Civic", price: 22 },
  { id: 3, name: "Mike Johnson", rating: 4.7, vehicle: "Ford Focus", price: 20 },
  { id: 4, name: "Sarah Williams", rating: 4.6, vehicle: "Hyundai Sonata", price: 23 },
  { id: 5, name: "David Brown", rating: 4.9, vehicle: "Chevrolet Malibu", price: 24 },
]

const UserDashboard = ({ onLogout }) => {
  const [pickup, setPickup] = useState("")
  const [destination, setDestination] = useState("")
  const [showDrivers, setShowDrivers] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  const handleRideSubmit = (e) => {
    e.preventDefault()
    if (pickup && destination) {
      setShowDrivers(true)
    }
  }

  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver)
  }

  const confirmBooking = () => {
    setBookingConfirmed(true)
    setShowDrivers(false)
  }

  const newRide = () => {
    setPickup("")
    setDestination("")
    setShowDrivers(false)
    setSelectedDriver(null)
    setBookingConfirmed(false)
  }

  return (
    <div className="user-dashboard">
      <header className="header">
        <h1>Ride Booking Portal</h1>
        <button className="btn-danger" onClick={onLogout}>
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        {!bookingConfirmed ? (
          <>
            <div className="ride-section">
              <h2>Book a Ride</h2>
              <RideForm
                pickup={pickup}
                setPickup={setPickup}
                destination={destination}
                setDestination={setDestination}
                onSubmit={handleRideSubmit}
              />
            </div>

            {showDrivers && (
              <div className="drivers-section">
                <h2>Available Drivers</h2>
                <DriverList drivers={mockDrivers} onSelect={handleDriverSelect} selectedDriver={selectedDriver} />
                {selectedDriver && (
                  <div className="booking-actions">
                    <button className="btn-success" onClick={confirmBooking}>
                      Confirm Booking
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="booking-confirmed card">
            <div className="confirmation-message">
              <h2>Booking Confirmed!</h2>
              <p>
                Your ride from <strong>{pickup}</strong> to <strong>{destination}</strong> has been booked.
              </p>
              <p>
                Driver: <strong>{selectedDriver.name}</strong>
              </p>
              <p>
                Vehicle: <strong>{selectedDriver.vehicle}</strong>
              </p>
              <p>
                Estimated fare: <strong>${selectedDriver.price}</strong>
              </p>
              <button className="btn-primary" onClick={newRide}>
                Book Another Ride
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard
