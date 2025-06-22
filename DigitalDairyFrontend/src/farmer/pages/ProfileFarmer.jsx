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
    <div className="max-w-3xl mx-auto mt-14 bg-[#fefae0] shadow-2xl rounded-3xl px-8 py-14 text-[#3e2c23]">
      <h1 className="text-4xl font-extrabold text-center text-[#7f5539] mb-12 tracking-wide">
        👤 Farmer Profile
      </h1>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Name */}
        <div className="bg-white p-5 rounded-2xl border border-[#e6ccb2] shadow hover:shadow-md transition duration-200">
          <label className="block text-xs font-semibold text-[#9c6644] uppercase tracking-widest mb-1">
            Name
          </label>
          <p className="text-lg font-medium">{user.name || "N/A"}</p>
        </div>
  
        {/* Email */}
        <div className="bg-white p-5 rounded-2xl border border-[#e6ccb2] shadow hover:shadow-md transition duration-200">
          <label className="block text-xs font-semibold text-[#9c6644] uppercase tracking-widest mb-1">
            Email
          </label>
          <p className="text-lg font-medium">{user.email || "N/A"}</p>
        </div>
  
        {/* Phone */}
        <div className="bg-white p-5 rounded-2xl border border-[#e6ccb2] shadow hover:shadow-md transition duration-200">
          <label className="block text-xs font-semibold text-[#9c6644] uppercase tracking-widest mb-1">
            Phone Number
          </label>
          <p className="text-lg font-medium">{user.phone || "N/A"}</p>
        </div>
  
        {/* Dairy ID */}
        <div className="bg-white p-5 rounded-2xl border border-[#e6ccb2] shadow hover:shadow-md transition duration-200">
          <label className="block text-xs font-semibold text-[#9c6644] uppercase tracking-widest mb-1">
            Dairy ID
          </label>
          <p className="text-lg font-medium">{user.dairyId || "N/A"}</p>
        </div>
  
        {/* Role */}
        <div className="bg-white p-5 rounded-2xl border border-[#e6ccb2] shadow hover:shadow-md transition duration-200">
          <label className="block text-xs font-semibold text-[#9c6644] uppercase tracking-widest mb-1">
            Role
          </label>
          <p className="text-lg font-medium capitalize">{user.role}</p>
        </div>
      </div>
    </div>
  );
  
  
};

export default ProfileFarmer;
