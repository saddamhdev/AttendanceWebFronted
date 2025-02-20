import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    designation: "",
    joinDate: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:8080/api/employees/add", formData);
      console.log("Employee Added:", response.data);
      alert("Employee added successfully!");
      
      // Clear form fields
      setFormData({
        id: "",
        name: "",
        designation: "",
        joinDate: new Date().toISOString().split("T")[0],
      });
      
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h4 className="text-center mb-3">Employee Registration</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">ID</label>
            <input
              type="text"
              name="id"
              className="form-control"
              placeholder="Enter ID"
              value={formData.id}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Designation</label>
            <input
              type="text"
              name="designation"
              className="form-control"
              placeholder="Enter Designation"
              value={formData.designation}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Join Date</label>
            <input
              type="date"
              name="joinDate"
              className="form-control"
              value={formData.joinDate}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-success w-100">Add Employee</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
