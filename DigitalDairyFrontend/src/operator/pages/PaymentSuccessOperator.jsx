import React from 'react';
import { useLocation } from 'react-router-dom';

const PaymentSuccessOperator = () => {
    const location = useLocation();
    const paymentDetails = location.state?.paymentDetails;
    const paymentFor = location.state?.paymentFor;

    return (
        <div className="payment-success">
            <h2>Payment Successful!</h2>
            <p>For: {paymentFor}</p>
            {paymentDetails && (
                <div className="payment-details">
                    <p>Payment ID: {paymentDetails.paymentId}</p>
                    <p>Amount: ${paymentDetails.amount}</p>
                    <p>Status: Completed</p>
                </div>
            )}
            <button onClick={() => window.location.href = '/dashboard'}>
                Return to Dashboard
            </button>
        </div>
    );
};

export default PaymentSuccessOperator;