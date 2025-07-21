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
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-green-100">
      <h2 className="text-2xl font-bold text-green-800 mb-6 pb-2 border-b border-green-200">
        Milk Collection History – Farmer #{farmerId}
      </h2>

      {loading && (
        <p className="text-green-700 animate-pulse py-4 text-center">
          Loading data...
        </p>
      )}
      {error && (
        <p className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 text-center">
          {error}
        </p>
      )}

      {filteredCollections?.length > 0 ? (
        <ul className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {filteredCollections.map((entry) => {
            const isPaid = entry.paymentId !== null && entry.paymentId !== undefined;

            return (
              <li
                key={entry.collectionId}
                className={`p-4 border rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                  isPaid ? 'bg-green-50 border-green-200' : 'bg-white border-green-200 hover:bg-green-50'
                } transition-all hover:shadow-md`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  <div>
                    <p className="text-gray-600"><span className="font-semibold text-gray-700">Date:</span> {entry.date}</p>
                    <p className="text-gray-600"><span className="font-semibold text-gray-700">Shift:</span> {entry.shift}</p>
                  </div>
                  <div>
                    <p className="text-gray-600"><span className="font-semibold text-gray-700">Quantity:</span> {entry.quantityLitres} L</p>
                    <p className="text-gray-600"><span className="font-semibold text-gray-700">Fat Content:</span> {entry.fatContent}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600"><span className="font-semibold text-gray-700">Rate:</span> ₹{entry.rateApplied}</p>
                    <p className="text-gray-600"><span className="font-semibold text-gray-700">Amount:</span> ₹{entry.totalAmount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-auto">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isPaid 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                  <input
                    type="checkbox"
                    disabled={isPaid}
                    checked={selectedIds.includes(entry.collectionId)}
                    onChange={() => handleCheckboxChange(entry.collectionId)}
                    className="w-5 h-5 accent-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500 mt-4 p-4 bg-green-50 rounded-lg text-center">
          No milk collection records found for this farmer.
        </p>
      )}

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-green-200 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-all hover:shadow-md"
        >
          Back
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <p className="font-semibold text-lg text-green-800">
            Total Selected: ₹{totalAmount?.toFixed(2) || '0.00'}
          </p>
          <button
            onClick={handlePayment}
            disabled={selectedIds.length === 0}
            className={`${
              selectedIds.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white px-4 py-2 rounded-md transition-all hover:shadow-md`}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerDetail;