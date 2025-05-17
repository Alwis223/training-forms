import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { allTasks, taskSchedule } from "./taskData";
import "./index.css";

function App() {
  const exportRef = useRef();

  const [trainingRequired, setTrainingRequired] = useState(false);
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
  const handleChange = (field, value) => setPilotInfo(p => ({ ...p, [field]: value }));
  const updateGrade = (id, type, value) => setGrades(g => ({ ...g, [id]: { ...g[id], [type]: value } }));

  const visibleTasks = (() => {
    const combined = new Set([
      ...(trainingRequired ? taskSchedule.training[trainingSession] || [] : []),
      ...(checkingRequired ? taskSchedule.checking[checkingSession] || [] : [])
    ]);
    return showAdditionalItems ? Object.keys(allTasks) : [...combined];
  })();

  const generatePDF = () => {
    if (!exportRef.current) return;
    html2canvas(exportRef.current, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      const code = pilotInfo.code || "XXX";
      const date = (pilotInfo.opcValidUntil || "0000-00-00").replace(/-/g, "");
      const name = checkingRequired ? "OPC" : "FSTD Training";
      pdf.save(`${code} ${name} ${date}.pdf`);
    });
  };
  return (
    <div className="p-4 max-w-6xl mx-auto text-sm space-y-4">
      <div ref={exportRef}>
        <h1 className="text-2xl font-bold mb-4">4_10 Airplane FSTD Training and Checking</h1>

        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 border rounded">
          {["name", "code", "license"].map(field => (
            <div key={field}>
              <label className="block font-medium capitalize">{field}</label>
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

        <div className="mt-6">
          <label className="font-medium block">Pilot Signature</label>
          <input type="text" value={pilotInfo.pilotSignature} onChange={e => handleChange("pilotSignature", e.target.value)} className="border p-1 w-full" />
        </div>

        {trainingRequired && (
          <div className="mt-4">
            <label className="font-medium block">Instructor Signature</label>
            <input type="text" value={pilotInfo.instructorSignature} onChange={e => handleChange("instructorSignature", e.target.value)} className="border p-1 w-full" />
            <label className="font-medium block">Instructor Name</label>
            <input type="text" value={pilotInfo.instructorName} onChange={e => handleChange("instructorName", e.target.value)} className="border p-1 w-full" />
            <label className="font-medium block">Instructor License</label>
            <input type="text" value={pilotInfo.instructorLicense} onChange={e => handleChange("instructorLicense", e.target.value)} className="border p-1 w-full" />
            <label className="font-medium block">Date</label>
            <input type="date" value={pilotInfo.date} onChange={e => handleChange("date", e.target.value)} className="border p-1 w-full" />
          </div>
        )}

        {checkingRequired && (
          <div className="mt-4">
            <h3 className="font-bold text-base mb-2">Examiner Section</h3>
            <label className="font-medium block">Examiner Name</label>
            <input type="text" value={pilotInfo.examinerName} onChange={e => handleChange("examinerName", e.target.value)} className="border p-1 w-full" />
            <label className="font-medium block">Examiner License</label>
            <input type="text" value={pilotInfo.examinerLicense} onChange={e => handleChange("examinerLicense", e.target.value)} className="border p-1 w-full" />
            <label className="font-medium block">Date</label>
            <input type="date" value={pilotInfo.examinerDate} onChange={e => handleChange("examinerDate", e.target.value)} className="border p-1 w-full" />
            <label className="font-medium block">Examiner Signature</label>
            <input type="text" value={pilotInfo.examinerSignature} onChange={e => handleChange("examinerSignature", e.target.value)} className="border p-1 w-full" />
          </div>
        )}
      </div>

      <button
        onClick={generatePDF}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate PDF
      </button>
    </div>
  );
}

export default App;
