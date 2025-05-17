import React, { useState } from "react";
import { allTasks, sectionTitles, taskSchedule } from "./taskData";
import "./index.css";

function App() {
  const [trainingRequired, setTrainingRequired] = useState(true);
  const [checkingRequired, setCheckingRequired] = useState(true);
  const [trainingSession, setTrainingSession] = useState(1);
  const [checkingSession, setCheckingSession] = useState(1);
  const [showAdditionalItems, setShowAdditionalItems] = useState(false);
  const [grades, setGrades] = useState({});
  const [pilotInfo, setPilotInfo] = useState({
    name: "", code: "", license: "", aircraftType: "H25B", function: "PIC", opcValidUntil: "",
    trainingLocation: "FSTD", checkingLocation: "FFS",
    trainingInstructor: "", checkingInstructor: "",
    instructorName: "", instructorLicense: "", date: "",
    examinerName: "", examinerLicense: "", examinerDate: "",
    pilotSignature: "", instructorSignature: "", examinerSignature: ""
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

  const handleChange = (field, value) => {
    setPilotInfo(prev => ({ ...prev, [field]: value }));
  };

  const getVisibleTasks = () => {
    const combined = new Set([
      ...(trainingRequired ? taskSchedule.training[trainingSession] || [] : []),
      ...(checkingRequired ? taskSchedule.checking[checkingSession] || [] : [])
    ]);
    return showAdditionalItems ? Object.keys(allTasks) : [...combined];
  };

  const visibleTasks = getVisibleTasks();

  return (
    <div className="p-4 max-w-6xl mx-auto text-sm space-y-4">
      <h1 className="text-2xl font-bold mb-4">4_10 Airplane FSTD Training and Checking</h1>

      {/* Pilot and Flight Info */}
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 border rounded">
        {["name", "code", "license"].map(field => (
          <div key={field}>
            <label className="block font-medium capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
            <input type="text" value={pilotInfo[field]} onChange={e => handleChange(field, e.target.value)} className="border p-1 w-full" />
          </div>
        ))}
        <div>
          <label className="block font-medium">Aircraft Type</label>
          <select value={pilotInfo.aircraftType} onChange={e => handleChange("aircraftType", e.target.value)} className="border p-1 w-full">
            {["H25B", "F2TH", "B737"].map(type => <option key={type}>{type}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-medium">Function</label>
          <select value={pilotInfo.function} onChange={e => handleChange("function", e.target.value)} className="border p-1 w-full">
            {["PIC", "FO"].map(fn => <option key={fn}>{fn}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-medium">OPC Valid Until</label>
          <input type="date" value={pilotInfo.opcValidUntil} onChange={e => handleChange("opcValidUntil", e.target.value)} className="border p-1 w-full" />
        </div>
      </div>
      {/* Session Controls */}
      <div className="space-y-2">
        {[["Training", trainingRequired, setTrainingRequired, trainingSession, setTrainingSession, "trainingLocation", "trainingInstructor"],
          ["Checking", checkingRequired, setCheckingRequired, checkingSession, setCheckingSession, "checkingLocation", "checkingInstructor"]
        ].map(([label, required, setRequired, session, setSession, locationKey, initialsKey]) => (
          <div key={label}>
            <label className="font-semibold">{label}:</label>
            <select value={required ? "required" : "not_required"} onChange={e => setRequired(e.target.value === "required")} className="border p-1 ml-2">
              <option value="required">Required</option>
              <option value="not_required">Not required</option>
            </select>
            {required && (
              <>
                <label className="ml-4">Session:</label>
                <select value={session} onChange={e => setSession(Number(e.target.value))} className="border p-1 ml-2">
                  {(label === "Training" ? [1, 2, 3] : [1, 2, 3, 4, 5, 6]).map(n => <option key={n}>{n}</option>)}
                </select>
                <label className="ml-4">Performed in:</label>
                <select value={pilotInfo[locationKey]} onChange={e => handleChange(locationKey, e.target.value)} className="border p-1 ml-2">
                  <option value="FSTD">FSTD</option>
                  <option value="Aircraft">Aircraft</option>
                </select>
                <label className="ml-4">Initials:</label>
                <input type="text" value={pilotInfo[initialsKey]} onChange={e => handleChange(initialsKey, e.target.value)} className="border p-1 ml-2" />
              </>
            )}
          </div>
        ))}
        <label className="block mt-2">
          <input type="checkbox" checked={showAdditionalItems} onChange={e => setShowAdditionalItems(e.target.checked)} className="mr-2" />
          Show All Training/Checking Items
        </label>
      </div>

      {/* Task Table */}
      <p className="text-xs text-gray-500">E – Excellent, G – Good, A – Acceptable, P – Poor, U – Unsatisfactory</p>
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-1">ID</th>
            <th className="border p-1">Description</th>
            {trainingRequired && <th className="border p-1">Training Grade</th>}
            {checkingRequired && <th className="border p-1">Checking Grade</th>}
          </tr>
        </thead>
        <tbody>
          {visibleTasks.map(id => {
            const isProgramTask =
              (trainingRequired && taskSchedule.training?.[trainingSession]?.includes(id)) ||
              (checkingRequired && taskSchedule.checking?.[checkingSession]?.includes(id));
            const green = showAdditionalItems && !isProgramTask ? "text-green-600" : "";
            return (
              <tr key={id}>
                <td className={`border p-1 font-mono ${green}`}>{id}</td>
                <td className={`border p-1 ${green}`}>{allTasks[id]}</td>
                {trainingRequired && (
                  <td className="border p-1">
                    {(showAdditionalItems || taskSchedule.training?.[trainingSession]?.includes(id)) && (
                      <select value={grades[id]?.tGrade || ""} onChange={e => updateGrade(id, "tGrade", e.target.value)} className="border w-full p-1">
                        {gradeOptions.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    )}
                  </td>
                )}
                {checkingRequired && (
                  <td className="border p-1">
                    {(showAdditionalItems || taskSchedule.checking?.[checkingSession]?.includes(id)) && (
                      <select value={grades[id]?.cGrade || ""} onChange={e => updateGrade(id, "cGrade", e.target.value)} className="border w-full p-1">
                        {gradeOptions.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Signatures */}
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 border rounded mt-6">
        <div>
          <label className="font-medium block">Pilot Signature</label>
          <input type="text" value={pilotInfo.pilotSignature} onChange={e => handleChange("pilotSignature", e.target.value)} className="border p-1 w-full" />
        </div>
        <div>
          <label className="font-medium block">Instructor Signature</label>
          <input type="text" value={pilotInfo.instructorSignature} onChange={e => handleChange("instructorSignature", e.target.value)} className="border p-1 w-full" />
        </div>
        <div className="col-span-2 border-t pt-4">
          <label className="font-medium block">Instructor Name</label>
          <input type="text" value={pilotInfo.instructorName} onChange={e => handleChange("instructorName", e.target.value)} className="border p-1 w-full mb-2" />
          <label className="font-medium block">Instructor License Number</label>
          <input type="text" value={pilotInfo.instructorLicense} onChange={e => handleChange("instructorLicense", e.target.value)} className="border p-1 w-full mb-2" />
          <label className="font-medium block">Date</label>
          <input type="date" value={pilotInfo.date} onChange={e => handleChange("date", e.target.value)} className="border p-1 w-full mb-2" />
        </div>

        {/* Examiner section only if initials differ */}
        {pilotInfo.checkingInstructor && pilotInfo.checkingInstructor !== pilotInfo.trainingInstructor && (
          <div className="col-span-2 border-t pt-4">
            <h3 className="font-bold mb-2">Examiner Section</h3>
            <label className="font-medium block">Examiner Name</label>
            <input type="text" value={pilotInfo.examinerName} onChange={e => handleChange("examinerName", e.target.value)} className="border p-1 w-full mb-2" />
            <label className="font-medium block">Examiner License Number</label>
            <input type="text" value={pilotInfo.examinerLicense} onChange={e => handleChange("examinerLicense", e.target.value)} className="border p-1 w-full mb-2" />
            <label className="font-medium block">Date</label>
            <input type="date" value={pilotInfo.examinerDate} onChange={e => handleChange("examinerDate", e.target.value)} className="border p-1 w-full mb-2" />
            <label className="font-medium block">Examiner Signature</label>
            <input type="text" value={pilotInfo.examinerSignature} onChange={e => handleChange("examinerSignature", e.target.value)} className="border p-1 w-full mb-2" />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
