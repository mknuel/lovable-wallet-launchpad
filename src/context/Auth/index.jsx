/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import {
    createContext,
    useContext,
    useState,
    useEffect,
  } from "react";
  import { useNavigate } from "react-router-dom";
  // import { toast } from "react-toastify";
  
  const AuthContext = createContext(null);
  
  // eslint-disable-next-line react-refresh/only-export-components
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };
  
  export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState<string | null>(
      localStorage.getItem("token")
    );
    const [userData, setUserData] = useState<any>(
      localStorage.getItem("userData")
    );
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();
    const checkTokenExpiration = () => {
      if (token && userData) {
        // Check if token is expired
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const isValid = payload.exp * 1000 > Date.now();
          setIsAuthenticated(isValid);
  
          if (!isValid) {
            logout();
            // toast.error("Session expired. Please login again.");
            navigate("/signin");
          }
        } catch {
          logout();
          navigate("/signin");
        }
      } else {
        setIsAuthenticated(false);
      }
    };
    useEffect(() => {
      checkTokenExpiration();
      const interval = setInterval(checkTokenExpiration, 60 * 1000);
      return () => clearInterval(interval);
    }, [token]);
  
    const login = (newToken, userData) => {
      setToken(newToken);
      setUserData(userData);
      setIsAuthenticated(true);
      // toast.success("Login successful");
    };
  
    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      setToken(null);
      setIsAuthenticated(false);
    };
    console.log("Auth provider is called...")
    return (
      <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  