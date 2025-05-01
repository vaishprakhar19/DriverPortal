import React, { useState, useEffect } from "react";
import "./DriverList.css";

const DriverList = ({ drivers, onSelect, selectedDriver , driverPrices}) => {

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
              {driver.driver_name ? driver.driver_name.charAt(0).toUpperCase() : "D"}
            </div>
            <div className="driver-details">
              <h3>{driver.driver_name || "Driver"}</h3>
              <div className="driver-rating">
                <span className="star">★</span> {parseFloat(driver.rating).toFixed(1)}
              </div>
              <p className="vehicle-info">
                {driver.vehicleModel} • {driver.vehicleColor}
              </p>
              <p className="license-plate">{driver.licensePlate}</p>
            </div>
          </div>
          <div className="driver-price">
            <span className="price-label">Estimated fare</span>
            <span className="price-amount">₹{driverPrices[driver.driver_id]}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DriverList;