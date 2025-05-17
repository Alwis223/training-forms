import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import SignatureCanvas from "react-signature-canvas";
import { allTasks, taskSchedule, sectionTitles } from "./taskData";
import "./index.css";

function App() {
  const exportRef = useRef();
  const sigInstructor = useRef();
  const sigExaminer = useRef();
  const sigPilot = useRef();

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
    examinerName: "", examinerLicense: "", examinerDate: ""
  });

  const gradeOptions = ["", "E", "G", "A", "P", "U"];

  const handleChange = (field, value) => {
    setPilotInfo(prev => ({ ...prev, [field]: value }));
  };

  const updateGrade = (id, type, value) => {
    setGrades(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type]: value
      }
    }));
  };

  const requiredTaskIds = new Set([
    ...(trainingRequired ? taskSchedule.training[trainingSession] || [] : []),
    ...(checkingRequired ? taskSchedule.checking[checkingSession] || [] : [])
  ]);

  const visibleTasks = showAdditionalItems ? Object.keys(allTasks) : [...requiredTaskIds];

  const generatePDF = () => {
    const input = exportRef.current;
    if (!input) return;
    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
      const opcDate = pilotInfo.opcValidUntil.replace(/-/g, "") || "DATE";
      const name = checkingRequired ? "OPC" : "FSTD Training";
      const filename = `${pilotInfo.code || "XXX"} ${name} ${opcDate}.pdf`;
      pdf.save(filename);
    });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto text-sm space-y-4">
      <div ref={exportRef}>
        <h1 className="text-2xl font-bold mb-4">4_10 Airplane FSTD Training and Checking</h1>

        {/* Pilot Info */}
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

        {/* Sessions in a single line */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 bg-gray-50 p-4 border rounded">
          {trainingRequired && (
            <>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={trainingRequired} onChange={e => setTrainingRequired(e.target.checked)} />
                <label className="font-medium">Training Required</label>
                <select value={trainingSession} onChange={e => setTrainingSession(Number(e.target.value))} className="border p-1">
                  {[1, 2, 3].map(n => <option key={n}>{n}</option>)}
                </select>
                <select value={pilotInfo.trainingLocation} onChange={e => handleChange("trainingLocation", e.target.value)} className="border p-1">
                  {["FSTD", "Aircraft"].map(loc => <option key={loc}>{loc}</option>)}
                </select>
                <input type="text" placeholder="Instructor Initials" value={pilotInfo.trainingInstructor} onChange={e => handleChange("trainingInstructor", e.target.value)} className="border p-1" />
              </div>
            </>
          )}

          {checkingRequired && (
            <>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={checkingRequired} onChange={e => setCheckingRequired(e.target.checked)} />
                <label className="font-medium">Checking Required</label>
                <select value={checkingSession} onChange={e => setCheckingSession(Number(e.target.value))} className="border p-1">
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n}>{n}</option>)}
                </select>
                <select value={pilotInfo.checkingLocation} onChange={e => handleChange("checkingLocation", e.target.value)} className="border p-1">
                  {["FFS", "Aircraft"].map(loc => <option key={loc}>{loc}</option>)}
                </select>
                <input type="text" placeholder="Examiner Initials" value={pilotInfo.checkingInstructor} onChange={e => handleChange("checkingInstructor", e.target.value)} className="border p-1" />
              </div>
            </>
          )}
        </div>

        {/* Show All Toggle */}
        <div className="mt-4">
          <label className="inline-flex items-center">
            <input type="checkbox" checked={showAdditionalItems} onChange={e => setShowAdditionalItems(e.target.checked)} />
            <span className="ml-2">Show All Training/Checking Items</span>
          </label>
        </div>

        {/* Table */}
        {Object.entries(sectionTitles).map(([section, title]) => {
          const tasksInSection = visibleTasks.filter(id => id.startsWith(section));
          if (tasksInSection.length === 0) return null;
          return (
            <div key={section} className="mt-6">
              <h3 className="font-bold text-base mb-2">{title}</h3>
              <table className="w-full border text-xs">
                <thead>
                  <tr>
                    <th className="border p-1">ID</th>
                    <th className="border p-1">Description</th>
                    {trainingRequired && <th className="border p-1">Training Grade</th>}
                    {checkingRequired && <th className="border p-1">Checking Grade</th>}
                  </tr>
                </thead>
                <tbody>
                  {tasksInSection.map(id => (
                    <tr key={id}>
                      <td className={`border p-1 ${!requiredTaskIds.has(id) ? "text-green-600" : ""}`}>{id}</td>
                      <td className={`border p-1 ${!requiredTaskIds.has(id) ? "text-green-600" : ""}`}>{allTasks[id]}</td>
                      {trainingRequired && (
                        <td className="border p-1">
                          <select value={grades[id]?.training || ""} onChange={e => updateGrade(id, "training", e.target.value)} className="w-full border p-1">
                            {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </td>
                      )}
                      {checkingRequired && (
                        <td className="border p-1">
                          <select value={grades[id]?.checking || ""} onChange={e => updateGrade(id, "checking", e.target.value)} className="w-full border p-1">
                            {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}

        {/* Signature Section */}
        <div className="mt-8 border-t pt-4 grid grid-cols-1 gap-4">
          <div>
            <h3 className="font-medium mb-1">Pilot Signature</h3>
            <SignatureCanvas penColor="black" canvasProps={{ width: 300, height: 100, className: "border" }} ref={sigPilot} />
          </div>

          {trainingRequired && (
            <div>
              <h3 className="font-medium mb-1">Instructor Signature</h3>
              <SignatureCanvas penColor="black" canvasProps={{ width: 300, height: 100, className: "border" }} ref={sigInstructor} />
            </div>
          )}

          {checkingRequired && (
            <div>
              <h3 className="font-medium mb-1">Examiner Signature</h3>
              <SignatureCanvas penColor="black" canvasProps={{ width: 300, height: 100, className: "border" }} ref={sigExaminer} />
            </div>
          )}
        </div>
      </div>

      <button onClick={generatePDF} className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Generate PDF
      </button>
    </div>
  );
}

export default App;
