import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner, Collapse, Table } from "react-bootstrap";
import {addAssignPermission, addEmployee,deleteEmployee,getAllUsers,getAllEmployees,addEmployeePage,addEmployeeComponent,getAllRole,saveRolesToDatabase } from "../services/rolePermissionService";
import Navbar from "../layouts/Navbar";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);   // ✅ Add users state
  const [formData, setFormData] = useState({ userName: "", roleName: "" });
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [endDate, setEndDate] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [roleData, setRoleData] = useState([]); // State for role data from DB
   const [selectedRole, setSelectedRole] = useState(""); // Store the selected role

  useEffect(() => {
    fetchEmployees();
    fetchUsers();   // ✅ Fetch users when the component mounts
    fetchRole();
  }, []);
 // Fetch role data from the backend
  const fetchRole = async () => {
    try {
      const response = await getAllRole("1"); // Fetch role data
      if (response && Array.isArray(response)) {
        setRoleData(response);
      } else {
        setRoleData([]);
      }
    } catch (error) {
      console.error("Error fetching role data:", error);
      setRoleData([]);
    }
  };
    const fetchUsers = async () => {   // ✅ Fetch users from the backend
    try {
        const response = await getAllUsers("1");   // ✅ Fetch users

        if (response && Array.isArray(response)) {
            setUsers(response);   // ✅ Set state with user data        
        } else {
            setUsers([]);   // ✅ Set users to empty array
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);   // ✅ Set users to empty array
    }
    };

  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployees("1");
      console.log("Employees API Response:", response); // Debugging

      setEmployees(
        response && Array.isArray(response)
          ? response.map(emp => ({
              id: emp.id,
              userName: emp.userName,
              type: emp.type || [] // Ensure pages exists
            }))
          : []
      );
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      const response = await addAssignPermission(formData);
      if (response.status === 200) {
        alert("Successfully Inserted");
  
        // Instead of manually adding to employees, fetch fresh data
        await fetchUsers();  
  
        setFormData({ userName: "", roleName: "" });
        setShowForm(false);
      } else if (response.status === 409) {
        alert("Failed to Insert: Role already exists.");
      } else {
        alert("An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add role.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!endDate) {
      alert("Please select an End Date before deleting.");
      return;
    }
    setLoadingDelete(selectedEmployee.id);
    try {
      await deleteEmployee(selectedEmployee.id, endDate);
      setEmployees(prev => prev.filter(emp => emp.id !== selectedEmployee.id)); // Fix delete function
      alert("Employee deleted successfully.");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete employee.");
    } finally {
      setLoadingDelete(null);
      setShowModal(false);
      setEndDate("");
    }
  };

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
    setFormData({ ...formData, userName: e.target.value });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4" style={{ paddingTop: "100px" }}>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
          aria-controls="employee-form-collapse"
          aria-expanded={showForm}
        >
          {showForm ? "Hide Form" : "Assign Role"}
        </Button>

        <Collapse in={showForm}>
          <div id="employee-form-collapse" className="mt-3">

           {users.length > 0 && (
            <Form.Select value={selectedUser} onChange={handleUserChange} className="me-2 mb-2" name="userName">
                <option value="">--Select User--</option>
                {users.map((user, index) => (
                <option key={index} value={user.name}>{user.name}</option>
                ))}
            </Form.Select>
            )}

        <select
            id="roleSelect"
            className="form-control mb-4"
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value); // Update selected role
              setFormData({ ...formData, roleName: e.target.value });
            }}
          >
            <option value="">--Select a Role--</option>
            {roleData.map((role) => (
              <option key={role.id} value={role.roleName}>
                {role.roleName}
              </option>
            ))}
          </select>

            <Button onClick={handleAdd} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
            </Button>
          </div>
        </Collapse>

        <Table bordered hover responsive className="mt-4">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Role Name</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No content in table</td>
              </tr>
            ) : (
                users.map((employee, index) => (
                <tr key={index} className="text-center">
                  <td>{employee.name}</td>
                  <td>
                    {employee.type && employee.type.length > 0
                        ? employee.type.join(", ") // Converts the array into a comma-separated string
                        : "No role"}
                    </td>

                  <td>
                    <Button variant="warning">Edit</Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteClick(employee)}
                      disabled={loadingDelete === employee.id}
                    >
                      {loadingDelete === employee.id ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete <strong>{selectedEmployee?.menuName}</strong>?</p>
            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default EmployeeManagement;
