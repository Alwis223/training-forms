
import React, { useState } from "react";
import { allTasks, sectionTitles, taskSchedule } from "./taskData";
import "./index.css";

function App() {
  const [trainingRequired, setTrainingRequired] = useState(true);
  const [checkingRequired, setCheckingRequired] = useState(false);
  const [trainingSession, setTrainingSession] = useState(1);
  const [checkingSession, setCheckingSession] = useState(1);
  const [showAdditionalItems, setShowAdditionalItems] = useState(false);
  const [grades, setGrades] = useState({});
  const [pilotInfo, setPilotInfo] = useState({
    name: "",
    code: "",
    license: "",
    aircraftType: "H25B",
    function: "PIC",
    opcValidUntil: "",
    trainingLocation: "FSTD",
    checkingLocation: "FFS",
    trainingInstructor: "",
    checkingInstructor: "",
    pilotSignature: "",
    instructorSignature: ""
  });

  const gradeOptions = ["", "E", "G", "A", "P", "U"];

  const updateGrade = (id, type, value) => {
    setGrades(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type]: value
      }
    }));
  };

  const handlePilotChange = (field, value) => {
    setPilotInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 max-w-7xl mx-auto text-sm">
      <h1 className="text-2xl font-bold mb-4">4_10 Airplane FSTD Training and Checking</h1>

      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 border rounded mb-6">
        <div>
          <label className="block text-sm font-medium">Pilot Name</label>
          <input type="text" className="border p-1 w-full" value={pilotInfo.name} onChange={e => handlePilotChange("name", e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium">3-letter Code</label>
          <input type="text" className="border p-1 w-full" value={pilotInfo.code} onChange={e => handlePilotChange("code", e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium">License Number</label>
          <input type="text" className="border p-1 w-full" value={pilotInfo.license} onChange={e => handlePilotChange("license", e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Aircraft Type</label>
          <select className="border p-1 w-full" value={pilotInfo.aircraftType} onChange={e => handlePilotChange("aircraftType", e.target.value)}>
            <option value="H25B">H25B</option>
            <option value="F2TH">F2TH</option>
            <option value="B737">B737</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Function</label>
          <select className="border p-1 w-full" value={pilotInfo.function} onChange={e => handlePilotChange("function", e.target.value)}>
            <option value="PIC">PIC</option>
            <option value="FO">FO</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">OPC Valid Until</label>
          <input type="date" className="border p-1 w-full" value={pilotInfo.opcValidUntil} onChange={e => handlePilotChange("opcValidUntil", e.target.value)} />
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div>
          <label className="font-semibold mr-2">Training:</label>
          <select value={trainingRequired ? "required" : "not_required"} onChange={e => setTrainingRequired(e.target.value === "required")} className="border p-1">
            <option value="required">Required</option>
            <option value="not_required">Not required</option>
          </select>
          {trainingRequired && (
            <>
              <label className="ml-4 mr-2">Session:</label>
              <select value={trainingSession} onChange={e => setTrainingSession(Number(e.target.value))} className="border p-1">
                {[1, 2, 3].map(n => (<option key={n} value={n}>{n}</option>))}
              </select>
              <label className="ml-4 mr-2">Performed in:</label>
              <select className="border p-1" value={pilotInfo.trainingLocation} onChange={e => handlePilotChange("trainingLocation", e.target.value)}>
                <option value="FSTD">FSTD</option>
                <option value="Aircraft">Aircraft</option>
              </select>
              <label className="ml-4 mr-2">Instructor Initials:</label>
              <input type="text" className="border p-1" value={pilotInfo.trainingInstructor} onChange={e => handlePilotChange("trainingInstructor", e.target.value)} />
            </>
          )}
        </div>
        <div>
          <label className="font-semibold mr-2">Checking:</label>
          <select value={checkingRequired ? "required" : "not_required"} onChange={e => setCheckingRequired(e.target.value === "required")} className="border p-1">
            <option value="required">Required</option>
            <option value="not_required">Not required</option>
          </select>
          {checkingRequired && (
            <>
              <label className="ml-4 mr-2">Session:</label>
              <select value={checkingSession} onChange={e => setCheckingSession(Number(e.target.value))} className="border p-1">
                {[1, 2, 3, 4, 5, 6].map(n => (<option key={n} value={n}>{n}</option>))}
              </select>
              <label className="ml-4 mr-2">Performed in:</label>
              <select className="border p-1" value={pilotInfo.checkingLocation} onChange={e => handlePilotChange("checkingLocation", e.target.value)}>
                <option value="FFS">FFS</option>
                <option value="Aircraft">Aircraft</option>
              </select>
              <label className="ml-4 mr-2">Examiner Initials:</label>
              <input type="text" className="border p-1" value={pilotInfo.checkingInstructor} onChange={e => handlePilotChange("checkingInstructor", e.target.value)} />
            </>
          )}
        </div>
        <div>
          <label className="font-semibold mr-2">Show All Training/Checking Items:</label>
          <input type="checkbox" checked={showAdditionalItems} onChange={e => setShowAdditionalItems(e.target.checked)} />
        </div>
      </div>

      {/* PARAŠAI */}
      <div className="mt-6 grid grid-cols-2 gap-4 bg-gray-50 p-4 border rounded">
        <div>
          <label className="block font-medium">Pilot Signature</label>
          <input type="text" className="border p-1 w-full" value={pilotInfo.pilotSignature} onChange={e => handlePilotChange("pilotSignature", e.target.value)} />
        </div>
        <div>
          <label className="block font-medium">Instructor Signature</label>
          <input type="text" className="border p-1 w-full" value={pilotInfo.instructorSignature} onChange={e => handlePilotChange("instructorSignature", e.target.value)} />
        </div>
      </div>
    </div>
  );
}

export default App;
