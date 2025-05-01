import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentPage.css";

const PaymentPage = ({estimatedPrice}) => {
  const [isPaid, setIsPaid] = useState(false);
  const navigate = useNavigate();

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
          <p>Price: {estimatedPrice}</p> 
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
