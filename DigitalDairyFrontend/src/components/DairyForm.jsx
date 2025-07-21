import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Chart from "chart.js/auto";
import { FaPaw, FaMapMarkerAlt, FaBuilding } from "react-icons/fa";

const DairyForm = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.dairy);
  const user = JSON.parse(localStorage.getItem("authUser"));
  const operatorId = user?.userId;

  let dairyid;
  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `http://localhost:8080/api/dairy-details/${operatorId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dairyid = response?.data?.dairyId;
      updateOperator();
    } catch (err) {
      console.error("Error creating dairy:", err);
      alert("Failed to create dairy. Please try again.");
    }
  };

  const updateOperator = async () => {
    try {
      if (operatorId && dairyid) {
        await axios.put(
          `http://localhost:8080/api/auth/users/${operatorId}/update-dairy-id`,
          {
            dairyId: dairyid,
          }
        );
        navigate("/dashboard");
      } else {
        console.error("Operator ID or Dairy ID is missing");
        alert("Failed to update operator. Please try again.");
      }
    } catch (error) {
      console.error("Error updating operator:", error);
    }
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
          label: "Milk Flow",
          data: labels.map((x) => Math.sin(x / 4)),
          borderColor: "#4ade80",
          backgroundColor: "rgba(74, 222, 128, 0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    };

    const chart = new Chart(ctx, {
      type: "line",
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
      chart.update("none");
      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      chart.destroy();
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
            <FaPaw />
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
          Create Your <span className="text-green-600">Dairy</span>
        </h2>

        {/* Dairy Name */}
        <div className="relative mb-4 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-500 group-focus-within:text-green-600 transition-colors">
            <FaBuilding />
          </div>
          <input
            type="text"
            name="name"
            placeholder="Dairy Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-3 py-3 rounded-lg border border-green-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
          />
        </div>

        {/* Location */}
        <div className="relative mb-6 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-500 group-focus-within:text-green-600 transition-colors">
            <FaMapMarkerAlt />
          </div>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-3 py-3 rounded-lg border border-green-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full font-semibold py-3 rounded-lg shadow-md transition duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            "Create Dairy"
          )}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded animate-shake">
            <p className="text-sm">{error}</p>
          </div>
        )}
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default DairyForm;