import axios from "axios";

const API_URL = "http://localhost:8181/api/attendance/insert"; // Your backend API URL

const saveAttendance = async (attendanceData) => {
  console.log("Sending Attendance Data:", attendanceData); // Debugging

  try {
     const response= await  axios.post(API_URL, attendanceData)

    return response.data;
  } catch (error) {
    console.error("Error saving attendance:", error?.response?.data || error.message);
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

export { saveAttendance };
