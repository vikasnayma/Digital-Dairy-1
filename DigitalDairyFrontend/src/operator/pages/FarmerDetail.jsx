import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMilkCollectionsByFarmerInOperator } from '../../Redux/Slices/dairyActions';

const FarmerDetail = () => {
  const { farmerId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { milkCollection, loading, error } = useSelector((state) => state.milkCollection);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (farmerId) {
      dispatch(fetchMilkCollectionsByFarmerInOperator(farmerId));
    }
  }, [farmerId, dispatch]);

  const filteredCollections = milkCollection?.filter(
    (entry) => entry.farmerId.toString() === farmerId
  );

  const handleCheckboxChange = (collectionId) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(collectionId)
        ? prevSelected.filter((id) => id !== collectionId)
        : [...prevSelected, collectionId]
    );
  };

  const selectedCollections = filteredCollections?.filter((entry) =>
    selectedIds.includes(entry.collectionId)
  );

  const totalAmount = selectedCollections?.reduce(
    (sum, entry) => sum + (entry.totalAmount || 0),
    0
  );

  const handlePayment = () => {
    navigate(`/dashboard/milk-collection-operator/payment/${farmerId}`, {
      state: {
        referenceIds: selectedIds,
        amount: totalAmount,
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">
        Milk Collection History – Farmer #{farmerId}
      </h2>

      {loading && <p className="text-blue-500">Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {filteredCollections?.length > 0 ? (
        <ul className="space-y-4 max-h-[500px] overflow-y-auto">
          {filteredCollections.map((entry) => {
            const isPaid = entry.paymentId !== null && entry.paymentId !== undefined;

            return (
              <li
                key={entry.collectionId}
                className={`p-4 border rounded-md shadow-sm flex justify-between items-center ${
                  isPaid ? 'bg-green-50' : 'bg-gray-100'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p><strong>Date:</strong> {entry.date}</p>
                  <p><strong>Shift:</strong> {entry.shift}</p>
                  <p><strong>Quantity:</strong> {entry.quantityLitres} L</p>
                  <p><strong>Fat Content:</strong> {entry.fatContent}%</p>
                  <p><strong>Rate Applied:</strong> ₹{entry.rateApplied}</p>
                  <p><strong>Total Amount:</strong> ₹{entry.totalAmount}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    {isPaid ? (
                      <span className="text-green-600 font-semibold">Paid</span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">Unpaid</span>
                    )}
                  </p>
                </div>

                <div>
                  <input
                    type="checkbox"
                    disabled={isPaid}
                    checked={selectedIds.includes(entry.collectionId)}
                    onChange={() => handleCheckboxChange(entry.collectionId)}
                    className="w-5 h-5 accent-blue-600"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500 mt-4">No milk collection records found for this farmer.</p>
      )}

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Back
        </button>

        <div className="flex items-center gap-4">
          <p className="font-semibold text-lg">Total Selected: ₹{totalAmount.toFixed(2)}</p>
          <button
            onClick={handlePayment}
            disabled={selectedIds.length === 0}
            className={`${
              selectedIds.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white px-4 py-2 rounded`}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerDetail;
