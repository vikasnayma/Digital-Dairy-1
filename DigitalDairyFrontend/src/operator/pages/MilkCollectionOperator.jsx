
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  addMilkCollection,
  fetchMilkCollectionsByDairy,
  getDairyDetails
} from '../../Redux/Slices/dairyActions';

const MilkCollectionOperator = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
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
      dairyId: '',
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
      setFormData(prev => ({ ...prev, dairyId: dairy.dairyId }));
      dispatch(fetchMilkCollectionsByDairy(dairy.dairyId));
    }
  }, [dairy, dispatch]);

  const filteredCollections = milkCollection?.filter(entry =>
    (!filter.date || entry.date === filter.date) &&
    (!filter.shift || entry.shift.toLowerCase() === filter.shift.toLowerCase()) &&
    (!filter.farmerId || entry.farmerId.toString() === filter.farmerId)
  );

  const handlePay = (farmerId , collectionId) => {
    navigate(`/dashboard/milk-collection-operator/payment/${farmerId}/${collectionId}`);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 space-y-10">
      {/* === Add Milk Collection Form === */}
      <div className="bg-white p-6 shadow rounded">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Add Milk Collection</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="farmerId" value={formData.farmerId} onChange={handleChange} required className="border p-2 rounded" placeholder="Farmer ID" />
          <input type="text" name="dairyId" value={formData.dairyId} onChange={handleChange} required className="border p-2 rounded" placeholder="Dairy ID" />
          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="border p-2 rounded" />
          <select name="shift" value={formData.shift} onChange={handleChange} className="border p-2 rounded">
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
          <input type="number" name="quantityLitres" step="0.1" value={formData.quantityLitres} onChange={handleChange} required className="border p-2 rounded" placeholder="Quantity (L)" />
          <input type="number" name="fatContent" step="0.1" value={formData.fatContent} onChange={handleChange} required className="border p-2 rounded" placeholder="Fat Content (%)" />
          <input type="text" name="qualityGrade" value={formData.qualityGrade} onChange={handleChange} required className="border p-2 rounded" placeholder="Quality Grade" />
          <input type="number" name="rateApplied" step="0.1" value={formData.rateApplied} onChange={handleChange} required className="border p-2 rounded" placeholder="Rate (₹/L)" />
          <button type="submit" disabled={loading} className="col-span-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
            {loading ? 'Saving...' : 'Submit Collection'}
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">Milk collection added successfully!</p>}
      </div>

      {/* === Filter Milk Collections === */}
      <div className="bg-white p-6 shadow rounded">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Filter Milk Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input type="date" name="date" value={filter.date} onChange={handleFilterChange} className="border p-2 rounded" placeholder="Filter by Date" />
          <select name="shift" value={filter.shift} onChange={handleFilterChange} className="border p-2 rounded">
            <option value="">Select Shift</option>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
          <input type="text" name="farmerId" value={filter.farmerId} onChange={handleFilterChange} className="border p-2 rounded" placeholder="Filter by Farmer ID" />
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Milk Collection Entries</h3>
          {filteredCollections.length > 0 ? (
            <ul className="space-y-3 max-h-[400px] overflow-y-auto">
              {filteredCollections.map(entry => (
                <li key={entry.collectionId} className="p-4 border rounded bg-gray-50 shadow-sm flex justify-between items-center">
                  <div>
                    <p><strong>Farmer ID:</strong> {entry.farmerId}</p>
                    <p><strong>Date:</strong> {entry.date} | <strong>Shift:</strong> {entry.shift}</p>
                    <p><strong>Qty:</strong> {entry.quantityLitres}L | <strong>Fat:</strong> {entry.fatContent}%</p>
                    <p><strong>Rate:</strong> ₹{entry.rateApplied} | <strong>Total:</strong> ₹{entry.totalAmount}</p>
                  </div>
                  <button
                    onClick={() => handlePay(entry.farmerId , entry.collectionId)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Pay
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No entries found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MilkCollectionOperator;

