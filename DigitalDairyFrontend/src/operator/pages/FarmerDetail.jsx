import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMilkCollectionsByDairy } from '../../Redux/Slices/dairyActions';

const FarmerDetail = () => {
  const { dairyId, farmerId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { milkCollection, loading, error } = useSelector((state) => state.milkCollection);

  useEffect(() => {
    if (dairyId) {
      dispatch(fetchMilkCollectionsByDairy(dairyId));
    }
  }, [dairyId, dispatch]);

  const filteredCollections = milkCollection?.filter(
    (entry) => entry.farmerId.toString() === farmerId
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">
        Milk Collection History – Farmer #{farmerId}
      </h2>

      {loading && <p className="text-blue-500">Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {filteredCollections?.length > 0 ? (
        <ul className="space-y-4 max-h-[500px] overflow-y-auto">
          {filteredCollections.map((entry) => (
            <li key={entry.collectionId} className="p-4 border rounded-md bg-gray-100 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <p><strong>Date:</strong> {entry.date}</p>
                <p><strong>Shift:</strong> {entry.shift}</p>
                <p><strong>Quantity:</strong> {entry.quantityLitres} L</p>
                <p><strong>Fat Content:</strong> {entry.fatContent}%</p>
                <p><strong>Rate Applied:</strong> ₹{entry.rateApplied}</p>
                <p><strong>Total Amount:</strong> ₹{entry.totalAmount}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-4">No milk collection records found for this farmer.</p>
      )}

      <button
        onClick={() => navigate(-1)}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Back
      </button>
    </div>
  );
};

export default FarmerDetail;
