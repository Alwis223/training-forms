
{/* Initials section */}
<div className="grid grid-cols-2 gap-4 mt-4">
  {trainingRequired && (
    <div>
      <label className="block font-medium">Instructor Initials</label>
      <input
        type="text"
        value={pilotInfo.trainingInstructor}
        onChange={e => handleChange("trainingInstructor", e.target.value)}
        className="border p-1 w-full"
      />
    </div>
  )}
  {checkingRequired && (
    <div>
      <label className="block font-medium">Examiner Initials</label>
      <input
        type="text"
        value={pilotInfo.checkingInstructor}
        onChange={e => handleChange("checkingInstructor", e.target.value)}
        className="border p-1 w-full"
      />
    </div>
  )}
</div>

{/* Session selection and performed in */}
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

{/* Signatures */}
<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div>
    <label className="font-medium block">Student Signature</label>
    <input
      type="text"
      value={pilotInfo.pilotSignature}
      onChange={e => handleChange("pilotSignature", e.target.value)}
      className="border p-1 w-full"
    />
  </div>
  {trainingRequired && (
    <div>
      <label className="font-medium block">Instructor Signature</label>
      <input
        type="text"
        value={pilotInfo.instructorSignature}
        onChange={e => handleChange("instructorSignature", e.target.value)}
        className="border p-1 w-full"
      />
      <label className="font-medium block">Instructor Name</label>
      <input
        type="text"
        value={pilotInfo.instructorName}
        onChange={e => handleChange("instructorName", e.target.value)}
        className="border p-1 w-full"
      />
      <label className="font-medium block">Instructor License</label>
      <input
        type="text"
        value={pilotInfo.instructorLicense}
        onChange={e => handleChange("instructorLicense", e.target.value)}
        className="border p-1 w-full"
      />
      <label className="font-medium block">Date</label>
      <input
        type="date"
        value={pilotInfo.date}
        onChange={e => handleChange("date", e.target.value)}
        className="border p-1 w-full"
      />
    </div>
  )}
  {checkingRequired && (
    <div>
      <label className="font-medium block">Examiner Name</label>
      <input
        type="text"
        value={pilotInfo.examinerName}
        onChange={e => handleChange("examinerName", e.target.value)}
        className="border p-1 w-full"
      />
      <label className="font-medium block">Examiner License</label>
      <input
        type="text"
        value={pilotInfo.examinerLicense}
        onChange={e => handleChange("examinerLicense", e.target.value)}
        className="border p-1 w-full"
      />
      <label className="font-medium block">Date</label>
      <input
        type="date"
        value={pilotInfo.examinerDate}
        onChange={e => handleChange("examinerDate", e.target.value)}
        className="border p-1 w-full"
      />
      <label className="font-medium block">Examiner Signature</label>
      <input
        type="text"
        value={pilotInfo.examinerSignature}
        onChange={e => handleChange("examinerSignature", e.target.value)}
        className="border p-1 w-full"
      />
    </div>
  )}
</div>
