import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { allTasks, taskSchedule, sectionTitles } from "./taskData";
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
    instructorName: "", instructorLicense: "", date: "",
    examinerName: "", examinerLicense: "", examinerDate: "",
    pilotSignature: "", instructorSignature: "", examinerSignature: ""
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

  const getVisibleTasks = () => {
    const trainingTasks = trainingRequired ? taskSchedule.training[trainingSession] || [] : [];
    const checkingTasks = checkingRequired ? taskSchedule.checking[checkingSession] || [] : [];
    const combined = new Set([...trainingTasks, ...checkingTasks]);
    return showAdditionalItems ? Object.keys(allTasks) : [...combined];
  };

  const visibleTasks = getVisibleTasks();

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
      const filename = `${pilotInfo.code || "XXX"} ${checkingRequired ? "OPC" : "FSTD Training"} ${opcDate}.pdf`;
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

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mt-4">
          <label><input type="checkbox" checked={trainingRequired} onChange={e => setTrainingRequired(e.target.checked)} /> Training Required</label>
          <label><input type="checkbox" checked={checkingRequired} onChange={e => setCheckingRequired(e.target.checked)} /> Checking Required</label>
          <label><input type="checkbox" checked={showAdditionalItems} onChange={e => setShowAdditionalItems(e.target.checked)} /> Show All Training/Checking Items</label>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {trainingRequired && (
            <>
              <div>
                <label className="block font-medium">Training Session</label>
                <select value={trainingSession} onChange={e => setTrainingSession(Number(e.target.value))} className="border p-1 w-full">
                  {[1, 2, 3].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-medium">Performed in (Training)</label>
                <select value={pilotInfo.trainingLocation} onChange={e => handleChange("trainingLocation", e.target.value)} className="border p-1 w-full">
                  {["FSTD", "Aircraft"].map(loc => <option key={loc}>{loc}</option>)}
                </select>
              </div>
            </>
          )}
          {checkingRequired && (
            <>
              <div>
                <label className="block font-medium">Checking Session</label>
                <select value={checkingSession} onChange={e => setCheckingSession(Number(e.target.value))} className="border p-1 w-full">
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-medium">Performed in (Checking)</label>
                <select value={pilotInfo.checkingLocation} onChange={e => handleChange("checkingLocation", e.target.value)} className="border p-1 w-full">
                  {["FFS", "Aircraft"].map(loc => <option key={loc}>{loc}</option>)}
                </select>
              </div>
            </>
          )}
        </div>

        {/* Table */}
        {Object.entries(sectionTitles).map(([section, title]) => {
          const tasksInSection = getVisibleTasks().filter(id => id.startsWith(section));
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
                      <td className={`border p-1 ${!getVisibleTasks().includes(id) ? "text-green-600" : ""}`}>{id}</td>
                      <td className={`border p-1 ${!getVisibleTasks().includes(id) ? "text-green-600" : ""}`}>{allTasks[id]}</td>
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
      </div>

      {/* PDF */}
      <button onClick={generatePDF} className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Generate PDF
      </button>
    </div>
  );
}

export default App;
