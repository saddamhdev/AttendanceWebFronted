import axios from "axios";
const API_URL = "http://localhost:8181/api/auth/token";

// Fetch the token from the backend
const fetchToken = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: { status: "123" }, // Correct way to send a query parameter
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching token:", error);
      throw error;
    }
  };
  
  
  // Store the token in localStorage
  const getToken = async () => {
    let token = localStorage.getItem("authToken");
    alert(token)
    if (!token) {
      token = await fetchToken();
      localStorage.setItem("authToken", token);
    }
    return token;
  };

  export default getToken;
  
  