import React, { createContext, useState, useCallback, ReactNode, useContext } from "react";
import axios from "axios";

// Configure default axios behavior for auth
axios.defaults.withCredentials = true;

// Add global axios interceptor to attach JWT token if present in localStorage
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.withCredentials = true;
  return config;
});

// Define the context type
interface AuthContextType {
  user: any;
  isLogin: boolean;
  setUser: (user: any) => void;
  fetchUserData: () => Promise<any>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isLogin, setIsLogin] = useState<boolean>(() => {
    return Boolean(localStorage.getItem("token"));
  });

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_Backend_URL}/user/getUser`,
        { withCredentials: true }
      );

      if (response.data && response.data.success && response.data.user) {
        setUser(response.data.user);
        setIsLogin(true);
        return response.data.user;
      } else {
        setUser(null);
        setIsLogin(false);
        localStorage.removeItem("token");
        return null;
      }
    } catch (error) {
      setUser(null);
      setIsLogin(false);
      localStorage.removeItem("token");
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_Backend_URL}/user/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setIsLogin(false);
    }
  }, []);

  // Context value
  const value: AuthContextType = {
    isLogin,
    logout,
    user,
    setUser,
    fetchUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};

export default AuthContextProvider;
