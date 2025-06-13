import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
