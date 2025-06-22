import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';

export default function SignupForm() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'farmer',
    dairyId: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...formData };
    if (submitData.role !== 'farmer' && submitData.role !== 'client') {
      delete submitData.dairyId;
    }

    signup(submitData);
    navigate(formData.role === 'operator' ? '/dairy-create' : '/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8E7] px-4 sm:px-6 lg:px-8 transition-all duration-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl w-full max-w-md animate-fade-in border border-[#e6d4b2]"
      >
        <h2 className="text-3xl font-extrabold text-center mb-8 text-[#6B4226] tracking-tight">
          🍂 Sign Up
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full px-4 py-2 mb-4 border border-[#d6c4a8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition duration-300"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-4 border border-[#d6c4a8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition duration-300"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-2 mb-4 border border-[#d6c4a8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition duration-300"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="w-full px-4 py-2 mb-4 border border-[#d6c4a8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition duration-300"
          value={formData.phone}
          onChange={handleChange}
        />

        <select
          name="role"
          className="w-full px-4 py-2 mb-6 border border-[#d6c4a8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition duration-300"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="farmer">Farmer</option>
          <option value="operator">Operator</option>
          <option value="client">Client</option>
        </select>

        {(formData.role === 'farmer' || formData.role === 'client') && (
          <input
            type="number"
            name="dairyId"
            placeholder="Enter Dairy ID"
            className="w-full px-4 py-2 mb-6 border border-[#d6c4a8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition duration-300"
            value={formData.dairyId}
            onChange={handleChange}
            required
          />
        )}

        <button
          type="submit"
          className="w-full bg-[#8B5E3C] hover:bg-[#6B4226] text-white font-semibold py-2 rounded-xl shadow-md transition duration-300 hover:scale-[1.02]"
        >
          Register
        </button>

        <p className="mt-5 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-[#8B5E3C] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>

      {/* Animation style */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
