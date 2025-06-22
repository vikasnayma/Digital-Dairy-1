import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

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
    return <div className="text-red-500 text-center mt-10">Missing booking ID.</div>;
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
    <div className="max-w-xl mx-auto mt-16 bg-white border border-gray-200 shadow-2xl rounded-3xl px-8 py-10 space-y-6">
  <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
    💰 Milk Collection Payment
  </h2>

  <div className="space-y-3 text-gray-800 text-base sm:text-lg">
    <p><span className="font-semibold text-blue-700">👤 Payer ID:</span> {payerId}</p>
    <p><span className="font-semibold text-blue-700">📦 Booking ID:</span> {bookingId}</p>

    <div>
      <label className="block mb-1 text-sm font-semibold text-gray-700">Enter Amount (₹):</label>
      <input
        type="number"
        min="1"
        value={amount}
        onChange={handleAmountChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        placeholder="Enter payment amount"
        required
      />
    </div>
  </div>

  {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
  {loading && <p className="text-blue-600 text-sm font-medium">⏳ Processing Payment...</p>}

  {!showPayment && !success && (
    <div>
      <button
        onClick={() => {
          if (amount && parseFloat(amount) > 0) {
            setShowPayment(true);
            setError(null);
          } else {
            setError("❗ Please enter a valid amount.");
          }
        }}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-3 rounded-xl transition duration-300 shadow-md"
      >
        💳 Pay Now
      </button>
    </div>
  )}

  {showPayment && (
    <div className="mt-6 border border-gray-200 rounded-xl shadow-inner p-4">
      <PayPalScriptProvider options={{ "client-id": "AdM0I7Z4hbUK6yPDVTN0apHNzL8g5fzIPLOsBlWCxHdMs47lO4iFeR5Zb4qz1_z_NAXJPJgNHDzFlPCV", currency: "USD" }}>
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(err) => {
            console.error("PayPal error:", err);
            setError("Something went wrong during PayPal transaction.");
          }}
          onCancel={() => {
            setShowPayment(false);
            setError("⚠️ Payment was cancelled.");
          }}
        />
      </PayPalScriptProvider>
    </div>
  )}
</div>

  );
};

export default PreBookingPayment;
