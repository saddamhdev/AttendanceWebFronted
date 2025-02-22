import axios from "axios";

const API_URL = "http://localhost:8080/api/user/insert"; // Your backend API URL
const GET_API_URL = "http://localhost:8080/api/user/getAll"; // Assuming your API has a GET endpoint for all employees

const addEmployee = async (employeeData, size) => {
  try {
    const updatedEmployeeData = {
      ...employeeData,
      status: "1", // Default status, change if needed
      endDate: "", // Empty string if no end date is provided
      position: size, // Assuming position is the same as designation
      currentTimee: new Date().toISOString(), // Current timestamp in ISO format
    };

    const response = await axios.post(API_URL, updatedEmployeeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to retrieve all employees with a status filter
const getAllEmployees = async (status) => {
  try {
    const response = await axios.get(GET_API_URL, {
      params: { status }, // Send the status as a query parameter
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { addEmployee, getAllEmployees };
