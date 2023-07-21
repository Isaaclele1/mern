import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

const { DateTime } = require("luxon");
const dt = DateTime;

const Record = (props) => (
  <>
 <tr>
   <td>{props.record.projectName}</td>
   <td>{props.record.position}</td>
   <td>{dt.fromISO(props.record.startTime).toFormat('f')}</td>
   <td>{dt.fromISO(props.record.endTime).toFormat('f')}</td>
   <td>{props.record.PPR}</td>
   <td>
     <Link className="btn btn-link" to={`/edit/${props.record._id}`}>Edit</Link> |
     <button className="btn btn-link"
       onClick={() => {
         props.deleteRecord(props.record._id);
       }}
     >
       Delete
     </button>
   </td>
 </tr>
 </>
);
 
export default function RecordList() {
 const [records, setRecords] = useState([]);
 
 // This method fetches the records from the database.
 useEffect(() => {
   async function getRecords() {
     const response = await fetch(`http://localhost:5050/record/`);
 
     if (!response.ok) {
       const message = `An error occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }
 
     const records = await response.json();
     setRecords(records);
   }

   getRecords();
 
   return;
 }, [records.length]);
 
 // This method will delete a record
 async function deleteRecord(id) {
   await fetch(`http://localhost:5050/record/${id}`, {
     method: "DELETE"
   });
 
   const newRecords = records.filter((el) => el._id !== id);
   setRecords(newRecords);
 }
 
 // This method will map out the records on the table
 function recordList() {
   return records.map((record) => {
     return (
      <>
       <Record
         record={record}
         deleteRecord={() => deleteRecord(record._id)}
         key={record._id}
       />

      </>
     );
   });
 }
 
 // This following section will display the table with the records of individuals.
 return (
   <div>
     <h3>Project List</h3>
     <table className="table table-striped" style={{ marginTop: 20 }}>
       <thead>
         <tr>
           <th>Project Name</th>
           <th>Location</th>
           <th>Start Time</th>
           <th>End Time</th>
           <th>PPR</th>
           <th>Action</th>
         </tr>
       </thead>
       <tbody>{recordList()}</tbody>
     </table>
     <NavLink className="nav-link" to="/create">
         <p className="text-center">Create Record</p>
       </NavLink>
   </div>
 );
}