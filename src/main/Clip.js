const fs = require("fs");
const path = require("path");
const CF = require("./CF");
const shortid = require("shortid");
const mapToObject = require("../util/mapToObject");
const { DEFAULT_ITEM_HEIGHT } = require("../common/settings");

module.exports = class Clip {
  constructor(mainFormat, extractDataList, settings) {
    this.settings = settings;
    this.id = `@${shortid.generate()}`;
    this.date = new Date().getTime();
    this.mainFormat = mainFormat;
    this.textData = "";
    this.lang = [];
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

    const textExtract = this.extractDataList.get("TEXT");
    this.textData = textExtract;

    switch (this.mainFormat) {
      case "TEXT":
        this._resizeText();
        break;
      case "FILE":
        this._resizeFile();
        break;

      default:
        break;
    }

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
      textData: this.textData,
      contents
    };

    return pastifyData;
  }

  _resizeFile() {
    const { maxFileLength } = this.settings.readPreferences();
    const files = this.extractDataList.get("FILE");
    if (maxFileLength !== "" && files.length > maxFileLength) {
      console.log("Clip file length is resized.");
      console.log(`${files.length} =>${maxFileLength}`);
      const filesResized = files.slice(0, maxFileLength);
      this.extractDataList.set("FILE", filesResized);
      this.textData = filesResized.join("\n");
    }
  }

  _resizeText() {
    const { maxTextLength } = this.settings.readPreferences();
    if (maxTextLength !== "" && this.textData.length > maxTextLength) {
      console.log("Clip text data is resized.");
      console.log(`${this.textData.length} =>${maxTextLength}`);
      this.textData = this.textData.slice(0, maxTextLength);
    }
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
    const clipImage = this.extractDataList.get("IMAGE");
    const { maxImageSize } = this.settings.readPreferences();

    const { width, height } = clipImage.getSize();
    const compareTarget = width > height ? "width" : "height";
    const compareSize = width > height ? width : height;

    let resize = false;
    if (maxImageSize !== "" && compareSize > maxImageSize) {
      resize = true;
    }

    let imageBuf;
    if (resize) {
      console.log("Clip image size is resized.");
      console.log(`${compareTarget} : ${compareSize} =>${maxImageSize}`);
      imageBuf = clipImage.resize({ [compareTarget]: Number(maxImageSize) });
    } else {
      imageBuf = clipImage;
    }

    const distDir = process.env.PORTABLE_EXECUTABLE_DIR || ".";
    fs.writeFileSync(
      `${path.resolve(distDir, "resource", "temp", "images")}\\${this.id}`,
      imageBuf.toPNG()
    );
    this.extractDataList.delete("IMAGE");
  }
};
