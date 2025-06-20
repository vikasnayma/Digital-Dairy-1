import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addMilkCollection,
  fetchMilkCollectionsByDairy,
  getDairyDetails
} from '../../Redux/Slices/dairyActions';

const MilkCollectionOperator = () => {
  const dispatch = useDispatch();
  const { loading, error, success, milkCollection } = useSelector((state) => state.milkCollection);
  const { dairy } = useSelector((state) => state.dairy);

  const [formData, setFormData] = useState({
    farmerId: '',
    dairyId: '',
    date: '',
    shift: 'morning',
    quantityLitres: '',
    fatContent: '',
    qualityGrade: '',
    rateApplied: ''
  });

  const [filter, setFilter] = useState({
    date: '',
    shift: '',
    farmerId: ''
  });

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
      rateApplied: parseFloat(formData.rateApplied)
    };

    dispatch(addMilkCollection(payload));
    setFormData({
      farmerId: '',
      dairyId: formData.dairyId,
      date: '',
      shift: 'morning',
      quantityLitres: '',
      fatContent: '',
      qualityGrade: '',
      rateApplied: ''
    });
  };

  useEffect(() => {
    dispatch(getDairyDetails());
  }, [dispatch]);

  useEffect(() => {
    if (dairy?.dairyId) {
      setFormData((prev) => ({ ...prev, dairyId: dairy.dairyId }));
      dispatch(fetchMilkCollectionsByDairy(dairy.dairyId));
    }
  }, [dairy, dispatch]);

  const filteredCollections = milkCollection?.filter((entry) =>
    (!filter.date || entry.date === filter.date) &&
    (!filter.shift || entry.shift.toLowerCase() === filter.shift.toLowerCase()) &&
    (!filter.farmerId || entry.farmerId.toString() === filter.farmerId)
  );

  return (
    <div className="max-w-6xl mx-auto mt-12 space-y-12 px-4">
      {/* === Add Collection Form === */}
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center tracking-tight">Add Milk Collection</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <input
            name="farmerId"
            value={formData.farmerId}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Farmer ID"
          />
          <input
            name="dairyId"
            value={formData.dairyId}
            onChange={handleChange}
            readOnly
            className="px-4 py-2 border border-gray-200 bg-gray-100 rounded-xl shadow-sm cursor-not-allowed"
            placeholder="Dairy ID"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="shift"
            value={formData.shift}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
          <input
            type="number"
            name="quantityLitres"
            value={formData.quantityLitres}
            step="0.1"
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Quantity (L)"
          />
          <input
            type="number"
            name="fatContent"
            value={formData.fatContent}
            step="0.1"
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Fat Content (%)"
          />
          <input
            name="qualityGrade"
            value={formData.qualityGrade}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Quality Grade"
          />
          <input
            type="number"
            name="rateApplied"
            value={formData.rateApplied}
            step="0.1"
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Rate (₹/L)"
          />
          <button
            type="submit"
            disabled={loading}
            className="col-span-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold tracking-wide shadow-md transition"
          >
            {loading ? 'Saving...' : 'Submit Collection'}
          </button>
        </form>
  
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {success && <p className="text-green-600 mt-4 text-center">Milk collection added successfully!</p>}
      </div>
  
      {/* === Filter & Collection List === */}
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-blue-700 mb-8 text-center">Milk Collection Records</h2>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="date"
            name="date"
            value={filter.date}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="shift"
            value={filter.shift}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Shifts</option>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
          <input
            type="text"
            name="farmerId"
            value={filter.farmerId}
            onChange={handleFilterChange}
            placeholder="Filter by Farmer ID"
            className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        {filteredCollections?.length > 0 ? (
          <ul className="space-y-4 max-h-[400px] overflow-y-auto">
            {filteredCollections.map((entry) => (
              <li key={entry.collectionId} className="p-6 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-gray-800 text-sm md:text-base">
                  <p><span className="font-semibold">Farmer ID:</span> {entry.farmerId}</p>
                  <p><span className="font-semibold">Date:</span> {entry.date}</p>
                  <p><span className="font-semibold">Shift:</span> {entry.shift}</p>
                  <p><span className="font-semibold">Quantity:</span> {entry.quantityLitres} L</p>
                  <p><span className="font-semibold">Fat %:</span> {entry.fatContent}</p>
                  <p><span className="font-semibold">Grade:</span> {entry.qualityGrade}</p>
                  <p><span className="font-semibold">Rate:</span> ₹{entry.rateApplied}</p>
                  <p><span className="font-semibold">Total:</span> ₹{entry.totalAmount}</p>
                  <p>
                    <span className="font-semibold">Status:</span>{' '}
                    {entry.paymentId ? (
                      <span className="text-green-600 font-medium">Paid</span>
                    ) : (
                      <span className="text-yellow-600 font-medium">Unpaid</span>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center mt-4">No milk collection entries found.</p>
        )}
      </div>
    </div>
  );  
};

export default MilkCollectionOperator;
