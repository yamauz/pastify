const moment = require("moment");
module.exports = (currentTime, dataTime) => {
  const m1 = moment(currentTime);
  const m2 = moment(dataTime);
  let diff;
  diff = m1.diff(m2, "s");
  if (diff === 0) {
    return "now";
  } else if (diff < 60) {
    return diff + "s";
  } else if (diff < 3600) {
    diff = m1.diff(m2, "m");
    return diff + "m";
  } else if (diff < 86400) {
    diff = m1.diff(m2, "h");
    return diff + "h";
  } else {
    return moment(dataTime).format("MM/DD");
  }
};
