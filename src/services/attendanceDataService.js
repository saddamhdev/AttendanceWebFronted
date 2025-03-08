import axios from "axios";
import {getToken} from "./Auth"; // Import getToken function

const API_URL = "http://localhost:8181/api/attendance/insert";
const exportAllAttendanceData_URL = "http://localhost:8181/api/attendance/exportAllAttendanceData";
const GetAllAttendanceData_URL = "http://localhost:8181/api/attendance/getAllAttendanceData";
const GetAllAttendanceDataForFixedDay_URL = "http://localhost:8181/api/attendance/getAllAttendanceDataForFixedDay";
const updateAttendanceData_URL = "http://localhost:8181/api/attendance/updateAttendanceData";
const GetAttendanceDataForAnyPeriod_URL = "http://localhost:8181/api/attendance/getAttendanceDataForAnyPeriod";
const exportSummaryAttendanceData_URL = "http://localhost:8181/api/attendance/exportSummaryAttendanceData";

const saveAttendance = async (attendanceData) => {
  try {
    const token = await getToken();
    const response = await axios.post(API_URL, attendanceData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return { message: "Failed to save attendance" };
  }
};

const getAttendanceData = async (startDate, endDate) => {
  try {
    const token = await getToken();
    const response = await axios.post(GetAllAttendanceData_URL, { startDate, endDate }, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAttendanceDataForAnyPeriod = async (employeeId, employeeName, startDate, endDate) => {
  try {
    const token = await getToken();
    const response = await axios.post(GetAttendanceDataForAnyPeriod_URL, { 
      employeeId, employeeName, startDate, endDate 
    }, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateAttendance = async (newData, oldData) => {
  try {
    const token = await getToken();
    const response = await axios.post(updateAttendanceData_URL, { newData, oldData }, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAttendanceDataForFixDay = async (selectedDate) => {
  try {
    const token = await getToken();
    const response = await axios.post(GetAllAttendanceDataForFixedDay_URL, { selectedDate }, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const exportDownloadAllAttendanceData = async (attendanceData) => {
  try {
    const token = await getToken();
    const response = await axios.post(exportAllAttendanceData_URL, attendanceData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const exportSummaryAttendanceData = async (attendanceData) => {
  try {
    const token = await getToken();
    const response = await axios.post(exportSummaryAttendanceData_URL, attendanceData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { 
  saveAttendance, 
  getAttendanceData, 
  exportDownloadAllAttendanceData, 
  getAttendanceDataForFixDay, 
  updateAttendance, 
  getAttendanceDataForAnyPeriod, 
  exportSummaryAttendanceData 
};
