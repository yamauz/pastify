const path = require("path");
const { nativeImage } = require("electron");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const { APP_DIR, TRAY_ICON_PATH } = require("../common/settings");

module.exports = class Settings {
  constructor() {
    this.resourcePath = this._createResoucePath();
    this.storeName = "SETTINGS";
    this.store = `${this.resourcePath}//${this.storeName}`;
    this.storeCategory = {
      WIN: {
        alwaysOnTop: false,
        width: 1200,
        widthUnfold: 1200,
        height: 600,
        minWidth: 301,
        isMaximized: false,
        isFold: false
      },
      FILTER: {
        filterName: "",
        filterShortcutKeyOpt: [],
        sortOpt: [],
        dataTypeFilterOpt: [],
        keywordFilterOpt: [],
        idFilterOpt: [],
        statusFilterOpt: [],
        hotKeyFilterOpt: [],
        hashTagFilterOpt: [],
        languageFilterOpt: []
      },
      PREFERENCES: {
        blockKeywordsOpt: [],
        blockDatatypeOpt: [],
        blockMinTextLength: 2,
        blockMaxTextLength: 10,
        blockMaxImageSize: 1020,
        blockMaxFileCount: 5,
        blockWordLength: "",
        launchKey: "shift",
        maxTextLength: 5,
        maxImageSize: 640,
        maxFileLength: 5,
        maxDayTrash: 2,
        maxDayDelete: 1,
        disableClipListener: false,
        isCompact: false,
        launchKeyDuration: 200,
        launchKeyOpt: {
          label: "Shift *2",
          value: "shift-double"
        },
        isVim: false
      }
    };
    this.disableClipListener = false;
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
    const data = this.DB.get("FILTER").value();
    return data;
  }

  createIconDataURL() {
    const onIconPath = path.join(APP_DIR, TRAY_ICON_PATH.on);
    const offIconPath = path.join(APP_DIR, TRAY_ICON_PATH.off);
    const onIconDataURL = nativeImage.createFromPath(onIconPath).toDataURL();
    const offIconDataURL = nativeImage.createFromPath(offIconPath).toDataURL();
    return { onIconDataURL, offIconDataURL };
  }

  createFilterParam() {
    const {
      sortOpt,
      keywordFilterOpt,
      idFilterOpt,
      dataTypeFilterOpt,
      statusFilterOpt,
      hotKeyFilterOpt,
      hashTagFilterOpt,
      languageFilterOpt
    } = this.DB.get("FILTER").value();

    const sortBy =
      sortOpt.length === 0
        ? this.defaultValue.sort.sortBy
        : sortOpt.map(option => option.key);
    const orderBy =
      sortOpt.length === 0
        ? this.defaultValue.sort.orderBy
        : sortOpt.map(option => option.order);

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

    const filterParam = {
      sortBy,
      orderBy,
      keywords,
      dataType,
      status,
      hotKey,
      hashTag,
      language,
      id
    };

    return filterParam;
  }

  readFilter() {
    return this.DB.get("FILTER").value();
  }

  readWin() {
    return this.DB.get("WIN").value();
  }
  readPreferences() {
    return this.DB.get("PREFERENCES").value();
  }

  updateFilter(filterOpt) {
    this.DB.get("FILTER")
      .assign({ ...filterOpt })
      .write();
  }

  updateWin(props) {
    this.DB.get("WIN")
      .assign({ ...props })
      .write();
  }
  updatePreferences(props) {
    this.DB.get("PREFERENCES")
      .assign({ ...props })
      .write();
  }

  _createResoucePath() {
    const distDir = process.env.PORTABLE_EXECUTABLE_DIR || ".";
    const resourcePath = path.resolve(distDir, "resource");
    return resourcePath;
  }
};
