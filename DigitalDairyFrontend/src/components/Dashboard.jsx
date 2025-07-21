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
  FaSignOutAlt,
  FaHistory,
  FaCalendarAlt,
  FaExchangeAlt,
  FaChartLine,
  FaCommentAlt
} from "react-icons/fa";

const Dashboard = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
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
      {
        name: "Milk Collection History",
        path: "/dashboard/milk-collection-history-farmer",
        icon: <FaHistory />,
      },
      {
        name: "Pre Milk Bookings",
        path: "/dashboard/pre-booking-farmer",
        icon: <FaCalendarAlt />,
      },
      {
        name: "Revenue",
        path: "/dashboard/revenue-farmer",
        icon: <FaChartLine />,
      },
      { name: "Profile", path: "/dashboard/profile-farmer", icon: <FaUser /> },
      { name: "Chat", path: "/dashboard/chat-farmer", icon: <FaCommentAlt /> },
    ],
    operator: [
      { name: "Home", path: "/dashboard/home-operator", icon: <FaHome /> },
      {
        name: "Bookings",
        path: "/dashboard/bookings-operator",
        icon: <FaCalendarAlt />,
      },
      {
        name: "Farmers",
        path: "/dashboard/farmers-operator",
        icon: <FaUsers />,
      },
      {
        name: "Milk Collection",
        path: "/dashboard/milk-collection-operator",
        icon: <FaClipboardList />,
      },
      {
        name: "Milk Exportation",
        path: "/dashboard/exportation-operator",
        icon: <FaExchangeAlt />,
      },
      {
        name: "Milk Rates",
        path: "/dashboard/milk-rates",
        icon: <FaMoneyBill />,
      },
      {
        name: "Profile",
        path: "/dashboard/profile-operator",
        icon: <FaUser />,
      },
      { name: "Chat", path: "/dashboard/chat-operator", icon: <FaCommentAlt /> },
    ],
    admin: [
      { name: "Home", path: "/dashboard/home-admin", icon: <FaHome /> },
      {
        name: "Operators",
        path: "/dashboard/operators-admin",
        icon: <FaUsers />,
      },
      { name: "Farmers", path: "/dashboard/farmers-admin", icon: <FaList /> },
      { name: "Profile", path: "/dashboard/profile-admin", icon: <FaUser /> },
    ],
    client: [
      {
        name: "Collection History",
        path: "/dashboard/exportation-client",
        icon: <FaHistory />,
      },
      { name: "Profile", path: "/dashboard/profile-client", icon: <FaUser /> },
    ],
  };

  const role = user?.role?.toLowerCase();
  const menuItems = menuMap[role] || [];

  return (
    <div className="flex min-h-screen bg-green-50 text-gray-800 font-sans">
      {/* Sidebar Toggle Button (Top Left Corner) */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-full shadow-md hover:bg-green-100 transition-colors"
        >
          <FaBars className="text-xl text-green-700" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-20"
        } bg-white shadow-lg border-r border-green-100`}
      >
        <div className="relative px-4 py-4 border-b border-green-100 flex items-center bg-green-600">
          <button
            onClick={toggleSidebar}
            className="text-xl text-white mr-3 hover:text-green-100 transition-colors"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h1
            className={`text-xl font-bold text-white transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            Dairy Dashboard
          </h1>
        </div>

        <ul className="mt-6 space-y-2 px-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-green-100 text-green-800 font-medium"
                      : "hover:bg-green-50 text-gray-700"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`text-lg ${isActive ? 'text-green-600' : 'text-green-500'}`}>
                      {item.icon}
                    </span>
                    {isOpen && <span className="text-base">{item.name}</span>}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ml-0 ${
          isOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        {/* Topbar */}
        <header
          className={`h-16 flex items-center justify-between px-6 bg-white shadow-sm transition-all duration-300 z-30 fixed top-0 w-full ${
            isOpen ? "md:left-64" : "md:left-20"
          }`}
        >
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-green-800">
              Welcome, {user?.name || "User"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-md flex items-center gap-2 mr-64"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </header>
      </main>
    </div>
  );
};

export default Dashboard;