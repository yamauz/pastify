const path = require("path");
const fs = require("fs");
const low = require("lowdb");
const _ = require("lodash");
const FileSync = require("lowdb/adapters/FileSync");
const Clip = require("./Clip");

const TRASH_LIMIT_DAY = 24;
const DELETE_LIMIT_DAY = 24;

module.exports = class DataStore {
  constructor() {
    this.resourcePath = this._createResoucePath();
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
    const clip = new Clip("TEXT", new Map([["TEXT", ""]]));
    this.DB.get(this.storeName)
      .push(clip)
      .write();
    win.sendToRenderer("ON_COPY", [clip], "MANUAL");
  }
  createByCopy(copiedData, win) {
    const { format, extracts } = copiedData;
    const clip = new Clip(format, extracts);
    this.DB.get(this.storeName)
      .push(clip)
      .write();
    win.sendToRenderer("ON_COPY", [clip], "AUTO");
  }

  readAll() {
    const data = this.DB.get(this.storeName).value();
    return data;
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

    return (
      this.DB.get(this.storeName)
        // filter by keywords
        .filter(item => {
          return keywords.every(keyword => {
            if (keyword[0] === "-") {
              return !item.textData
                .toLowerCase()
                .includes(keyword.slice(1).toLowerCase());
            } else {
              return item.textData
                .toLowerCase()
                .includes(keyword.toLowerCase());
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
            return item.lang !== "";
          } else if (language[0] === "__UNSET__") {
            return item.lang === "";
          } else {
            return language.some(ln => {
              return item.lang === ln;
            });
          }
        })
        // sort
        .orderBy(sortBy, orderBy)
        .map("id")
        .value()
    );
  }

  update(props) {
    const { id, value } = props;

    if (value.hasOwnProperty("isTrashed")) {
      // const { isTrashed } = value;
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

  getTextById(id) {
    return this.DB.get(this.storeName)
      .find({ id })
      .value().textData;
  }

  _createResoucePath() {
    const distDir = process.env.PORTABLE_EXECUTABLE_DIR || ".";
    const resourcePath = path.resolve(distDir, "resource");
    const tempPath = path.resolve(resourcePath, "temp");
    if (!fs.existsSync(resourcePath)) {
      fs.mkdirSync(resourcePath);
      fs.mkdirSync(tempPath);
    }
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
    // Trash item by limit day
    this.DB.get(this.storeName)
      .each(item => {
        const timeDiff = this._computeDiff(item.date, "HOUR");
        if (!item.isFaved && timeDiff > TRASH_LIMIT_DAY) {
          return (item.isTrashed = true);
        } else {
          return;
        }
      })
      .write();

    // Delete item by limit day
    this.DB.get(this.storeName)
      .remove(item => {
        const timeDiff = this._computeDiff(item.date, "HOUR");
        return item.isTrashed && timeDiff > DELETE_LIMIT_DAY;
      })
      .write();
  }
};
