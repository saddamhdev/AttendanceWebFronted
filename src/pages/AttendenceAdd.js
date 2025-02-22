import React, { useState,useEffect } from "react";
import { Table, Form, Button } from "react-bootstrap";
import Navbar from "../layouts/Navbar";
import { getAllEmployees } from "../services/employeeService";
import { saveAttendance } from "../services/attendanceDataService";

const AttendanceSheet = () => {
  const [user, setUser] = useState([])
  const [employees, setEmployees] = useState([ 
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setEmployees([...employees.map(emp => ({ ...emp, date: e.target.value }))]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const getMonthName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { month: "long" }).toUpperCase();
  };
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getAllEmployees("1");
        console.log("Fetched employees:", response);
        if (Array.isArray(response)) {
          setEmployees(response.map(emp => ({
            date: selectedDate,
            employeeId: emp.idNumber, // Fixed syntax error
            name: emp.name,
            startHour: "9",
            startMinute: "0",
            lateEntryReason: "",
            startPeriod: "AM",
            exitHour: "5",
            exitMinute: "0",
            exitPeriod: "PM",
            outHour: "0",
            outMinute: "0",
            status: "Present",
          })));
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);


  const handleInputChange = (e, index, field) => {
    const newEmployees = [...employees];
    newEmployees[index][field] = e.target.value;
    setEmployees(newEmployees);
  };

  const handleSubmit = async () => {
    const response = await saveAttendance(employees);
    alert(response.message);
  };

  return (
    <>
    
     <Navbar/>

    <div className="container mt-4" style={{ paddingTop: "100px" }}>
    <div className="d-flex align-items-center mb-3">
        <Form.Control 
          type="date" 
          value={selectedDate} 
          onChange={handleDateChange} 
          className="me-2" 
        />
        <Button variant="secondary" className="me-2" >{"<"}</Button>
        <Form.Control 
          type="text" 
          value={formatDate(selectedDate)} 
          readOnly 
          className="me-2" 
        />
        <Button variant="secondary">{">"}</Button>
      </div>

      <div className="border p-3">
        <h5 className="text-center">Daily Attendance Sheet - {new Date(selectedDate).getFullYear()}</h5>
        <div className="d-flex justify-content-between mt-2">
          <span>Month: {getMonthName(selectedDate)}</span>
          <span>Date: {selectedDate}</span>
        </div>
      </div>

      <div className="d-flex my-3">
        <Form.Select className="me-2">
          <option>Present</option>
          <option>Absent</option>
        </Form.Select>
        <Form.Select>
          <option>Office</option>
          <option>Remote</option>
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
          {employees.map((employee, index) => (
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
              <td><Form.Control type="text" className="w-100" /></td>
              <td className="d-flex">
                <Form.Control type="text" value={employee.outHour} onChange={(e) => handleInputChange(e, index, "outHour")} className="me-1 w-50" />
                <Form.Control type="text" value={employee.outMinute} onChange={(e) => handleInputChange(e, index, "outMinute")} className="w-50" />
              </td>
              <td>
                <Form.Select value={employee.status} onChange={(e) => handleInputChange(e, index, "status")}>
                  <option>Present</option>
                  <option>Absent</option>
                </Form.Select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="text-center mt-3">
          <Button variant="success" onClick={handleSubmit}>Submit</Button>
        </div>
    </div>
    </>
  );
};

export default AttendanceSheet;
