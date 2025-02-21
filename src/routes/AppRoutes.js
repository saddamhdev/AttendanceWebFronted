import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Error from "../pages/Error";
import RegistrationForm from "../pages/RegistrationForm";
import EmployeeList from "../pages/EmployeeList";
import AttendenceAdd from "../pages/AttendenceAdd";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/error" element={<Error />} />
        <Route path="/reg" element={<RegistrationForm />} />
        <Route path="/EmployeeList" element={<EmployeeList />} />
        <Route path="/AttendenceAdd" element={<AttendenceAdd />} />
      </Routes>
    </Router>
  );
}

export default App;
