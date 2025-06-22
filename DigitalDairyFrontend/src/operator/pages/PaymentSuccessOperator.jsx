import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccessOperator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentDetails, paymentFor } = location.state || {};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 px-4 animate-fade-in">
      <div className="bg-amber-50 rounded-3xl shadow-xl p-8 md:p-10 max-w-xl w-full text-center border border-amber-200 animate-fade-in-up">
        <div className="text-green-600 mb-6 animate-bounce">
          <svg
            className="w-20 h-20 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-stone-800 mb-4">
          Payment Successful!
        </h2>

        <p className="text-lg text-stone-600 mb-6">
          Your payment for{' '}
          <span className="font-semibold text-amber-700 capitalize">
            {paymentFor?.replace('_', ' ')}
          </span>{' '}
          has been completed successfully.
        </p>

        {paymentDetails && (
          <div className="bg-amber-100/30 rounded-xl p-5 shadow-inner text-left text-stone-700 space-y-3 mb-8 animate-fade-in">
            <p className="flex gap-2">
              <span className="font-semibold min-w-[100px]">Payment ID:</span>
              <span className="font-mono">{paymentDetails.paymentId}</span>
            </p>
            <p className="flex gap-2">
              <span className="font-semibold min-w-[100px]">Amount:</span>
              <span className="font-bold text-amber-700">₹{paymentDetails.amount}</span>
            </p>
            <p className="flex gap-2">
              <span className="font-semibold min-w-[100px]">Status:</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                Completed
              </span>
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-amber-700 hover:bg-amber-800 text-amber-50 font-semibold py-3 px-8 rounded-xl 
                      transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95
                      focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
          >
            Return to Dashboard
          </button>
          <button
            onClick={() => navigate('/dashboard/milk-collection-operator')}
            className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold py-3 px-8 rounded-xl 
                      transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95
                      border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
          >
            View Collections
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessOperator;