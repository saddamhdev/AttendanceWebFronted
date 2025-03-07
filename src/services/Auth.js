import axios from "axios";

const API_URL = "http://localhost:8080/api/user/token";


const getToken = () => {
  try {
      const token = localStorage.getItem("authToken"); // ✅ Fetch token from localStorage
      
      if (!token) {
          console.warn("No token found in localStorage");
          return null;
      }
      return token;
  } catch (error) {
      console.error("Failed to get token:", error);
      return null;
  }
};

export default getToken; // ✅ Export correctly

