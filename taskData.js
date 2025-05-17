
export const allTasks = {
  "1.0": "Preflight preparation",
  "1.1": "Cockpit preparation",
  "1.2": "Checklist usage",
  "1.3": "Briefings",
  "1.4": "Taxi procedures",
  "1.5": "Take-off procedures",
  "1.6": "Climb and cruise procedures",
  "2.0": "Abnormal engine procedures",
  "2.1": "Single engine approach",
  "2.2": "Engine failure after V1",
  "3.0": "Emergency descent",
  "3.1": "Windshear escape",
  "3.2": "TCAS RA response",
  "7.0": "Circling approach",
  "7.1": "Missed approach",
  "7.2": "Rejected take-off"
};

export const taskSchedule = {
  training: {
    1: ["1.0", "1.1", "1.2", "1.3"],
    2: ["1.4", "1.5", "1.6", "2.0"],
    3: ["2.1", "2.2", "3.0"]
  },
  checking: {
    1: ["1.0", "1.1", "1.2", "1.3"],
    2: ["1.1", "1.2", "1.3", "1.4"],
    3: ["1.1", "1.3", "1.5", "1.6"],
    4: ["1.1", "1.4", "1.5"],
    5: ["1.1", "1.3", "1.6"],
    6: ["1.0", "1.2", "1.6", "2.0", "2.2", "3.1", "3.2", "7.0", "7.1", "7.2"]
  }
};

export const sectionTitles = {
  "1": "Preparation & Departure",
  "2": "Abnormal Procedures",
  "3": "Emergency Procedures",
  "7": "Circling / Missed / Rejected"
};
