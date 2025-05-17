
const allTasks = {
  "1.0": "Flight preparation (flight data analysis incl. weather information)",
  "1.1": "Performance calculation",
  ...
  "7.10": "Rejected landing"
};

const sectionTitles = {
  "1": "SECTION 1 – Flight Preparation",
  ...
  "7": "SECTION 7 – Emergency Procedures"
};

const taskSchedule = {
  training: {
    1: ["1.1", "1.2", "1.3", "2.1", "2.2", "3.1", "4.1", "5.1"],
    ...
  },
  checking: {
    1: ["1.0", "1.1", "1.2", "1.3", "2.1", "3.1", "4.1", "5.1"],
    ...
  }
};

export { allTasks, sectionTitles, taskSchedule };
