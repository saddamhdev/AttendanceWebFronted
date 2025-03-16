import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner, Collapse, Table } from "react-bootstrap";
import { addEmployee, deleteEmployee, getAllEmployees,getAllRole } from "../services/rolePermissionService";
import Navbar from "../layouts/Navbar";
import { checkAccessComponent, checkAccess, checkAccessMenu } from "../utils/accessControl";
const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ roleName: "" });
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getAllRole("1"); // Fetch role data
      console.log(response);  
      setEmployees(
        response && Array.isArray(response)
          ? response.map(emp => ({ roleName: emp.roleName }))
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

  const handleAdd = async (event) => {
    event.preventDefault();  // Prevents unintended form submission
    setLoading(true);
    try {
      const response = await addEmployee(formData);
      console.log("New Employee Added:", response);

      if (response.status === 200 && response.data) {
        alert("Successfully Inserted");
        setFormData({ roleName: "" });
        setShowForm(false);
        await fetchEmployees();
      } else if (response.status === 409) {
        alert("Failed to Insert: Employee already exists.");
      } else {
        alert("An unexpected error occurred.");
      }
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
    setLoadingDelete(selectedEmployee.roleName);
    try {
      await deleteEmployee(selectedEmployee.roleName, endDate);
      setEmployees(prev => prev.filter(emp => emp.roleName !== selectedEmployee.roleName));
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

  return (
    <>
      <Navbar />

      <div className="container mt-4" style={{ paddingTop: "100px" }}>
        {checkAccessComponent("Owner","Role","Add") && (
            <>
            <Button
            variant="primary"
            onClick={() => setShowForm(!showForm)}
            aria-controls="employee-form-collapse"
            aria-expanded={showForm}
          >
            {showForm ? "Hide Form" : "Add role Name"}
          </Button>
            </>
        )}
        

        <Collapse in={showForm}>
          <div id="employee-form-collapse" className="mt-3">
            <Form.Control
              type="text"
              name="roleName"
              placeholder="role Name"
              value={formData.roleName}
              onChange={handleChange}
              className="me-2 mb-2"
            />
            <Button onClick={handleAdd} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
            </Button>
          </div>
        </Collapse>

        <Table bordered hover responsive className="mt-4">
          <thead>
            <tr>
              <th>Role Name</th>
              {checkAccessComponent("Owner","Role","Edit") && (
                    <>
                    <th>Edit</th>
                    </>
                )}
                {checkAccessComponent("Owner","Role","Delete") && (
                    <>
                    <th>Delete</th>
                    </>
                )}
             
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center">No content in table</td>
              </tr>
            ) : (
              employees.map((employee, index) => (
                <tr key={index} className="text-center">
                 <td>{employee.roleName}</td>

                 
                  {checkAccessComponent("Owner","Role","Edit") && (
                    <>
                     <td>
                        <Button variant="warning">Edit</Button>
                      </td>
                  

                    </>
                )}
                {checkAccessComponent("Owner","Role","Delete") && (
                    <>
                   <td>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteClick(employee)}
                      disabled={loadingDelete === employee.roleName}
                    >
                      {loadingDelete === employee.roleName ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </td>
                    </>
                )}
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
            <p>Are you sure you want to delete <strong>{selectedEmployee?.roleName}</strong>?</p>
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