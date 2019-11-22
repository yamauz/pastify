const path = require("path");
const fs = require("fs");
const low = require("lowdb");
const _ = require("lodash");
const FileSync = require("lowdb/adapters/FileSync");

module.exports = class DataStore {
  constructor() {
    this.resourcePath = this._createResoucePath();
    this.storeName = "DATASRORE";
    this.store = `${this.resourcePath}//${this.storeName}`;
    this.storeCategory = {
      TIME_LINE: []
    };
    this.adapter = new FileSync(this.store);
    this.DATA_STORE = low(this.adapter);
    this.DATA_STORE.defaults(this.storeCategory).write();

    this.initialize();
  }

  initialize() {
    const computeDiff = (from, diffType) => {
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
    };

    const TRASH_LIMIT_DAY = 24;
    const DELETE_LIMIT_DAY = 5;

    // Trash item by limit day
    this.DATA_STORE.get("TIME_LINE")
      .each(item => {
        const timeDiff = computeDiff(item.date, "HOUR");
        // if (timeDiff > TRASH_LIMIT) {
        if (timeDiff > TRASH_LIMIT_DAY) {
          return (item.isTrashed = true);
        } else {
          return;
        }
      })
      .write();

    // Delete item by limit day
    this.DATA_STORE.get("TIME_LINE")
      .remove(item => {
        const timeDiff = computeDiff(item.date, "MINUTE");
        return item.isTrashed && timeDiff > DELETE_LIMIT_DAY;
      })
      .write();
  }

  initialLoad(type) {
    const data = this.DATA_STORE.get(type).value();
    return data;
  }
  getIds(type, sortOptions) {
    const { sortBy, orderBy } = sortOptions;
    return this.DATA_STORE.get(type)
      .orderBy(sortBy, orderBy)
      .map("id")
      .value();
  }
  // getIds2(type, sortOpt) {
  //   let sortBy, orderBy;
  //   if (sortOpt) {
  //     sortBy = sortOpt.map(option => option.key);
  //     orderBy = sortOpt.map(option => option.order);
  //   } else {
  //     sortBy = "date";
  //     orderBy = "desc";
  //   }
  //   return this.DATA_STORE.get(type)
  //     .orderBy(sortBy, orderBy)
  //     .map("id")
  //     .value();
  // }
  getIds3(type, sortSettings, filterSettings) {
    const { sortBy, orderBy } = sortSettings;
    const {
      keywords,
      dataType,
      status,
      hotKey,
      hashTag,
      language,
      id
    } = filterSettings;

    return (
      this.DATA_STORE.get(type)
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
  // getItem(type, id) {
  //   return this.DATA_STORE.get(type)
  //     .filter(item => item.id === id)
  //     .value();
  // }

  write(type, data) {
    this.DATA_STORE.get(type)
      .push(data)
      .write();
  }

  update(type, id, value) {
    if (value.hasOwnProperty("isTrashed")) {
      const { isTrashed } = value;

      if (isTrashed) {
        const isTrashedMaster = this.DATA_STORE.get(type)
          .find({ id })
          .value().isTrashed;

        if (isTrashedMaster) {
          this.DATA_STORE.get(type)
            .remove({ id })
            .write();
          return;
        }
      }
    }
    this.DATA_STORE.get(type)
      .find({ id: id })
      .assign(value)
      .write();
  }
  delete(type, idList) {
    this.DATA_STORE.get(type)
      .remove(item => {
        return idList.includes(item.id);
      })
      .write();
  }

  getHashTagOptions(type) {
    const tags = this.DATA_STORE.get(type)
      .map("tag")
      .value();
    const tagsFlat = tags.flatMap(v => v);
    const tagsOptions = _.uniq(tagsFlat.filter(tag => tag !== ""));
    // const tagsOptions = tagsUniq.map(tag => {
    //   return {
    //     label: tag,
    //     value: tag
    //   };
    // });
    return tagsOptions;
  }
  getKeyOptions(type) {
    const keys = this.DATA_STORE.get(type)
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
};
