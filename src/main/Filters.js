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
      FILTERS: []
    };
    this.adapter = new FileSync(this.store);
    this.DB = low(this.adapter);
    this.DB.defaults(this.storeCategory).write();
  }

  create(props, { settings }) {
    const { filterName, filterShortcutKeyOpt } = props;
    const id = shortid.generate();
    const currentFilterOpt = settings.readFilter();
    const saveData = {
      id,
      filterName,
      filterShortcutKeyOpt,
      ...currentFilterOpt
    };
    this.DB.get(this.storeName)
      .push(saveData)
      .write();

    return id;
  }

  readAll() {
    const data = this.DB.get(this.storeName).value();
    return data;
  }

  update(props, { settings }) {
    const { filterName, filterShortcutKeyOpt } = props;
    const currentFilterOpt = settings.readFilter();
    this.DB.get(this.storeName)
      .find({ filterName })
      .assign({ ...currentFilterOpt, filterShortcutKeyOpt })
      .write();
    const id = this.DB.get(this.storeName)
      .find({ filterName })
      .value().id;

    return id;
  }

  delete(props) {
    const { id } = props;

    this.DB.get(this.storeName)
      .remove({ id })
      .write();
    return null;
  }

  _createResoucePath() {
    const distDir = process.env.PORTABLE_EXECUTABLE_DIR || ".";
    const resourcePath = path.resolve(distDir, "resource");
    return resourcePath;
  }
};
