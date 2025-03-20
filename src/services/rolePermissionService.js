// Function to add an employee
import axios from "axios";
import {getToken} from "./Auth";
const API_URL = "http://localhost:8080/api/role/insert"; 
const API_URL_DELETE = "http://localhost:8080/api/role/delete"; 
const API_URL_DELETE_Permission = "http://localhost:8080/api/role/deletePermission"; 
const API_URL_Update = "http://localhost:8080/api/role/update"; 
const API_URL_PERMISSION = "http://localhost:8080/api/role/permission"; 
const API_URL_Page = "http://localhost:8080/api/developer/insertPage"; 
const API_URL_Component = "http://localhost:8080/api/developer/insertComponent"; 
const GET_API_URL = "http://localhost:8080/api/role/getAll";
const GET_API_URL_SINGLE_ROLE_DATA = "http://localhost:8080/api/role/getSingleRoleData";
const GET_API_URL_USERS = "http://localhost:8080/api/user/getAll";
const GET_API_URL_ROLE = "http://localhost:8080/api/role/getAllRole";
const API_URL_AssignPermission = "http://localhost:8080/api/role/assignPermission";
const Delete_API_URL = "http://localhost:8080/api/user/delete";

// Fetch the token from the backend
const addEmployee = async (employeeData) => {

    try {
      const updatedEmployeeData = {
        ...employeeData
       
      };
  
      const token = await getToken();  // ✅ Fix: Await getToken()
  
      const response = await axios.post(API_URL, updatedEmployeeData, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      return response;
    } catch (error) {
      console.error("Error adding employee:", error);
      throw error;
    }
  };
  // Fetch the token from the backend
const addEmployeePage = async (employeeData) => {

  try {
    const updatedEmployeeData = {
      ...employeeData
     
    };

    const token = await getToken();  // ✅ Fix: Await getToken()

    const response = await axios.post(API_URL_Page, updatedEmployeeData, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};
const addEmployeeComponent = async (employeeData) => {

  try {
    const updatedEmployeeData = {
      ...employeeData
     
    };

    const token = await getToken();  // ✅ Fix: Await getToken()

    const response = await axios.post(API_URL_Component, updatedEmployeeData, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};
  // Function to delete an employee
const deleteRole = async (id) => {
    try {
      const token = await getToken(); // ✅ Fix: Await getToken()
      const response = await axios.post(API_URL_DELETE, id, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });
      return response;
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  };
  const updateRole = async (data) => {
    try {
      const token = await getToken(); // ✅ Fix: Await getToken()
      const response = await axios.post(API_URL_Update, data, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });
      return response;
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  };
   // Function to delete an employee
const deletePemission = async (data) => {
  try {
    const token = await getToken(); // ✅ Fix: Await getToken()
    const response = await axios.post(API_URL_DELETE_Permission, data, {
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};
  const getAllEmployees = async (status) => {
   
    try {
      const token = await getToken(); // ✅ Await token retrieval
      const response = await axios.get(GET_API_URL, {
        headers: { "Authorization": `Bearer ${token}` },
        params: { status },
      });
      
      
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.warn("Unauthorized access. Redirecting to login...");
        window.location.href = "/"; // 🔴 Redirect to login page
      } else {
        console.error("Error fetching employees:", error);
      }
      throw error;
    }
  };

 
  const getAllUsers = async (status) => {
    try {
      const token = await getToken(); // ✅ Await token retrieval
      const response = await axios.get(GET_API_URL_USERS, {
        headers: { "Authorization": `Bearer ${token}` },
        params: { status },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.warn("Unauthorized access. Redirecting to login...");
        window.location.href = "/"; // 🔴 Redirect to login page
      } else {
        console.error("Error fetching employees:", error);
      }
      throw error;
    }
  };
  
  const getAllRole = async (status) => {
   
    try {
      const token = await getToken(); // ✅ Await token retrieval
      const response = await axios.get(GET_API_URL_ROLE, {
        headers: { "Authorization": `Bearer ${token}` },
        params: { status },
      });
      
      
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.warn("Unauthorized access. Redirecting to login...");
        window.location.href = "/"; // 🔴 Redirect to login page
      } else {
        console.error("Error fetching employees:", error);
      }
      throw error;
    }
  };

  // Fetch the token from the backend
const saveRolesToDatabase = async (selectedRole,employeeData) => {

    try {
      const updatedEmployeeData = {
        ...employeeData,
        roleName:selectedRole,
       
      };
  
      const token = await getToken();  // ✅ Fix: Await getToken()
  
      const response = await axios.post(API_URL_PERMISSION, updatedEmployeeData, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      return response;
    } catch (error) {
      console.error("Error adding employee:", error);
      throw error;
    }
  };

   // Fetch the token from the backend
const addAssignPermission = async (employeeData) => {

  try {
    const updatedEmployeeData = {
      ...employeeData
     
    };

    const token = await getToken();  // ✅ Fix: Await getToken()

    const response = await axios.post(API_URL_AssignPermission, updatedEmployeeData, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};
const getAllRoleDataByRole = async (status) => {
   
  try {
    const token = await getToken(); // ✅ Await token retrieval
    const response = await axios.get(GET_API_URL_SINGLE_ROLE_DATA, {
      headers: { "Authorization": `Bearer ${token}` },
      params: { status },
    });
    
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.warn("Unauthorized access. Redirecting to login...");
      window.location.href = "/"; // 🔴 Redirect to login page
    } else {
      console.error("Error fetching employees:", error);
    }
    throw error;
  }
};
  export {addEmployee,deleteRole,getAllUsers,deletePemission ,updateRole,getAllEmployees,addEmployeePage,addEmployeeComponent,getAllRole,saveRolesToDatabase,addAssignPermission,getAllRoleDataByRole};