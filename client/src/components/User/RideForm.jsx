"use client"
import "./RideForm.css"

const RideForm = ({ pickup, setPickup, destination, setDestination, onSubmit }) => {
  return (
    <form className="ride-form card" onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="pickup">Pickup Location</label>
        <input
          type="text"
          id="pickup"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          placeholder="Enter pickup location"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="destination">Destination</label>
        <input
          type="text"
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter destination"
          required
        />
      </div>

      <button type="submit" className="btn-primary find-drivers-btn">
        Find Drivers
      </button>
    </form>
  )
}

export default RideForm
