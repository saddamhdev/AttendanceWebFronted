import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../layouts/Navbar";
import { addLocalSettingData,getAllLocalData ,deleteLocalData} from "../services/LocalSettingService";
import { getAllEmployees } from "../services/employeeService";
import { checkAccessComponent, checkAccess, checkAccessMenu } from "../utils/accessControl";


const DataTable = () => {
    const[selectedParson,setSelectedParson]=useState();
    const[selectedId,setSelectedId]=useState();
  const [employees, setEmployees] = useState([ 
  ]);
  const [rows, setRows] = useState([]);


  const [user, setUser] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [newRow, setNewRow] = useState({
    employeeId: "",
    name: "", 
    formattedBirthDate: "",
    formattedDeathDate: "",
    startHours: 0,
    startMinute: 0,
    endHours: 0,
    endMinute: 0,
    totalHours: 0,
    designation: ""
  });
  const fetchLocalData = async () => {
    try {
      const response = await getAllLocalData();
     

      setRows(response);

    const  response1 = await getAllEmployees("1");
      
      setUser(response1);
      setSelectedId(response1[0].idNumber);
      setSelectedParson(response1[0].name);


    } catch (error) {
      console.error("Error fetching global data:", error);
    }
  };

  useEffect(() => {
   
    fetchLocalData();
  }, []);

  const handleNewButtonClick = () => {
    let startDate;
    if (rows.length > 0) {
      const firstRowDate = new Date(rows[0].formattedDeathDate);
      startDate = new Date(firstRowDate);
      startDate.setDate(startDate.getDate() + 1);
    } else {
      startDate = new Date(); // Default to today if no rows exist
    }

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    setNewRow({
      employeeId: selectedId,
      name: selectedParson,
      formattedBirthDate: startDate.toISOString().split("T")[0],
      formattedDeathDate: endDate.toISOString().split("T")[0],
      startHours: 0,
      startMinute: 0,
      endHours: 0,
      endMinute: 0,
      totalHours: 0,
      designation: ""
    });

    setShowModal(true);
  };

  const handleInputChange = (field, value) => {
    setNewRow({ ...newRow, [field]: value });
  };

  const handleSave = async () => {
    try {
      await addLocalSettingData(newRow);
      setShowModal(false);
      fetchLocalData();
    } catch (error) {
      console.error("Failed to save entry:", error);
    }
  };

  const deleteRow = async (row,index) => {
    setRows(rows.filter((_, i) => i !== index));
    // Implement delete functionality here
    try {
        const response = await deleteLocalData(row);
        fetchLocalData();
        alert(response.replace(/^"|"$/g, ''));


        
      } catch (error) {
        console.error("Error fetching global data:", error);
      }
  };
  const handleUserChange = (e) => {
    setSelectedParson(e.target.value);
    const selectedUser = user.find((us) => us.name === e.target.value);
    setSelectedId(selectedUser.idNumber);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4" style={{ paddingTop: "100px" }}>
        
      <div className="d-flex align-items-center me-2" style={{ width: "30%" }}>
        <Form.Select value={selectedParson} className="me-2" onChange={(e) => handleUserChange(e)}>
          {
            user.map((us, index) => (
              <option key={index}>{us.name}</option>
            ))
          }
        </Form.Select>

       
        
       
          {checkAccessComponent("User","LocalSetting","Add") && (
              <>
                <Button variant="primary" className="me-2" onClick={handleNewButtonClick}>
                New
              </Button>
              </>
            )}


            {checkAccessComponent("User","LocalSetting","History") && (
              <>
                 <Button variant="secondary">History</Button>
              </>
             )}

      </div>


        <Table bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Start Hours</th>
              <th>Start Minute</th>
              <th>End Hours</th>
              <th>End Minute</th>
              <th>Total Hours</th>
              <th>Designation</th>
             
              {checkAccessComponent("User","LocalSetting","Edit") && (
              <>
                 <th>Edit</th>
               
              </>
            )}


            {checkAccessComponent("User","LocalSetting","Delete") && (
              <>
                  
                  <th>Delete</th>
              </>
             )}
            </tr>
          </thead>
          <tbody>
            {rows.filter(row => row.employeeId === selectedId).map((row, index) => (
              <tr key={index}>
                <td>{row.formattedBirthDate}</td>
                <td>{row.formattedDeathDate}</td>
                <td>{row.startHours}</td>
                <td>{row.startMinute}</td>
                <td>{row.endHours}</td>
                <td>{row.endMinute}</td>
                <td>{row.totalHours}</td>
                <td>{row.designation}</td>
                
               
                {checkAccessComponent("User","LocalSetting","Edit") && (
                      <>
                       <td>
                        <Button variant="warning">Edit</Button>
                      </td>
                      </>
                    )}


                    {checkAccessComponent("User","LocalSetting","Delete") && (
                      <>
                        <td>
                          <Button variant="danger" onClick={() => deleteRow(row,index)}>
                            Delete
                          </Button>
                        </td>
                      </>
                    )}

              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal for adding a new row */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>

            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={newRow.formattedBirthDate}
                onChange={(e) => handleInputChange("formattedBirthDate", e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={newRow.formattedDeathDate}
                onChange={(e) => handleInputChange("formattedDeathDate", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Hours</Form.Label>
              <Form.Control
                type="number"
                value={newRow.startHours}
                onChange={(e) => handleInputChange("startHours", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Minute</Form.Label>
              <Form.Control
                type="number"
                value={newRow.startMinute}
                onChange={(e) => handleInputChange("startMinute", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Hours</Form.Label>
              <Form.Control
                type="number"
                value={newRow.endHours}
                onChange={(e) => handleInputChange("endHours", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Minute</Form.Label>
              <Form.Control
                type="number"
                value={newRow.endMinute}
                onChange={(e) => handleInputChange("endMinute", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Total Hours</Form.Label>
              <Form.Control
                type="number"
                value={newRow.totalHours}
                onChange={(e) => handleInputChange("totalHours", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Designation</Form.Label>
              <Form.Control
                type="text"
                value={newRow.designation}
                onChange={(e) => handleInputChange("designation", e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DataTable;
