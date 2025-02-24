import React from "react";
import { useState,useEffect } from "react";
import { Container, Row, Col, Card, Button, Form,Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../layouts/Navbar";
import { getAllEmployees } from "../services/employeeService";

const AttendanceReport = () => {

    const[startDate,setStartDate]=useState("");
    const[endDate,setEndDate]=useState("");
    const[employeeId,setEmployeeId]=useState("");
    const[employeeName,setEmployeeName]=useState("");
    const[employees,setEmployees]=useState([]);
    const fetchEmployees=async()=>{ 
        try{
            const response=await getAllEmployees("1");
            console.log("Fetched employees:",response);
            setEmployees(response);
            setEmployeeId(response[0].idNumber);
            setEmployeeName(response[0].name);
        }catch(error){
            console.error("Error fetching employees:",error);
        }
    }
    useEffect(()=>{
        fetchEmployees();
    },[]);

    const  handleStartDateChange=(value)=>{
        setStartDate(value);

    }
    const handleEndDateChange=(value)=>{
        setEndDate(value); 
             
    } 
    const handleUserChange=(e)=>{
        setEmployeeName(e.target.value);
        const selectedUser=employees.find((us)=>us.name===e.target.value);
        setEmployeeId(selectedUser.idNumber);


    } 
    
  return (
    <> 
    <Navbar />
    <Container className="mt-4" style={{ paddingTop: '100px' }}>

      <Row className="mb-3 align-items-center">
        <Col md={3}>
          <Form.Control type="date" defaultValue="2025-02-01" value={startDate} onChange={(e) => handleStartDateChange( e.target.value)} />
        </Col>
        <Col md={3}>
          <Form.Control type="date" defaultValue="2025-03-01" value={endDate} onChange={(e)=> handleEndDateChange(e.target.value)} />
        </Col>
        <Col md={3}>
           <Form.Select value={employeeName} className="me-2" onChange={(e) => handleUserChange(e)}>
            {
                employees.map((us, index) => (
                <option key={index}>{us.name}</option>
                ))
            }
           </Form.Select>
        </Col>
        <Col md={3}>
          <Button variant="dark" className="w-100">Export Data</Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <tbody>
          {/* Office Day */}
          <tr className="text-white text-center fw-bold">
            <td style={{ backgroundColor: '#CCCCCC' }}>Office Day</td>
            <td style={{ backgroundColor: '#C0E0A0' }}>Total Present</td>
            <td style={{ backgroundColor: '#5080C0' }}>Avg Time</td>
          </tr>
          <tr className="text-center">
            <td>1</td>
            <td>1</td>
            <td>8:0</td>
          </tr>

          <tr className="text-white text-center fw-bold">
            <td colSpan={3} style={{ backgroundColor: '#F2F2F2', padding: '10px' }}></td>
          </tr>

          {/* Leave */}
          <tr className="text-white text-center fw-bold">
            <td style={{ backgroundColor: '#FCE588', color: '#000' }}>Leave</td>
            <td style={{ backgroundColor: '#B22222' }}>Absent</td>
            <td style={{ backgroundColor: '#333333' }}>Holiday</td>
          </tr>
          <tr className="text-center">
            <td>0</td>
            <td>0</td>
            <td>0</td>
          </tr>

          <tr className="text-white text-center fw-bold">
            <td colSpan={3} style={{ backgroundColor: '#F2F2F2', padding: '10px' }}></td>
          </tr>

          {/* Short Time */}
          <tr className="text-white text-center fw-bold">
            <td style={{ backgroundColor: '#F2B6B6', color: '#000' }}>Short Time</td>
            <td style={{ backgroundColor: '#C2E0C2', color: '#000' }}>Regular Time</td>
            <td style={{ backgroundColor: '#226622' }}>Extra Time</td>
          </tr>
          <tr className="text-center">
            <td>1</td>
            <td>1</td>
            <td>0</td>
          </tr>

          <tr className="text-white text-center fw-bold">
            <td colSpan={3} style={{ backgroundColor: '#F2F2F2', padding: '10px' }}></td>
          </tr>

          {/* Entry */}
          <tr className="text-white text-center fw-bold">
            <td colSpan={3} style={{ backgroundColor: '#6080C0' }}>Entry</td>
          </tr>
          <tr className="text-center">
            <td style={{ backgroundColor: '#C0E0A0' }}>In Time</td>
            <td style={{ backgroundColor: '#F2B6B6' }}>Late</td>
            <td style={{ backgroundColor: '#B22222' }}>Total Late</td>
          </tr>
          <tr className="text-center">
            <td>00</td>
            <td>0:0</td>
            <td>0:0</td>
          </tr>

          <tr className="text-white text-center fw-bold">
            <td colSpan={3} style={{ backgroundColor: '#F2F2F2', padding: '10px' }}></td>
          </tr>

          {/* Exit */}
          <tr className="text-white text-center fw-bold">
            <td colSpan={2} style={{ backgroundColor: '#9988CC' }}>Exit</td>
            <td style={{ backgroundColor: '#D9EAD3' }}>Total Extra Time</td>
          </tr>
          <tr className="text-center">
            <td style={{ backgroundColor: '#C0E0A0' }}>Ok</td>
            <td style={{ backgroundColor: '#F2B6B6' }}>Early</td>
            <td rowSpan={2} className="align-middle">00</td>
          </tr>
          <tr className="text-center">
            <td>00</td>
            <td>0:0</td>
          </tr>

          <tr className="text-white text-center fw-bold">
            <td colSpan={3} style={{ backgroundColor: '#F2F2F2', padding: '10px' }}></td>
          </tr>

          {/* Office Out Time */}
          <tr className="text-white text-center fw-bold">
            <td style={{ backgroundColor: '#F2B6B6' }}>Office Out Time</td>
            <td style={{ backgroundColor: '#C2E0C2' }}>Office In Time</td>
            <td style={{ backgroundColor: '#226622' }}>Total Time</td>
          </tr>
          <tr className="text-center">
            <td>8</td>
            <td>8:0</td>
            <td>8:0</td>
          </tr>
        </tbody>
      </Table>
    </Container>
    </>
  );
};

export default AttendanceReport;
