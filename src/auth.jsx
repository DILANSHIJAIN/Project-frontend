import { createContext, useContext, useEffect, useState } from "react";

// 🚀 Dynamic URL parsing linking frontend builds cleanly to your live Render server backend
const RAW_API_URL = import.meta.env.VITE_API_URL || "https://ai-powered-helpdesk.onrender.com";

// 🧹 AUTO-CLEAN: This automatically deletes any accidental trailing slash to prevent double slashes (//api)
const API_URL = RAW_API_URL.endsWith('/') ? RAW_API_URL.slice(0, -1) : RAW_API_URL;

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [isServicesLoading, setIsServicesLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const authorizationToken = `Bearer ${token}`;

  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    return localStorage.setItem("token", serverToken);
  };

  const isLoggedIn = !!token;
  const isAdmin = user?.isAdmin || false;

  // Logout functionality
  const LogoutUser = () => {
    setToken("");
    localStorage.removeItem("token");
    setUser("");
  };

  // JWT AUTHENTICATION - fetch user data from backend
  const userAuthentication = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/auth/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Your backend returns { userData: { ... } }
        setUser(data.userData);
      } else {
        // If token is invalid or expired, clear it and user data
        LogoutUser();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // to fetch the services data from the database
  const getServices = async () => {
    try {
      setIsServicesLoading(true);
      // ✅ Fixed path: Pointing to /api/data to match app.use("/api/data", serviceRoute) inside server.js
      const response = await fetch(`${API_URL}/api/data`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        // Fallback in case backend returns array directly or inside .msg
        const servicesData = Array.isArray(data) ? data : data.msg;
        setServices(servicesData || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsServicesLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      userAuthentication(); // Only fetch user data if a token exists
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => { 
    getServices(); // Fetch services when the component mounts
  }, []); 

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isAdmin,
        storeTokenInLS,
        LogoutUser,
        user,
        authorizationToken,
        services,
        getServices,
        token,
        isServicesLoading,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return authContextValue;
};