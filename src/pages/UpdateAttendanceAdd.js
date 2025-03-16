import React, { useState, useEffect } from "react";
import { Table, Form, Button, Spinner, Modal } from "react-bootstrap";
import Navbar from "../layouts/Navbar";
import { getAttendanceDataForFixDay, saveAttendance,updateAttendance } from "../services/attendanceDataService";
import { checkAccessComponent, checkAccess, checkAccessMenu } from "../utils/accessControl";

const AttendanceSheet = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [dayStatus, setDayStatus] = useState("Office");
  const [loading, setLoading] = useState(false);
  const [oldData, setOldData] = useState([]);

  useEffect(() => {
    if (selectedDate) {
      fetchEmployees();
    }
  }, [selectedDate]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await getAttendanceDataForFixDay(selectedDate);
     
      setEmployees(Array.isArray(response) && response.length > 0 ? response : []);
      setOldData(JSON.parse(JSON.stringify(Array.isArray(response) && response.length > 0 ? response : [])));  // Deep copy
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
      setOldData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDayStatusChange = (e) => {
    const newStatus = e.target.value;
    setDayStatus(newStatus);
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) => ({ ...emp, globalDayStatus: newStatus }))
    );
  };
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) => ({ ...emp, status: newStatus }))
    );
  };
  
  const handleInputChange = (e, index, field) => {
    const newEmployees = [...employees];
    newEmployees[index][field] = e.target.value;
    setEmployees(newEmployees);
  };

  const handleUpdate = async () => {
    try {
      const response = await updateAttendance(employees, oldData);
      alert(response);
      fetchEmployees();
      
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const changeDate = (days) => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate.toISOString().split("T")[0]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getMonthName = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-US", { month: "long" }).toUpperCase();
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4" style={{ paddingTop: "100px" }}>
        <div className="d-flex align-items-center mb-3">
          <Button variant="secondary" className="me-2" onClick={() => changeDate(-1)}>
            {"<"}
          </Button>
          <Form.Control type="date" value={selectedDate} onChange={handleDateChange} className="me-2" />
          <Form.Control type="text" value={formatDate(selectedDate)} readOnly className="me-2" />
          <Button variant="secondary" onClick={() => changeDate(1)}>
            {">"}
          </Button>
        </div>

        <div className="border p-3">
          <h5 className="text-center">Daily Attendance Sheet - {selectedDate ? new Date(selectedDate).getFullYear() : ""}</h5>
          <div className="d-flex justify-content-between mt-2">
            <span>Month: {getMonthName(selectedDate)}</span>
            <span>Date: {selectedDate}</span>
          </div>
        </div>

        <div className="d-flex my-3">
        <Form.Select className="me-2"  value={employees.length > 0 ? employees[0].status : "Present"}  onChange={handleStatusChange}>
        <option>Present</option>
        <option>Absent</option>
        <option>Leave</option>
        <option>Holiday</option>
        </Form.Select>

          <Form.Select 
          value={employees.length > 0 ? employees[0].globalDayStatus : "Office"} 
          onChange={handleDayStatusChange}
        >
          <option>Office</option>
          <option>Holiday</option>
        </Form.Select>

        </div>

        <Table bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Start Time</th>
              <th>Reason For Being Late</th>
              <th>Exit Time</th>
              <th>Reason For Early Exit</th>
              <th>Out Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee, index) => (
                <tr key={employee.employeeId}>
                  <td>{employee.employeeId}</td>
                  <td>{employee.name}</td>
                  <td className="d-flex">
                    <Form.Control type="text" value={employee.startHour} onChange={(e) => handleInputChange(e, index, "startHour")} className="me-1 w-25" />
                    <Form.Control type="text" value={employee.startMinute} onChange={(e) => handleInputChange(e, index, "startMinute")} className="me-1 w-25" />
                    <Form.Select value={employee.startPeriod} onChange={(e) => handleInputChange(e, index, "startPeriod")} className="w-50">
                      <option>AM</option>
                      <option>PM</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control type="text" value={employee.lateEntryReason} onChange={(e) => handleInputChange(e, index, "lateEntryReason")} className="w-100" />
                  </td>
                  <td className="d-flex">
                    <Form.Control type="text" value={employee.exitHour} onChange={(e) => handleInputChange(e, index, "exitHour")} className="me-1 w-25" />
                    <Form.Control type="text" value={employee.exitMinute} onChange={(e) => handleInputChange(e, index, "exitMinute")} className="me-1 w-25" />
                    <Form.Select value={employee.exitPeriod} onChange={(e) => handleInputChange(e, index, "exitPeriod")} className="w-50">
                      <option>AM</option>
                      <option>PM</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control type="text" value={employee.earlyExitReason} onChange={(e) => handleInputChange(e, index, "earlyExitReason")} className="w-100" />
                  </td>
                  <td className="d-flex">
                    <Form.Control type="text" value={employee.outHour} onChange={(e) => handleInputChange(e, index, "outHour")} className="me-1 w-50" />
                    <Form.Control type="text" value={employee.outMinute} onChange={(e) => handleInputChange(e, index, "outMinute")} className="w-50" />
                  </td>
                  <td>
                    <Form.Select value={employee.status} onChange={(e) => handleInputChange(e, index, "status")}>
                      <option>Present</option>
                      <option>Absent</option>
                      <option>Leave</option>
                      <option>Holiday</option>
                    </Form.Select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-danger fw-bold">
                  Data not exist
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {checkAccessComponent("Attendance", "UpdateAttendanceAdd", "Update") && employees.length > 0 && (
          <> 
          <div className="text-center mt-3">
            <Button variant="success" onClick={handleUpdate}>Update</Button>
          </div>
          </>
        )}


       
      </div>

      <Modal show={loading} backdrop="static" centered>
        <Modal.Body className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Fetching data, please wait...</p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AttendanceSheet;
