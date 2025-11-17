import React, { useState, useEffect } from "react";
import { Table, Form, Button } from "react-bootstrap";
import Navbar from "../layouts/Navbar";
import { getAllEmployees } from "../services/employeeService";
import { saveAttendance } from "../services/attendanceDataService";
import { checkAccessComponent } from "../utils/accessControl";

const AttendanceSheet = () => {

  const [user, setUser] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [dayStatus, setDayStatus] = useState("Office");

  // 🔥 NEW STATES
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // 🔥 SUCCESS SOUND
  const playSuccessSound = () => {
    const audio = new Audio("/audio.mp3");
    audio.play();
  };

  // 🔥 AUTO HIDE TOAST
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setEmployees([...employees.map(emp => ({ ...emp, date: e.target.value }))]);
  };

  const handleDayStatusChange = (e) => {
    const newStatus = e.target.value;
    setDayStatus(newStatus);

    setEmployees(prevEmployees =>
      prevEmployees.map(emp => ({ ...emp, globalDayStatus: newStatus }))
    );
  };

  const getMonthName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { month: "long" }).toUpperCase();
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getAllEmployees("1");

        if (Array.isArray(response)) {
          setEmployees(
            response.map(emp => ({
              date: selectedDate,
              employeeId: emp.idNumber,
              name: emp.name,
              startHour: "10",
              startMinute: "0",
              lateEntryReason: "",
              startPeriod: "AM",
              exitHour: "6",
              exitMinute: "0",
              exitPeriod: "PM",
              earlyExitReason: "",
              outHour: "0",
              outMinute: "0",
              updateStatus: "1",
              globalDayStatus: dayStatus,
              status: "Present"
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, [selectedDate]);

  const handleInputChange = (e, index, field) => {
    const newEmployees = [...employees];
    let value = e.target.value;

    if (field === "startHour") {
      newEmployees[index][field] = value;
      const hour = parseInt(value, 10);
      if (!isNaN(hour)) {
        if (hour >= 6 && hour <= 11) newEmployees[index].startPeriod = "AM";
        else newEmployees[index].startPeriod = "PM";
      }
    } else if (field === "exitHour") {
      const hour = parseInt(value, 10);
      if (!isNaN(hour)) {
        if (hour === 12) {
          if (newEmployees[index].exitPeriod === "AM") {
            alert("❌ Exit at 12 AM means next day, not allowed.");
            newEmployees[index][field] = "";
            return setEmployees(newEmployees);
          } else {
            alert("🌞 It is time to Dupur (12 PM).");
            newEmployees[index][field] = value;
            return setEmployees(newEmployees);
          }
        }

        if (hour >= 1 && hour <= 9 && newEmployees[index].exitPeriod === "AM") {
          alert("❌ Exit between 1–9 AM not allowed.");
          newEmployees[index][field] = "";
          return setEmployees(newEmployees);
        }

        if (hour >= 1 && hour <= 11) newEmployees[index].exitPeriod = "PM";
      }
      newEmployees[index][field] = value;
    } else if (field === "exitPeriod") {
      const hour = parseInt(newEmployees[index].exitHour, 10);
      if (hour >= 1 && hour <= 11 && value === "AM") {
        alert("❌ Exit between 1–11 can only be PM.");
        return;
      }
      if (hour === 12 && value === "AM") {
        alert("❌ Exit at 12 AM means next day, not allowed.");
        return;
      }
      if (hour === 12 && value === "PM") alert("🌞 It is time to Dupur (12 PM).");

      newEmployees[index][field] = value;
    } else {
      newEmployees[index][field] = value;
    }

    setEmployees(newEmployees);
  };

  // 🔥 SUBMIT WITH OVERLAY, TOAST, SOUND
  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);

      const response = await saveAttendance(employees);

      setShowToast(true);       // show toast
      playSuccessSound();       // play ding sound
      //alert(response.message);  // keep your alert
    } 
    catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } 
    finally {
      setSubmitLoading(false);
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setEmployees(prevEmployees =>
      prevEmployees.map(emp => ({ ...emp, status: newStatus }))
    );
  };

  const changeDate = (days) => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate.toISOString().split("T")[0]);
  };

  return (
    <>
      <Navbar />

      {/* 🔥 FULLSCREEN OVERLAY LOADING */}
      {submitLoading && (
        <div style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div className="spinner-border text-light" style={{ width: "4rem", height: "4rem" }}></div>
        </div>
      )}

      {/* 🔥 TOAST SUCCESS MESSAGE */}
      {showToast && (
        <div 
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 99999
          }}
        >
          <div className="toast show bg-success text-white p-3 rounded shadow">
            <strong>Success!</strong> Attendance saved successfully.
          </div>
        </div>
      )}

      <div className="container mt-4" style={{ paddingTop: "100px" }}>

        {/* Date Navigation */}
        <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center mb-3 gap-2">
          <Button variant="secondary" onClick={() => changeDate(-1)}>{"<"}</Button>

          <Form.Control
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="flex-grow-1"
          />

          <Button variant="secondary" onClick={() => changeDate(1)}>{">"}</Button>
        </div>

        {/* Header */}
        <div className="border p-3">
          <h5 className="text-center">Daily Attendance Sheet - {new Date(selectedDate).getFullYear()}</h5>
          <div className="d-flex justify-content-between flex-wrap mt-2">
            <span>Month: {getMonthName(selectedDate)}</span>
            <span>Date: {selectedDate}</span>
          </div>
        </div>

        {/* Status Select */}
        <div className="d-flex flex-wrap gap-2 my-3">
          <Form.Select className="me-2 flex-grow-1" onChange={handleStatusChange}>
            <option>Present</option>
            <option>Absent</option>
            <option>Leave</option>
            <option>Holiday</option>
          </Form.Select>

          <Form.Select className="flex-grow-1" value={dayStatus} onChange={handleDayStatusChange}>
            <option>Office</option>
            <option>Holiday</option>
          </Form.Select>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <Table bordered hover className="table-sm">
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
                  <td style={{ minWidth: "120px" }}>{employee.name}</td>

                  <td className="d-flex flex-column flex-sm-row">
                    <Form.Control
                      type="text"
                      value={employee.startHour}
                      onChange={(e) => handleInputChange(e, index, "startHour")}
                      className="mb-2 mb-sm-0 me-sm-1 w-100 w-sm-50"
                      style={{ minWidth: "50px", maxWidth: "80px" }}
                    />

                    <Form.Control
                      type="text"
                      value={employee.startMinute}
                      onChange={(e) => handleInputChange(e, index, "startMinute")}
                      className="mb-2 mb-sm-0 me-sm-1 w-100 w-sm-50"
                      style={{ minWidth: "50px", maxWidth: "80px" }}
                    />

                    <Form.Select
                      value={employee.startPeriod}
                      disabled
                      style={{ minWidth: "80px", maxWidth: "80px" }}
                    >
                      <option>AM</option>
                      <option>PM</option>
                    </Form.Select>
                  </td>

                  <td>
                    <Form.Control
                      type="text"
                      value={employee.llateEntryReason}
                      onChange={(e) => handleInputChange(e, index, "lateEntryReason")}
                      className="w-100"
                      style={{ minWidth: "100px" }}
                    />
                  </td>

                  <td className="d-flex flex-column flex-sm-row">
                    <Form.Control
                      type="text"
                      value={employee.exitHour}
                      onChange={(e) => handleInputChange(e, index, "exitHour")}
                      className="mb-2 mb-sm-0 me-sm-1 w-100 w-sm-50"
                      style={{ minWidth: "50px", maxWidth: "80px" }}
                    />

                    <Form.Control
                      type="text"
                      value={employee.exitMinute}
                      onChange={(e) => handleInputChange(e, index, "exitMinute")}
                      className="mb-2 mb-sm-0 me-sm-1 w-100 w-sm-50"
                      style={{ minWidth: "50px", maxWidth: "80px" }}
                    />

                    <Form.Select
                      value={employee.exitPeriod}
                      onChange={(e) => handleInputChange(e, index, "exitPeriod")}
                      className="w-100 w-sm-50"
                      style={{ minWidth: "80px", maxWidth: "80px" }}
                    >
                      <option>AM</option>
                      <option>PM</option>
                    </Form.Select>
                  </td>

                  <td>
                    <Form.Control
                      type="text"
                      value={employee.earlyExitReason}
                      onChange={(e) => handleInputChange(e, index, "earlyExitReason")}
                      className="w-100"
                      style={{ minWidth: "100px" }}
                    />
                  </td>

                  <td className="d-flex flex-column flex-sm-row">
                    <Form.Control
                      type="text"
                      value={employee.outHour}
                      onChange={(e) => handleInputChange(e, index, "outHour")}
                      className="mb-2 mb-sm-0 me-sm-1 w-100 w-sm-50"
                      style={{ minWidth: "50px" }}
                    />

                    <Form.Control
                      type="text"
                      value={employee.outMinute}
                      onChange={(e) => handleInputChange(e, index, "outMinute")}
                      className="mb-2 mb-sm-0 me-sm-1 w-100 w-sm-50"
                      style={{ minWidth: "50px" }}
                    />
                  </td>

                  <td>
                    <Form.Select
                      value={employee.status}
                      onChange={(e) => handleInputChange(e, index, "status")}
                      className="w-100"
                      style={{ minWidth: "110px" }}
                    >
                      <option>Present</option>
                      <option>Absent</option>
                      <option>Leave</option>
                      <option>Holiday</option>
                    </Form.Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* 🔥 SUBMIT BUTTON with LOADING */}
        {checkAccessComponent("Attendance", "AttendanceAdd", "Submit") && (
          <div className="text-center mt-3">
            <Button 
              variant="success" 
              onClick={handleSubmit}
              disabled={submitLoading}
            >
              {submitLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Saving...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        )}

      </div>
    </>
  );
};

export default AttendanceSheet;
