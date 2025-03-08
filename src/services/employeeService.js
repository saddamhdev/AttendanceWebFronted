import axios from "axios";
import {getToken} from "./Auth";
const API_URL = "http://localhost:8080/api/user/insert"; 
const GET_API_URL = "http://localhost:8080/api/user/getAll";
const Delete_API_URL = "http://localhost:8080/api/user/delete";
const Login_API_URL = "http://localhost:8080/api/user/login";
// Fetch the token from the backend


// Function to add an employee
const addEmployee = async (employeeData, size) => {
  try {
    const updatedEmployeeData = {
      ...employeeData,
      status: "1", 
      endDate: "",
      position: size,
      currentTimee: new Date().toISOString(),
    };

    const token = await getToken();  // ✅ Fix: Await getToken()

    const response = await axios.post(API_URL, updatedEmployeeData, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};

// Function to retrieve all employees
const getAllEmployees = async (status) => {
  try {
    const token = await getToken(); // ✅ Fix: Await getToken()
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

// Function to delete an employee
const deleteEmployee = async (id, endDate) => {
  try {
    const token = await getToken(); // ✅ Fix: Await getToken()
    const response = await axios.post(Delete_API_URL, { id, endDate }, {
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};

// Function to delete an employee
const loginEmloyee = async (email, password) => {
  try {
    const response = await axios.post(Login_API_URL, { email, password }, {
      headers: {  "Content-Type": "application/json" }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};


export { addEmployee, getAllEmployees, deleteEmployee ,loginEmloyee};
