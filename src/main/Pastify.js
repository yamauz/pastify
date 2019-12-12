const CF = require("./CF");
const robot = require("robotjs");

module.exports = class Pastify {
  constructor() {
    this.isCopiedBySelf = false;
  }

  pasteClip(props, { dataStore, settings, win }) {
    const { id, mode } = props;
    this.isCopiedBySelf = true;
    const text = dataStore.getTextById(id);
    CF.get("TEXT").write(text);
    win.showLastActiveWindow(settings);
    robot.keyTap("v", "control");

    if (mode === "RETURN") win.focus();

    return null;
  }
};
