import { Outlet } from "react-router-dom";
import Dashboard from "./Dashboard";

const Layout = () => {
  return (
    <div className="flex h-screen">
      <Dashboard />
      <div className="flex-1 p-6">
        <Outlet /> 
      </div>
    </div>
  );
};

export default Layout;