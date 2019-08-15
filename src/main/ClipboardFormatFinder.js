const ffi = require("ffi");
const user32 = new ffi.Library("user32", {
  OpenClipboard: ["int8", ["ulong"]],
  CloseClipboard: ["int8", []],
  EnumClipboardFormats: ["uint", ["uint"]]
});
const CF = require("./CF");

module.exports = class ClipboardFormatFinder {
  getFormat() {
    if (!this._openClipboard()) return console.log("failed to open clipboard");
    const currentCF = this._getCurrentFormat();

    const targetCF = this._getTargetFormat(currentCF);
    this._closeClipboard();
    return targetCF;
  }

  _openClipboard() {
    return user32.OpenClipboard(0);
  }

  _getCurrentFormat() {
    const currentCF = [];
    let EOF,
      format = 0;
    while (!EOF) {
      format = user32.EnumClipboardFormats(format);
      if (!format) EOF = true;
      currentCF.push(format);
    }
    return currentCF;
  }

  _getTargetFormat(currentCF) {
    const targetCF = [];
    for (const [key, value] of CF.entries()) {
      if (currentCF.includes(value.fNum)) {
        targetCF.push(key);
      }
    }
    return targetCF;
  }

  _closeClipboard() {
    return user32.CloseClipboard();
  }
};
