import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMilkRate, fetchMilkRatesByDairyID } from "../../Redux/Slices/dairyActions";
import { getDairyDetails } from "../../Redux/Slices/dairyActions";
import dayjs from "dayjs";

const MilkRates = () => {
  const dispatch = useDispatch();
  const { milkRates, loading, error } = useSelector((state) => state.milkRates);
  const { dairy } = useSelector((state) => state.dairy);
  const dairyId = dairy.dairyId;

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

  const handleSubmit = async (e) => {
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
    <div className="max-w-4xl mx-auto px-6 py-10 mt-12 animate-fade-in">
      <h1 className="text-3xl font-bold text-stone-800 text-center mb-8">
        <span className="inline-block animate-bounce">🐄</span> Milk Rate Management
      </h1>

      {/* Create Rate Form */}
      <div className="bg-amber-50 rounded-2xl shadow-lg p-6 mb-10 border border-amber-100 animate-fade-in-up">
        <h2 className="text-xl font-semibold text-stone-700 mb-4">
          Add New Milk Rate
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-stone-600 font-medium mb-1">
              Price per Fat (₹)
            </label>
            <input
              type="number"
              name="pricePerFat"
              value={formData.pricePerFat}
              onChange={handleChange}
              className="w-full border border-amber-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-100/30"
              required
              step="0.01"
              min="0"
            />
          </div>
          <div>
            <label className="block text-stone-600 font-medium mb-1">
              Effective From
            </label>
            <input
              type="date"
              name="effectiveFrom"
              value={formData.effectiveFrom}
              onChange={handleChange}
              className="w-full border border-amber-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-100/30"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className={`${
                loading ? 'bg-amber-400 cursor-not-allowed' : 'bg-amber-700 hover:bg-amber-800'
              } text-amber-50 font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-amber-100 border-t-transparent rounded-full animate-spin"></span>
                  Adding...
                </span>
              ) : (
                "Add Milk Rate"
              )}
            </button>
          </div>
        </form>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-600 animate-shake">
            {error}
          </div>
        )}
      </div>

      {/* List of Rates */}
      <div className="bg-amber-50 rounded-2xl shadow-lg p-6 border border-amber-100 animate-fade-in-up">
        <h2 className="text-xl font-semibold text-stone-700 mb-4">
          Milk Rates History
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-amber-200 text-sm">
            <thead>
              <tr className="bg-amber-100 text-stone-800 text-left">
                <th className="py-3 px-4 border-b border-amber-200">#</th>
                <th className="py-3 px-4 border-b border-amber-200">Price per Fat (₹)</th>
                <th className="py-3 px-4 border-b border-amber-200">Effective From</th>
              </tr>
            </thead>
            <tbody>
              {milkRates?.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-stone-500">
                    No rates available
                  </td>
                </tr>
              ) : (
                milkRates
                  .slice()
                  .sort((a, b) => new Date(b.effectiveFrom) - new Date(a.effectiveFrom))
                  .map((rate, index) => (
                    <tr 
                      key={rate.rateId} 
                      className="hover:bg-amber-100/50 transition-colors duration-200"
                    >
                      <td className="py-3 px-4 border-b border-amber-200">{index + 1}</td>
                      <td className="py-3 px-4 border-b border-amber-200 font-medium text-amber-700">
                        {rate.pricePerFat} ₹
                      </td>
                      <td className="py-3 px-4 border-b border-amber-200">
                        {dayjs(rate.effectiveFrom).format("DD MMM YYYY")}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MilkRates;