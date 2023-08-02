//import React from "react";
import outageMapImg from "./Images/Whole_Plant.jpg";
import React, { useState, component } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styles from "./projects.module.css";
import { useEffect } from "react";
import Select from "react-select";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

//
export default function OutageMap() {
  // this is how we update state
  const [locations, setLocations] = useState([]); //intiates state for all locations (styles for each project to show where they are on map)
  const [records, setRecords] = useState([]); //initiates state for all records from MongoDB, returns as an Array of Objects
  const [recordsPPRFilter, setRecordsPPRFilter] = useState([]);

  // setting options for dropdown menu
  const [selected, setSelected] = useState(null); //initiates state for project name dropdown choice

  const [uniquePPRs, setUniquePPRS] = useState([]); //initiates state for unique PPRs which are fetched from MongoDB using .distinct

  const [PPRChoice, setSelectedPPR] = useState([]); //initiates state for PPR dropdown choice

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
        return;
      }

      const records = await response.json(); //assigns the variable records to the fetched response as a Javascript Object
      setRecords(records);
    }

    getRecords();

    return;
  }, [records.length]);

    // trying to implement unique values
    useEffect(() => {
      async function getUniquePPRs() {
        const response = await fetch(`http://localhost:5050/record/pprs`);
  
        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          window.alert(message);
          return;
        }
  
        const uniquePPRs = await response.json();
        setUniquePPRS(uniquePPRs);
      }
  
      getUniquePPRs();
  
      return;
    }, [uniquePPRs.length]);

  // generating the html for the locations by mapping through
  function locationList(selectedOption) {
    return locations.map((location) => {
      for (let option in selectedOption) {
        //logic for comparing the selected option to the given location we are mapping through
        if (selectedOption[option].position === location.name) {
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
              <Popup
                trigger={
                  <div
                    className=""
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
                }
                position="top center"
                nested
              >
                <div>{location.name}</div>
              </Popup>
            </>
          );
        }
      }
      /* compare the selectionOption[val].position to location.name
      -for each location check if there is an selectedoption that matches
      - scenario 1:
      -- user hasnt selected anything 
      -- array is null 
      -- if array is blank -> run through code with all locations

      - scenario 2:
      -- user has selected options
      -- array has values
      -- for each location.name check if there is a selectedOption[val].position that matches
      --- if matches , run through the code below 
      --- if doesnt match, go to next value of location array

      


      */
    });
  }


  const projectListPPRFilter = (selectedPPR) => {
    let updatedProjectNameOptions = [];
    for (let option in records) {
      if (records[option].PPR === selectedPPR[option].PPR) {
          updatedProjectNameOptions = records[option].PPR.map(updatedProjectNameOptions)
          setRecordsPPRFilter(updatedProjectNameOptions);
      } else {
        return setRecordsPPRFilter(records);
      }
      setSelectedPPR(selectedPPR);
    }
  }

  //Create an array of selected PPRs this would be equal to PPRChoice
  //Lets the dropdown of Project choices only contain options where the PPR is equal to that of PPRChoice
      //for option in records
        //if records[option].PPR == PPRChoice[option]
        //then let updatedProjects === records

  // When someone chooses the projects they would like to view this function sets the state of which projects are chosen
  const handleChange = (selectedOption) => {
    setSelected(selectedOption);
    console.log(`Option selected:`, selectedOption);
  };

  const handlePPRChange = (selectedPPR) => {
    setSelectedPPR(selectedPPR);
    projectListPPRFilter(selectedPPR);
    console.log(`Option selected:`, selectedPPR);
  };

  //render the stuff
  return (
    <>

      <Select
        isMulti
        name="colors"
        options={uniquePPRs.map((t) => ({ value: t, label: t }))}
        onChange={projectListPPRFilter}
        className="basic-multi-select"
        classNamePrefix="select"
      />

      <Select
        isMulti
        name="colors"
        options={recordsPPRFilter}
        getOptionLabel={(option) => option.projectName}
        getOptionValue={(option) => option._id}
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
      />

        {}

      <div className="head-text">
        <TransformWrapper initialScale={1}>
          <TransformComponent
            wrapperStyle={{ width: "100%", maxHeight: "calc(100vh - 25px)" }}
            contentStyle={{ width: "100%", maxHeight: "calc(100vh - 25px)" }}
          >
            <img src={outageMapImg} style={{ width: "100%", height: "auto" }} />
            <div></div>
            <div>{locationList(selected)}</div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </>
  );
}
