import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from "framer-motion";

const PreBookingPayment = () => {
  const user = JSON.parse(localStorage.getItem("authUser"));
  const payerId = user.userId;

  const { bookingId } = useParams();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const navigate = useNavigate();

  if (!bookingId) {
    return (
      <div className="text-center mt-10 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg max-w-md mx-auto">
        <p className="font-medium">Missing booking ID.</p>
      </div>
    );
  }

  const createOrder = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/payments/create', {
        amount: amount
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      return response.data.id; // PayPal order ID
    } catch (err) {
      console.error('Error creating order:', err);
      setError("Failed to create PayPal order.");
      throw err;
    }
  };

  const onApprove = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:8080/api/payments/pre-booking-payment/capture?orderId=${data.orderID}`, {
        orderId: data.orderID,
        payerId: payerId,
        payeeId: 1,
        amount: amount,
        paymentFor: "pre_booking",
        referenceIds: [bookingId] // Wrap in array if expecting list
      });

      if (response.data.status === 'success') {
        setSuccess(true);
        setShowPayment(false);
        navigate('/dashboard/payment-success-operator', {
          state: {
            paymentDetails: response.data,
            paymentFor: 'pre_booking'
          }
        });
      } else {
        setError('Payment capture failed. Please try again.');
      }

    } catch (err) {
      console.error('Error capturing payment:', err);
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (!isNaN(val)) {
      setAmount(val);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto mt-8 sm:mt-12 bg-white border border-green-200 rounded-2xl p-6 sm:p-8 shadow-lg"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-800 mb-6 pb-2 border-b border-green-200">
        🥛 Milk Collection Payment
      </h2>

      <div className="space-y-4 text-gray-800">
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <p className="font-medium text-green-700">👤 Payer ID: <span className="font-normal text-gray-800">{payerId}</span></p>
          <p className="font-medium text-green-700 mt-2">📦 Booking ID: <span className="font-normal text-gray-800">{bookingId}</span></p>
        </div>

        <div className="mt-6">
          <label className="block mb-2 text-sm font-medium text-green-700">Enter Amount (₹):</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={handleAmountChange}
            className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm"
            placeholder="Enter payment amount"
            required
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {loading && (
        <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 text-blue-700 rounded-lg">
          <p className="font-medium">⏳ Processing Payment...</p>
        </div>
      )}

      {!showPayment && !success && (
        <div className="mt-6">
          <button
            onClick={() => {
              if (amount && parseFloat(amount) > 0) {
                setShowPayment(true);
                setError(null);
              } else {
                setError("Please enter a valid amount.");
              }
            }}
            className={`w-full py-3 px-4 text-white font-semibold rounded-lg transition duration-300 shadow-md ${
              !amount ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            💳 Pay Now
          </button>
        </div>
      )}

      {showPayment && (
        <div className="mt-6 border border-green-200 rounded-lg shadow-inner p-4 bg-green-50">
          <PayPalScriptProvider options={{ "client-id": "AdM0I7Z4hbUK6yPDVTN0apHNzL8g5fzIPLOsBlWCxHdMs47lO4iFeR5Zb4qz1_z_NAXJPJgNHDzFlPCV", currency: "USD" }}>
            <PayPalButtons
              style={{ layout: "vertical", color: "gold" }}
              createOrder={createOrder}
              onApprove={onApprove}
              onError={(err) => {
                console.error("PayPal error:", err);
                setError("Something went wrong during PayPal transaction.");
              }}
              onCancel={() => {
                setShowPayment(false);
                setError("Payment was cancelled.");
              }}
            />
          </PayPalScriptProvider>
        </div>
      )}
    </motion.div>
  );
};

export default PreBookingPayment;