import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMilkExportation,
  fetchMilkExportationsByDairy,
  getDairyDetails,
} from "../../Redux/Slices/dairyActions";
import { motion } from "framer-motion";

const MilkExportationOperator = () => {
  const dispatch = useDispatch();
  const { loading, error, success, milkExportation } = useSelector(
    (state) => state.milkExportation
  );
  const { dairy } = useSelector((state) => state.dairy);

  const [formData, setFormData] = useState({
    clientId: "",
    dairyId: "",
    date: "",
    shift: "morning",
    quantityLitres: "",
    fatContent: "",
    qualityGrade: "",
    rateApplied: "",
  });

  const [filter, setFilter] = useState({ date: "", shift: "" });

  useEffect(() => {
    dispatch(getDairyDetails());
  }, [dispatch]);

  useEffect(() => {
    if (dairy?.dairyId) {
      setFormData((prev) => ({ ...prev, dairyId: dairy.dairyId }));
      dispatch(fetchMilkExportationsByDairy(dairy.dairyId));
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
    dispatch(addMilkExportation(payload));
    setFormData({
      clientId: "",
      dairyId: formData.dairyId,
      date: "",
      shift: "morning",
      quantityLitres: "",
      fatContent: "",
      qualityGrade: "",
      rateApplied: "",
    });
  };

  const filteredCollections = milkExportation?.filter(
    (entry) =>
      (!filter.date || entry.date === filter.date) &&
      (!filter.shift || entry.shift.toLowerCase() === filter.shift.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full mt-18 px-4 sm:px-8 py-10">
      {/* Add Exportation Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto bg-white border border-green-200 rounded-2xl shadow-lg p-6 sm:p-10 mb-10"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-green-800 pb-2 border-b border-green-200">
          Add Milk Exportation
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {["clientId", "date", "quantityLitres", "fatContent", "qualityGrade", "rateApplied"].map((name, index) => {
            const labels = {
              clientId: "Client ID",
              date: "Date",
              quantityLitres: "Quantity (L)",
              fatContent: "Fat Content (%)",
              qualityGrade: "Quality Grade",
              rateApplied: "Rate Applied (₹)",
            };
            const types = {
              clientId: "text",
              date: "date",
              quantityLitres: "number",
              fatContent: "number",
              qualityGrade: "text",
              rateApplied: "number",
            };
            return (
              <div className="space-y-1" key={name}>
                <label className="font-medium text-gray-700">{labels[name]}</label>
                <input
                  type={types[name]}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            );
          })}
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
          <button
            type="submit"
            disabled={loading}
            className={`col-span-full mt-4 text-white py-3 rounded-lg font-semibold transition-colors ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Exportation"}
          </button>
        </form>
        {error && (
          <p className="mt-4 text-center text-red-600">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-4 text-center text-green-600">
            Exportation added successfully!
          </p>
        )}
      </motion.div>

      {/* Exportation Records */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto bg-white border border-green-200 rounded-2xl shadow-lg p-6 sm:p-10"
      >
        <h3 className="text-2xl font-bold text-center mb-6 text-green-800 pb-2 border-b border-green-200">
          Milk Exportation Records
        </h3>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <input
            type="date"
            name="date"
            value={filter.date}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <select
            name="shift"
            value={filter.shift}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Shifts</option>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
        </div>

        {/* Exportation List */}
        <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-green-300">
          {filteredCollections?.length > 0 ? (
            filteredCollections.map((entry) => (
              <div
                key={entry.exportId}
                className="p-4 bg-white rounded-xl border border-green-200 shadow hover:bg-green-50 transition-colors"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm sm:text-base">
                  <p><strong className="text-gray-700">Client ID:</strong> {entry.clientId}</p>
                  <p><strong className="text-gray-700">Date:</strong> {entry.date}</p>
                  <p><strong className="text-gray-700">Shift:</strong> {entry.shift}</p>
                  <p><strong className="text-gray-700">Quantity:</strong> {entry.quantityLitres} L</p>
                  <p><strong className="text-gray-700">Fat %:</strong> {entry.fatContent}</p>
                  <p><strong className="text-gray-700">Grade:</strong> {entry.qualityGrade}</p>
                  <p><strong className="text-gray-700">Rate:</strong> ₹{entry.rateApplied}</p>
                  <p><strong className="text-gray-700">Total:</strong> ₹{(entry.quantityLitres * entry.rateApplied).toFixed(2)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              No entries found.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MilkExportationOperator;