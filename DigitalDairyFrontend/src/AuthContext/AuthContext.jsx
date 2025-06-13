import { createContext, useState, useContext , useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}
    

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Initialize user from localStorage on first load
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async(credentials) => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", credentials);
      console.log(response.data.user);
      // console.log(response.data.user.role);
      setUser(response.data.user);
      localStorage.setItem("authUser", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);


      return true;
    } catch (error) {
      console.log("Login Error" , error);
      return false;
    }
  };

  const signup = async(formData) => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", formData);
      console.log(response);
    } catch (error) {
      console.log("Signup Error" , error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
