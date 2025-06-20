
import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const MilkExportationPayment = () => {
  const user = JSON.parse(localStorage.getItem("authUser"));
  const payerId = user.userId;

  const { state } = useLocation();
  const { exportId , amount } = state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const navigate = useNavigate();

  if (!exportId || !amount) {
    return <div className="text-red-500 text-center mt-10">Missing payment details.</div>;
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
      const response = await axios.post(`http://localhost:8080/api/payments/exportation-payment/capture?orderId=${data.orderID}`, {
        orderId: data.orderID,
        payerId: payerId,
        payeeId: 1,
        amount: amount,
        paymentFor: "milk_export",
        referenceIds: [exportId],
      });                                                                                                              

      if (response.data.status === 'success') {
        setSuccess(true);
        setShowPayment(false);
        navigate('/dashboard/payment-success-operator', {
          state: {
            paymentDetails: response.data,
            paymentFor: 'milk_export'
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

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded space-y-6">
      <h2 className="text-2xl font-bold text-blue-800">Milk Collection Payment</h2>

      <div className="text-lg">
        <p><strong>Exportation Id : </strong> {exportId}</p>
        <p><strong>Amount to Pay:</strong> ₹{amount}</p>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p className="text-blue-600">Processing Payment...</p>}

      {!showPayment && !success && (
        <button
          onClick={() => setShowPayment(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Pay Now
        </button>
      )}

      {showPayment && (
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
              setError('Payment was cancelled.');
            }}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
};

export default MilkExportationPayment;


