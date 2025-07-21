import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMilkCollection,
  fetchMilkCollectionsByDairy,
  getDairyDetails,
} from "../../Redux/Slices/dairyActions";
import { motion } from "framer-motion";

const MilkCollectionOperator = () => {
  const dispatch = useDispatch();
  const { loading, error, success, milkCollection } = useSelector(
    (state) => state.milkCollection
  );
  const { dairy } = useSelector((state) => state.dairy);

  const [formData, setFormData] = useState({
    farmerId: "",
    dairyId: "",
    date: "",
    shift: "morning",
    quantityLitres: "",
    fatContent: "",
    qualityGrade: "",
    rateApplied: "",
  });

  const [filter, setFilter] = useState({
    date: "",
    shift: "",
    farmerId: "",
  });

  useEffect(() => {
    dispatch(getDairyDetails());
  }, [dispatch]);

  useEffect(() => {
    if (dairy?.dairyId) {
      setFormData((prev) => ({ ...prev, dairyId: dairy.dairyId }));
      dispatch(fetchMilkCollectionsByDairy(dairy.dairyId));
    }
  }, [dairy, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      quantityLitres: parseFloat(formData.quantityLitres),
      fatContent: parseFloat(formData.fatContent),
      rateApplied: parseFloat(formData.rateApplied),
    };
    dispatch(addMilkCollection(payload));
    setFormData({
      farmerId: "",
      dairyId: formData.dairyId,
      date: "",
      shift: "morning",
      quantityLitres: "",
      fatContent: "",
      qualityGrade: "",
      rateApplied: "",
    });
  };

  const filteredCollections = milkCollection?.filter(
    (entry) =>
      (!filter.date || entry.date === filter.date) &&
      (!filter.shift || entry.shift.toLowerCase() === filter.shift.toLowerCase()) &&
      (!filter.farmerId || entry.farmerId.toString() === filter.farmerId)
  );

  return (
    <div className="min-h-screen w-full mt-12 px-4 sm:px-8 py-10">
      {/* Add Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto bg-white border border-green-200 rounded-2xl shadow-lg p-6 sm:p-10 mb-10"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-green-800 pb-2 border-b border-green-200">
          Add Milk Collection
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {[
            ["farmerId", "Farmer ID", "text"],
            ["date", "Date", "date"],
            ["quantityLitres", "Quantity (L)", "number"],
            ["fatContent", "Fat Content (%)", "number"],
            ["qualityGrade", "Quality Grade", "text"],
            ["rateApplied", "Rate Applied (₹)", "number"],
          ].map(([name, label, type]) => (
            <div className="space-y-1" key={name}>
              <label className="font-medium text-gray-700">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          ))}

          {/* Shift Dropdown */}
          <div className="space-y-1">
            <label className="font-medium text-gray-700">Shift</label>
            <select
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
          </div>

          {/* Dairy ID (Read Only) */}
          <div className="space-y-1">
            <label className="font-medium text-gray-700">Dairy ID</label>
            <input
              type="text"
              name="dairyId"
              value={formData.dairyId}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 bg-gray-100 rounded-lg shadow-sm"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`col-span-full mt-4 text-white py-3 rounded-lg font-semibold transition-colors ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Collection"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-red-600">{error}</p>
        )}
        {success && (
          <p className="mt-4 text-center text-green-600">
            Collection added successfully!
          </p>
        )}
      </motion.div>

      {/* Records Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto bg-white border border-green-200 rounded-2xl shadow-lg p-6 sm:p-10"
      >
        <h3 className="text-3xl pb-4 font-bold text-center mb-6 text-green-800 border-b border-green-200">
          Milk Collection Records
        </h3>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {[
            ["date", "Filter by Date"],
            ["shift", "Filter by Shift"],
            ["farmerId", "Filter by Farmer ID"],
          ].map(([name, label]) => (
            <div key={name} className="space-y-1">
              <label className="font-medium text-gray-700">{label}</label>
              {name === "shift" ? (
                <select
                  name={name}
                  value={filter[name]}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All</option>
                  <option value="morning">Morning</option>
                  <option value="evening">Evening</option>
                </select>
              ) : (
                <input
                  name={name}
                  type={name === "date" ? "date" : "text"}
                  value={filter[name]}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              )}
            </div>
          ))}
        </div>

        {/* Entries */}
        <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-green-300">
          {filteredCollections?.length > 0 ? (
            filteredCollections.map((entry) => (
              <div
                key={entry.collectionId}
                className="p-4 bg-white rounded-xl border border-green-200 shadow hover:bg-green-50 transition-colors"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm sm:text-base">
                  <p><strong className="text-gray-700">Farmer ID:</strong> {entry.farmerId}</p>
                  <p><strong className="text-gray-700">Date:</strong> {entry.date}</p>
                  <p><strong className="text-gray-700">Shift:</strong> {entry.shift}</p>
                  <p><strong className="text-gray-700">Quantity:</strong> {entry.quantityLitres} L</p>
                  <p><strong className="text-gray-700">Fat %:</strong> {entry.fatContent}</p>
                  <p><strong className="text-gray-700">Grade:</strong> {entry.qualityGrade}</p>
                  <p><strong className="text-gray-700">Rate:</strong> ₹{entry.rateApplied}</p>
                  <p><strong className="text-gray-700">Total:</strong> ₹{entry.totalAmount}</p>
                  <p>
                    <strong className="text-gray-700">Status:</strong>{" "}
                    {entry.paymentId ? (
                      <span className="text-green-600 font-medium">Paid</span>
                    ) : (
                      <span className="text-yellow-600 font-medium">Unpaid</span>
                    )}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No entries found.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MilkCollectionOperator;