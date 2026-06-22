import { createContext, useContext, useEffect, useState } from "react";

// 🚀 Dynamic URL parsing linking frontend builds cleanly to your live Render server backend
const API_URL = import.meta.env.VITE_API_URL || "https://ai-powered-helpdesk.onrender.com";

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
          Authorization: authorizationToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Your backend returns { userData: { ... } }
        setUser(data.userData);
        setIsLoading(false);
      } else {
        console.error("Error fetching user data");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
    }
  };

  // to fetch the services data from the database
  const getServices = async () => {
    try {
      setIsServicesLoading(true);
      const response = await fetch(`${API_URL}/api/data/service`, {
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
    userAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => { getServices(); }, []); // Fetch services when the component mounts

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