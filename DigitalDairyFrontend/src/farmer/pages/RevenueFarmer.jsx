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
    <div className="max-w-6xl mx-auto p-6 mt-16 bg-[#fefae0] text-[#3e2c23] rounded-3xl shadow-2xl">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-[#7f5539] tracking-wide">
        💰 Payments Received
      </h2>
  
      <div className="text-xl font-semibold text-green-700 text-center mb-8">
        Total Payment Received: ₹{totalReceived.toFixed(2)}
      </div>
  
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-[#ddd]">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-[#b08968] text-white">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Payer ID</th>
              <th className="px-6 py-3 text-left font-semibold">Purpose</th>
              <th className="px-6 py-3 text-left font-semibold">Amount (₹)</th>
              <th className="px-6 py-3 text-left font-semibold">Payment Date</th>
              <th className="px-6 py-3 text-center font-semibold">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee]">
            {payments?.length > 0 ? (
              payments.map((payment, idx) => (
                <tr key={idx} className="hover:bg-[#fefae0]/60 transition-all">
                  <td className="px-6 py-4">{payment.payerId}</td>
                  <td className="px-6 py-4">{payment.paymentFor}</td>
                  <td className="px-6 py-4">₹{payment.amount}</td>
                  <td className="px-6 py-4">
                    {payment.paymentDate || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => downloadInvoice(payment.paymentId)}
                      className="bg-[#7f5539] hover:bg-[#6e442f] text-white px-4 py-1 rounded-full text-sm shadow-sm transition duration-200"
                    >
                      Download Invoice
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-6 text-center text-[#7f5539]">
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
