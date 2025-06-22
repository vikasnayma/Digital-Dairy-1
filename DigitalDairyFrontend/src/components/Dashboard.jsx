import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import {
  FaHome,
  FaMoneyBill,
  FaClipboardList,
  FaUser,
  FaList,
  FaUsers,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Dashboard = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const menuMap = {
    farmer: [
      // { name: "Home", path: "/dashboard/home-farmer", icon: <FaHome /> },
      { name: "Milk Collection History", path: "/dashboard/milk-collection-history-farmer", icon: <FaClipboardList /> },
      { name: "Pre Milk Bookings", path: "/dashboard/pre-booking-farmer", icon: <FaClipboardList /> },
      { name: "Revenue", path: "/dashboard/revenue-farmer", icon: <FaMoneyBill /> },
      { name: "Profile", path: "/dashboard/profile-farmer", icon: <FaUser /> },
    ],
    operator: [
      { name: "Home", path: "/dashboard/home-operator", icon: <FaHome /> },
      { name: "Bookings", path: "/dashboard/bookings-operator", icon: <FaClipboardList /> },
      { name: "Farmers", path: "/dashboard/farmers-operator", icon: <FaUser /> },
      { name: "Milk Collection", path: "/dashboard/milk-collection-operator", icon: <FaClipboardList /> },
      { name: "Milk Exportation", path: "/dashboard/exportation-operator", icon: <FaClipboardList /> },
      { name: "Milk Rates", path: "/dashboard/milk-rates", icon: <FaClipboardList /> },
      { name: "Profile", path: "/dashboard/profile-operator", icon: <FaUser /> },
    ],
    admin: [
      { name: "Home", path: "/dashboard/home-admin", icon: <FaHome /> },
      { name: "Operators", path: "/dashboard/operators-admin", icon: <FaUsers /> },
      { name: "Farmers", path: "/dashboard/farmers-admin", icon: <FaList /> },
      { name: "Profile", path: "/dashboard/profile-admin", icon: <FaUser /> },
    ],
    client: [
      // { name: "Home", path: "/dashboard/home-client", icon: <FaHome /> },
      { name: "Collection History", path: "/dashboard/exportation-client", icon: <FaClipboardList /> },
      { name: "Profile", path: "/dashboard/profile-client", icon: <FaUser /> },
      
    ],
  };

  const role = user?.role?.toLowerCase();
  const menuItems = menuMap[role] || [];

  return (
    <div className="flex h-screen bg-[#fefae0] text-[#3e2c23] font-sans relative overflow-hidden">
  {/* Overlay for mobile */}
  {isMobile && isOpen && (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={toggleSidebar}
    />
  )}

  {/* Sidebar */}
  <div
    className={`fixed top-0 left-0 h-full transition-all duration-300 z-50 shadow-xl 
      ${isOpen ? "w-64" : "w-20"} 
      bg-[#7f5539] text-white rounded-tr rounded-br-3xl`}
  >
    <div className="h-full flex flex-col">
      {/* Toggle Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 border-b border-[#b08968]">
        <h1
          className={`text-2xl font-bold transition-all duration-300 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          Dashboard
        </h1>
        <button
          onClick={toggleSidebar}
          className="text-xl hover:text-[#fefae0] transition"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menu */}
      <ul className="flex-1 px-4 py-6 space-y-3">
        {menuItems.map((item, idx) => (
          <li key={idx}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-[#9c6644] text-white shadow-inner"
                    : "hover:bg-[#9c6644]/90 hover:text-[#fff3cc]"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span
                className={`text-base font-medium transition-opacity duration-200 ${
                  isOpen ? "opacity-100" : "opacity-0 hidden"
                }`}
              >
                {item.name}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  </div>

  {/* Main Content Area */}
  <div
    className={`flex-1 flex flex-col transition-all duration-300 h-full ${
      isOpen ? "ml-64" : "ml-20"
    }`}
  >
    {/* Topbar */}
    <div
      className="bg-[#9c6644] text-white h-16 flex justify-between items-center px-6 shadow-md 
      fixed top-0 right-0 z-40 transition-all duration-300 rounded-bl-3xl"
      style={{ left: isOpen ? "16rem" : "5rem" }}
    >
      <div className="flex items-center gap-4">
        {isMobile && (
          <FaBars
            className="text-xl cursor-pointer hover:text-[#fefae0]"
            onClick={toggleSidebar}
          />
        )}
        <h1 className="text-lg sm:text-xl font-semibold tracking-wide">
          Welcome, {user?.name || "User"}
        </h1>
      </div>

      <button
        onClick={handleLogout}
        className="bg-[#b08968] hover:bg-[#a47148] text-white px-4 py-2 rounded-full 
        text-sm sm:text-base transition-all duration-200 shadow-md"
      >
        Logout
      </button>
    </div>
  </div>
</div>

  );
};

export default Dashboard;