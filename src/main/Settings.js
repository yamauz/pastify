const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

module.exports = class Settings {
  constructor() {
    this.resourcePath = this._createResoucePath();
    this.storeName = "SETTINGS";
    this.store = `${this.resourcePath}//${this.storeName}`;
    this.storeCategory = {
      WIN: {
        alwaysOnTop: false,
        width: 1200,
        height: 600,
        isMaximized: false
      },
      CURRENT: {
        sortOpt: [],
        dataTypeFilterOpt: [],
        keywordFilterOpt: [],
        idFilterOpt: [],
        statusFilterOpt: [],
        hotKeyFilterOpt: [],
        hashTagFilterOpt: [],
        languageFilterOpt: []
      },
      TIME_LINE: []
    };
    this.adapter = new FileSync(this.store);
    this.SETTINGS = low(this.adapter);
    this.SETTINGS.defaults(this.storeCategory).write();

    this.defaultValue = {
      sort: {
        sortBy: ["date"],
        orderBy: ["desc"]
      },
      filter: {
        dataType: ["TEXT", "IMAGE", "FILE", "SHEET"],
        status: [{ isTrashed: false }],
        hotKey: ["__DEFAULT__"],
        hashTag: ["__DEFAULT__"],
        language: ["__DEFAULT__"],
        id: ["__DEFAULT__"]
      }
    };
  }

  getWinSettings() {
    return this.SETTINGS.get("WIN").value();
  }

  // Options for select-box---------------------------------------------
  getFilterSortOptions(type) {
    return this.SETTINGS.get(type).value();
  }

  // Settings for filtering data ----------------------------------------
  getSortSettings(type) {
    const { sortOpt } = this.SETTINGS.get(type).value();
    const sortBy =
      sortOpt.length === 0
        ? this.defaultValue.sort.sortBy
        : sortOpt.map(option => option.key);
    const orderBy =
      sortOpt.length === 0
        ? this.defaultValue.sort.orderBy
        : sortOpt.map(option => option.order);
    return { sortBy, orderBy };
  }

  getFilterSettings(type) {
    const {
      keywordFilterOpt,
      idFilterOpt,
      dataTypeFilterOpt,
      statusFilterOpt,
      hotKeyFilterOpt,
      hashTagFilterOpt,
      languageFilterOpt
    } = this.SETTINGS.get(type).value();

    const keywords = keywordFilterOpt.map(keyword => keyword.value);
    const dataType =
      dataTypeFilterOpt.length === 0
        ? this.defaultValue.filter.dataType
        : dataTypeFilterOpt.map(dataType => dataType.value);
    const status =
      statusFilterOpt.length === 0
        ? this.defaultValue.filter.status
        : statusFilterOpt.map(status => status.value);
    const hotKey =
      hotKeyFilterOpt.length === 0
        ? this.defaultValue.filter.hotKey
        : hotKeyFilterOpt.map(hotKey => hotKey.value);
    const hashTag =
      hashTagFilterOpt.length === 0
        ? this.defaultValue.filter.hashTag
        : hashTagFilterOpt.map(hashTag => hashTag.value);
    const language =
      languageFilterOpt.length === 0
        ? this.defaultValue.filter.language
        : languageFilterOpt.map(language => language.value);
    const id =
      idFilterOpt.length === 0
        ? this.defaultValue.filter.id
        : idFilterOpt.map(id => id.value);
    return { keywords, dataType, status, hotKey, hashTag, language, id };
  }

  setSortOptions(type, sortOpt) {
    this.SETTINGS.get(type)
      .assign({ sortOpt })
      .write();
  }
  setFilterOptions(type, filterOpt) {
    this.SETTINGS.get(type)
      .assign({ ...filterOpt })
      .write();
  }
  setWinSettings(settings) {
    this.SETTINGS.get("WIN")
      .assign({ ...settings })
      .write();
  }

  _createResoucePath() {
    const distDir = process.env.PORTABLE_EXECUTABLE_DIR || ".";
    const resourcePath = path.resolve(distDir, "resource");
    return resourcePath;
  }
};
