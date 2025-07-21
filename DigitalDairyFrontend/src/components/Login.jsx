import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import Chart from 'chart.js/auto';
import { FaEnvelope, FaLock, FaLeaf, FaPaw } from 'react-icons/fa';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const canvasRef = useRef();
  const particlesRef = useRef([]);

  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(credentials);
    if (success) navigate("/redirect");
  };

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

  // Floating dairy particles animation
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 20;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 15 + 5,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.5 + 0.1,
        angle: Math.random() * Math.PI * 2,
        type: Math.random() > 0.5 ? 'leaf' : 'cow'
      });
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;
        
        // Reset particles that go off screen
        if (particle.x < 0 || particle.x > canvas.width || 
            particle.y < 0 || particle.y > canvas.height) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.angle = Math.random() * Math.PI * 2;
        }

        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = '#4ade80';
        
        if (particle.type === 'leaf') {
          // Draw leaf shape
          ctx.beginPath();
          ctx.ellipse(0, 0, particle.size, particle.size/2, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Draw simple cow shape
          ctx.beginPath();
          ctx.ellipse(0, 0, particle.size, particle.size/1.5, 0, 0, Math.PI * 2);
          ctx.fill();
          // Spots
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(-particle.size/3, -particle.size/4, particle.size/4, 0, Math.PI * 2);
          ctx.arc(particle.size/3, particle.size/4, particle.size/5, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      });

      requestAnimationFrame(animateParticles);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.body.removeChild(canvas);
    };
  }, []);

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
      {Math.random() > 0.5 ? <FaLeaf /> : <FaPaw />}  {/* Using FaPaw as alternative */}
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
          Welcome to <span className="text-green-600">DairyPro</span>
        </h2>

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
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="relative mb-6 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-500 group-focus-within:text-green-600 transition-colors">
            <FaLock />
          </div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full pl-10 pr-3 py-3 rounded-lg border border-green-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
        >
          <span>Login</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </button>

        {/* Redirect */}
        <p className="mt-5 text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-green-600 font-semibold hover:underline hover:text-green-700 transition-colors"
          >
            Sign up
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