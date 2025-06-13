import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import {
  FaHome,
  FaMoneyBill,
  FaFilm,
  FaClipboardList,
  FaUser,
  FaCrown,
  FaList,
  FaUsers,
  FaBars,
} from "react-icons/fa";

const Dashboard = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const menuMap = {
    farmer: [
      { name: "Home", path: "/dashboard/home-farmer", icon: <FaHome /> },
      { name: "Revenue", path: "/dashboard/revenue-farmer", icon: <FaMoneyBill /> },
      { name: "Profile", path: "/dashboard/profile-farmer", icon: <FaUser /> },
    ],
    operator: [
      { name: "Home", path: "/dashboard/home-operator", icon: <FaHome /> },
      { name: "Bookings", path: "/dashboard/bookings-operator", icon: <FaClipboardList /> },
      { name: "Profile", path: "/dashboard/profile-operator", icon: <FaUser /> },
    ],
    admin: [
      { name: "Home", path: "/dashboard/home-admin", icon: <FaHome /> },
      { name: "Operators", path: "/dashboard/operators-admin", icon: <FaUsers /> },
      { name: "Farmers", path: "/dashboard/farmers-admin", icon: <FaList /> },
      { name: "Profile", path: "/dashboard/profile-admin", icon: <FaUser /> },
    ],
    client: [
      { name: "Home", path: "/dashboard/home-client", icon: <FaHome /> },
      { name: "Profile", path: "/dashboard/profile-client", icon: <FaUser /> },
    ],
  };

  const role = user?.role?.toLowerCase();
  // console.log(role);
  
  const menuItems = menuMap[role] || [];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white h-full fixed top-0 left-0 ${isOpen ? "w-64" : "w-20"} transition-all duration-300 p-4`}>
        {/* Toggle Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-lg font-bold ${isOpen ? "block" : "hidden"}`}>
            Dashboard
          </h1>
          <FaBars className="text-2xl cursor-pointer" onClick={toggleSidebar} />
        </div>

        {/* Sidebar Menu */}
        <ul className="space-y-4 mt-4">
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <NavLink
                to={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-500 transition-all duration-300"
              >
                <span className="text-xl">{item.icon}</span>
                <span className={`${isOpen ? "block" : "hidden"}`}>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Topbar */}
      <div className="flex-1 flex flex-col ml-20 sm:ml-64">
        <div className="bg-gray-900 text-white h-16 flex justify-between items-center px-6 shadow-md fixed top-0 left-0 w-full z-50 ml-0 sm:ml-64">
          <h1 className="text-xl font-bold">Welcome, {user?.name || "User"}</h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
