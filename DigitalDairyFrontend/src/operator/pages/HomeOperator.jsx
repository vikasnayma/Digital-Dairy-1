import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDairyDetails } from "../../Redux/Slices/dairyActions";
import { motion } from "framer-motion";

const HomeOperator = () => {
  const dispatch = useDispatch();
  const { dairy, loading, error } = useSelector((state) => state.dairy);

  useEffect(() => {
    dispatch(getDairyDetails());
  }, [dispatch]);

  if (loading) {
    return (
      <p className="text-center mt-8 text-green-700 font-medium animate-pulse">
        Loading dairy details...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-8 text-red-600 font-medium bg-red-50 p-3 rounded-lg border border-red-200">
        {error}
      </p>
    );
  }

  if (!dairy) {
    return (
      <p className="text-center mt-8 text-gray-500 bg-green-50 p-4 rounded-lg shadow-inner">
        No dairy found for this operator.
      </p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full min-h-screen px-4 md:px-10 py-12"
    >
      <div className="max-w-3xl mx-auto mt-18 bg-white shadow-lg rounded-2xl px-8 py-10 border border-green-100">
        <h2 className="text-3xl font-extrabold text-center text-green-800 mb-8 pb-2 border-b border-green-200">
          Dairy Details
        </h2>
        <div className="space-y-5 text-base">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <span className="font-semibold w-36 text-gray-700">Name:</span>
            <span className="text-gray-800">{dairy.name}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <span className="font-semibold w-36 text-gray-700">Dairy ID:</span>
            <span className="text-gray-800">{dairy.dairyId}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <span className="font-semibold w-36 text-gray-700">Operator ID:</span>
            <span className="text-gray-800">{dairy.operatorId}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <span className="font-semibold w-36 text-gray-700">Location:</span>
            <span className="text-gray-800">{dairy.location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeOperator;