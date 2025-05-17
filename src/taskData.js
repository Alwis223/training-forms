const allTasks = {
  "1.0": "Flight preparation (flight data analysis incl. weather information)",
  "1.1": "Performance calculation",
  "1.2": "Airplane external and internal visual inspection",
  "1.3": "Cockpit inspection",
  "1.4": "Checklist, radio and navigation equipment check, frequency selection",
  "1.5": "Taxiing in compliance with ATC instructions",
  "1.6": "Before take-off checks",

  "2.1": "Normal take-off with different flap settings",
  "2.2": "Instrument take-off; transition to instrument flight",
  "2.3": "Crosswind take-off (within crosswind limits)",
  "2.4": "Take-off at maximum take-off mass (actual or simulated)",
  "2.5": "Take-off with simulated engine failure shortly before V1 (FFS only)",
  "2.6": "Rejected take-off before V1",

  "3.1": "Climb",
  "3.2": "Level off",
  "3.3": "Cruise",
  "3.4": "Fuel management",
  "3.5": "Use of checklist",
  "3.6": "System management (electrics, hydraulics, pneumatics, pressurisation, air conditioning)",
  "3.7": "Upset Prevention and Recovery Training (UPRT)",
  "3.8": "Navigation and radio navigation equipment use",

  "4.1": "Normal approach",
  "4.2": "Crosswind approach and landing (within crosswind limits)",
  "4.3": "Instrument approaches: ILS, LLZ, VOR, GNSS, NDB",
  "4.4": "Manual landing",
  "4.5": "Landing with simulated malfunction (engine, systems)",
  "4.6": "Missed approach",

  "5.1": "Post flight checks",
  "5.2": "Parking, shutdown and checklist",

  "6.1": "ETOPS and EDTO procedures",
  "6.2": "Low Visibility Take-off (LVTO)",
  "6.3": "CAT II/III Approach and Landing",
  "6.4": "Steep approaches",
  "6.5": "Circling approach",
  "6.6": "Operations at CAT C aerodromes",

  "7.1": "CRM – decision making, workload management, cooperation",
  "7.2": "Emergency evacuation",
  "7.3": "Smoke or fire in flight and on the ground",
  "7.4": "Decompression",
  "7.5": "Engine failure",
  "7.6": "Aborted take-off at low and high speed",
  "7.7": "TCAS II RA",
  "7.8": "Windshear escape maneuver",
  "7.9": "Ground proximity warning system (EGPWS/TAWS) response",
  "7.10": "Rejected landing"
};

const sectionTitles = {
  "1": "SECTION 1 – Flight Preparation",
  "2": "SECTION 2 – Take-off",
  "3": "SECTION 3 – Flight",
  "4": "SECTION 4 – Approach and Landing",
  "5": "SECTION 5 – Post Flight",
  "6": "SECTION 6 – Special Operations",
  "7": "SECTION 7 – Emergency Procedures"
};

const taskSchedule = {
  training: {
    1: ["1.1", "1.2", "1.3", "2.1", "2.2", "3.1", "4.1", "5.1"],
    2: ["1.1", "1.3", "1.4", "1.5", "2.3", "2.4", "3.2", "3.3", "4.2", "5.2", "6.1"],
    3: ["1.1", "1.2", "1.3", "1.4", "1.6", "2.5", "2.6", "3.4", "3.5", "3.6", "4.3", "4.4", "6.2", "7.1", "7.2"]
  },
  checking: {
    1: ["1.0", "1.1", "1.2", "1.3", "2.1", "3.1", "4.1", "5.1"],
    2: ["1.1", "1.2", "1.3", "1.4", "2.2", "3.2", "4.2", "5.2"],
    3: ["1.1", "1.3", "1.5", "1.6", "2.3", "3.3", "4.3", "6.2", "7.3"],
    4: ["1.1", "1.4", "1.5", "2.4", "3.4", "4.4", "6.3", "7.4"],
    5: ["1.1", "1.3", "1.6", "2.5", "3.5", "4.5", "6.5", "7.5", "7.6"],
    6: ["1.0", "1.2", "1.6", "2.6", "3.6", "4.6", "6.6", "7.7", "7.8", "7.9", "7.10"]
  }
};

export { allTasks, sectionTitles, taskSchedule };
