
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";

import DairyForm from "./components/DairyForm";
import ProtectedRoute from "./routes/ProtectedRoute";

import Layout from "./components/Layout";
import { useAuth } from "./AuthContext/AuthContext";
import FarmerChatComponent from "./components/FarmerChatComponent";
import OperatorChatComponent from "./components/OperatorChatComponent";

import HomeFarmer from "./farmer/pages/HomeFarmer";
import RevenueFarmer from "./farmer/pages/RevenueFarmer";
import ProfileFarmer from "./farmer/pages/ProfileFarmer";
import CollectionHistoryFarmer from './farmer/pages/CollectionHistoryFarmer'
import PreBookingFarmer from './farmer/pages/PreBookingFarmer'
import PreBookingPayment from "./farmer/pages/PreBookingPayment";


import BookingsOperator from "./operator/pages/BookingsOperator";
import ProfileOperator from "./operator/pages/ProfileOperator";
import HomeOperator from "./operator/pages/HomeOperator";
import MilkCollectionOperator from "./operator/pages/MilkCollectionOperator";
import MilkExportationOperator from "./operator/pages/MilkExportationOperator";
import PaymentMilkCollection from './operator/pages/PaymentMilkCollection';
import PaymentSuccessOperator from "./operator/pages/PaymentSuccessOperator";
import AllFarmers from "./operator/pages/AllFarmers";
import FarmerDetail from "./operator/pages/FarmerDetail";
import MilkRates from "./operator/pages/MilkRates";



import OperatorAdmin from "./admin/pages/OperatorAdmin";
import FarmerAdmin from "./admin/pages/FarmerAdmin";
import ProfileAdmin from "./admin/pages/ProfileAdmin";
import HomeAdmin from "./admin/pages/HomeAdmin";


import HomeClient from './clientdairy/pages/HomeClient'
import ProfileClient from './clientdairy/pages/ProfileClient'
import MilkExportationClient from './clientdairy/pages/MilkExportationClient'
import MilkExportationPayment from "./clientdairy/pages/MilkExportationPayment";


//Block login/signup if already logged in
const PublicRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/dashboard" replace />;
  return element;
};

//Redirect any logged-in user to dashboard
const AutoRedirect = () => {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  if (!role) return <Navigate to="/login" replace />;

  switch (role) {
    case "farmer":
      return <Navigate to="/dashboard/profile-farmer" replace />;
    case "operator":
      return <Navigate to="/dashboard/home-operator" replace />;
      case "client":
        return <Navigate to="/dashboard/profile-client" replace />;
    case "admin":
      return <Navigate to="/dashboard/home-admin" replace />;
    // case "client":
    //   return <Navigate to="/dashboard/home-client" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const App = () => {


  return (
    <div className="flex flex-col min-h-screen text-[#2A1F1C]
 overflow-x-hidden">
      <Router>

        <div className="flex-grow">
          <Routes>
            {/* Auto Redirect after login */}
            <Route path="/redirect" element={<AutoRedirect />} />

            {/* Public Routes */}
            <Route path="/" element={<PublicRoute element={<Login />} />} />
            <Route
              path="/signup"
              element={<PublicRoute element={<Signup />} />}
            />
  
            <Route
              path="/login"
              element={<PublicRoute element={<Login />} />}
            />
            <Route
              path="/dairy-create"
              element={<PublicRoute element={<DairyForm />} />}
            />

            {/* Farmer Routes */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Layout />} />}
            >
              <Route path="home-farmer" element={<HomeFarmer/>}></Route>
              <Route path="revenue-farmer" element={<RevenueFarmer/>}></Route>
              <Route path="profile-farmer" element={<ProfileFarmer/>}></Route>
              <Route path="milk-collection-history-farmer" element={<CollectionHistoryFarmer />}></Route>
              <Route path="pre-booking-farmer" element={<PreBookingFarmer />}></Route>
              <Route path="pre-booking-payment/:bookingId" element={<PreBookingPayment />}></Route>
              <Route path="chat-farmer" element={<FarmerChatComponent />}></Route>
            </Route>

            {/* Operator Routes */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Layout />} />}
            >
              <Route path="home-operator" element={<HomeOperator/>}></Route>
              <Route path="bookings-operator" element={<BookingsOperator/>}></Route>
              <Route path="profile-operator" element={<ProfileOperator/>}></Route>
              <Route path="farmers-operator" element={<AllFarmers/>}></Route>
              <Route path="farmer-details/:dairyId/:farmerId" element={<FarmerDetail/>}></Route>
              <Route path="milk-collection-operator" element={<MilkCollectionOperator/>}></Route>
              <Route path="exportation-operator" element={<MilkExportationOperator/>}></Route>
              <Route path="milk-collection-operator/payment/:farmerId" element={<PaymentMilkCollection/>}></Route>
              <Route path="payment-success-operator" element={<PaymentSuccessOperator/>}></Route>
              <Route path="milk-rates" element={<MilkRates/>}></Route>
              <Route path="chat-operator" element={<OperatorChatComponent />}></Route>
            </Route>

            {/* Admin Routes */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Layout />} />}
            >
               <Route path="home-admin" element={<HomeAdmin/>}></Route>
              <Route path="operators-admin" element={<OperatorAdmin/>}></Route>
              <Route path="farmers-admin" element={<FarmerAdmin/>}></Route>
              <Route path="profile-admin" element={<ProfileAdmin/>}></Route>
            </Route>

            {/* Client Routes */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Layout />} />}
            >
              <Route path="home-client" element={<HomeClient/>}></Route>
              <Route path="exportation-client" element={<MilkExportationClient/>}></Route>
              <Route path="profile-client" element={<ProfileClient/>}></Route>
              <Route path="exportation-payment" element={<MilkExportationPayment/>}></Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
