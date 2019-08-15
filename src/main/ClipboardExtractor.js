const ffi = require("ffi");
const ref = require("ref");
const CF = require("./CF");

module.exports = class ClipboardExtractor {
  constructor() {
    this.extractDataList = new Map();
  }
  extract(validFormats) {
    for (const fmt of validFormats) {
      const extractData = CF.get(fmt).extract();
      this.extractDataList.set(fmt, extractData);
    }
  }
};
