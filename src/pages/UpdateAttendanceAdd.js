import React, { useState, useEffect } from "react";
import { Table, Form, Button, Spinner, Modal } from "react-bootstrap";
import Navbar from "../layouts/Navbar";
import { getAttendanceDataForFixDay, saveAttendance, updateAttendance } from "../services/attendanceDataService";
import { checkAccessComponent } from "../utils/accessControl";

const AttendanceSheet = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [dayStatus, setDayStatus] = useState("Office");
  const [loading, setLoading] = useState(false); // 🔥 Existing (for Search modal)
  const [oldData, setOldData] = useState([]);

  // 🔥 NEW STATES FOR UPDATE BUTTON
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // 🔥 SUCCESS SOUND
  const playSuccessSound = () => {
    const audio = new Audio("/audos.mp3");  // keep same mp3
    audio.play();
  };

  // 🔥 AUTO HIDE TOAST
  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  const fetchEmployees = async () => {
    setLoading(true);  // SHOW SEARCH MODAL LOADER
    try {
      const response = await getAttendanceDataForFixDay(selectedDate);
      console.log("Fetched attendance data:", response);
      setEmployees(Array.isArray(response) && response.length > 0 ? response : []);
      setOldData(JSON.parse(JSON.stringify(Array.isArray(response) && response.length > 0 ? response : [])));
    } catch (error) {
      console.error("Error:", error);
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

    setEmployees(prev =>
      prev.map(emp => ({ ...emp, globalDayStatus: newStatus }))
    );
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setEmployees(prev =>
      prev.map(emp => ({ ...emp, status: newStatus }))
    );
  };

  const handleInputChange = (e, index, field) => {

    const newEmployees = [...employees];
    let value = e.target.value;

    // (KEEP YOUR FULL LOGIC SAME)
    // Start Hour, Exit Hour, Exit Period, Default
    // --------------------------------------------
    
    if (field === "startHour") {
      newEmployees[index][field] = value;
      const hour = parseInt(value, 10);
      if (!isNaN(hour)) {
        if (hour >= 6 && hour <= 11) newEmployees[index].startPeriod = "AM";
        else newEmployees[index].startPeriod = "PM";
      }
    }
    else if (field === "exitHour") {
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
    }
    else if (field === "exitPeriod") {
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
    }
    else {
      newEmployees[index][field] = value;
    }

    setEmployees(newEmployees);
  };

  // 🔥 UPDATE BUTTON — WITH OVERLAY SPINNER + TOAST + SOUND
  const handleUpdate = async () => {
    try {
      setUpdateLoading(true);       // show overlay spinner

      const response = await updateAttendance(employees, oldData);

      setShowToast(true);           // show toast
      playSuccessSound();           // play sound

      //alert(response);              // keep your existing alert
      await fetchEmployees();       // refresh data
    } 
    catch (error) {
      console.error("Update error:", error);
      alert("Update failed!");
    } 
    finally {
      setUpdateLoading(false);      // hide overlay spinner
    }
  };

  const changeDate = (days) => {
    if (!selectedDate) return;
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const getMonthName = (date) =>
    date ? new Date(date).toLocaleString("en-US", { month: "long" }) : "";

  return (
    <>
      <Navbar />

      {/* 🔥 FULLSCREEN OVERLAY SPINNER (Update Button) */}
      {updateLoading && (
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
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 99999
        }}>
          <div className="toast show bg-success text-white p-3 rounded shadow">
            <strong>Updated!</strong> Attendance updated successfully.
          </div>
        </div>
      )}

      {/* 🔵 SEARCH MODAL LOADING */}
      <Modal show={loading} backdrop="static" centered>
        <Modal.Body className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Fetching data, please wait...</p>
        </Modal.Body>
      </Modal>

      <div className="container mt-4" style={{ paddingTop: "100px" }}>

        {/* Date Controls */}
        <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center mb-3 gap-2">
          <Button variant="secondary" onClick={() => changeDate(-1)}>{"<"}</Button>

          <Form.Control type="date" value={selectedDate} onChange={handleDateChange} />

          <Button variant="primary" onClick={fetchEmployees}>Search</Button>

          <Button variant="secondary" onClick={() => changeDate(1)}>{">"}</Button>
        </div>

        {/* Header */}
        <div className="border p-3">
          <h5 className="text-center">
            Daily Attendance Sheet - {selectedDate ? new Date(selectedDate).getFullYear() : ""}
          </h5>
          <div className="d-flex justify-content-between flex-wrap mt-2">
            <span>Month: {getMonthName(selectedDate)}</span>
            <span>Date: {selectedDate}</span>
          </div>
        </div>

        {/* Global Status */}
        <div className="d-flex flex-column flex-md-row my-3 gap-2">
          <Form.Select
            value={employees.length > 0 ? employees[0].status : "Present"}
            onChange={handleStatusChange}
          >
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

        {/* TABLE (unchanged) */}
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
              {employees.length > 0 ? (
                employees.map((emp, index) => (
                  <tr key={emp.employeeId}>
                    <td>{emp.employeeId}</td>
                    <td style={{ minWidth: "120px" }}>{emp.name}</td>

                    {/* Start Time */}
                    <td className="d-flex flex-column flex-sm-row">
                      <Form.Control
                        type="text"
                        value={emp.startHour}
                        onChange={(e) => handleInputChange(e, index, "startHour")}
                        className="mb-2 mb-sm-0 me-sm-1"
                        style={{ minWidth: "50px", maxWidth: "80px" }}
                      />
                      <Form.Control
                        type="text"
                        value={emp.startMinute}
                        onChange={(e) => handleInputChange(e, index, "startMinute")}
                        className="mb-2 mb-sm-0 me-sm-1"
                        style={{ minWidth: "50px", maxWidth: "80px" }}
                      />
                      <Form.Select
                        value={emp.startPeriod}
                        disabled
                        style={{ minWidth: "80px", maxWidth: "80px" }}
                      >
                        <option>AM</option>
                        <option>PM</option>
                      </Form.Select>
                    </td>

                    {/* Late Entry */}
                    <td>
                      <Form.Control
                        type="text"
                        value={emp.lateEntryReason}
                        onChange={(e) => handleInputChange(e, index, "lateEntryReason")}
                        style={{ minWidth: "100px" }}
                      />
                    </td>

                    {/* Exit */}
                    <td className="d-flex flex-column flex-sm-row">
                      <Form.Control
                        type="text"
                        value={emp.exitHour}
                        onChange={(e) => handleInputChange(e, index, "exitHour")}
                        style={{ minWidth: "50px", maxWidth: "80px" }}
                      />
                      <Form.Control
                        type="text"
                        value={emp.exitMinute}
                        onChange={(e) => handleInputChange(e, index, "exitMinute")}
                        style={{ minWidth: "50px", maxWidth: "80px" }}
                      />
                      <Form.Select
                        value={emp.exitPeriod}
                        onChange={(e) => handleInputChange(e, index, "exitPeriod")}
                        style={{ minWidth: "80px", maxWidth: "80px" }}
                      >
                        <option>AM</option>
                        <option>PM</option>
                      </Form.Select>
                    </td>

                    {/* Early Exit */}
                    <td>
                      <Form.Control
                        type="text"
                        value={emp.earlyExitReason}
                        onChange={(e) => handleInputChange(e, index, "earlyExitReason")}
                        style={{ minWidth: "100px" }}
                      />
                    </td>

                    {/* Out */}
                    <td className="d-flex flex-column flex-sm-row">
                      <Form.Control
                        type="text"
                        value={emp.outHour}
                        onChange={(e) => handleInputChange(e, index, "outHour")}
                        style={{ minWidth: "50px" }}
                      />
                      <Form.Control
                        type="text"
                        value={emp.outMinute}
                        onChange={(e) => handleInputChange(e, index, "outMinute")}
                        style={{ minWidth: "50px" }}
                      />
                    </td>

                    {/* Status */}
                    <td>
                      <Form.Select
                        value={emp.status}
                        onChange={(e) => handleInputChange(e, index, "status")}
                        style={{ minWidth: "110px" }}
                      >
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
        </div>

        {/* UPDATE BUTTON */}
        {checkAccessComponent("Attendance", "UpdateAttendanceAdd", "Update") && employees.length > 0 && (
          <div className="text-center mt-3">
            <Button variant="success" onClick={handleUpdate} disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default AttendanceSheet;
