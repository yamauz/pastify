const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const shortid = require("shortid");

module.exports = class Filters {
  constructor() {
    this.resourcePath = this._createResoucePath();
    this.storeName = "FILTERS";
    this.store = `${this.resourcePath}//${this.storeName}`;
    this.storeCategory = {
      // FILTERS: {
      //   filterName: "",
      //   filterShortcutKeyOpt: null,
      //   sortOpt: [],
      //   dataTypeFilterOpt: [],
      //   keywordFilterOpt: [],
      //   idFilterOpt: [],
      //   statusFilterOpt: [],
      //   hotKeyFilterOpt: [],
      //   hashTagFilterOpt: [],
      //   languageFilterOpt: []
      // }
      FILTERS: []
    };
    this.adapter = new FileSync(this.store);
    this.DB = low(this.adapter);
    this.DB.defaults(this.storeCategory).write();

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

  initialLoad() {
    const data = this.DB.get(this.storeName).value();
    return data;
  }

  getWinSettings() {
    return this.DB.get("WIN").value();
  }

  // Options for select-box---------------------------------------------
  getFilterSortOptions() {
    return this.DB.get(this.storeName).value();
  }

  saveFilterSettings(filterName, filterShortcutKeyOpt) {
    const id = shortid.generate();
    const {
      sortOpt,
      dataTypeFilterOpt,
      keywordFilterOpt,
      idFilterOpt,
      statusFilterOpt,
      hotKeyFilterOpt,
      hashTagFilterOpt,
      languageFilterOpt
    } = this.DB.get("CURRENT").value();
    const saveData = {
      id,
      filterName,
      filterShortcutKeyOpt,
      sortOpt,
      dataTypeFilterOpt,
      keywordFilterOpt,
      idFilterOpt,
      statusFilterOpt,
      hotKeyFilterOpt,
      hashTagFilterOpt,
      languageFilterOpt
    };

    this.DB.get(this.storeName)
      .push(saveData)
      .write();

    return id;
  }

  updateFilter() {
    console.log("test");
  }

  // Settings for filtering data ----------------------------------------
  getSortSettings() {
    const { sortOpt } = this.DB.get(this.storeName).value();
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

  getFilterSettings() {
    const {
      keywordFilterOpt,
      idFilterOpt,
      dataTypeFilterOpt,
      statusFilterOpt,
      hotKeyFilterOpt,
      hashTagFilterOpt,
      languageFilterOpt
    } = this.DB.get(this.storeName).value();

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

  setSortOptions(sortOpt) {
    this.DB.get(this.storeName)
      .assign({ sortOpt })
      .write();
  }
  setFilterOptions(filterOpt) {
    this.DB.get(this.storeName)
      .assign({ ...filterOpt })
      .write();
  }
  setWinSettings(settings) {
    this.DB.get("WIN")
      .assign({ ...settings })
      .write();
  }

  _createResoucePath() {
    const distDir = process.env.PORTABLE_EXECUTABLE_DIR || ".";
    const resourcePath = path.resolve(distDir, "resource");
    return resourcePath;
  }
};
