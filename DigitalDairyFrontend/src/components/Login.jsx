import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(credentials);
    if (success) navigate("/redirect");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8E7] px-4 sm:px-6 lg:px-8 transition-all duration-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl w-full max-w-md animate-fade-in border border-[#e6d4b2]"
      >
        <h2 className="text-3xl font-extrabold text-center mb-8 text-[#6B4226] tracking-tight">
          🔐 Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-4 border border-[#d6c4a8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition duration-300"
          value={credentials.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-2 mb-6 border border-[#d6c4a8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] transition duration-300"
          value={credentials.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-[#8B5E3C] hover:bg-[#6B4226] text-white font-semibold py-2 rounded-xl shadow-md transition duration-300 hover:scale-[1.02]"
        >
          Login
        </button>

        <p className="mt-5 text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#8B5E3C] font-semibold hover:underline">
            Sign up
          </Link>
        </p>
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
}
