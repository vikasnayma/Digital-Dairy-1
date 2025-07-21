import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPreMilkBooking,
  fetchAllPreMilkBookingsByFarmer,
} from "../../Redux/Slices/dairyActions";
import { useNavigate } from "react-router-dom";

const PreBookingFarmer = () => {
  const navigate = useNavigate();
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

  const handlePaymentClick = (bookingId) => {
    navigate(`/dashboard/pre-booking-payment/${bookingId}`);
  };

  return (
    <div className="max-w-5xl mx-auto mt-20 p-4 sm:p-6 py-8 bg-white rounded-lg shadow-md mt-6 text-gray-800 border border-green-50">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-green-800 tracking-wide">
        🥛 Pre-Milk Booking
      </h2>

      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6">
          <p className="font-medium">✅ Booking created successfully!</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          <p className="font-medium">❌ {error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-green-50 p-4 sm:p-6 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-green-700">
              Booking Date
            </label>
            <input
              type="date"
              name="bookingDate"
              value={formData.bookingDate}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-md border border-green-200 focus:ring-2 focus:ring-green-300 focus:border-green-300 bg-white"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-green-700">
              Shift
            </label>
            <select
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-md border border-green-200 focus:ring-2 focus:ring-green-300 focus:border-green-300 bg-white"
            >
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-green-700">
              Quantity (Litres)
            </label>
            <input
              type="number"
              step="0.1"
              name="quantityLitres"
              value={formData.quantityLitres}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-md border border-green-200 focus:ring-2 focus:ring-green-300 focus:border-green-300 bg-white"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 text-white font-medium rounded-md transition duration-200 ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          } shadow-sm`}
        >
          {loading ? "Processing..." : "Submit Booking"}
        </button>
      </form>

      {/* Table Section */}
      <div className="mt-10">
        <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 text-green-800">
          Your Pre-Bookings
        </h3>

        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-green-100">
          <table className="min-w-full divide-y divide-green-100 text-sm">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Shift</th>
                <th className="px-4 py-3 text-left font-medium">Quantity (L)</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-50">
              {preMilkBookings?.length > 0 ? (
                preMilkBookings.map((booking) => (
                  <tr key={booking.bookingId} className="hover:bg-green-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap">{booking.bookingDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap capitalize">{booking.shift}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium">{booking.quantityLitres}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          booking.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {booking.paymentStatus === "paid" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePaymentClick(booking.bookingId)}
                          className="px-3 py-1 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition shadow-sm"
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-green-700">
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