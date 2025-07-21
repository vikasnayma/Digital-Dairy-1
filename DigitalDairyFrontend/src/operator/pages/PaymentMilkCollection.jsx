import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const PaymentMilkCollection = () => {
  const user = JSON.parse(localStorage.getItem("authUser"));
  const payerId = user.userId;

  const { farmerId } = useParams();
  const { state } = useLocation();
  const { referenceIds, amount } = state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const navigate = useNavigate();

  if (!referenceIds || !amount) {
    return (
      <div className="text-red-600 bg-green-50 p-4 rounded-lg border border-green-200 max-w-md mx-auto mt-10 animate-fade-in">
        Missing payment details.
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

      return response.data.id;
    } catch (err) {
      console.error('Error creating order:', err);
      setError("Failed to create PayPal order.");
      throw err;
    }
  };

  const onApprove = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:8080/api/payments/capture?orderId=${data.orderID}`, {
        orderId: data.orderID,
        payerId: payerId,
        payeeId: farmerId,
        amount: amount,
        paymentFor: "milk_collection",
        referenceIds: referenceIds
      });

      if (response.data.status === 'success') {
        setSuccess(true);
        setShowPayment(false);
        setTimeout(() => {
          navigate('/dashboard/payment-success-operator', {
            state: {
              paymentDetails: response.data,
              paymentFor: 'milk_collection'
            }
          });
        }, 1500); // Delay for success animation
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
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg border border-green-200 space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-green-800 pb-2 border-b border-green-200">
        Milk Collection Payment
      </h2>

      <div className="space-y-3 bg-green-50 p-4 rounded-lg">
        <p className="flex items-center gap-2">
          <span className="font-semibold text-gray-700 min-w-[120px]">Farmer ID:</span>
          <span className="text-gray-600">{farmerId}</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-semibold text-gray-700 min-w-[120px]">Collections:</span>
          <span className="text-gray-600">{referenceIds.length}</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="font-semibold text-gray-700 min-w-[120px]">Amount:</span>
          <span className="text-xl font-bold text-green-600">₹{amount}</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 animate-shake">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center gap-2 py-4">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-green-700 font-medium">Processing Payment...</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 animate-pulse">
          <p className="text-green-700 font-medium">Payment successful! Redirecting...</p>
        </div>
      )}

      {!showPayment && !success && !loading && (
        <button
          onClick={() => setShowPayment(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium
                    transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Proceed to Payment
        </button>
      )}

      {showPayment && (
        <div className="animate-fade-in">
          <PayPalScriptProvider options={{ "client-id": "AdM0I7Z4hbUK6yPDVTN0apHNzL8g5fzIPLOsBlWCxHdMs47lO4iFeR5Zb4qz1_z_NAXJPJgNHDzFlPCV", currency: "USD" }}>
            <PayPalButtons
              style={{ 
                layout: "vertical",
                color: "gold",
                shape: "pill",
                label: "pay",
                height: 45
              }}
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
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className="text-gray-600 hover:text-gray-800 font-medium transition-all
                  hover:underline flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to previous page
      </button>
    </div>
  );
};

export default PaymentMilkCollection;