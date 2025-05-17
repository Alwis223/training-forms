const allTasks = {
  "1.0": "Flight preparation (flight data analysis incl. weather information)",
  "1.1": "Performance calculation",
  "1.2": "Airplane external and internal visual inspection",
  "1.3": "Cockpit inspection"
  // ... (tęsk kaip buvo, bet įsitikink, kad tarp eilučių yra KABLELIAI)
};

const sectionTitles = {
  "1": "SECTION 1 – Flight Preparation",
  "2": "SECTION 2 – Take-off",
  "3": "SECTION 3 – Flight"
  // ... ir t.t., su kableliais
};

const taskSchedule = {
  training: {
    1: ["1.0", "1.1"],
    2: ["1.2", "1.3"]
  },
  checking: {
    1: ["1.0"],
    2: ["1.1", "1.3"]
  }
};

export { allTasks, sectionTitles, taskSchedule };
