import axios from "axios";
import {getToken} from "./Auth";
const GET_API_URL = "http://localhost:8181/api/userAtAGlance/getAll";
const EXPORT_API_URL = "http://localhost:8181/api/userAtAGlance/exportAtAGlanceData";



// Function to retrieve user attendance data with filters
const getAllAtAGlanceData = async (employeeId, employeeName, startDate, endDate) => {
  try {
    const response = await axios.get(GET_API_URL, {
      params: { employeeId, employeeName, startDate, endDate }, 
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const exportAtAGlanceData = async (AtAGlanceData) => {
  try {
    const response = await axios.post(EXPORT_API_URL, AtAGlanceData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getAllAtAGlanceData, exportAtAGlanceData };
