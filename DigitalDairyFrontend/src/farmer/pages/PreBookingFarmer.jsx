
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPreMilkBooking,
  fetchAllPreMilkBookingsByFarmer,
} from "../../Redux/Slices/dairyActions";

const PreBookingFarmer = () => {
  const user = JSON.parse(localStorage.getItem("authUser"));
  const farmerId = user.userId;
  const dairyId = user.dairyId;
  const dispatch = useDispatch();
  const { loading, error, success, preMilkBookings } = useSelector(
    (state) => state.preMilkBookings
  );

  const [formData, setFormData] = useState({
    farmerId,
    dairyId,
    bookingDate: "",
    shift: "morning",
    quantityLitres: "",
  });

  useEffect(() => {
    dispatch(fetchAllPreMilkBookingsByFarmer());
  }, [dispatch, success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createPreMilkBooking(formData));
    setFormData({
      farmerId,
      dairyId: "",
      bookingDate: "",
      shift: "morning",
      quantityLitres: "",
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 sm:px-8 py-16 bg-white rounded-3xl shadow-2xl mt-12">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10 tracking-tight">
        Pre-Milk Booking Form
      </h2>
  
      {success && (
        <div className="bg-green-50 border border-green-300 text-green-700 p-4 rounded-lg mb-6 text-center text-sm font-medium shadow-sm">
          ✅ Booking created successfully!
        </div>
      )}
  
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg mb-6 text-center text-sm font-medium shadow-sm">
          ❌ {error}
        </div>
      )}
  
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
  
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Booking Date
            </label>
            <input
              type="date"
              name="bookingDate"
              value={formData.bookingDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              required
            />
          </div>
  
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Shift
            </label>
            <select
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            >
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantity (Litres)
            </label>
            <input
              type="number"
              step="0.1"
              name="quantityLitres"
              value={formData.quantityLitres}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              required
            />
          </div>
        </div>
  
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 text-white font-semibold rounded-xl shadow-md transition duration-300 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Booking..." : "Submit Booking"}
        </button>
      </form>
      
  {/* TABLE BOOKING */}
      <div className="mt-16">
  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
    Your Pre-Bookings
  </h3>

  <div className="overflow-x-auto rounded-lg shadow-md">
    <table className="min-w-full divide-y divide-gray-200 bg-white">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">
            Date
          </th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">
            Shift
          </th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">
            Quantity (L)
          </th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">
            Payment
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {preMilkBookings?.length > 0 ? (
          preMilkBookings.map((booking) => (
            <tr
              key={booking.bookingId}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {booking.bookingDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm capitalize text-gray-700">
                {booking.shift}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {booking.quantityLitres}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : booking.paymentStatus === "unpaid"
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {booking.paymentStatus}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="5"
              className="text-center py-6 text-sm text-gray-500"
            >
              No bookings found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
  
};

export default PreBookingFarmer;