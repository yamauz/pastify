const path = require("path");
const fs = require("fs");
const low = require("lowdb");
const _ = require("lodash");
const shortid = require("shortid");
const FileSync = require("lowdb/adapters/FileSync");
const Clip = require("./Clip");
const arraySort = require("array-sort");
const colors = require("colors");
colors.setTheme({
  silly: "rainbow",
  input: "grey",
  verbose: "cyan",
  prompt: "grey",
  info: "green",
  data: "grey",
  help: "cyan",
  warn: "yellow",
  debug: "blue",
  error: "red"
});

module.exports = class DataStore {
  constructor(settings) {
    this.settings = settings;
    this.resourcePath = this._getResoucePath();
    this.storeName = "CLIPS";
    this.store = `${this.resourcePath}//${this.storeName}`;
    this.storeCategory = {
      CLIPS: []
    };
    this.adapter = new FileSync(this.store);
    this.DB = low(this.adapter);
    this.DB.defaults(this.storeCategory).write();

    this._initialize();
  }

  createByUser(props, { win }) {
    const { textValue } = props;
    const settings = this.settings;
    const clip = new Clip("TEXT", new Map([["TEXT", textValue]]), settings);
    this.DB.get(this.storeName)
      .push(clip)
      .write();
    const args = { clip: [clip], mode: "MANUAL" };
    win.sendToRenderer("useIpc", "COPY", args);
  }
  createBySearchInputValue(props, { win }) {
    const { textValue } = props;
    const settings = this.settings;
    const clip = new Clip("TEXT", new Map([["TEXT", textValue]]), settings);
    this.DB.get(this.storeName)
      .push(clip)
      .write();
    const args = { clip: [clip], mode: "AUTO" };
    win.sendToRenderer("useIpc", "COPY", args);
    return clip;
  }
  createByCopy(copiedData, win) {
    const { format, extracts } = copiedData;
    const settings = this.settings;
    const clip = new Clip(format, extracts, settings);
    this.DB.get(this.storeName)
      .push(clip)
      .write();
    const args = { clip: [clip], mode: "AUTO" };
    win.sendToRenderer("useIpc", "COPY", args);
  }
  createByImport(importJSON, win) {
    const importFileRenamed = importJSON.map(clip => {
      const newId = `@${shortid.generate()}`;
      if (clip.mainFormat === "IMAGE" || clip.mainFormat === "SHEET") {
        const distDir = process.env.PORTABLE_EXECUTABLE_DIR || ".";
        const from = `${path.resolve(
          distDir,
          "resource",
          "temp",
          "import",
          "images"
        )}\\${clip.id}`;
        const to = `${path.resolve(
          distDir,
          "resource",
          "temp",
          "images"
        )}\\${newId}`;
        fs.renameSync(from, to);
        clip.textData = newId;
      }
      clip.id = newId;
      clip.date = new Date().getTime();
      this.DB.get(this.storeName)
        .push(clip)
        .write();
      return clip;
    });
    const args = { clip: importFileRenamed };
    win.sendToRenderer("useIpc", "IMPORT", args);
  }

  readAll() {
    const data = this.DB.get(this.storeName).value();
    return data;
  }
  readAllIds() {
    const data = this.DB.get(this.storeName)
      .map("id")
      .value();
    return data;
  }
  readNotTrashed() {
    const data = this.DB.get(this.storeName)
      .filter(clip => !clip.isTrashed)
      .value();
    return data;
  }
  readHasHotKey(args) {
    if (args === undefined) return [];

    const { condSelect } = args;
    const _condSelect = new Map(condSelect);
    let data = this.DB.get(this.storeName);
    switch (_condSelect.get("LABEL")) {
      case "HOTKEY":
        data = data.filter(clip => clip.key !== "");
        break;
      case "LANGUAGE":
        // data = data.filter(clip => clip.lang !== "");
        data = data.filter(clip => clip.lang.length !== 0);
        break;
      case "HASHTAG":
        data = data.filter(clip => clip.tag.length !== 0);
        break;
      default:
        break;
    }
    switch (_condSelect.get("STATUS")) {
      case "FAVED":
        data = data.filter(clip => clip.isFaved && !clip.isTrashed);
        break;
      case "TRASHED":
        data = data.filter(clip => clip.isTrashed);
        break;
      default:
        data = data.filter(clip => !clip.isTrashed);
        break;
    }
    switch (_condSelect.get("DATATYPE")) {
      case "TEXT":
        data = data.filter(clip => clip.mainFormat === "TEXT");
        break;
      case "IMAGE":
        data = data.filter(clip => clip.mainFormat === "IMAGE");
        break;
      case "FILE":
        data = data.filter(clip => clip.mainFormat === "FILE");
        break;
      case "SHEET":
        data = data.filter(clip => clip.mainFormat === "SHEET");
        break;
      default:
        break;
    }
    return data.value();
  }

  readClipsById(idsTimeLine) {
    const clips = this.DB.get(this.storeName).filter(clip =>
      idsTimeLine.includes(clip.id)
    );
    return clips.value();
  }

  getIdsByFilter(args, { settings }) {
    const {
      sortBy,
      orderBy,
      keywords,
      dataType,
      status,
      hotKey,
      hashTag,
      language,
      id
    } = settings.createFilterParam();

    const filteredClips = this.DB.get(this.storeName)
      // filter by keywords
      .filter(item => {
        return keywords.every(keyword => {
          if (keyword[0] === "-") {
            return !item.textData
              .toLowerCase()
              .includes(keyword.slice(1).toLowerCase());
          } else {
            return item.textData.toLowerCase().includes(keyword.toLowerCase());
          }
        });
      })
      // filter by id
      .filter(item =>
        id[0] === "__DEFAULT__" ? item : id.some(i => item.id.includes(i))
      )
      // filter by data type
      .filter(item => {
        return dataType.some(type => {
          return item.mainFormat === type;
        });
      })
      // filter by status
      .filter(item => {
        return status.every(st => {
          if (st.hasOwnProperty("isFaved")) {
            return (
              item.isFaved === st.isFaved && item.isTrashed === st.isTrashed
            );
          } else {
            return item.isTrashed === st.isTrashed;
          }
        });
      })
      // filter by hot key
      .filter(item => {
        if (hotKey[0] === "__DEFAULT__") {
          return item;
        } else if (hotKey[0] === "__SET__") {
          return item.key !== "";
        } else if (hotKey[0] === "__UNSET__") {
          return item.key === "";
        } else {
          return hotKey.some(hk => {
            return item.key === hk;
          });
        }
      })
      // filter by hash tag
      .filter(item => {
        if (hashTag[0] === "__DEFAULT__") {
          return item;
        } else if (hashTag[0] === "__SET__") {
          return item.tag.length !== 0;
        } else if (hashTag[0] === "__UNSET__") {
          return item.tag.length === 0;
        } else {
          return item.tag.some(tag => hashTag.includes(tag.value));
        }
      })
      // filter by language
      .filter(item => {
        if (language[0] === "__DEFAULT__") {
          return item;
        } else if (language[0] === "__SET__") {
          // return item.lang !== "";
          return item.lang.length !== 0;
        } else if (language[0] === "__UNSET__") {
          // return item.lang === "";
          return item.lang.length === 0;
        } else {
          // return language.some(ln => {
          //   return item.lang === ln;
          // });
          return item.lang.some(lang => language.includes(lang.value));
        }
      })
      // sort
      // .orderBy(sortBy, orderBy)
      // .map("id")
      .value();
    const sortedClips = this._sortClips(filteredClips, sortBy, orderBy);
    const sortedIds = sortedClips.map(clip => clip.id);
    return sortedIds;
  }

  _sortClips(filteredClips, sortBy, orderBy) {
    const sortFuncs = sortBy.map((sBy, i) =>
      orderBy[i] === "asc"
        ? (a, b) => {
            // const _a = Array.isArray(a[sBy])
            //   ? a[sBy].toString().trim()
            //   : a[sBy].trim();
            // const _b = Array.isArray(b[sBy])
            //   ? b[sBy].toString().trim()
            //   : b[sBy].trim();
            const _a = a[sBy].toString().trim();
            const _b = b[sBy].toString().trim();
            return _a.localeCompare(_b);
          }
        : (a, b) => {
            // const _a = Array.isArray(a[sBy])
            //   ? a[sBy].toString().trim()
            //   : a[sBy].trim();
            // const _b = Array.isArray(b[sBy])
            //   ? b[sBy].toString().trim()
            //   : b[sBy].trim();
            const _a = a[sBy].toString().trim();
            const _b = b[sBy].toString().trim();
            return _b.localeCompare(_a);
          }
    );

    return arraySort(filteredClips, ...sortFuncs);
  }

  update(props) {
    const { id, value } = props;

    this.DB.get(this.storeName)
      .find({ id })
      .assign(value)
      .write();

    return null;
  }
  updateAll(props) {
    const { ids, value } = props;
    ids.forEach(id => {
      if (value.hasOwnProperty("isTrashed")) {
        if (value.isTrashed) {
          const isTrashedMaster = this.DB.get(this.storeName)
            .find({ id })
            .value().isTrashed;
          if (isTrashedMaster) {
            this.DB.get(this.storeName)
              .remove({ id })
              .write();
            return;
          }
        }
      }
      this.DB.get(this.storeName)
        .find({ id })
        .assign(value)
        .write();
    });
    return null;
  }

  delete(props) {
    const { id } = props;

    this.DB.get(this.storeName)
      .remove({ id })
      .write();

    return null;
  }

  getHashTagOptions() {
    const tags = this.DB.get(this.storeName)
      .map("tag")
      .value();
    const tagsFlat = tags.flatMap(v => v);
    const tagsOptions = _.uniq(tagsFlat.filter(tag => tag !== ""));
    return tagsOptions;
  }
  getKeyOptions() {
    const keys = this.DB.get(this.storeName)
      .map("key")
      .value();
    const keysFlat = keys.flatMap(v => v);
    const keysUniq = _.uniq(keysFlat.filter(key => key !== ""));
    const keysOptions = keysUniq.map(key => {
      return {
        label: key,
        value: key
      };
    });
    return keysOptions;
  }

  getClipById(id) {
    return this.DB.get(this.storeName)
      .find({ id })
      .value();
  }

  _getResoucePath() {
    const distDir = process.env.PORTABLE_EXECUTABLE_DIR || ".";
    const resourcePath = path.resolve(distDir, "resource");
    return resourcePath;
  }

  _computeDiff(from, diffType) {
    const to = new Date().getTime();
    const diff = to - from;
    let devide;
    switch (diffType) {
      case "DAY":
        devide = 1000 * 60 * 60 * 24;
        break;
      case "HOUR":
        devide = 1000 * 60 * 60;
        break;
      case "MINUTE":
        devide = 1000 * 60;
        break;
      case "SECOND":
        devide = 1000;
        break;
    }
    return Math.floor(diff / devide);
  }

  _initialize() {
    const { maxDayTrash, maxDayDelete } = this.settings.readPreferences();
    let trashCount = 0;
    let deleteCount = 0;

    // Trash item by limit day
    this.DB.get(this.storeName)
      .each(item => {
        const timeDiff = this._computeDiff(item.date, "DAY");
        if (maxDayTrash !== "" && !item.isFaved && timeDiff >= maxDayTrash) {
          trashCount++;
          return (item.isTrashed = true);
        } else {
          return;
        }
      })
      .write();
    if (trashCount !== 0) {
      console.log(
        colors.info(
          `${trashCount} clips was trashed by exceeding ${maxDayTrash} days`
        )
      );
    }

    // Delete item by limit day
    this.DB.get(this.storeName)
      .remove(item => {
        const timeDiff = this._computeDiff(item.date, "DAY");
        if (maxDayDelete !== "" && timeDiff >= maxDayDelete) {
          deleteCount++;
          return true;
        }
      })
      .write();
    if (deleteCount !== 0) {
      console.log(
        colors.info(
          `${deleteCount} clips was deleted by exceeding ${maxDayDelete} days`
        )
      );
    }
  }
};
