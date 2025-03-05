import axios from "axios";

import getToken from "./Auth";
const API_URL = "http://localhost:8181/api/localSetting/insert"; 
const GET_API_URL = "http://localhost:8181/api/localSetting/getAll"; 
const DELETE_API_URL = "http://localhost:8181/api/localSetting/delete"; 



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

const addLocalSettingData = async (LocalSettingData) => {
  try {
    const updatedLocalSettingData = {
      ...LocalSettingData,
      currentTime: formatCurrentTime(),
      status: "1", 
    };

    const response = await axios.post(API_URL, updatedLocalSettingData, {
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

const getAllLocalData = async (status) => {
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

const deleteLocalData = async (row) => {
  try {
    const response = await axios.delete(DELETE_API_URL, {
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

export { addLocalSettingData, getAllLocalData, deleteLocalData };
