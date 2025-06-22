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
    <div className="max-w-6xl mx-auto mt-8 space-y-8 px-4 animate-fadeIn">
      {/* === Add Collection Form === */}
      <div className="bg-amber-50 p-8 rounded-2xl shadow-lg border border-amber-100 transform transition-all hover:shadow-xl">
        <h2 className="text-3xl font-bold text-amber-900 mb-6 text-center tracking-tight font-serif">
          Add Milk Collection
          <span className="block h-1 w-20 bg-amber-300 mx-auto mt-2 rounded-full"></span>
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="space-y-1">
            <label className="text-amber-800 font-medium">Farmer ID</label>
            <input
              name="farmerId"
              value={formData.farmerId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-amber-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-300 transition-all bg-white"
              placeholder="Enter Farmer ID"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-amber-800 font-medium">Dairy ID</label>
            <input
              name="dairyId"
              value={formData.dairyId}
              onChange={handleChange}
              readOnly
              className="w-full px-4 py-3 border border-amber-100 bg-amber-50 rounded-lg shadow-sm cursor-not-allowed"
              placeholder="Dairy ID"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-amber-800 font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-amber-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-300 transition-all bg-white"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-amber-800 font-medium">Shift</label>
            <select
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-300 transition-all bg-white"
            >
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-amber-800 font-medium">Quantity (L)</label>
            <input
              type="number"
              name="quantityLitres"
              value={formData.quantityLitres}
              step="0.1"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-amber-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-300 transition-all bg-white"
              placeholder="0.0"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-amber-800 font-medium">Fat Content (%)</label>
            <input
              type="number"
              name="fatContent"
              value={formData.fatContent}
              step="0.1"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-amber-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-300 transition-all bg-white"
              placeholder="0.0"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-amber-800 font-medium">Quality Grade</label>
            <input
              name="qualityGrade"
              value={formData.qualityGrade}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-amber-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-300 transition-all bg-white"
              placeholder="Grade"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-amber-800 font-medium">Rate Applied</label>
            <input
              type="number"
              name="rateApplied"
              value={formData.rateApplied}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-amber-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-300 transition-all bg-white"
              placeholder="0.0"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="col-span-full mt-4 bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-lg font-semibold tracking-wide shadow-md transition-all transform hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Submit Collection'}
          </button>
        </form>
  
        {error && (
          <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded animate-shake">
            <p className="text-center">{error}</p>
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded animate-fadeIn">
            <p className="text-center">Milk collection added successfully!</p>
          </div>
        )}
      </div>
  
      {/* === Filter & Collection List === */}
      <div className="bg-amber-50 p-8 rounded-2xl shadow-lg border border-amber-100 transform transition-all hover:shadow-xl">
        <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center font-serif">
          Milk Collection Records
          <span className="block h-1 w-16 bg-amber-300 mx-auto mt-2 rounded-full"></span>
        </h2>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-1">
            <label className="text-amber-800 font-medium">Filter by Date</label>
            <input
              type="date"
              name="date"
              value={filter.date}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-amber-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-300 transition-all bg-white"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-amber-800 font-medium">Filter by Shift</label>
            <select
              name="shift"
              value={filter.shift}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-amber-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-300 transition-all bg-white"
            >
              <option value="">All Shifts</option>
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-amber-800 font-medium">Filter by Farmer ID</label>
            <input
              type="text"
              name="farmerId"
              value={filter.farmerId}
              onChange={handleFilterChange}
              placeholder="Enter Farmer ID"
              className="w-full px-4 py-2 border border-amber-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-300 transition-all bg-white"
            />
          </div>
        </div>
  
        {filteredCollections?.length > 0 ? (
          <ul className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-amber-100">
            {filteredCollections.map((entry) => (
              <li 
                key={entry.collectionId} 
                className="p-5 border border-amber-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:border-amber-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-amber-900 text-sm md:text-base">
                  <p><span className="font-semibold text-amber-700">Farmer ID:</span> {entry.farmerId}</p>
                  <p><span className="font-semibold text-amber-700">Date:</span> {entry.date}</p>
                  <p><span className="font-semibold text-amber-700">Shift:</span> <span className="capitalize">{entry.shift}</span></p>
                  <p><span className="font-semibold text-amber-700">Quantity:</span> <span className="text-amber-600">{entry.quantityLitres} L</span></p>
                  <p><span className="font-semibold text-amber-700">Fat %:</span> <span className="text-amber-600">{entry.fatContent}</span></p>
                  <p><span className="font-semibold text-amber-700">Grade:</span> <span className="uppercase font-medium">{entry.qualityGrade}</span></p>
                  <p><span className="font-semibold text-amber-700">Rate:</span> ₹{entry.rateApplied}</p>
                  <p><span className="font-semibold text-amber-700">Total:</span> <span className="font-bold">₹{entry.totalAmount}</span></p>
                  <p>
                    <span className="font-semibold text-amber-700">Status:</span>{' '}
                    {entry.paymentId ? (
                      <span className="text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full text-xs">Paid</span>
                    ) : (
                      <span className="text-amber-600 font-medium bg-amber-100 px-2 py-1 rounded-full text-xs">Unpaid</span>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center p-8 bg-amber-100 rounded-xl border border-amber-200 animate-pulse">
            <p className="text-amber-800">No milk collection entries found.</p>
          </div>
        )}
      </div>
    </div>
  );  
};

export default MilkCollectionOperator;