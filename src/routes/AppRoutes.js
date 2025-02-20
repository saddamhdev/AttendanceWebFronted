import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Error from "../pages/Error";
import RegistrationForm from "../pages/RegistrationForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/error" element={<Error />} />
        <Route path="/reg" element={<RegistrationForm />} />
      </Routes>
    </Router>
  );
}

export default App;
