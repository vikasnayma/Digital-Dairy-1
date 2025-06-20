import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentsByPayee } from "../../Redux/Slices/dairyActions"; 
// import { Spinner } from "./Spinner";

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

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 bg-white shadow rounded-2xl">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">
        Payments Received
      </h2>

        <>
          <div className="mb-6 text-lg font-medium text-green-700">
            Total Payment Received: ₹{totalReceived.toFixed(2)}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm text-gray-700">
              <thead className="bg-blue-100 text-left">
                <tr>
                  <th className="py-2 px-4 border-b">Payer ID</th>
                  <th className="py-2 px-4 border-b">Purpose</th>
                  <th className="py-2 px-4 border-b">Amount (₹)</th>
                  <th className="py-2 px-4 border-b">Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {payments?.map((payment, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{payment.payerId}</td>
                    <td className="py-2 px-4 border-b">{payment.paymentFor}</td>
                    <td className="py-2 px-4 border-b">₹{payment.amount}</td>
                    <td className="py-2 px-4 border-b">
                      {payment.paymentDate || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
    </div>
  );
};

export default RevenueFarmer;
