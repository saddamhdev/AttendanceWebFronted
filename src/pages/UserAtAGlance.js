import React from "react";
import { useState,useEffect } from "react";
import { Container, Row, Col, Button, Form,Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../layouts/Navbar";
import { getAllEmployees } from "../services/employeeService";
import { getAllAtAGlanceData ,exportAtAGlanceData} from "../services/userAtAGlanceService";
const AttendanceReport = () => {

     const [startDate, setStartDate] = useState(() => new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0]);
     const [endDate, setEndDate] = useState(() => new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split("T")[0]);
  
    const[employeeId,setEmployeeId]=useState("");
    const[employeeName,setEmployeeName]=useState("");
    const[employees,setEmployees]=useState([]);
    const[userAtAGlanceData,setUserAtAGlanceData]=useState(
      {
        startDate:" ",
        endDate:" ",
        employeeId:" ",
        employeeName:" ",
        officeDay:0,
        totalPresent:0,
        avgTime:0.0,
        leave:0,
        absent:0,
        holiday:0,
        shortTime:0,
        regularTime:0,
        extraTime:0,
        entryInTime:0,
        entryLate:0,
        totalLate:0,
        exitOk:0,
        exitEarly:0,
        totalExtraTime:0,
        officeOutTime:0,
        officeInTime:0,
        totalTime:0

      }
    );


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


  const fetchUserAtAGlanceData = async () => {
      try {
          const response = await getAllAtAGlanceData(employeeId, employeeName, startDate, endDate);
          console.log("Fetched user at a glance data 11:", response);
          setUserAtAGlanceData(response);
      } catch (error) {
          console.error("Error fetching user at a glance data:", error);
      }
  };
  
  useEffect(() => {
      if (employeeId && employeeName && startDate && endDate) {
          fetchUserAtAGlanceData();
      }
  }, [employeeId, employeeName, startDate, endDate]); // Fetch data when any dependency changes


  
    const exportData=async()=>{
        
        await exportAtAGlanceData(userAtAGlanceData);
        alert('Download successfully to Download directory'); // Log the response from the server
        

    }
    
  return (
    <> 
    <Navbar />
    <Container className="mt-4" style={{ paddingTop: '100px' }}>

      <Row className="mb-3 align-items-center">
        <Col md={3}>
          <Form.Control type="date"  value={startDate} onChange={(e) => handleStartDateChange( e.target.value)} />
        </Col>
        <Col md={3}>
          <Form.Control type="date"  value={endDate} onChange={(e)=> handleEndDateChange(e.target.value)} />
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
          <Button variant="dark" className="w-100" onClick={exportData}>Export Data</Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <tbody>
          {/* Office Day */}
          <tr className="text-white text-center fw-bold">
            <td  style={{ backgroundColor: '#CCCCCC' }}  >Office Day</td>
            <td style={{ backgroundColor: '#C0E0A0' }}>Total Present</td>
            <td style={{ backgroundColor: '#5080C0' }}>Avg Time</td>
          </tr>
          <tr className="text-center">
            <td >{userAtAGlanceData.officeDay}</td>
            <td >{userAtAGlanceData.totalPresent}</td>
            <td >{userAtAGlanceData.avgTime}</td>
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
            <td  > {userAtAGlanceData.leave}</td>
            <td >{userAtAGlanceData.absent}</td>
            <td >{userAtAGlanceData.holiday}</td>
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
            <td >{userAtAGlanceData.shortTime}</td>
            <td >{userAtAGlanceData.regularTime}</td>
            <td >{userAtAGlanceData.extraTime}</td>
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
            <td >{userAtAGlanceData.entryInTime}</td>
            <td >{userAtAGlanceData.entryLate}</td>
            <td >{userAtAGlanceData.totalLate}</td>
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
            <td rowSpan={2} className="align-middle" >{userAtAGlanceData.totalExtraTime}</td>
          </tr>
          <tr className="text-center">
            <td >{userAtAGlanceData.exitOk}</td>
            <td >{userAtAGlanceData.exitEarly}</td>
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
            <td >{userAtAGlanceData.officeOutTime}</td>
            <td >{userAtAGlanceData.officeInTime}</td>
            <td >{userAtAGlanceData.totalTime}</td>
          </tr>
        </tbody>
      </Table>
    </Container>
    </>
  );
};

export default AttendanceReport;
