import React from "react";
import "./DriverList.css";

const DriverList = ({ drivers, onSelect, selectedDriver }) => {
  return (
    <div className="driver-list">
      {drivers.map((driver) => (
        <div
          key={driver.driver_id}
          className={`driver-card card ${
            selectedDriver && selectedDriver.driver_id === driver.driver_id ? "selected" : ""
          }`}
          onClick={() => onSelect(driver)}
        >
          <div className="driver-info">
            <div className="driver-avatar">
              {driver.name ? driver.name.charAt(0).toUpperCase() : "D"}
            </div>
            <div className="driver-details">
              <h3>{driver.name || "Driver"}</h3>
              <div className="driver-rating">
                <span className="star">★</span> {parseFloat(driver.rating).toFixed(1)}
              </div>
              <p className="vehicle-info">
                {driver.vehicleModel} • {driver.vehicleColor}
              </p>
              <p className="license-plate">{driver.licensePlate}</p>
            </div>
          </div>
          {/* You might want to fetch the estimated fare dynamically based on some logic */}
          <div className="driver-price">
            <span className="price-label">Estimated fare</span>
            <span className="price-amount">${Math.floor(Math.random() * 30) + 10}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DriverList;