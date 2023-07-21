import outageMapImg from "./Images/Whole_Plant.jpg";
import React, { useState, component } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from "./projects.module.css";
import { useEffect } from "react";

//
export default function OutageMap() {
  // this is how we update state
  const [locations, setLocations] = useState([]);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    projectName: "",
  });


   // These methods will update the state properties.
 function updateForm(value) {
    return setForm((prev) => {
        return { ...prev, ...value };
    });
  }

  // fetch the locations from the locations collection
  useEffect(() => {
    async function getLocations() {
      const response = await fetch(`http://localhost:5050/location/`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const locations = await response.json();
      setLocations(locations);
    }

    getLocations();

    return;
  }, [locations.length]);

  // get access to the records
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

  let query = function locationFilter() {

      const query = { projectName : "Air Compressor"}
      
      return query;
  }

  

  // generating the html for the locations by mapping through
  function locationList() {
    return locations.map((location) => {
      // handling the color of the fields in the outtage map
      let closed = "red";
      let open = "gray";



      function checkProjectsForEachLocation() {
        for (let record in records) {
          if (records[record].position === location.name) {

            // *write code to check if in between time*
            return closed;
          }
        }
        return open;
      }


      let status = checkProjectsForEachLocation();

      return (
        <>
          <div
            className="location"
            key={location._id}
            style={{
              width: location.coordinates.width,
              height: location.coordinates.height,
              left: location.coordinates.left,
              bottom: location.coordinates.bottom,
              position: "absolute",
              backgroundColor: status,
              opacity: "25%",
            }}
          ></div>
        </>
      );
    });
  }

  //render the stuff
  return (
    <>
    <div className="head-text">
      <TransformWrapper initialScale={1}>
        <TransformComponent
          wrapperStyle={{ width: "100%", maxHeight: "calc(100vh - 25px)" }}
          contentStyle={{ width: "100%", maxHeight: "calc(100vh - 25px)" }}
        >
          <img src={outageMapImg} style={{ width: "100%", height: "auto" }} />
          <div></div>
          <div>{locationList()}</div>
        </TransformComponent>
      </TransformWrapper>
    </div>
    </>
  );
}