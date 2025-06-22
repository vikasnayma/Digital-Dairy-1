import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMilkExportationsByClient } from "../../Redux/Slices/dairyActions";
import { useNavigate } from "react-router-dom";

const MilkExportationClient = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { milkExportation, loading, error } = useSelector((state) => state.milkExportation);
  const [filter, setFilter] = useState({ date: "", shift: "" });

  useEffect(() => {
    dispatch(fetchMilkExportationsByClient());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayClick = (exportId, totalAmount) => {
    navigate("/dashboard/exportation-payment", {
      state: { exportId, amount: totalAmount }
    });
  };

  const filteredCollections = milkExportation?.filter((entry) =>
    (!filter.date || entry.date === filter.date) &&
    (!filter.shift || entry.shift.toLowerCase() === filter.shift.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto mt-10 bg-white rounded-3xl shadow-2xl border border-gray-100">
  <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-10 tracking-tight">
    🧾 Milk Exportation History
  </h2>

  {/* Filters */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">📅 Filter by Date</label>
      <input
        type="date"
        name="date"
        value={filter.date}
        onChange={handleFilterChange}
        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">🌅 Filter by Shift</label>
      <select
        name="shift"
        value={filter.shift}
        onChange={handleFilterChange}
        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
      >
        <option value="">All</option>
        <option value="morning">Morning</option>
        <option value="evening">Evening</option>
      </select>
    </div>
  </div>

  {/* Loader and Error */}
  {loading && <p className="text-center text-blue-600 font-medium">Loading exportations...</p>}
  {error && <p className="text-center text-red-600 font-medium">{error}</p>}

  {/* Table */}
  {!loading && !error && (
    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-md">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-blue-100 text-gray-900 text-sm font-semibold uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 border">Date</th>
            <th className="px-4 py-3 border">Shift</th>
            <th className="px-4 py-3 border">Quantity (L)</th>
            <th className="px-4 py-3 border">Fat %</th>
            <th className="px-4 py-3 border">Rate (₹/L)</th>
            <th className="px-4 py-3 border">Total (₹)</th>
            <th className="px-4 py-3 border text-center">Payment</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {filteredCollections?.length > 0 ? (
            filteredCollections.map((entry) => (
              <tr key={entry.exportId} className="hover:bg-gray-50 transition duration-200">
                <td className="px-4 py-3 border">{entry.date}</td>
                <td className="px-4 py-3 border capitalize">{entry.shift}</td>
                <td className="px-4 py-3 border">{entry.quantityLitres}</td>
                <td className="px-4 py-3 border">{entry.fatContent}</td>
                <td className="px-4 py-3 border">{entry.rateApplied}</td>
                <td className="px-4 py-3 border font-bold text-blue-700">₹{entry.totalAmount}</td>
                <td className="px-4 py-3 border text-center">
                  {entry.paymentId ? (
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                      Paid
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePayClick(entry.exportId, entry.totalAmount)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full text-sm font-medium shadow-sm transition"
                    >
                      Pay
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-4 py-6 text-center text-gray-500 font-medium">
                No exportations found for selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )}
</div>
  );
};

export default MilkExportationClient;
