import React, { useState } from "react";
import { useNavigate } from "react-router";
 
export default function Create() {
 const [form, setForm] = useState({
   name: "",
   position: "",
   startTime: "",
   endTime: "",
   PPR: "",
 });
 const navigate = useNavigate();
 
 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }
 
 // This function will handle the submission.
 async function onSubmit(e) {
   e.preventDefault();
 
   // When a post request is sent to the create url, we'll add a new record to the database.
   const newPerson = { ...form };
 
   await fetch("http://localhost:5050/record", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newPerson),
   })
   .catch(error => {
     window.alert(error);
     return;
   });
 
   setForm({ name: "", position: "", startTime: "", endTime: "", PPR: ""});
   navigate("/");
 }
 
 // This following section will display the form that takes the input from the user.
 return (
   <div>
     <h3>Create New Record</h3>
     <form onSubmit={onSubmit}>

      {/*Project Name Entry Field*/}
       <div className="form-group">
         <label htmlFor="projectName">Project Name</label>
         <input
           type="text"
           className="form-control"
           id="projectName"
           value={form.projectName}
           onChange={(e) => updateForm({ projectName: e.target.value })}
         />
       </div>

       {/*Location Entry Field*/}
       <div className="form-group">
         <label htmlFor="location">Location</label>
         <input
           type="text"
           className="form-control"
           id="location"
           value={form.position}
           onChange={(e) => updateForm({ position: e.target.value })}
         />
       </div>


      {/*Start Time Entry Field*/}
       <div className="form-group">
         <label htmlFor="startTime">Start Time</label>
         <input
           type="datetime-local"
           className="form-control"
           id="startTime"
           value={form.startTime}
           onChange={(e) => updateForm({ startTime: e.target.value })}
         />
       </div>

      {/*End Time Entry Field*/}
       <div className="form-group">
         <label htmlFor="endTime">End Time</label>
         <input
           type="datetime-local"
           className="form-control"
           id="endTime"
           value={form.endTime}
           onChange={(e) => updateForm({ endTime: e.target.value })}
         />
       </div>

      {/*PPR Entry Field*/}
       <div className="form-group">
         <label htmlFor="PPR">PPR</label>
         <input
           type="text"
           className="form-control"
           id="PPR"
           value={form.PPR}
           onChange={(e) => updateForm({ PPR: e.target.value })}
         />
       </div>

       <div className="form-group">
         <input
           type="submit"
           value="Create person"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}