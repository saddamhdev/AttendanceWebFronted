import axios from "axios";

const API_URL = "http://localhost:8181/api/globalSetting/insert"; // Your backend API URL
const GET_API_URL = "http://localhost:8181/api/globalSetting/getAll"; // Assuming your API has a GET endpoint for all employees
const Delete_API_URL = "http://localhost:8181/api/globalSetting/delete"; // Assuming your API has a GET endpoint for all employees

const formatCurrentTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Ensure two digits
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const addGlobalSettingData = async (GlobalSettingData) => {
  try {
    const updatedGlobalSettingData = {
          // Use formatted timestamp
        ...GlobalSettingData,
        currentTime: formatCurrentTime(),
        status: "1", // Default status, change if needed
     
    };
    console.log(updatedGlobalSettingData);
    const response = await axios.post(API_URL, updatedGlobalSettingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to retrieve all employees with a status filter
const getAllGlobalData = async (status) => {
    try {
      const response = await axios.get(GET_API_URL, {
        params: { status }, // Send the status as a query parameter
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteGlobalData = async (row) => {
    
    try {
        const response = await axios.delete(Delete_API_URL, {
            data: row, // ✅ Send data in the config object
        });
       
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  

export { addGlobalSettingData,getAllGlobalData ,deleteGlobalData};
