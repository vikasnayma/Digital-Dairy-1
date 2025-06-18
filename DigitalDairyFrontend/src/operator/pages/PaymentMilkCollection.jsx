
import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PaymentMilkCollection = () => {
    const user = JSON.parse(localStorage.getItem("authUser"));
    const payerId = user.userId;
    const { farmerId, collectionId } = useParams();
    
    const [amount, setAmount] = useState(0);
    const [payeeId, setPayeeId] = useState(null);
    const [paymentFor, setPaymentFor] = useState('');
    const [referenceId, setReferenceId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [showPayment, setShowPayment] = useState(false);  // New State to control payment UI

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8080/api/milk-collections/collection/${collectionId}`);
                setAmount(response.data.totalAmount);
                setPayeeId(farmerId);
                setPaymentFor(`Milk Collection ${response.data.collectionId}`);
                setReferenceId(response.data.collectionId);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentDetails();
    }, [collectionId, farmerId]);

    const createOrder = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/payments/create', {
                payerId: payerId,
                payeeId: payeeId,
                paymentFor: paymentFor,
                referenceId: referenceId,
                amount: amount
            } ,{
                headers: {
                    'Content-Type': 'application/json'
                }});
            return response.data.id;
        } catch (err) {
            console.error('Error creating order:', err);
            throw err;
        }
    };

    const onApprove = async (data, actions) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/payments/execute`, {
                params: {
                    paymentId: data.paymentID,
                    PayerID: data.payerID,
                    payerId: payerId,
                    payeeId: payeeId,
                    amount: amount,
                    paymentFor: paymentFor,
                    referenceId: referenceId
                }
            });

            if (response.data.status === 'success') {
                setSuccess(true);
                setShowPayment(false);  // Hide PayPal button after payment
                navigate('/dashboard/payment-success-operator', {
                    state: {
                        paymentDetails: response.data,
                        paymentFor: paymentFor
                    }
                });
            }
        } catch (err) {
            console.error('Error capturing payment:', err);
            setError('Payment failed. Please try again.');
        }
    };

    if (loading) return <div>Loading payment details...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="payment-container max-w-xl mx-auto p-6 bg-white shadow rounded mt-10 space-y-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Payment for {paymentFor}</h2>
            
            <div className="space-y-2 text-lg">
                <p><strong>Reference ID:</strong> {referenceId}</p>
                <p><strong>Amount to Pay:</strong> ₹{amount}</p>
            </div>

            {!showPayment && !success && (
                <button
                    onClick={() => setShowPayment(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    Pay Now
                </button>
            )}

            {showPayment && (
                <PayPalScriptProvider options={{ "client-id": "AfJNYV8fPGVUG2ly51jSLruzcmj-wMljfhHE1u-3dON1E83xJbwF0baFDRj1_c8OwOntRXFOgQq3dp88", currency: "USD" }}>
                    <PayPalButtons
                        style={{ layout: "vertical" }}
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={(err) => setError(err.toString())}
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

export default PaymentMilkCollection;



// import React, { useState, useEffect } from 'react';
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';

// const PaymentMilkCollection = () => {

//     const user = JSON.parse(localStorage.getItem("authUser"));
//     const payerId = user.userId;
//     const { farmerId , collectionId } = useParams();
//     const [amount, setAmount] = useState(0);
//     const [payeeId, setPayeeId] = useState(null); // Farmer ID
//     const [paymentFor, setPaymentFor] = useState('');
//     const [referenceId, setReferenceId] = useState(null); // Milk collection ID
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(false);

//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchPaymentDetails = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get(`http://localhost:8080/api/milk-collections/collection/${collectionId}`);
//                 setAmount(response.data.amount);
//                 setPayeeId(farmerId);
//                 setPaymentFor(`Milk Collection ${response.data.collectionId}`);
//                 setReferenceId(response.data.collectionId);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
        
//         fetchPaymentDetails();
//     }, [collectionId , farmerId]);

//     const createOrder = async () => {
//         try {
//             const response = await axios.post('http://localhost:8080/api/payments/create', {
//                 payerId: payerId,
//                 payeeId: payeeId,
//                 paymentFor: paymentFor,
//                 referenceId: referenceId,
//                 amount: amount
//             });
            
//             return response.data.id; // PayPal order ID
//         } catch (err) {
//             console.error('Error creating order:', err);
//             throw err;
//         }
//     };

//     const onApprove = async (data, actions) => {
//         try {
//             const response = await axios.get(`http://localhost:8080/api/payments/execute`, {
//                 params: {
//                     paymentId: data.paymentID,
//                     PayerID: data.payerID,
//                     payerId: payerId,
//                     payeeId: payeeId,
//                     amount: amount,
//                     paymentFor: paymentFor,
//                     referenceId: referenceId
//                 }
//             });
            
//             if (response.data.status === 'success') {
//                 setSuccess(true);
//                 navigate('/dashboard/payment-success-operator', { 
//                     state: { 
//                         paymentDetails: response.data,
//                         paymentFor: paymentFor
//                     } 
//                 });
//             }
//         } catch (err) {
//             console.error('Error capturing payment:', err);
//             setError('Payment failed. Please try again.');
//         }
//     };

//     if (loading) return <div>Loading payment details...</div>;
//     if (error) return <div>Error: {error}</div>;

//     return (
//         <div className="payment-container">
//             <h2>Payment for {paymentFor}</h2>
//             <div className="payment-details">
//                 <p>Reference ID: {referenceId}</p>
//                 <p>Amount to Pay: ${amount}</p>
//             </div>
            
//             {!success && (
//                 <PayPalScriptProvider 
//                     options={{ 
//                         "client-id": "YOUR_PAYPAL_CLIENT_ID",
//                         currency: "USD"
//                     }}
//                 >
//                     <PayPalButtons
//                         style={{ layout: "vertical" }}
//                         createOrder={createOrder}
//                         onApprove={onApprove}
//                         onError={(err) => setError(err.toString())}
//                         onCancel={() => navigate('/payment/cancel')}
//                     />
//                 </PayPalScriptProvider>
//             )}
//         </div>
//     );
// };

// export default PaymentMilkCollection;