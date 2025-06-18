// src/components/BookingsOperator.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllPreMilkBookings,
  updateBookingStatus,
  updatePaymentStatus,
} from '../../Redux/Slices/dairyActions';
import { getDairyDetails } from '../../Redux/Slices/dairyActions';

const statusOptions = ['pending', 'confirmed', 'rejected'];
const paymentOptions = ['unpaid', 'paid'];

const BookingsOperator = () => {
  const dispatch = useDispatch();
  const { preMilkBookings, loading, error } = useSelector((state) => state.preMilkBookings);
  const { dairy } = useSelector((state) => state.dairy);
  const [statusMap, setStatusMap] = useState({});
  const [paymentMap, setPaymentMap] = useState({});
  const dairyId = dairy.dairyId;

   useEffect(() => {
      dispatch(getDairyDetails());
    }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllPreMilkBookings(dairyId));
  }, [dispatch, dairyId]);

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateBookingStatus(id, newStatus ));
  };

  const handlePaymentChange = (id, newPaymentStatus) => {
    dispatch(updatePaymentStatus(id, newPaymentStatus ));
  };

  if (loading) return <div className="text-center mt-4">Loading bookings...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="px-6 py-16 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">
        All Bookings for Your Dairy
      </h1>
  
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-blue-50 text-gray-800 uppercase text-sm tracking-wider">
            <tr>
              <th className="py-3 px-4 text-left border-b">Booking ID</th>
              <th className="py-3 px-4 text-left border-b">Farmer ID</th>
              <th className="py-3 px-4 text-left border-b">Quantity</th>
              <th className="py-3 px-4 text-left border-b">Status</th>
              <th className="py-3 px-4 text-left border-b">Update Status</th>
              <th className="py-3 px-4 text-left border-b">Payment</th>
              <th className="py-3 px-4 text-left border-b">Update Payment</th>
            </tr>
          </thead>
          <tbody>
            {preMilkBookings.map((booking, index) => (
              <tr
                key={booking.bookingId}
                className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="py-3 px-4 font-medium text-gray-700">{booking.bookingId}</td>
                <td className="py-3 px-4 text-gray-600">{booking.farmerId}</td>
                <td className="py-3 px-4 text-gray-600">{booking.quantityLitres} L</td>
                <td className="py-3 px-4 capitalize text-gray-700">{booking.status}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <select
                      value={statusMap[booking.bookingId] || booking.status}
                      onChange={(e) =>
                        setStatusMap({ ...statusMap, [booking.bookingId]: e.target.value })
                      }
                      className="border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() =>
                        handleStatusChange(booking.bookingId, statusMap[booking.bookingId])
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded shadow-sm transition"
                    >
                      Update
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4 capitalize text-gray-700">{booking.paymentStatus}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <select
                      value={paymentMap[booking.bookingId] || booking.paymentStatus}
                      onChange={(e) =>
                        setPaymentMap({ ...paymentMap, [booking.bookingId]: e.target.value })
                      }
                      className="border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      {paymentOptions.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() =>
                        handlePaymentChange(booking.bookingId, paymentMap[booking.bookingId])
                      }
                      className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded shadow-sm transition"
                    >
                      Update
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
};

export default BookingsOperator;

