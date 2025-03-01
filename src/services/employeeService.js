import axios from "axios";
import getToken from "./Auth";

const API_URL = "http://localhost:8080/api/user/insert"; 
const GET_API_URL = "http://localhost:8080/api/user/getAll"; 
const DELETE_API_URL = "http://localhost:8080/api/user/delete";

const addEmployee = async (employeeData, size) => {
  try {
    const updatedEmployeeData = {
      ...employeeData,
      status: "1", // Default status
      endDate: "", // Empty string if no end date is provided
      position: size, // Assuming position is the same as designation
      currentTimee: new Date().toISOString(), // Current timestamp in ISO format
    };

    const token = await getToken(); // ✅ Get token before making request

    const response = await axios.post(API_URL, updatedEmployeeData, {
      headers: { "Authorization": `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};

// Function to retrieve all employees
const getAllEmployees = async (status) => {
  try {
    const token = await getToken();
    
    const response = await axios.get(GET_API_URL, {
      headers: { "Authorization": `Bearer ${token}` },
      params: { status },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

const deleteEmployee = async (id, endDate) => {
  try {
    const token = await getToken();

    const response = await axios.post(
      DELETE_API_URL,
      { id, endDate }, // ✅ Correct request body
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    console.log("Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};

export { addEmployee, getAllEmployees, deleteEmployee };
