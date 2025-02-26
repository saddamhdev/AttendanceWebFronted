import React, { useState, useEffect } from "react";
import { Table, Form, Button, Spinner,Modal } from "react-bootstrap";
import Navbar from "../layouts/Navbar";
import { addEmployee,getAllEmployees,deleteEmployee } from "../services/employeeService";
const EmployeeTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ idNumber: "", name: "", designation: "", joinDate: "" });
  const [loading, setLoading] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(null); // Track loading for specific delete button
  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployees("1"); // Fetch all employees with status 1
  
      console.log("Fetched employees:", response); // Ensure you're logging the resolved data

  
      // Check if the response contains an array and set employees
      if (Array.isArray(response)) {
        setEmployees(response);  // Set state with employee data
      } else {
        setEmployees([response]); // If it's not an array, wrap it in an array
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  
  
  useEffect(() => {
    fetchEmployees();  // Fetch employees when the component mounts
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      await addEmployee(formData, employees.length+1);
      setEmployees([...employees, formData]);
      setFormData({ idNumber: "", name: "", designation: "", joinDate: "" });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add employee.");
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

    setLoadingDelete(selectedEmployee.idNumber);

    try {
      // Here you can send the `endDate` to your backend if needed
       await deleteEmployee(selectedEmployee.idNumber, endDate);
      setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.idNumber !== selectedEmployee.idNumber));
      alert("Employee deleted successfully.");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete employee.");
    } finally {
      setLoadingDelete(null);
      setShowModal(false);
      setEndDate(""); // Reset date
    }
  };
  return (
    <>
      <Navbar />
      <div className="container mt-4" style={{ paddingTop: "100px" }}>
        <div className="d-flex flex-wrap mb-3">
          <Form.Control type="text" name="idNumber" placeholder="ID Number" value={formData.idNumber} onChange={handleChange} className="me-2 mb-2" />
          <Form.Control type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="me-2 mb-2" />
          <Form.Control type="text" name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} className="me-2 mb-2" />
          <Form.Control type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} className="me-2 mb-2" />
          <Button variant="success" onClick={handleAdd} className="mb-2 d-flex align-items-center" disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Adding...
              </>
            ) : (
              "Add"
            )}
          </Button>
        </div>

        <Table bordered hover>
          <thead>
            <tr>
              <th>ID Number</th>
              <th>Name</th>
              <th>Join Date</th>
              <th>Designation</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No content in table</td>
              </tr>
            ) : (
              employees.map((employee, index) => (
                <tr key={index} className="text-center">
                  <td>{employee.idNumber}</td>
                  <td>{employee.name}</td>
                  <td>{employee.joinDate}</td>
                  <td>{employee.designation}</td>
                  <td><Button variant="warning">Edit</Button></td>
                  <td>
                    <Button 
                      variant="danger" 
                      onClick={() => handleDeleteClick(employee)}
                      disabled={loadingDelete === employee.idNumber}
                    >
                      {loadingDelete === employee.idNumber ? (
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
      </div>

      {/* Delete Confirmation Modal with Date Picker */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete <strong>{selectedEmployee?.name}</strong>?</p>
          <Form.Group>
            <Form.Label>Select End Date:</Form.Label>
            <Form.Control 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Confirm Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EmployeeTable;
