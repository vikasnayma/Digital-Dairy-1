import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMilkCollectionsByFarmer } from "../../Redux/Slices/dairyActions"; 
// import Loader from "./Loader"; // optional loader component
// import Error from "./Error";   // optional error component

const CollectionHistoryFarmer = () => {
  const dispatch = useDispatch();

  const { milkCollection, loading, error } = useSelector((state) => state.milkCollection);
  const [filter, setFilter] = useState({ date: "", shift: "" });

  useEffect(() => {
    dispatch(fetchMilkCollectionsByFarmer());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredCollections = milkCollection?.filter((entry) =>
    (!filter.date || entry.date === filter.date) &&
    (!filter.shift || entry.shift.toLowerCase() === filter.shift.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
        Milk Collection History
      </h2>
  
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Filter by Date</label>
          <input
            type="date"
            name="date"
            value={filter.date}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Filter by Shift</label>
          <select
            name="shift"
            value={filter.shift}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="">All</option>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
        </div>
      </div>
  
      {/* Loader and Error */}
      {loading}
      {error}
  
      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-blue-100 text-gray-800">
              <tr>
                <th className="px-4 py-3 border">Date</th>
                <th className="px-4 py-3 border">Shift</th>
                <th className="px-4 py-3 border">Quantity (L)</th>
                <th className="px-4 py-3 border">Fat %</th>
                <th className="px-4 py-3 border">Rate (₹/L)</th>
                <th className="px-4 py-3 border">Total Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredCollections?.length > 0 ? (
                filteredCollections.map((entry) => (
                  <tr key={entry.collectionId} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 border">{entry.date}</td>
                    <td className="px-4 py-2 border capitalize">{entry.shift}</td>
                    <td className="px-4 py-2 border">{entry.quantityLitres}</td>
                    <td className="px-4 py-2 border">{entry.fatContent}</td>
                    <td className="px-4 py-2 border">{entry.rateApplied}</td>
                    <td className="px-4 py-2 border">{entry.totalAmount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-4 text-center text-gray-500" colSpan="6">
                    No collections found for selected filters.
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

export default CollectionHistoryFarmer;
