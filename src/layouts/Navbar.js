import React, { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "../assets/Navbar.css"; // Import custom CSS

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark  shadow-lg p-3" style={{ backgroundColor: " #1d4961" }}>
      <div className="container-fluid">
        
        {/* Logo */}
        <a className="navbar-brand fs-4 fw-bold" href="/">SNVN</a>

        {/* Mobile Menu Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item dropdown hover-dropdown">
              <a
                className="nav-link"
                href="#"
              >
                Attendence
              </a>

              {/* Sub-navbar for hover */}
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="/AttendenceAdd">Add</a></li>
                <li><a className="dropdown-item" href="/seo">Update</a></li>
              </ul>
            </li>
            <li className="nav-item dropdown hover-dropdown">
              <a
                className="nav-link"
                href="#"
              >
                User
              </a>

              {/* Sub-navbar for hover */}
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="/web-design">Summary</a></li>
                <li><a className="dropdown-item" href="/seo">At a Glance</a></li>
                <li><a className="dropdown-item" href="/marketing">Setting</a></li>
                <li><a className="dropdown-item" href="/marketing">Asset</a></li>
                <li><a className="dropdown-item" href="/marketing">Profile</a></li>
              </ul>
            </li>
            
            <li className="nav-item dropdown hover-dropdown">
              <a
                className="nav-link"
                href="#"
              >
                
                Employee
              </a>

              {/* Sub-navbar for hover */}
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="/EmployeeList">List</a></li>
                <li><a className="dropdown-item" href="/seo">Archieve</a></li>
                <li><a className="dropdown-item" href="/marketing">Delete</a></li>
                <li><a className="dropdown-item" href="/marketing">Position</a></li>
              </ul>
            </li>
          <li className="nav-item dropdown hover-dropdown">
              <a
                className="nav-link"
                href="#"
              >
                Setting
              </a>
            </li>
            <li className="nav-item dropdown hover-dropdown">
              <a
                className="nav-link"
                href="/services"
              >
                Download
              </a>

            </li>
            
            <li className="nav-item dropdown hover-dropdown">
              <a
                className="nav-link"
                href="/services"
              >
                Archieve
              </a>

              {/* Sub-navbar for hover */}
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="/web-design">Employee</a></li>
                <li><a className="dropdown-item" href="/seo">Summary</a></li>
                <li><a className="dropdown-item" href="/marketing">At a Glance</a></li>
                <li><a className="dropdown-item" href="/marketing">Download</a></li>
              </ul>
            </li>
          </ul>

          {/* Search Bar */}
          <form className="d-flex">
            <div className="input-group">
              <span className="input-group-text">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                aria-label="Search"
              />
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
