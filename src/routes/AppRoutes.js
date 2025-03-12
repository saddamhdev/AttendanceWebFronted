import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Error from "../pages/Error";
import RegistrationForm from "../pages/RegistrationForm";
import EmployeeList from "../pages/EmployeeList";
import AttendenceAdd from "../pages/AttendenceAdd";
import GlobalSetting from "../pages/GlobalSetting";
import LocalSetting from "../pages/LocalSetting";
import Position from "../pages/Position";
import UserAtAGlance from "../pages/UserAtAGlance";
import DownloadAllEmployeeAttendanceData from "../pages/DownloadAllEmployeeAttendanceData";
import UpdateAttendenceAdd from "../pages/UpdateAttendenceAdd";
import Summary from "../pages/Summary";
import ProtectedRoute from "../pages/ProtectedRoute"; // Import ProtectedRoute
import Component from "../Developer/Component";
import Menu from "../Developer/Menu";
import Page from "../Developer/Page";
import Role from "../Owner/Role";
import Permission from "../Owner/Permission";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/error" element={<ProtectedRoute><Error /></ProtectedRoute>} />
        <Route path="/reg" element={<ProtectedRoute><RegistrationForm /></ProtectedRoute>} />
        <Route path="/EmployeeList" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
        <Route path="/AttendenceAdd" element={<ProtectedRoute><AttendenceAdd /></ProtectedRoute>} />
        <Route path="/GlobalSetting" element={<ProtectedRoute><GlobalSetting /></ProtectedRoute>} />
        <Route path="/LocalSetting" element={<ProtectedRoute><LocalSetting /></ProtectedRoute>} />
        <Route path="/Position" element={<ProtectedRoute><Position /></ProtectedRoute>} />
        <Route path="/UserAtAGlance" element={<ProtectedRoute><UserAtAGlance /></ProtectedRoute>} />
        <Route path="/DownloadAllEmployeeAttendanceData" element={<ProtectedRoute><DownloadAllEmployeeAttendanceData /></ProtectedRoute>} />
        <Route path="/UpdateAttendenceAdd" element={<ProtectedRoute><UpdateAttendenceAdd /></ProtectedRoute>} />
        <Route path="/Summary" element={<ProtectedRoute><Summary /></ProtectedRoute>} />
        <Route path="/Component" element={<ProtectedRoute><Component /></ProtectedRoute>} />
        <Route path="/Menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
        <Route path="/Page" element={<ProtectedRoute><Page /></ProtectedRoute>} />  
        <Route path="/Role" element={<ProtectedRoute><Role /></ProtectedRoute>} />  
        <Route path="/Permission" element={<ProtectedRoute><Permission /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
