import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllPreMilkBookings,
  updateBookingStatus,
  getDairyDetails
} from '../../Redux/Slices/dairyActions';
import { motion } from 'framer-motion';

const statusOptions = ['pending', 'confirmed', 'rejected'];

const BookingsOperator = () => {
  const dispatch = useDispatch();
  const { preMilkBookings, loading, error } = useSelector((state) => state.preMilkBookings);
  const { dairy } = useSelector((state) => state.dairy);
  const [statusMap, setStatusMap] = useState({});
  const dairyId = dairy.dairyId;

  useEffect(() => {
    dispatch(getDairyDetails());
  }, [dispatch]);

  useEffect(() => {
    if (dairyId) dispatch(fetchAllPreMilkBookings(dairyId));
  }, [dispatch, dairyId]);

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateBookingStatus(id, newStatus));
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-green-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-green-200 rounded-full mb-4"></div>
        <p className="text-green-700 font-medium">Loading bookings...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded animate-shake">
      <p>Error: {error}</p>
    </div>
  );

  return (
    <motion.div 
      className="px-4 py-12 min-h-screen transition-colors duration-500"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-8xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl mt-12 font-bold text-green-800 mb-2">
            All Bookings for Your Dairy
          </h1>
          <div className="w-24 h-1 bg-green-300 mx-auto rounded-full"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-green-100">
              <thead className="bg-green-600">
                <tr>
                  {['Booking ID', 'Farmer ID', 'Quantity', 'Status', 'Update Status', 'Payment'].map((head) => (
                    <th 
                      key={head} 
                      className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-green-100">
                {preMilkBookings.map((booking, index) => (
                  <motion.tr 
                    key={booking.bookingId} 
                    className="transition-all hover:bg-green-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {booking.bookingId}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {booking.farmerId}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 font-medium">
                      {booking.quantityLitres} L
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full capitalize ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <select
                          value={statusMap[booking.bookingId] || booking.status}
                          onChange={(e) =>
                            setStatusMap({ ...statusMap, [booking.bookingId]: e.target.value })
                          }
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <button
                          onClick={() =>
                            handleStatusChange(booking.bookingId, statusMap[booking.bookingId] || booking.status)
                          }
                          className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg shadow-md transition-colors"
                        >
                          Update
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {booking.paymentStatus === 'paid' ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          ✔ Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          ✖ Unpaid
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {preMilkBookings.length === 0 && (
          <div className="mt-8 p-8 bg-green-100 rounded-xl border border-green-200 text-center">
            <p className="text-green-800 font-medium">No bookings found for your dairy.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BookingsOperator;