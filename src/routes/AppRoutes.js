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
        <Route path="/GlobalSetting" element={<GlobalSetting />} />
        <Route path="/LocalSetting" element={<LocalSetting />} />
        <Route path="/Position" element={<Position />} />
        <Route path="/UserAtAGlance" element={<UserAtAGlance />} />
        <Route path="/DownloadAllEmployeeAttendanceData" element={<DownloadAllEmployeeAttendanceData />} />
        <Route path="/UpdateAttendenceAdd" element={<UpdateAttendenceAdd />} />
      </Routes>
    </Router>
  );
}

export default App;
