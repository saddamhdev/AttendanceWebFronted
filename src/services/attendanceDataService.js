import axios from "axios";

const API_URL = "http://localhost:8181/api/attendance/insert"; // Your backend API URL
const exportAllAttendanceData_URL = "http://localhost:8181/api/attendance/exportAllAttendanceData"; // Assuming your API has a GET endpoint for all employees
const GetAllAttendanceData_URL = "http://localhost:8181/api/attendance/getAllAttendanceData"; // Assuming your API has a GET endpoint for all employees
const GetAllAttendanceDataForFixedDay_URL = "http://localhost:8181/api/attendance/getAllAttendanceDataForFixedDay"; // Assuming your API has a GET endpoint for all employees
const updateAttendanceData_URL = "http://localhost:8181/api/attendance/updateAttendanceData"; // Assuming your API has a GET endpoint for all employees
const GetAttendanceDataForAnyPeriod_URL = "http://localhost:8181/api/attendance/getAttendanceDataForAnyPeriod"; // Assuming your API has a GET endpoint for all employees
const exportSummaryAttendanceData_URL = "http://localhost:8181/api/attendance/exportSummaryAttendanceData"; // Assuming your API has a GET endpoint for all employees
const saveAttendance = async (attendanceData) => {
  

  try {
     const response= await  axios.post(API_URL, attendanceData)

    return response.data;
  } catch (error) {
   
    return { message: "Failed to save attendance" };
  }
};

const formatDateTime = (date, hour, minute, period) => {
    const formattedTime = formatTime(hour, minute, period);
    const isoString = new Date(`${date}T${formattedTime}`).toISOString(); // Get full ISO format
    return isoString.slice(0, 23); // Trim to `yyyy-MM-dd'T'HH:mm:ss.SSS`
  };
  

// Helper function to format time correctly
const formatTime = (hour, minute, period) => {
  let h = parseInt(hour);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return `${h.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`;
};

const getAttendanceData = async (startDate, endDate) => {
  try {
      const response = await axios.post(GetAllAttendanceData_URL, { 
        startDate, endDate  // ✅ Correct way to send data in the request body
      }, {
          headers: {
              'Content-Type': 'application/json',
          }
      });
   
      return response.data;
  } catch (error) {
    
      throw error;
  }
};

const getAttendanceDataForAnyPeriod = async (employeeId,employeeName,startDate, endDate) => {
  try {
      const response = await axios.post(GetAttendanceDataForAnyPeriod_URL, { 
        employeeId,employeeName,startDate, endDate  // ✅ Correct way to send data in the request body
      }, {
          headers: {
              'Content-Type': 'application/json',
          }
      });
   
      return response.data;
  } catch (error) {
     
      throw error;
  }
};

const updateAttendance = async (newData, oldData) => {
  try {
    const response = await axios.post(updateAttendanceData_URL, JSON.stringify({
      newData: newData,  // ✅ Ensure keys match backend expectation
      oldData: oldData
    }), {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
  
    throw error;
  }
};


const getAttendanceDataForFixDay = async (selectedDate) => {
  try {
      const response = await axios.post(GetAllAttendanceDataForFixedDay_URL, { 
        selectedDate  // ✅ Correct way to send data in the request body
      }, {
          headers: {
              'Content-Type': 'application/json',
          }
      });
    
      return response.data;
  } catch (error) {
    
      throw error;
  }
};

const exportDownloadAllAttendanceData = async (attendanceData) => {
  try {
      const response = await axios.post(exportAllAttendanceData_URL, attendanceData, { 
          headers: {
              'Content-Type': 'application/json',
          }
      });
    
      return response.data;
  } catch (error) {
     
      throw error;
  }
};
const exportSummaryAttendanceData = async (attendanceData) => {
  try {
      const response = await axios.post(exportSummaryAttendanceData_URL, attendanceData, { 
          headers: {
              'Content-Type': 'application/json',
          }
      });
    
      return response.data;
  } catch (error) {
     
      throw error;
  }
};


export { saveAttendance ,getAttendanceData,exportDownloadAllAttendanceData ,getAttendanceDataForFixDay,updateAttendance,getAttendanceDataForAnyPeriod,exportSummaryAttendanceData}; 
