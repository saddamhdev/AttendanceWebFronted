import axios from "axios";

const GET_API_URL = "http://localhost:8181/api/userAtAGlance/getAll";
const Export_API_URL = "http://localhost:8181/api/userAtAGlance/exportAtAGlanceData";
// Function to retrieve user attendance data with filters
const getAllAtAGlanceData = async (employeeId, employeeName, startDate, endDate) => {
    try {
        const response = await axios.get(GET_API_URL, {
            params: { employeeId, employeeName, startDate, endDate }, // Pass all required parameters
        });
        return response.data;
    } catch (error) {
       
        throw error;
    }
};

const exportAtAGlanceData = async (AtAGlanceData) => {
  
    try {
        // Send the data in the request body
        const response = await axios.post(Export_API_URL, AtAGlanceData, {
            headers: {
                'Content-Type': 'application/json', // Ensure it's set to JSON
            }
        });
        
        return response.data; // Return the response data from the API
    } catch (error) {
       
        throw error; // Rethrow the error if needed
    }
};

  

export { getAllAtAGlanceData,exportAtAGlanceData };
