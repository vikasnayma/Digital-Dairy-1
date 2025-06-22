import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFarmersByDairy, getDairyDetails } from '../../Redux/Slices/dairyActions';
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
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-amber-50 rounded-xl shadow-lg border border-amber-100">
      <h2 className="text-3xl font-bold text-center text-stone-800 mb-8 pb-2 border-b border-amber-200">
        Farmers in Your Dairy
      </h2>

      {loading && (
        <p className="text-center text-amber-700 animate-pulse py-4">
          Loading farmers...
        </p>
      )}
      {error && (
        <p className="text-center text-red-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
          {error}
        </p>
      )}

      {allFarmers?.length === 0 && !loading ? (
        <p className="text-center text-stone-600 bg-amber-50 p-4 rounded-lg shadow-inner">
          No farmers found for this dairy.
        </p>
      ) : (
        <ul className="divide-y divide-amber-200">
          {allFarmers?.map((farmer) => (
            <li
              key={farmer.user_id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-5 px-4 hover:bg-amber-100/50 transition-all rounded-lg"
            >
              <div className="mb-3 sm:mb-0">
                <p className="text-lg font-semibold text-stone-800">{farmer.name}</p>
                <p className="text-md font-medium text-stone-700">ID: {farmer.user_id}</p>
                <p className="text-sm text-stone-600">Phone: {farmer.phone}</p>
                <p className="text-sm text-stone-600">Email: {farmer.email}</p>
              </div>
              <button
                onClick={() => handleViewDetails(farmer.user_id)}
                className="bg-amber-700 text-amber-50 px-4 py-2 rounded-md hover:bg-amber-800 hover:shadow-md transition-all focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
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