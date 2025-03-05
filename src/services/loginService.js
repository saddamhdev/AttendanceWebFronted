import axios from "axios";

const API_URL = "http://localhost:8181/api/auth/login"; // Assuming your API has a POST endpoint for login
// Function to delete an employee
const loginEmloyee = async (userName, password) => {
   // const token = await getToken(); // ✅ Fix: Await getToken()
    alert(userName);
    try {
      const response = await axios.post(API_URL, { userName, password }, {
        headers: {  "Content-Type": "application/json" },

      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export { loginEmloyee };