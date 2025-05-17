import React, { useState } from "react";
import { allTasks, sectionTitles, taskSchedule } from "./taskData";

function App() {
  const [trainingRequired, setTrainingRequired] = useState(true);
  const [checkingRequired, setCheckingRequired] = useState(false);
  const [trainingSession, setTrainingSession] = useState(1);
  const [checkingSession, setCheckingSession] = useState(1);
  const [showAdditionalItems, setShowAdditionalItems] = useState(false);
  const [grades, setGrades] = useState({});
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

  return (
    <div className="p-4 max-w-7xl mx-auto text-sm">
      <h1 className="text-xl font-bold mb-4">4_10 Airplane FSTD Training and Checking</h1>

      <div className="mb-4 space-y-2">
        <div>
          <label className="font-semibold mr-2">Training:</label>
          <select
            value={trainingRequired ? "required" : "not_required"}
            onChange={e => setTrainingRequired(e.target.value === "required")}
            className="border p-1"
          >
            <option value="required">Required</option>
            <option value="not_required">Not required</option>
          </select>
          {trainingRequired && (
            <>
              <label className="ml-4 mr-2">Session:</label>
              <select
                value={trainingSession}
                onChange={e => setTrainingSession(Number(e.target.value))}
                className="border p-1"
              >
                {[1, 2, 3].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </>
          )}
        </div>

        <div>
          <label className="font-semibold mr-2">Checking:</label>
          <select
            value={checkingRequired ? "required" : "not_required"}
            onChange={e => setCheckingRequired(e.target.value === "required")}
            className="border p-1"
          >
            <option value="required">Required</option>
            <option value="not_required">Not required</option>
          </select>
          {checkingRequired && (
            <>
              <label className="ml-4 mr-2">Session:</label>
              <select
                value={checkingSession}
                onChange={e => setCheckingSession(Number(e.target.value))}
                className="border p-1"
              >
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </>
          )}
        </div>

        <div>
          <label className="font-semibold mr-2">Show All Training/Checking Items:</label>
          <input
            type="checkbox"
            checked={showAdditionalItems}
            onChange={e => setShowAdditionalItems(e.target.checked)}
          />
        </div>
      </div>

      {Object.entries(sectionTitles).map(([section, title]) => {
        const taskIds = Object.keys(allTasks).filter(id => id.startsWith(section + "."));
        const visibleIds = showAdditionalItems
          ? taskIds
          : taskIds.filter(id =>
              (trainingRequired && taskSchedule.training?.[trainingSession]?.includes(id)) ||
              (checkingRequired && taskSchedule.checking?.[checkingSession]?.includes(id))
            );

        if (visibleIds.length === 0) return null;

        return (
          <div key={section} className="mt-6">
            <h2 className="font-bold mb-1 text-lg">{title}</h2>
            <p className="text-sm text-gray-600 mb-2">
              E – Excellent, G – Good, A – Acceptable, P – Poor, U – Unsatisfactory
            </p>

            <table className="w-full border-collapse text-sm mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border w-1/12">ID</th>
                  <th className="p-2 border w-7/12">Description</th>
                  {trainingRequired && <th className="p-2 border w-2/12">Training Grade</th>}
                  {checkingRequired && <th className="p-2 border w-2/12">Checking Grade</th>}
                </tr>
              </thead>
              <tbody>
                {visibleIds.map(id => {
                  const isMandatory =
                    (trainingRequired && taskSchedule.training?.[trainingSession]?.includes(id)) ||
                    (checkingRequired && taskSchedule.checking?.[checkingSession]?.includes(id));
                  const isAdditional = showAdditionalItems && !isMandatory;

                  return (
                    <tr key={id} className="border-t">
                      <td className={`p-2 border font-mono ${isAdditional ? "text-green-600" : ""}`}>{id}</td>
                      <td className={`p-2 border ${isAdditional ? "text-green-600" : ""}`}>{allTasks[id]}</td>

                      {trainingRequired && (
                        <td className="p-2 border">
                          {(showAdditionalItems || taskSchedule.training?.[trainingSession]?.includes(id)) && (
                            <select
                              className="border p-1 w-full"
                              value={grades[id]?.tGrade || ""}
                              onChange={e => updateGrade(id, "tGrade", e.target.value)}
                            >
                              {gradeOptions.map(g => (
                                <option key={g} value={g}>{g}</option>
                              ))}
                            </select>
                          )}
                        </td>
                      )}

                      {checkingRequired && (
                        <td className="p-2 border">
                          {(showAdditionalItems || taskSchedule.checking?.[checkingSession]?.includes(id)) && (
                            <select
                              className="border p-1 w-full"
                              value={grades[id]?.cGrade || ""}
                              onChange={e => updateGrade(id, "cGrade", e.target.value)}
                            >
                              {gradeOptions.map(g => (
                                <option key={g} value={g}>{g}</option>
                              ))}
                            </select>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

export default App;
