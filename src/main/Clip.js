const fs = require("fs");
const path = require("path");
const CF = require("./CF");
const shortid = require("shortid");
const mapToObject = require("../util/mapToObject");
const { DEFAULT_ITEM_HEIGHT } = require("../common/settings");

module.exports = class Clip {
  constructor(mainFormat, extractDataList) {
    this.id = `@${shortid.generate()}`;
    this.date = new Date().getTime();
    this.mainFormat = mainFormat;
    this.lang = "";
    this.tag = [];
    this.key = "";
    this.isFaved = false;
    this.isTrashed = false;
    this.itemHeight = DEFAULT_ITEM_HEIGHT;
    this.itemTagHeight = 0;
    this.extractDataList = extractDataList;

    const clip = this._createClip();
    return clip;
  }

  _createClip() {
    if (!this.extractDataList.has("TEXT")) this._addText();
    if (this.extractDataList.has("IMAGE")) {
      this._getItemHeight();
      this._saveImageAsFile();
    }

    const textData = this.extractDataList.get("TEXT");
    this.extractDataList.delete("TEXT");
    const contents = mapToObject(this.extractDataList);

    const pastifyData = {
      id: this.id,
      date: this.date,
      mainFormat: this.mainFormat,
      lang: this.lang,
      tag: this.tag,
      key: this.key,
      itemHeight: this.itemHeight,
      itemTagHeight: this.itemTagHeight,
      isFaved: this.isFaved,
      isTrashed: this.isTrashed,
      textData,
      contents
    };

    return pastifyData;
  }

  _addText() {
    const key = "TEXT";
    const extractData = this.extractDataList.get(this.mainFormat);
    const value = CF.get(this.mainFormat).addText(extractData, this.id);
    this.extractDataList.set(key, value);
  }

  _getItemHeight() {
    const { height } = this.extractDataList.get("IMAGE").getSize();
    const imageHeight =
      height <= DEFAULT_ITEM_HEIGHT ? height : DEFAULT_ITEM_HEIGHT;
    this.itemHeight = imageHeight + DEFAULT_ITEM_HEIGHT;
  }

  _saveImageAsFile() {
    const imageBuf = this.extractDataList.get("IMAGE").toPNG();
    const distDir = process.env.PORTABLE_EXECUTABLE_DIR || ".";
    fs.writeFileSync(
      `${path.resolve(distDir, "resource", "temp", "images")}\\${this.id}`,
      imageBuf
    );
    this.extractDataList.delete("IMAGE");
  }
};
