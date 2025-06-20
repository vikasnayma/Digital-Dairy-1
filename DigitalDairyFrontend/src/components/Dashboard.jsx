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
    <div className="flex h-screen bg-gray-100">
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-gradient-to-b from-gray-800 to-gray-900 text-white h-full fixed top-0 left-0 ${
          isOpen ? "w-64" : "w-20"
        } transition-all duration-300 z-50 shadow-xl`}
      >
        <div className="h-full flex flex-col p-4">
          {/* Toggle Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-xl font-bold ${isOpen ? "block" : "hidden"}`}>
              Dashboard
            </h1>
            {isOpen ? (
              <FaTimes
                className="text-xl cursor-pointer hover:text-red-400 transition-colors"
                onClick={toggleSidebar}
              />
            ) : (
              <FaBars
                className="text-xl cursor-pointer hover:text-red-400 transition-colors"
                onClick={toggleSidebar}
              />
            )}
          </div>

          {/* Sidebar Menu */}
          <ul className="space-y-2 mt-4">
            {menuItems.map((item, idx) => (
              <li key={idx}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200 ${
                      isActive
                        ? "bg-red-600 text-white shadow-md"
                        : "hover:bg-gray-700 hover:text-red-400"
                    }`
                  }
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className={`${isOpen ? "block" : "hidden"}`}>
                    {item.name}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isOpen ? "ml-0 md:ml-64" : "ml-0 md:ml-20"
        }`}
      >
        {/* Topbar */}
        <div
          className={`bg-gradient-to-r from-gray-800 to-gray-900 text-white h-16 flex justify-between items-center px-4 sm:px-6 shadow-md fixed top-0 right-0 ${
            isOpen ? "left-0 md:left-64" : "left-0 md:left-20"
          } z-40 transition-all duration-300`}
        >
          <div className="flex items-center">
            {isMobile && (
              <FaBars
                className="text-xl mr-4 cursor-pointer hover:text-red-400 transition-colors"
                onClick={toggleSidebar}
              />
            )}
            <h1 className="text-lg sm:text-xl font-bold">
              Welcome, {user?.name || "User"}
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base transition-colors duration-200 shadow hover:shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;