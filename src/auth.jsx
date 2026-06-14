import { createContext, useContext, useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://10.238.173.228:5000";

export const AuthContext=createContext();

export const AuthProvider=({children})=>{
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [services,setServices]=useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const storeTokenInLS = (serverToken) => {
        setToken(serverToken);
        return localStorage.setItem("token", serverToken);
    };

    let isLoggedIn=!!token;
    // Define the authorization token string for use in headers
    const authorizationToken = `Bearer ${token}`;
    
    const LogoutUser=()=>{
        setToken("");
        setUser(null); // Clear user data on logout correctly
        return localStorage.removeItem("token");
    };

    const userAuthentication=async()=>{
        try{
            setIsLoading(true);
            const response=await fetch(`${API_URL}/api/auth/user`,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`,
                },
            });

            if (response.ok){
                const data=await response.json();
                console.log('User profile fetched:', data.userData);
                setUser(data.userData);
            } else {
                // If token is invalid or expired, clear it and user data
                LogoutUser();
            }
        }catch(error){
            console.log(error);
        } finally {
            setIsLoading(false);
        }
        };
    //to fetch the services data from the database
    const getServices=async()=>{
        try{
            const response=await fetch(`${API_URL}/api/data/service`,{
                method:"GET",
            });
            if(response.ok){
                const data=await response.json();
                // Fallback in case backend returns array directly or inside .msg
                const servicesData = Array.isArray(data) ? data : data.msg;
                setServices(servicesData || []); 
            }
        }catch(error){
            console.log('Error fetching services:', error);
        } finally {
            // Ensure loading ends after services are fetched
            setIsLoading(false);
        }
    };

    const isAdmin = user?.isAdmin || false;

        useEffect(()=>{
            if (token) {
                userAuthentication(); // Only fetch user data if a token exists
            } else {
                setIsLoading(false);
            }
        }, [token]);

        useEffect(()=>{
            getServices(); // Fetch services when the component mounts
        }, []);

    return (
         <AuthContext.Provider value={{isLoggedIn, isAdmin, storeTokenInLS, LogoutUser, user, services, getServices, token, authorizationToken, isLoading}}>
        {children} 

    </AuthContext.Provider>
    );
};

export const useAuth=()=>{
    const authContextValue=useContext(AuthContext);
    if(!authContextValue){
        throw new Error("useAuth used outside of the Provider");
    }
    return authContextValue;
};