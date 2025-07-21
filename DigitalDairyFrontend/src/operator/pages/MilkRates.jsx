import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMilkRate, fetchMilkRatesByDairyID, getDairyDetails } from "../../Redux/Slices/dairyActions";
import dayjs from "dayjs";
import { motion } from "framer-motion";

const MilkRates = () => {
  const dispatch = useDispatch();
  const { milkRates, loading, error } = useSelector((state) => state.milkRates);
  const { dairy } = useSelector((state) => state.dairy);
  const dairyId = dairy?.dairyId;

  const [formData, setFormData] = useState({
    pricePerFat: "",
    effectiveFrom: "",
  });

  useEffect(() => {
    dispatch(getDairyDetails());
  }, [dispatch]);

  useEffect(() => {
    if (dairyId) {
      dispatch(fetchMilkRatesByDairyID(dairyId));
    }
  }, [dispatch, dairyId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      dairyId,
      pricePerFat: parseFloat(formData.pricePerFat),
      effectiveFrom: formData.effectiveFrom,
    };
    dispatch(addMilkRate(payload));
    dispatch(fetchMilkRatesByDairyID(dairyId));
    setFormData({ pricePerFat: "", effectiveFrom: "" });
  };

  return (
    <motion.div
      className="w-full px-4 sm:px-8 py-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mt-14 text-center text-green-800 mb-8">
        Milk Rate Management
      </h1>

      {/* Form Section */}
      <motion.div
        className="bg-white mt-12 border border-green-200 rounded-2xl shadow p-6 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold text-green-800 mb-4 pb-2 border-b border-green-200">
          Add New Milk Rate
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Price per Fat (₹)
            </label>
            <input
              type="number"
              name="pricePerFat"
              value={formData.pricePerFat}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              step="0.01"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Effective From
            </label>
            <input
              type="date"
              name="effectiveFrom"
              value={formData.effectiveFrom}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Adding...
                </span>
              ) : (
                "Add Milk Rate"
              )}
            </button>
          </div>
        </form>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}
      </motion.div>

      {/* Milk Rate History */}
      <motion.div
        className="bg-white border border-green-200 rounded-2xl shadow p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-green-800 mb-4 pb-2 border-b border-green-200">
          Milk Rates History
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-green-200 text-sm">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="py-3 px-4 border-b border-green-200">#</th>
                <th className="py-3 px-4 border-b border-green-200">Price per Fat (₹)</th>
                <th className="py-3 px-4 border-b border-green-200">Effective From</th>
              </tr>
            </thead>
            <tbody>
              {milkRates?.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No rates available
                  </td>
                </tr>
              ) : (
                milkRates
                  .slice()
                  .sort((a, b) => new Date(b.effectiveFrom) - new Date(a.effectiveFrom))
                  .map((rate, index) => (
                    <tr key={rate.rateId} className="transition hover:bg-green-50">
                      <td className="py-3 px-4 border-b border-green-200">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 border-b border-green-200 font-medium text-gray-800">
                        ₹ {rate.pricePerFat}
                      </td>
                      <td className="py-3 px-4 border-b border-green-200 text-gray-800">
                        {dayjs(rate.effectiveFrom).format("DD MMM YYYY")}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MilkRates;