import React, { use, useState,useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "../assets/Navbar.css"; // Import custom CSS
import { checkAccessComponent, checkAccess, checkAccessMenu } from "../utils/accessControl";


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
            {checkAccessMenu("Owner") && (
              <>
                <a className="nav-link" href="#">Owner</a>
                <ul className="dropdown-menu">
                  {checkAccess("Owner","Role") && <li><a className="dropdown-item" href="/Role">Role</a></li>}
                  {checkAccess("Owner","Permission") && <li><a className="dropdown-item" href="/Permission">Permission</a></li>}
                  {checkAccess("Owner","Assign Permission") && <li><a className="dropdown-item" href="/AssignPermission">Assign Permission</a></li>}
                </ul>
              </>
            )}
          </li>


         <li className="nav-item dropdown hover-dropdown">
            {checkAccessMenu("Developer") && (
              <>
                <a className="nav-link" href="#">Developer</a>
                <ul className="dropdown-menu">
                {checkAccess("Developer","menu") && <li><a className="dropdown-item" href="/menu">Menu</a></li>}
                  {checkAccess("Developer","page") && <li><a className="dropdown-item" href="/page">Page</a></li>}
                  {checkAccess("Developer","component") && <li><a className="dropdown-item" href="/component">Component</a></li>}
                </ul>
              </>
            )}
          </li>


           
           <li className="nav-item dropdown hover-dropdown">
            {checkAccessMenu("Attendance") && (
              <>
                <a className="nav-link" href="#">Attendance</a>
                <ul className="dropdown-menu">
                  {checkAccess("Attendance","AttendanceAdd") && <li><a className="dropdown-item" href="/AttendanceAdd">Add</a></li>}
                  {checkAccess("Attendance","UpdateAttendanceAdd") && <li><a className="dropdown-item" href="/UpdateAttendanceAdd">Update</a></li>}
                </ul>
              </>
            )}
          </li>

          <li className="nav-item dropdown hover-dropdown">
            {checkAccessMenu("User") && (
              <>
                <a className="nav-link" href="#">User</a>
                <ul className="dropdown-menu">
                  {checkAccess("User","Summary") && <li><a className="dropdown-item" href="/Summary">Summary</a></li>}
                  {checkAccess("User","UserAtAGlance") && <li><a className="dropdown-item" href="/UserAtAGlance">At a Glance</a></li>}
                  {checkAccess("User","LocalSetting") && <li><a className="dropdown-item" href="/LocalSetting">Setting</a></li>}
                  {checkAccess("User","asset") && <li><a className="dropdown-item" href="/marketing">Asset</a></li>}
                  {checkAccess("User","profile") && <li><a className="dropdown-item" href="/marketing">Profile</a></li>}
                </ul>
              </>
            )}
          </li>

          <li className="nav-item dropdown hover-dropdown">
            {checkAccessMenu("Employee") && (
              <>
                <a className="nav-link" href="#">Employee</a>
                <ul className="dropdown-menu">
                  {checkAccess("Employee","EmployeeList") && <li><a className="dropdown-item" href="/EmployeeList">List</a></li>}
                  {checkAccess("Employee","viewEmployeeArchive") && <li><a className="dropdown-item" href="/viewEmployeeArchive">Archieve</a></li>}
                  {checkAccess("Employee","Position") && <li><a className="dropdown-item" href="/Position">Position</a></li>}
                </ul>
              </>
            )}
          </li>

          <li className="nav-item dropdown hover-dropdown">
            {checkAccessMenu("Setting") && (
              <a className="nav-link" href="/GlobalSetting">Setting</a>
            )}
          </li>

          <li className="nav-item dropdown hover-dropdown">
            {checkAccessMenu("Download") && (
              <a className="nav-link" href="/DownloadAllEmployeeAttendanceData">Download</a>
            )}
          </li>

          <li className="nav-item dropdown hover-dropdown">
            {checkAccessMenu("Archieve") && (
              <>
                <a className="nav-link" href="/services">Archieve</a>
                <ul className="dropdown-menu">
                  {checkAccess("Archieve","viewEmployeeArchive") && <li><a className="dropdown-item" href="/web-design">Employee</a></li>}
                  {checkAccess("Archieve","viewSummary") && <li><a className="dropdown-item" href="/seo">Summary</a></li>}
                  {checkAccess("Archieve","viewAtAGlance") && <li><a className="dropdown-item" href="/marketing">At a Glance</a></li>}
                  {checkAccess("Archieve","download") && <li><a className="dropdown-item" href="/marketing">Download</a></li>}
                </ul>
              </>
            )}
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
