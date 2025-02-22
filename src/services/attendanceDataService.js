import axios from "axios";

const API_URL = "http://localhost:8181/api/attendance/insert"; // Your backend API URL

const saveAttendance = async (attendanceData) => {
  console.log("Sending Attendance Data:", attendanceData); // Debugging

  try {
    await Promise.all(
      attendanceData.map((data) =>
        axios.post(API_URL, {
          employeeId: data.employeeId,
          name: data.name,
          month: new Date(data.date).toLocaleString("en-US", { month: "long" }), // Convert to full month name
          year: new Date(data.date).getFullYear().toString(), // Convert year to string
          entryTime: formatDateTime(data.date, data.startHour, data.startMinute, data.startPeriod), 
          lateEntryReason: data.lateEntryReason || "good reason",
          exitTime: formatDateTime(data.date, data.exitHour, data.exitMinute, data.exitPeriod), 
          earlyExitReason: data.earlyExitReason || "why",
          status: data.status,
          outtime: (data.outHour+"."+data.outMinute), // Convert to 24-hour format
          entryDate: data.date, // Ensure format is `YYYY-MM-DD`
          presentTime: formatDateTime(data.date, data.startHour, data.startMinute, data.startPeriod),
          updateStatus: data.updateStatus || "1",
          globalDayStatus: data.globalDayStatus || "Present",
        })
      )
    );

    return { message: "Attendance saved successfully" };
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
