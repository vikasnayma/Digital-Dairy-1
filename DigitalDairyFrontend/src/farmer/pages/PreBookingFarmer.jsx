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
    <div className="max-w-5xl mx-auto p-6 sm:p-8 py-16 bg-[#fefae0] rounded-3xl shadow-2xl mt-12 text-[#3e2c23]">
  <h2 className="text-3xl font-extrabold text-center mb-10 text-[#7f5539] tracking-wide">
    🐄 Pre-Milk Booking Form
  </h2>

  {success && (
    <div className="bg-green-50 border border-green-300 text-green-800 p-4 rounded-xl mb-6 text-center font-medium shadow-sm">
      ✅ Booking created successfully!
    </div>
  )}

  {error && (
    <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-xl mb-6 text-center font-medium shadow-sm">
      ❌ {error}
    </div>
  )}

  <form onSubmit={handleSubmit} className="space-y-10">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div>
        <label className="block mb-2 text-sm font-semibold text-[#7f5539]">
          Booking Date
        </label>
        <input
          type="date"
          name="bookingDate"
          value={formData.bookingDate}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#b08968] bg-white shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-semibold text-[#7f5539]">
          Shift
        </label>
        <select
          name="shift"
          value={formData.shift}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#b08968] bg-white shadow-sm"
        >
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
        </select>
      </div>
      <div>
        <label className="block mb-2 text-sm font-semibold text-[#7f5539]">
          Quantity (Litres)
        </label>
        <input
          type="number"
          step="0.1"
          name="quantityLitres"
          value={formData.quantityLitres}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#b08968] bg-white shadow-sm"
          required
        />
      </div>
    </div>

    <button
      type="submit"
      disabled={loading}
      className={`w-full py-3 px-4 text-white font-semibold rounded-xl transition duration-300 shadow-md ${
        loading
          ? "bg-[#b08968]/60 cursor-not-allowed"
          : "bg-[#7f5539] hover:bg-[#6e442f]"
      }`}
    >
      {loading ? "Booking..." : "Submit Booking"}
    </button>
  </form>

  {/* Table Section */}
  <div className="mt-16">
    <h3 className="text-2xl font-bold text-center mb-8 text-[#7f5539]">
      📋 Your Pre-Bookings
    </h3>

    <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-[#ddd]">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-[#b08968] text-white">
          <tr>
            <th className="px-6 py-4 text-left font-semibold">Date</th>
            <th className="px-6 py-4 text-left font-semibold">Shift</th>
            <th className="px-6 py-4 text-left font-semibold">Quantity (L)</th>
            <th className="px-6 py-4 text-left font-semibold">Status</th>
            <th className="px-6 py-4 text-left font-semibold">Payment</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#eee]">
          {preMilkBookings?.length > 0 ? (
            preMilkBookings.map((booking) => (
              <tr key={booking.bookingId} className="hover:bg-[#fefae0]/60 transition">
                <td className="px-6 py-4">{booking.bookingDate}</td>
                <td className="px-6 py-4 capitalize">{booking.shift}</td>
                <td className="px-6 py-4 font-medium">{booking.quantityLitres}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
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
                <td className="px-6 py-4">
                  {booking.paymentStatus === "paid" ? (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Paid
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePaymentClick(booking.bookingId)}
                      className="px-4 py-1 rounded-full text-sm font-medium bg-[#7f5539] text-white hover:bg-[#6e442f] transition"
                    >
                      Pay
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-6 text-center text-[#7f5539]">
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
