import React, { useState, useContext } from "react";
import axios from "axios";
import "./DriverRegistration.css";
import { AppContext } from "../../AppContext";

const DriverRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    vehicleModel: "",
    vehicleColor: "",
    licensePlate: "",
    serviceArea: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { userId } = useContext(AppContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  console.log(userId, "in driverreg");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/drivers", { ...formData, driverId: userId });
      setSuccessMessage("Driver registered successfully!");
      setErrorMessage("");
      setFormData({
        name: "",
        vehicleModel: "",
        vehicleColor: "",
        licensePlate: "",
        serviceArea: "",
      });
      window.location.href = "/driver"; // Redirect to /driver after registration
    } catch (error) {
      setErrorMessage("Failed to register driver. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="driver-registration">
      <h2>Driver Registration</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="vehicleModel">Vehicle Model</label>
          <input
            type="text"
            id="vehicleModel"
            name="vehicleModel"
            value={formData.vehicleModel}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="vehicleColor">Vehicle Color</label>
          <input
            type="text"
            id="vehicleColor"
            name="vehicleColor"
            value={formData.vehicleColor}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="licensePlate">License Plate</label>
          <input
            type="text"
            id="licensePlate"
            name="licensePlate"
            value={formData.licensePlate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="serviceArea">Service Area</label>
          <input
            type="text"
            id="serviceArea"
            name="serviceArea"
            value={formData.serviceArea}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn-primary">Register</button>
      </form>
    </div>
  );
};

export default DriverRegistration;