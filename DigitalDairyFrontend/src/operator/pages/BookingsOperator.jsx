import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllPreMilkBookings,
  updateBookingStatus,
} from '../../Redux/Slices/dairyActions';
import { getDairyDetails } from '../../Redux/Slices/dairyActions';

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
    <div className="flex justify-center items-center h-screen bg-amber-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-amber-200 rounded-full mb-4"></div>
        <p className="text-amber-800 font-medium">Loading bookings...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded animate-shake">
      <p>Error: {error}</p>
    </div>
  );

  return (
    <div className="px-4 py-12 bg-amber-50 min-h-screen animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-serif font-bold text-amber-900 mb-2">
            All Bookings for Your Dairy
          </h1>
          <div className="w-24 h-1 bg-amber-300 mx-auto rounded-full"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100 transform transition-all hover:shadow-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-amber-100">
              <thead className="bg-amber-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                    Farmer ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                    Update Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                    Payment
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-amber-50">
                {preMilkBookings.map((booking, index) => (
                  <tr 
                    key={booking.bookingId} 
                    className={`transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-amber-50'} hover:bg-amber-100`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-900">
                      {booking.bookingId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800">
                      {booking.farmerId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700 font-medium">
                      {booking.quantityLitres} L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'rejected' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <select
                          value={statusMap[booking.bookingId] || booking.status}
                          onChange={(e) =>
                            setStatusMap({ ...statusMap, [booking.bookingId]: e.target.value })
                          }
                          className="border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-300 bg-white transition-all"
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() =>
                            handleStatusChange(booking.bookingId, statusMap[booking.bookingId] || booking.status)
                          }
                          className="bg-amber-600 hover:bg-amber-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm transition-all transform hover:scale-105 active:scale-95"
                        >
                          Update
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {booking.paymentStatus === 'paid' ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Unpaid
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {preMilkBookings.length === 0 && (
          <div className="mt-8 p-8 bg-amber-100 rounded-xl border border-amber-200 text-center animate-pulse">
            <p className="text-amber-800 font-medium">No bookings found for your dairy.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsOperator;