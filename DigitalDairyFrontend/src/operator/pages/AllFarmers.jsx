import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFarmersByDairy, getDairyDetails } from '../../Redux/Slices/dairyActions';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    <motion.div
      className="min-h-screen w-full px-4 py-10 mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-green-100">
        <h2 className="text-3xl font-bold text-center mb-8 pb-6 border-b border-green-200 text-green-800">
          Farmers in Your Dairy
        </h2>

        {loading && (
          <p className="text-center text-green-700 animate-pulse py-4">
            Loading farmers...
          </p>
        )}
        {error && (
          <p className="text-center text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </p>
        )}

        {allFarmers?.length === 0 && !loading ? (
          <p className="text-center text-gray-600 bg-green-100 p-4 rounded-lg shadow-inner">
            No farmers found for this dairy.
          </p>
        ) : (
          <ul className="divide-y divide-green-100">
            {allFarmers?.map((farmer) => (
              <motion.li
                key={farmer.user_id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-5 px-4 hover:bg-green-50 transition-all rounded-lg"
                whileHover={{ scale: 1.01 }}
              >
                <div className="mb-3 sm:mb-0">
                  <p className="text-lg font-semibold text-gray-800">{farmer.name}</p>
                  <p className="text-md font-medium text-gray-700">ID: {farmer.user_id}</p>
                  <p className="text-sm text-gray-600">Phone: {farmer.phone}</p>
                  <p className="text-sm text-gray-600">Email: {farmer.email}</p>
                </div>
                <button
                  onClick={() => handleViewDetails(farmer.user_id)}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg shadow-md transition-colors"
                >
                  View Details
                </button>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}