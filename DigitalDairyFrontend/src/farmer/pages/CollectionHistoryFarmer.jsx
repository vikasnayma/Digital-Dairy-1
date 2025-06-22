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
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl my-12 mx-auto text-[#3e2c23]">
  <h2 className="text-3xl font-bold text-center mb-8 text-[#7f5539]">
    🥛 Milk Collection History
  </h2>

  {/* Filters */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 bg-[#fefae0] p-6 rounded-xl shadow">
    <div>
      <label className="block text-sm font-semibold mb-2 text-[#7f5539]">Filter by Date</label>
      <input
        type="date"
        name="date"
        value={filter.date}
        onChange={handleFilterChange}
        className="w-full px-4 py-2 rounded-lg border border-[#ccc] focus:outline-none focus:ring-2 focus:ring-[#b08968] shadow-sm bg-white"
      />
    </div>
    <div>
      <label className="block text-sm font-semibold mb-2 text-[#7f5539]">Filter by Shift</label>
      <select
        name="shift"
        value={filter.shift}
        onChange={handleFilterChange}
        className="w-full px-4 py-2 rounded-lg border border-[#ccc] focus:outline-none focus:ring-2 focus:ring-[#b08968] shadow-sm bg-white"
      >
        <option value="">All</option>
        <option value="morning">Morning</option>
        <option value="evening">Evening</option>
      </select>
    </div>
  </div>

  {/* Loader and Error */}
  {loading && (
    <div className="text-center text-[#9c6644] font-medium py-4 animate-pulse">
      Loading collections...
    </div>
  )}
  {error && (
    <div className="text-center text-red-600 font-semibold py-4">
      {error}
    </div>
  )}

  {/* Table */}
  {!loading && !error && (
    <div className="overflow-x-auto rounded-xl shadow-md border border-[#ddd] bg-white">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-[#b08968] text-white">
          <tr>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Shift</th>
            <th className="px-6 py-3">Quantity (L)</th>
            <th className="px-6 py-3">Fat %</th>
            <th className="px-6 py-3">Rate (₹/L)</th>
            <th className="px-6 py-3">Total Amount (₹)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#eee] bg-[#fefae0]">
          {filteredCollections?.length > 0 ? (
            filteredCollections.map((entry) => (
              <tr
                key={entry.collectionId}
                className="hover:bg-[#f2e8cf] transition duration-200"
              >
                <td className="px-6 py-3">{entry.date}</td>
                <td className="px-6 py-3 capitalize">{entry.shift}</td>
                <td className="px-6 py-3">{entry.quantityLitres}</td>
                <td className="px-6 py-3">{entry.fatContent}</td>
                <td className="px-6 py-3">{entry.rateApplied}</td>
                <td className="px-6 py-3">{entry.totalAmount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="px-6 py-6 text-center text-[#7f5539] font-medium"
                colSpan="6"
              >
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
