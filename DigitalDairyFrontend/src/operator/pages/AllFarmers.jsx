import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFarmersByDairy , getDairyDetails } from '../../Redux/Slices/dairyActions';
import { useNavigate } from 'react-router-dom';

export default function AllFarmers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { allFarmers, loading, error } = useSelector((state) => state.allFarmers);
  const { dairy } = useSelector((state) => state.dairy);

   useEffect(() => {
      dispatch(getDairyDetails());
    }, [dispatch]);

   useEffect(() => {
      if (dairy?.dairyId) {
        dispatch(fetchAllFarmersByDairy(dairy.dairyId));
      }
    }, [dairy, dispatch]);

  const handleViewDetails = (farmerId) => {
    navigate(`/dashboard/farmer-details/${dairy.dairyId}/${farmerId}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Farmers in Your Dairy</h2>

      {loading && <p className="text-center text-blue-500">Loading farmers...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {allFarmers?.length === 0 && !loading ? (
        <p className="text-center text-gray-600">No farmers found for this dairy.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {allFarmers?.map((farmer) => (
            <li
              key={farmer.user_id}
              className="flex justify-between items-center py-4 px-4 hover:bg-gray-50 transition-all"
            >
              <div>
                <p className="text-lg font-medium text-gray-800">{farmer.name}</p>
                <p className="text-sm text-gray-500">Phone: {farmer.phone}</p>
                <p className="text-sm text-gray-500">Email: {farmer.email}</p>
              </div>
              <button
                onClick={() => handleViewDetails(farmer.user_id)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all"
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
