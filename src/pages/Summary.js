import React, { useState, useEffect, useRef, useCallback } from "react";
import { Table, Form, Button, Modal, Spinner } from "react-bootstrap";
import Navbar from "../layouts/Navbar";
import { getAttendanceDataForAnyPeriod, exportDownloadAllAttendanceData,exportSummaryAttendanceData } from "../services/attendanceDataService";
import { getAllEmployees } from "../services/employeeService";

const AttendanceSheet = () => {
  const [employees, setEmployees] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const latestRequestRef = useRef(0);
  const [users, setUsers] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  // Fetch Attendance Data
  useEffect(() => {
    if (!startDate || !endDate || !employeeId || new Date(startDate) > new Date(endDate)) return;

    let requestId = ++latestRequestRef.current;
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await getAttendanceDataForAnyPeriod(employeeId, employeeName, startDate, endDate);
        if (requestId === latestRequestRef.current) {
          console.log("Latest Data Fetched:", response);
          setEmployees(Array.isArray(response) ? response : []);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, employeeId]);

  // Fetch Employees
  const fetchEmployees = useCallback(async () => {
    let requestId = ++latestRequestRef.current;
    setLoading(true);
    try {
      const response = await getAllEmployees("1");
      if (requestId === latestRequestRef.current && response.length > 0) {
        setUsers(response);
        setEmployeeId(response[0].idNumber);
        setEmployeeName(response[0].name);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Handle Employee Selection Change
  const handleUserChange = (e) => {
    const selectedName = e.target.value;
    setEmployeeName(selectedName);
    const selectedUser = users.find((us) => us.name === selectedName);
    if (selectedUser) setEmployeeId(selectedUser.idNumber);
  };

  // Export Data
  const exportData = async () => {
    setLoading(true);
    await exportSummaryAttendanceData(employees);
    setLoading(false);
    alert("Exported successfully to Download directory");
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4" style={{ paddingTop: "100px" }}>
        <div className="d-flex align-items-center mb-3">
          <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="me-2" />
          <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="me-2" />
        </div>

        <div className="border p-3 mb-4">
          <h5 className="text-center">Monthly Attendance Sheet</h5>
          <div className="d-flex justify-content-between mt-2">
            <span>Start Date: {startDate}</span>
            <span>End Date: {endDate}</span>
          </div>
        </div>

        {/* User Selection & Export Button */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <Form.Select value={employeeName} onChange={handleUserChange} style={{ maxWidth: "250px" }}>
            {users.map((us) => (
              <option key={us.idNumber} value={us.name}>
                {us.name}
              </option>
            ))}
          </Form.Select>
          <Button variant="dark" onClick={exportData} disabled={!employees || employees.length === 0}>
            Export Data
          </Button>
        </div>

        <div className="table-responsive mt-4">
          <Table bordered hover className="text-center">
            <thead>
              <tr>
                <th>Date</th>
                <th>Entry Time</th>
                <th>Late Duration</th>
                <th>Entry Comment</th>
                <th>Exit Time</th>
                <th>Time After Exit</th>
                <th>Exit Comment</th>
                <th>Out Time</th>
                <th>Total Time In Day</th>
                <th>Day Comment</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {employees?.length > 0 ? (
                [...employees]
                  .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sorting by date
                  .map((emp, index) => (
                    <tr key={index}>
                      <td>{emp.date}</td>
                      <td>{emp.entryTime}</td>
                      <td>{emp.lateDuration}</td>
                      <td>{emp.entryComment}</td>
                      <td>{emp.exitTime}</td>
                      <td>{emp.timeAfterExit}</td>
                      <td>{emp.exitComment}</td>
                      <td>{emp.outTime}</td>
                      <td>{emp.totalTimeInDay}</td>
                      <td>{emp.dayComment}</td>
                      <td>{emp.comment}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center text-danger" style={{ verticalAlign: "middle" }}>
                    No attendance data available
                  </td>
                </tr>
              )}
            </tbody>

          </Table>
        </div>
      </div>

      {/* Loading Popup */}
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
