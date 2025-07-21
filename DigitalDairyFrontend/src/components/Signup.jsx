import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import Chart from 'chart.js/auto';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaLeaf, FaPaw } from 'react-icons/fa';

export default function SignupForm() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const canvasRef = useRef();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'farmer',
    dairyId: ''
  });

  // Milk flow chart background
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    let frameId;
    let offset = 0;

    const labels = Array.from({ length: 50 }, (_, i) => i);

    const data = {
      labels,
      datasets: [
        {
          label: 'Milk Flow',
          data: labels.map((x) => Math.sin(x / 4)),
          borderColor: '#4ade80',
          backgroundColor: 'rgba(74, 222, 128, 0.2)',
          fill: true,
          tension: 0.4,
        },
      ],
    };

    const chart = new Chart(ctx, {
      type: 'line',
      data,
      options: {
        responsive: true,
        animation: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: { display: false },
        },
      },
    });

    const animate = () => {
      offset += 0.1;
      chart.data.datasets[0].data = labels.map(
        (x) => Math.sin((x + offset) / 4) * 2
      );
      chart.update('none');
      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      chart.destroy();
    };
  }, []);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4 transition-all duration-500 font-sans text-gray-800 relative overflow-hidden">
      
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute w-[500px] h-[300px] top-0 left-0 opacity-10 blur-2xl pointer-events-none z-0"
      />

      {/* Floating dairy icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-300 opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            {Math.random() > 0.5 ? <FaLeaf /> : <FaPaw />}
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="z-10 bg-white/90 backdrop-blur-sm border border-green-200 shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-md animate-fade-in"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <FaPaw className="text-green-600 text-3xl" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-6 tracking-tight">
          Join <span className="text-green-600">DairyPro</span>
        </h2>

        {/* Name */}
        <div className="relative mb-4 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-500 group-focus-within:text-green-600 transition-colors">
            <FaUser />
          </div>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full pl-10 pr-3 py-3 rounded-lg border border-green-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="relative mb-4 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-500 group-focus-within:text-green-600 transition-colors">
            <FaEnvelope />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full pl-10 pr-3 py-3 rounded-lg border border-green-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="relative mb-4 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-500 group-focus-within:text-green-600 transition-colors">
            <FaLock />
          </div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full pl-10 pr-3 py-3 rounded-lg border border-green-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone */}
        <div className="relative mb-4 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-500 group-focus-within:text-green-600 transition-colors">
            <FaPhone />
          </div>
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            className="w-full pl-10 pr-3 py-3 rounded-lg border border-green-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Role Selector */}
        <div className="relative mb-4">
          <select
            name="role"
            className="w-full px-4 py-3 rounded-lg border border-green-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 appearance-none"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="farmer">Farmer</option>
            <option value="operator">Operator</option>
            <option value="client">Client</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Dairy ID if needed */}
        {(formData.role === 'farmer' || formData.role === 'client') && (
          <input
            type="number"
            name="dairyId"
            placeholder="Enter Dairy ID"
            className="w-full px-4 py-3 mb-6 rounded-lg border border-green-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
            value={formData.dairyId}
            onChange={handleChange}
            required
          />
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
        >
          <span>Register</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </button>

        {/* Redirect */}
        <p className="mt-5 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-green-600 font-semibold hover:underline hover:text-green-700 transition-colors"
          >
            Login
          </Link>
        </p>
      </form>

      {/* Animation */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}