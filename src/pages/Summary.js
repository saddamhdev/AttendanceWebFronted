import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Table, Form, Button, Modal, Spinner, InputGroup } from "react-bootstrap";
import Navbar from "../layouts/Navbar";
import {
  getAttendanceDataForAnyPeriod,
  exportSummaryAttendanceData,
} from "../services/attendanceDataService";
import { getAllEmployees } from "../services/employeeService";
import { checkAccessComponent } from "../utils/accessControl";

const AttendanceSheet = () => {
  const [employees, setEmployees] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const latestRequestRef = useRef(0);
  const [users, setUsers] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [search, setSearch] = useState(""); // 🔎 search text

  // ========== Helpers ==========
  const isMissing = (val) => {
    if (val == null) return true;
    const s = String(val).trim();
    return s === "" || s === "—" || s === "-";
  };

  // duration => seconds
  const toSecondsDuration = (val) => {
    if (isMissing(val)) return null;
    const s = String(val).trim();
    let m = s.match(/^(\d{1,2}):([0-5]?\d)(?::([0-5]?\d))?$/);
    if (m) {
      const h = parseInt(m[1], 10) || 0;
      const min = parseInt(m[2], 10) || 0;
      const sec = m[3] ? parseInt(m[3], 10) : 0;
      return h * 3600 + min * 60 + sec;
    }
    m = s.match(/^(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?\s*(?:(\d+)\s*s)?$/i);
    if (m && (m[1] || m[2] || m[3])) {
      const h = parseInt(m[1] || "0", 10);
      const min = parseInt(m[2] || "0", 10);
      const sec = parseInt(m[3] || "0", 10);
      return h * 3600 + min * 60 + sec;
    }
    m = s.match(/^(\d+(?:\.\d+)?)\s*h?$/i);
    if (m) return Math.round(parseFloat(m[1]) * 3600);
    return null;
  };

  // clock => seconds since midnight
  const toSecondsClock = (val) => {
    if (isMissing(val)) return null;
    const s = String(val).trim();
    let m = s.match(/^(\d{1,2}):([0-5]?\d)(?::([0-5]?\d))?\s*(AM|PM)$/i);
    if (m) {
      let h = parseInt(m[1], 10) || 0;
      const min = parseInt(m[2], 10) || 0;
      const sec = m[3] ? parseInt(m[3], 10) : 0;
      const ap = m[4].toUpperCase();
      h = h % 12;
      if (ap === "PM") h += 12;
      return h * 3600 + min * 60 + sec;
    }
    m = s.match(/^([01]?\d|2[0-3]):([0-5]?\d)(?::([0-5]?\d))?$/);
    if (m) {
      const h = parseInt(m[1], 10) || 0;
      const min = parseInt(m[2], 10) || 0;
      const sec = m[3] ? parseInt(m[3], 10) : 0;
      return h * 3600 + min * 60 + sec;
    }
    return null;
  };

  const getComparable = (val, type) => {
    switch (type) {
      case "date": {
        if (isMissing(val)) return null;
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d.getTime();
      }
      case "number": {
        if (isMissing(val)) return null;
        const n = parseFloat(val);
        return Number.isFinite(n) ? n : null;
      }
      case "duration": return toSecondsDuration(val);
      case "clock": return toSecondsClock(val);
      default:
        if (isMissing(val)) return null;
        return String(val).trim().toLowerCase();
    }
  };

  // Colored badge for final "Comment" column
  const renderCommentBadge = (val) => {
    const v = (val ?? "").toString().trim().toLowerCase();
    const map = { present: "success", absent: "danger", leave: "warning", holiday: "info" };
    const variant = map[v] ?? "secondary";
    const label = v ? v.charAt(0).toUpperCase() + v.slice(1) : "—";
    return <span className={`badge text-bg-${variant}`}>{label}</span>;
  };

  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "asc", type: "date" });
  const onSort = (key, type = "string") => {
    setSortConfig((prev) => (prev.key === key
      ? { key, direction: prev.direction === "asc" ? "desc" : "asc", type }
      : { key, direction: "asc", type }));
  };
  const sortIcon = (key) => (sortConfig.key !== key ? "↕" : sortConfig.direction === "asc" ? "▲" : "▼");

  // Column definitions
  const columns = [
    { label: "Date", key: "date", type: "date" },
    { label: "Entry Time", key: "entryTime", type: "clock" },
    { label: "Late Duration", key: "lateDuration", type: "duration" },
    { label: "Entry Comment", key: "entryComment", type: "string" },
    { label: "Exit Time", key: "exitTime", type: "clock" },
    { label: "Time After Exit", key: "timeAfterExit", type: "duration" },
    { label: "Exit Comment", key: "exitComment", type: "string" },
    { label: "Out Time", key: "outTime", type: "number" },
    { label: "Total Time In Day", key: "totalTimeInDay", type: "duration" },
    { label: "Day Comment", key: "dayComment", type: "string" },
    { label: "Comment", key: "comment", type: "string", isBadge: true },
  ];
  const filterKeys = columns.map((c) => c.key);

  // ========== Data fetching ==========
  const fetchEmployees = useCallback(async () => {
    let requestId = ++latestRequestRef.current;
    setLoading(true);
    try {
      const response = await getAllEmployees("1");
      if (requestId === latestRequestRef.current && Array.isArray(response) && response.length > 0) {
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

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const handleUserChange = (e) => {
    const selectedName = e.target.value;
    setEmployeeName(selectedName);
    const selectedUser = users.find((us) => us.name === selectedName);
    if (selectedUser) setEmployeeId(selectedUser.idNumber);
  };

  const fetchingData = async () => {
    if (!startDate || !endDate || !employeeId || new Date(startDate) > new Date(endDate)) return;
    let requestId = ++latestRequestRef.current;
    setLoading(true);
    try {
      const response = await getAttendanceDataForAnyPeriod(employeeId, employeeName, startDate, endDate);
      if (requestId === latestRequestRef.current) {
        setEmployees(Array.isArray(response) ? response : []);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    setLoading(true);
    const success = await exportSummaryAttendanceData(employees);
    setLoading(false);
    alert(success ? "Exported successfully to Download directory" : "Export failed. Please check your internet or try again later.");
  };

  // ========== Filter + Sort ==========
  const filteredEmployees = useMemo(() => {
    if (!Array.isArray(employees)) return [];
    const q = search.trim().toLowerCase();
    if (!q) return [...employees];
    const tokens = q.split(/\s+/).filter(Boolean); // AND match across tokens
    return employees.filter((emp) => {
      const hay = filterKeys.map((k) => (emp[k] == null ? "" : String(emp[k]))).join(" ").toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
  }, [employees, search]);

  const sortedEmployees = useMemo(() => {
    const base = filteredEmployees;
    const { key, direction, type } = sortConfig || {};
    if (!key) return [...base];

    const asc = direction === "asc";
    return [...base].sort((a, b) => {
      const av = getComparable(a[key], type);
      const bv = getComparable(b[key], type);
      const aNull = av === null;
      const bNull = bv === null;
      if (aNull && bNull) return 0;
      if (aNull) return 1; // nulls bottom
      if (bNull) return -1; // nulls bottom
      if (av < bv) return asc ? -1 : 1;
      if (av > bv) return asc ? 1 : -1;
      return 0;
    });
  }, [filteredEmployees, sortConfig]);

  return (
    <>
      <Navbar />
      <div className="container mt-4" style={{ paddingTop: "100px" }}>
        <div className="row align-items-center mb-3">
          <div className="col-12 col-md-2 mb-2">
            <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="col-12 col-md-2 mb-2">
            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="col-12 col-md-3 mb-2">
            <Form.Select value={employeeName} onChange={handleUserChange} className="w-100">
              {users.map((us) => (
                <option key={us.idNumber} value={us.name}>
                  {us.name}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="col-12 col-md-2 mb-2">
            <Button variant="primary" onClick={fetchingData} className="w-100">
              Fetch Data
            </Button>
          </div>
          {checkAccessComponent("User", "Summary", "Export") && (
            <div className="col-12 col-md-3 mb-2">
              <Button
                variant="dark"
                onClick={exportData}
                disabled={!employees || employees.length === 0}
                className="w-100"
              >
                Export Data
              </Button>
            </div>
          )}
        </div>

        <div className="border p-3 mb-3 text-center">
          <h5>Monthly Attendance Sheet</h5>
          <div className="row mt-2">
            <div className="col-6 text-start">Start Date: {startDate || "—"}</div>
            <div className="col-6 text-end">End Date: {endDate || "—"}</div>
          </div>
        </div>

        {/* 🔎 Search Bar */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div style={{ minWidth: 260, maxWidth: 420 }} className="w-100 me-2">
            <InputGroup>
              <InputGroup.Text role="img" aria-label="search">🔎</InputGroup.Text>
              <Form.Control
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search (date, time, comment, etc.)"
              />
              {search && (
                <Button variant="outline-secondary" onClick={() => setSearch("")} title="Clear search">✖</Button>
              )}
            </InputGroup>
          </div>
          <small className="text-muted">
            Showing <b>{sortedEmployees.length}</b> of <b>{Array.isArray(employees) ? employees.length : 0}</b> rows
          </small>
        </div>

        <div className="table-responsive mt-2">
          <Table bordered hover className="text-center align-middle">
            <thead className="table-light">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="text-nowrap">
                    <button
                      type="button"
                      onClick={() => onSort(c.key, c.type)}
                      className="btn btn-link p-0 text-decoration-none"
                      title={`Sort by ${c.label}`}
                    >
                      {c.label} <span className="ms-1">{sortIcon(c.key)}</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedEmployees.length > 0 ? (
                sortedEmployees.map((emp, rowIdx) => (
                  <tr key={rowIdx}>
                    {columns.map((c) => {
                      const cellVal = emp[c.key];
                      return (
                        <td key={c.key}>
                          {c.isBadge ? renderCommentBadge(cellVal) : (isMissing(cellVal) ? "—" : cellVal)}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center text-danger" style={{ verticalAlign: "middle" }}>
                    No attendance data available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
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
