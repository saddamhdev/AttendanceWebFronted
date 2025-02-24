import axios from "axios";

const API_URL = "http://localhost:8181/api/positionSetting/insert"; // Your backend API URL
const GET_API_URL = "http://localhost:8181/api/positionSetting/getAll"; // Assuming your API has a GET endpoint for all employees
const Delete_API_URL = "http://localhost:8181/api/positionSetting/delete"; // Assuming your API has a GET endpoint for all employees
const Update_API_URL = "http://localhost:8181/api/positionSetting/updateSortingPosition"; 
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

const addPositionSettingData = async (PositionSettingData) => {
  try {
    const updatedPositionSettingData = {
          // Use formatted timestamp
        ...PositionSettingData,
        currentTime: formatCurrentTime(),
        status: "1", // Default status, change if needed
     
    };
    console.log(updatedPositionSettingData);
    const response = await axios.post(API_URL, updatedPositionSettingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to retrieve all employees with a status filter
const getAllPositionData = async (status) => {
    try {
      const response = await axios.get(GET_API_URL, {
        params: { status }, // Send the status as a query parameter
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deletePositionData = async (row) => {
    
    try {
        const response = await axios.delete(Delete_API_URL, {
            data: row, // ✅ Send data in the config object
        });
       
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updatePositionData = async (row) => {
    console.log("row", row);
    try {
        // Send the data in the request body
        const response = await axios.post(Update_API_URL, row, {
            headers: {
                'Content-Type': 'application/json', // Ensure it's set to JSON
            }
        });
        console.log('Response:', response); // Log the response from the server
        return response.data; // Return the response data from the API
    } catch (error) {
        console.error('Error updating position data:', error); // Log any errors
        throw error; // Rethrow the error if needed
    }
};

  

export { addPositionSettingData,getAllPositionData ,deletePositionData,updatePositionData};
