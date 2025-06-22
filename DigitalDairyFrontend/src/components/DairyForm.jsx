import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createDairy } from '../Redux/Slices/dairyActions';
import { useNavigate } from 'react-router-dom';

const DairyForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.dairy);

  const [formData, setFormData] = useState({
    name: '',
    location: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createDairy(formData));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8E7] px-4 sm:px-6 lg:px-8 transition-all duration-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl w-full max-w-md animate-fade-in border border-[#e6d4b2]"
      >
        <h2 className="text-3xl font-extrabold text-center mb-8 text-[#6B4226] tracking-tight">
          🐄 Create Your Dairy
        </h2>

        <div className="mb-6">
          <label className="block font-semibold text-gray-700 mb-1">Dairy Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. Shree Dairy"
            className="w-full border border-[#d6c4a8] p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition duration-300"
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="e.g. Jaipur, Rajasthan"
            className="w-full border border-[#d6c4a8] p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition duration-300"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-xl shadow-md transition duration-300 hover:scale-[1.02] ${
            loading ? "bg-[#B08968] cursor-not-allowed" : "bg-[#8B5E3C] hover:bg-[#6B4226]"
          }`}
        >
          {loading ? 'Creating...' : 'Create Dairy'}
        </button>

        {error && (
          <p className="text-red-600 text-sm mt-4 text-center">{error}</p>
        )}
      </form>

      {/* Animation */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DairyForm;
