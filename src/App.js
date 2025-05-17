// App.js
import React, { useState, useRef } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import SignatureCanvas from "react-signature-canvas";
import { allTasks, taskSchedule, sectionTitles } from "./taskData";
import pdfBase64 from "./pdfBase64";
import "./index.css";

function App() {
  const sigPilot = useRef();
  const sigInstructor = useRef();
  const sigExaminer = useRef();

  const [trainingRequired, setTrainingRequired] = useState(false);
  const [checkingRequired, setCheckingRequired] = useState(true);
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
    instructorName: "",
    instructorLicense: "",
    date: "",
    examinerName: "",
    examinerLicense: "",
    examinerDate: ""
  });

  const handleChange = (field, value) => {
    setPilotInfo(prev => ({ ...prev, [field]: value }));
  };

  const requiredTaskIds = new Set([
    ...(trainingRequired ? taskSchedule.training[trainingSession] || [] : []),
    ...(checkingRequired ? taskSchedule.checking[checkingSession] || [] : [])
  ]);

  const visibleTasks = showAdditionalItems ? Object.keys(allTasks) : [...requiredTaskIds];

  const generatePDF = async () => {
    const pdfBytes = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPages()[0];
    const fontSize = 10;

    const drawText = (text, x, y) => {
      page.drawText(text, { x, y, size: fontSize, color: rgb(0, 0, 0) });
    };

    drawText(pilotInfo.name, 50, 750);
    drawText(pilotInfo.code, 250, 750);
    drawText(pilotInfo.license, 400, 750);
    drawText(pilotInfo.aircraftType, 50, 730);
    drawText(pilotInfo.function, 250, 730);
    drawText(pilotInfo.opcValidUntil, 400, 730);

    // Insert signature images if available
    const embedSignature = async (sigRef, x, y) => {
      if (sigRef.current && !sigRef.current.isEmpty()) {
        const pngDataUrl = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
        const pngImage = await pdfDoc.embedPng(pngDataUrl);
        const pngDims = pngImage.scale(0.5);
        page.drawImage(pngImage, {
          x,
          y,
          width: pngDims.width,
          height: pngDims.height
        });
      }
    };

    await embedSignature(sigPilot, 50, 150);
    if (trainingRequired) await embedSignature(sigInstructor, 200, 150);
    if (checkingRequired) await embedSignature(sigExaminer, 350, 150);

    const pdfBytesFinal = await pdfDoc.save();
    const blob = new Blob([pdfBytesFinal], { type: "application/pdf" });
    const name = checkingRequired ? "OPC" : "FSTD Training";
    const date = pilotInfo.opcValidUntil.replace(/-/g, "") || "00000000";
    saveAs(blob, `${pilotInfo.code || "XXX"} ${name} ${date}.pdf`);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4 text-sm">
      <h1 className="text-2xl font-bold">4_10 Airplane FSTD Training and Checking</h1>

      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 border rounded">
        {['name', 'code', 'license'].map(field => (
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

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={trainingRequired} onChange={e => setTrainingRequired(e.target.checked)} /> Training Required
        </label>
        {trainingRequired && (
          <>
            <select value={trainingSession} onChange={e => setTrainingSession(Number(e.target.value))} className="border p-1">
              {[1, 2, 3].map(n => <option key={n}>{n}</option>)}
            </select>
            <select value={pilotInfo.trainingLocation} onChange={e => handleChange("trainingLocation", e.target.value)} className="border p-1">
              {["FSTD", "Aircraft"].map(loc => <option key={loc}>{loc}</option>)}
            </select>
            <input type="text" placeholder="Instructor Initials" value={pilotInfo.trainingInstructor} onChange={e => handleChange("trainingInstructor", e.target.value)} className="border p-1" />
          </>
        )}

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={checkingRequired} onChange={e => setCheckingRequired(e.target.checked)} /> Checking Required
        </label>
        {checkingRequired && (
          <>
            <select value={checkingSession} onChange={e => setCheckingSession(Number(e.target.value))} className="border p-1">
              {[1, 2, 3, 4, 5, 6].map(n => <option key={n}>{n}</option>)}
            </select>
            <select value={pilotInfo.checkingLocation} onChange={e => handleChange("checkingLocation", e.target.value)} className="border p-1">
              {["FFS", "Aircraft"].map(loc => <option key={loc}>{loc}</option>)}
            </select>
            <input type="text" placeholder="Examiner Initials" value={pilotInfo.checkingInstructor} onChange={e => handleChange("checkingInstructor", e.target.value)} className="border p-1" />
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div>
          <h3 className="font-medium">Pilot Signature</h3>
          <SignatureCanvas ref={sigPilot} penColor="black" canvasProps={{ className: "border w-full h-24" }} />
        </div>
        {trainingRequired && (
          <div>
            <h3 className="font-medium">Instructor Signature</h3>
            <SignatureCanvas ref={sigInstructor} penColor="black" canvasProps={{ className: "border w-full h-24" }} />
          </div>
        )}
        {checkingRequired && (
          <div>
            <h3 className="font-medium">Examiner Signature</h3>
            <SignatureCanvas ref={sigExaminer} penColor="black" canvasProps={{ className: "border w-full h-24" }} />
          </div>
        )}
      </div>

      <button onClick={generatePDF} className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Generate PDF
      </button>
    </div>
  );
}

export default App;
