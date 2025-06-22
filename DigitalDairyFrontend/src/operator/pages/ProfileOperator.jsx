import React from "react";
import { useAuth } from "../../AuthContext/AuthContext";

const ProfileOperator = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center mt-20 text-red-600 bg-amber-50 p-4 rounded-lg border border-amber-200 max-w-md mx-auto animate-fade-in">
        User not logged in or data unavailable.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-14 bg-amber-50 shadow-xl rounded-3xl px-8 py-14 border border-amber-100 animate-fade-in-up">
      <h1 className="text-4xl font-extrabold text-center text-stone-800 mb-10 tracking-tight">
        <span className="inline-block animate-wiggle">👤</span> Dairy Operator Profile
      </h1>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-stone-700">
        <div className="bg-amber-100/30 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-amber-200">
          <label className="block text-sm font-semibold text-stone-600 uppercase tracking-wide mb-2">
            Name
          </label>
          <p className="text-lg font-medium text-stone-800">
            {user.name || <span className="text-stone-400">N/A</span>}
          </p>
        </div>
  
        <div className="bg-amber-100/30 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-amber-200">
          <label className="block text-sm font-semibold text-stone-600 uppercase tracking-wide mb-2">
            Email
          </label>
          <p className="text-lg font-medium text-stone-800 break-all">
            {user.email || <span className="text-stone-400">N/A</span>}
          </p>
        </div>
  
        <div className="bg-amber-100/30 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-amber-200">
          <label className="block text-sm font-semibold text-stone-600 uppercase tracking-wide mb-2">
            Phone Number
          </label>
          <p className="text-lg font-medium text-stone-800">
            {user.phone || <span className="text-stone-400">N/A</span>}
          </p>
        </div>
  
        <div className="bg-amber-100/30 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-amber-200">
          <label className="block text-sm font-semibold text-stone-600 uppercase tracking-wide mb-2">
            Role
          </label>
          <p className="text-lg font-medium text-stone-800 capitalize">
            {user.role || <span className="text-stone-400">N/A</span>}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileOperator;