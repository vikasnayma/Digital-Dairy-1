import React from "react";
import { useAuth  } from "../../AuthContext/AuthContext";

const ProfileFarmer = () => {
  const { user } = useAuth();


  if (!user) {
    return (
      <div className="text-center mt-20 text-red-500 font-medium text-lg">
        User not logged in or data unavailable.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-14 bg-white shadow-2xl rounded-3xl px-8 py-14 border border-gray-100">
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-10 tracking-tight">
        👤 Farmer Profile
      </h1>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-gray-700">
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Name
          </label>
          <p className="text-lg font-medium">{user.name || "N/A"}</p>
        </div>
  
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Email
          </label>
          <p className="text-lg font-medium">{user.email || "N/A"}</p>
        </div>
  
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Phone Number
          </label>
          <p className="text-lg font-medium">{user.phone || "N/A"}</p>
        </div>
  
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Dairy ID
          </label>
          <p className="text-lg font-medium">{user.dairyId || "N/A"}</p>
        </div>
  
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Role
          </label>
          <p className="text-lg font-medium capitalize">{user.role}</p>
        </div>
      </div>
    </div>
  );
  
};

export default ProfileFarmer;
