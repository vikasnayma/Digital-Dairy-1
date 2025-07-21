import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentsByPayee } from "../../Redux/Slices/dairyActions"; 
import axios from "axios";

const RevenueFarmer = () => {
  const dispatch = useDispatch();

  const { payments } = useSelector((state) => state.payments);

  useEffect(() => {
    dispatch(fetchPaymentsByPayee());
  }, [dispatch]);

  const totalReceived = payments?.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );

  const downloadInvoice = async (paymentId) => {
    try {
      const response = await axios.get(
        `/api/payments/${paymentId}/invoice`,
        { responseType: 'blob' } 
      );

      const blob = new Blob([response.data], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download invoice:", error);
      alert("Unable to download invoice. Please try again later.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-20 p-4 sm:p-6 mt-8 bg-white rounded-lg shadow-md border border-green-50">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-green-800 tracking-wide">
        💰 Payments Received
      </h2>
  
      <div className="text-lg sm:text-xl font-semibold text-green-700 text-center mb-8 p-4 bg-green-50 rounded-lg">
        Total Payment Received: ₹{totalReceived?.toFixed(2) || '0.00'}
      </div>
  
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-green-100">
        <table className="min-w-full divide-y divide-green-100 text-sm">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Payer ID</th>
              <th className="px-4 py-3 text-left font-medium">Purpose</th>
              <th className="px-4 py-3 text-left font-medium">Amount (₹)</th>
              <th className="px-4 py-3 text-left font-medium">Payment Date</th>
              <th className="px-4 py-3 text-center font-medium">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-50">
            {payments?.length > 0 ? (
              payments.map((payment, idx) => (
                <tr key={idx} className="hover:bg-green-50 transition-all">
                  <td className="px-4 py-3 whitespace-nowrap">{payment.payerId}</td>
                  <td className="px-4 py-3">{payment.paymentFor}</td>
                  <td className="px-4 py-3 font-medium">₹{payment.amount}</td>
                  <td className="px-4 py-3">
                    {payment.paymentDate || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => downloadInvoice(payment.paymentId)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm shadow-sm transition duration-200"
                    >
                      Download Invoice
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-green-700">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RevenueFarmer;