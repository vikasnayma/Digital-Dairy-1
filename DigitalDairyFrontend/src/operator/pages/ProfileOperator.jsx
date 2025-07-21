import React from "react";
import { useAuth } from "../../AuthContext/AuthContext";
import { motion } from "framer-motion";

const ProfileOperator = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mt-20 text-red-600 bg-red-50 p-4 rounded-lg border border-red-200 max-w-md mx-auto"
      >
        User not logged in or data unavailable.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen px-4 mt-14 pt-10 pb-20"
    >
      <div className="max-w-4xl mx-auto bg-white text-gray-800 rounded-2xl shadow-lg p-8 md:p-12 border border-green-200">
        <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-center text-green-800">
          <span className="inline-block">👤</span> Dairy Operator Profile
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-green-200 hover:border-green-300">
            <label className="block text-sm font-semibold mb-2 uppercase tracking-wide text-green-700">Name</label>
            <p className="text-lg font-medium">
              {user.name || <span className="text-gray-400">N/A</span>}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-green-200 hover:border-green-300">
            <label className="block text-sm font-semibold mb-2 uppercase tracking-wide text-green-700">Email</label>
            <p className="text-lg font-medium break-all">
              {user.email || <span className="text-gray-400">N/A</span>}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-green-200 hover:border-green-300">
            <label className="block text-sm font-semibold mb-2 uppercase tracking-wide text-green-700">Phone Number</label>
            <p className="text-lg font-medium">
              {user.phone || <span className="text-gray-400">N/A</span>}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-green-200 hover:border-green-300">
            <label className="block text-sm font-semibold mb-2 uppercase tracking-wide text-green-700">Role</label>
            <p className="text-lg font-medium capitalize">
              {user.role || <span className="text-gray-400">N/A</span>}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileOperator;