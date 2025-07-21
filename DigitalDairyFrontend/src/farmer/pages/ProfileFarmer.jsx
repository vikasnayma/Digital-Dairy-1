import React from "react";
import { useAuth } from "../../AuthContext/AuthContext";

const ProfileFarmer = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center mt-10 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg max-w-md mx-auto">
        <p className="font-medium">User not logged in or data unavailable.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 sm:mt-10 bg-white shadow-sm rounded-xl px-4 sm:px-8 py-8 sm:py-10 border border-green-50">
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">
          👨‍🌾 Farmer Profile
        </h1>
        <p className="text-green-600">View and manage your account details</p>
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Name */}
        <div className="bg-green-50 p-4 sm:p-5 rounded-lg border border-green-100 hover:shadow-md transition duration-200">
          <label className="block text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
            Name
          </label>
          <p className="text-base sm:text-lg font-medium text-gray-800">
            {user.name || <span className="text-gray-400">N/A</span>}
          </p>
        </div>
  
        {/* Email */}
        <div className="bg-green-50 p-4 sm:p-5 rounded-lg border border-green-100 hover:shadow-md transition duration-200">
          <label className="block text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
            Email
          </label>
          <p className="text-base sm:text-lg font-medium text-gray-800">
            {user.email || <span className="text-gray-400">N/A</span>}
          </p>
        </div>
  
        {/* Phone */}
        <div className="bg-green-50 p-4 sm:p-5 rounded-lg border border-green-100 hover:shadow-md transition duration-200">
          <label className="block text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
            Phone Number
          </label>
          <p className="text-base sm:text-lg font-medium text-gray-800">
            {user.phone || <span className="text-gray-400">N/A</span>}
          </p>
        </div>
  
        {/* Dairy ID */}
        <div className="bg-green-50 p-4 sm:p-5 rounded-lg border border-green-100 hover:shadow-md transition duration-200">
          <label className="block text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
            Dairy ID
          </label>
          <p className="text-base sm:text-lg font-medium text-gray-800">
            {user.dairyId || <span className="text-gray-400">N/A</span>}
          </p>
        </div>
  
        {/* Role */}
        <div className="bg-green-50 p-4 sm:p-5 rounded-lg border border-green-100 hover:shadow-md transition duration-200">
          <label className="block text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
            Role
          </label>
          <p className="text-base sm:text-lg font-medium text-gray-800 capitalize">
            {user.role || <span className="text-gray-400">N/A</span>}
          </p>
        </div>

        {/* Additional Info (if available) */}
        {user.address && (
          <div className="bg-green-50 p-4 sm:p-5 rounded-lg border border-green-100 hover:shadow-md transition duration-200 sm:col-span-2">
            <label className="block text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
              Address
            </label>
            <p className="text-base sm:text-lg font-medium text-gray-800">
              {user.address}
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-green-100 text-center">
        <p className="text-sm text-green-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ProfileFarmer;