const CF = require("./CF");
const robot = require("robotjs");

module.exports = class Pastify {
  constructor() {
    this.isCopiedBySelf = false;
  }

  // pasteClip(props, { dataStore, settings, win }) {
  //   const { id, mode } = props;
  //   this.isCopiedBySelf = true;
  //   const text = dataStore.getTextById(id);
  //   CF.get("TEXT").write(text);
  //   win.showLastActiveWindow(settings);
  //   robot.keyTap("v", "control");

  //   if (mode === "RETURN") win.focus();

  //   return null;
  // }
  copyClipId(props) {
    const { id } = props;
    this.isCopiedBySelf = true;
    CF.get("TEXT").writeId(id);
    return null;
  }

  copyClip(props, { dataStore, settings, win }) {
    const { id, isReturn, copyOnly, copyAs, surround } = props;
    const clip = dataStore.getClipById(id);
    const _copyAs = copyAs === "_ORIGINAL_" ? clip.mainFormat : copyAs;
    this.isCopiedBySelf = true;

    CF.get(_copyAs).write(clip, surround);
    if (!copyOnly) {
      this._pasteClip(settings, win, isReturn);
    }
    return null;
  }

  _pasteClip(settings, win, isReturn) {
    win.showLastActiveWindow(settings);
    robot.keyTap("v", "control");
    if (isReturn) win.focus();
  }
};
