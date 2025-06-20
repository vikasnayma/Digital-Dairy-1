import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccessOperator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentDetails, paymentFor } = location.state || {};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10 max-w-xl w-full text-center">
        <div className="text-green-600 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h2>

        <p className="text-lg text-gray-600 mb-6">
          Your payment for <span className="font-semibold text-blue-700">{paymentFor}</span> has been completed.
        </p>

        {paymentDetails && (
          <div className="bg-gray-50 rounded-xl p-5 shadow-inner text-left text-gray-700 space-y-2 mb-6">
            <p><span className="font-semibold">Payment ID:</span> {paymentDetails.paymentId}</p>
            <p><span className="font-semibold">Amount:</span> ₹{paymentDetails.amount}</p>
            <p><span className="font-semibold">Status:</span> <span className="text-green-700 font-medium">Completed</span></p>
          </div>
        )}

        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-200 shadow"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessOperator;
