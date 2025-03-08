import React from "react";
import AppRoutes from "./routes/AppRoutes";
import {getToken, isTokenExpired, checkAndRefreshToken, handleSessionExpiry } from "./services/Auth";
import { useEffect ,useState } from "react";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    // Check if user is logged in
    const storedAuthToken = localStorage.getItem("authToken");
    if (storedAuthToken && !isTokenExpired()) {
      setIsAuthenticated(true);
    }

    if (isAuthenticated) {
      console.log("Starting global token refresh interval...");
      const interval = setInterval(checkAndRefreshToken, 10 * 1000);

      return () => {
        console.log("Clearing global token refresh interval...");
        clearInterval(interval);
      };
    }
  }, [isAuthenticated]); // ✅ Runs when `isAuthenticated` changes
  return <AppRoutes />;
};

export default App;
