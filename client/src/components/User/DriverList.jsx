"use client"
import "./DriverList.css"

const DriverList = ({ drivers, onSelect, selectedDriver }) => {
  return (
    <div className="driver-list">
      {drivers.map((driver) => (
        <div
          key={driver.id}
          className={`driver-card card ${selectedDriver && selectedDriver.id === driver.id ? "selected" : ""}`}
          onClick={() => onSelect(driver)}
        >
          <div className="driver-info">
            <div className="driver-avatar">{driver.name.charAt(0)}</div>
            <div className="driver-details">
              <h3>{driver.name}</h3>
              <div className="driver-rating">
                <span className="star">★</span> {driver.rating}
              </div>
              <p className="vehicle-info">{driver.vehicle}</p>
            </div>
          </div>
          <div className="driver-price">
            <span className="price-amount">${driver.price}</span>
            <span className="price-label">Estimated fare</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DriverList
