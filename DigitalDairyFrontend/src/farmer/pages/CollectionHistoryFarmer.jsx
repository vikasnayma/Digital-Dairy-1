import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMilkCollectionsByFarmer } from "../../Redux/Slices/dairyActions"; 
import { FaFilter, FaHistory, FaSearch } from "react-icons/fa";

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
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl my-12 mx-auto text-gray-800 min-h-screen">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center bg-green-100 p-4 rounded-full mb-4">
          <FaHistory className="text-green-600 text-3xl" />
        </div>
        <h2 className="text-3xl font-bold text-green-800">
          Milk Collection History
        </h2>
        <div className="w-24 h-1 bg-green-300 mx-auto mt-2 rounded-full"></div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 bg-white p-6 rounded-xl shadow-sm border border-green-200">
        <div className="flex items-center gap-2 text-green-700 mb-2">
          <FaFilter />
          <span className="font-semibold">Filter Records</span>
        </div>
        <div className="sm:col-span-2"></div>
        
        <div className="relative">
          <label className="block text-sm font-medium mb-2 text-green-700">Date</label>
          <div className="relative">
            <input
              type="date"
              name="date"
              value={filter.date}
              onChange={handleFilterChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
            />
            <FaSearch className="absolute left-3 top-3 text-green-400" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-green-700">Shift</label>
          <select
            name="shift"
            value={filter.shift}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
          >
            <option value="">All Shifts</option>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
        </div>
      </div>

      {/* Loader and Error */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-green-700 font-medium">Loading collections...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded animate-shake">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl shadow-sm border border-green-200 bg-white">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Shift</th>
                <th className="px-6 py-3 font-semibold">Quantity (L)</th>
                <th className="px-6 py-3 font-semibold">Fat %</th>
                <th className="px-6 py-3 font-semibold">Rate (₹/L)</th>
                <th className="px-6 py-3 font-semibold">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-100">
              {filteredCollections?.length > 0 ? (
                filteredCollections.map((entry) => (
                  <tr
                    key={entry.collectionId}
                    className="hover:bg-green-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">{entry.date}</td>
                    <td className="px-6 py-4 capitalize">{entry.shift}</td>
                    <td className="px-6 py-4 font-medium">{entry.quantityLitres}</td>
                    <td className="px-6 py-4">{entry.fatContent}</td>
                    <td className="px-6 py-4">{entry.rateApplied}</td>
                    <td className="px-6 py-4 font-semibold text-green-700">{entry.totalAmount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-6 py-8 text-center text-gray-500 font-medium"
                    colSpan="6"
                  >
                    No collections found for selected filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default CollectionHistoryFarmer;
