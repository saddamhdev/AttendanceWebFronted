import axios from "axios";
import {getToken} from "./Auth";

const API_URL = "http://localhost:8181/api/globalSetting/insert"; 
const GET_API_URL = "http://localhost:8181/api/globalSetting/getAll"; 
const Delete_API_URL = "http://localhost:8181/api/globalSetting/delete"; 
const Update_API_URL = "http://localhost:8181/api/globalSetting/update"; 

const formatCurrentTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); 
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const addGlobalSettingData = async (GlobalSettingData) => {
  try {
    const updatedGlobalSettingData = {
      ...GlobalSettingData,
      currentTime: formatCurrentTime(),
      status: "1", 
    };

    const response = await axios.post(API_URL, updatedGlobalSettingData, {
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

const updateGlobalData = async (rowId,GlobalSettingData) => {
  try {
    const updatedGlobalSettingData = {
      ...GlobalSettingData,
      currentTime: formatCurrentTime(),
      status: "1", 
      rowId: rowId,
    };

    const response = await axios.post(Update_API_URL, updatedGlobalSettingData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    alert(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllGlobalData = async (status) => {
  try {
    const response = await axios.get(GET_API_URL, {
      params: { status },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteGlobalData = async (row) => {
  try {
    const response = await axios.delete(Delete_API_URL, {
      data: row,
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

export { addGlobalSettingData, getAllGlobalData, deleteGlobalData ,updateGlobalData};
