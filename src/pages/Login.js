import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { loginEmloyee } from "../services/employeeService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async(e) => {
    e.preventDefault();
    
    const response = await loginEmloyee(email, password);
   
    if (response.result === "Authenticated") {
      const sessionExpiryTime = Date.now() + 10 * 60 * 1000; // Set expiry (10 minutes)
      localStorage.setItem("authToken", response.token);
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("expiry", sessionExpiryTime); // Store expiry time
      navigate("/AttendenceAdd");
    } else {
      navigate("/reg");
    }
  };
  
  

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f4f6f9" }}>
      <div className="card p-4 shadow-lg" style={{ width: "350px", borderRadius: "10px" }}>
        <h4 className="text-center mb-3">Login</h4>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
}



 export default Login;