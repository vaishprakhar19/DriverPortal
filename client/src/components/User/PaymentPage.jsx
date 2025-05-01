import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import "./PaymentPage.css";

const PaymentPage = () => {
  const [isPaid, setIsPaid] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to get location
  const { estimatedPrice } = location.state || {}; // Access state from location

  const handlePayment = () => {
    setIsPaid(true);
    setTimeout(() => {
      navigate("/user"); // Navigate back to the dashboard after 2 seconds
    }, 2000);
  };

  return (
    <div className="payment-page">
      {!isPaid ? (
        <div className="payment-card">
          <h2>Payment for Your Ride</h2>
          <p>Price: ₹{estimatedPrice}</p> 
          <button className="btn-success" onClick={handlePayment}>
            Pay
          </button>
        </div>
      ) : (
        <div className="confirmation-message">
          <h2>Booking Confirmed!</h2>
          <p>Your payment was successful. Redirecting to the dashboard...</p>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
