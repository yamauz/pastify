import { OrderedMap, Set, Record, List } from "immutable";
import ItemValue from "./ItemValue";
import FilterValue from "./FilterValue";
import sortOptions from "../../common/sortOptions";
import _ from "lodash";

const { ipcRenderer } = window.require("electron");

const StateRecord = Record({
  alwaysOnTop: false,
  winFocus: true,
  winMaximize: false,
  isCompact: false,
  isFold: true,
  // detailType: "DEFAULT",
  detailType: "filter-sort-settings",
  moment: new Date().getTime(),
  addMode: "",
  itemsTimeLine: OrderedMap(),
  filtersList: OrderedMap(),
  itemStore: null,
  itemDisplayRange: { start: 0, stop: 20 },
  itemListToolTipVisibility: false,
  itemListRef: null,
  scrollToRow: -1,
  itemIdAddedManually: "_UNSET_",
  focusItemList: false,
  idsTimeLine: List(),
  idsFav: List(),
  itemsFav: OrderedMap(),
  idSelected: "",
  prevTab: "",
  nextTab: "",
  itemClipboard: { text: "empty", format: "" }, // display on footer
  menuTabSelected: "TimeLine",
  keyboardHandler: "",
  modalVisibility: false,
  filterSaveModalVisibility: false,
  prevFocusedElm: null,
  actionSelected: "",
  sortOpt: null,
  // Filter Name -------------------------------------------------
  filterName: "",
  // Filter by id ------------------------------------------------
  idFilterOpt: [],
  idFilterInputValue: "",
  // Filter by keyword -------------------------------------------
  keywordFilterOpt: [],
  keywordFilterInputValue: "",
  // Filter by data type -----------------------------------------
  dataTypeFilterOpt: [],
  // Filter by status --------------------------------------------
  statusFilterOpt: [],
  // Filter by language ------------------------------------------
  languageFilterOpt: [],
  // Filter by hot key -------------------------------------------
  hotKeyFilterOpt: [],
  hotKeyFilterInputValue: "",
  // Filter by hash tag ------------------------------------------
  hashTagFilterOpt: [],
  hashTagFilterInputValue: "",
  // hashtag input
  hashTagOptions: [],
  hashTagInputValue: "",
  // hot key
  keyOptions: [],
  keyInputValue: ""
});

class State extends StateRecord {
  constructor() {
    // initial load of items
    const items = ipcRenderer.sendSync("ON_LOAD_ITEM_FIRST");
    const mapVal = items.map(item => [item.id, new ItemValue(item)]);
    const itemsTimeLine = OrderedMap(mapVal);

    // initial load of filter
    const filters = ipcRenderer.sendSync("ON_LOAD_FILTER_FIRST");
    const mapFilter = filters.map(item => [item.id, new FilterValue(item)]);
    const filtersList = OrderedMap(mapFilter);

    const hashTagOptions = ipcRenderer.sendSync("GET_HASH_TAG_OPTIONS");
    const keyOptions = ipcRenderer.sendSync("GET_KEY_OPTIONS");
    const idsTimeLine = List(ipcRenderer.sendSync("GET_IDS"));
    const {
      sortOpt,
      dataTypeFilterOpt,
      keywordFilterOpt,
      idFilterOpt,
      statusFilterOpt,
      languageFilterOpt,
      hotKeyFilterOpt,
      hashTagFilterOpt
    } = ipcRenderer.sendSync("GET_FILTER_SORT_OPTIONS_SELECTED");
    const { alwaysOnTop } = ipcRenderer.sendSync("GET_WIN_SETTINGS");
    super({
      // windows settings
      alwaysOnTop,
      // timeline
      itemsTimeLine,
      idsTimeLine,
      // Saved filter settings
      filtersList,
      // sort filter options
      sortOpt,
      dataTypeFilterOpt,
      keywordFilterOpt,
      idFilterOpt,
      statusFilterOpt,
      languageFilterOpt,
      hotKeyFilterOpt,
      hashTagFilterOpt,
      // item tag options
      hashTagOptions,
      keyOptions
    });
  }

  setScrollToRow(scrollToRow, itemIdAddedManually) {
    return this.withMutations(state => {
      state
        .set("scrollToRow", scrollToRow)
        .set("itemIdAddedManually", itemIdAddedManually);
    });
  }

  pasteItem(id, mode) {
    ipcRenderer.sendSync("PASTE_ITEM", { id, mode });
    return this;
  }

  addItemClipboard(itemsCopied, dist, addMode) {
    const itemName = `items${dist}`;
    const idName = `ids${dist}`;
    const item = itemsCopied[0];
    const itemValue = new ItemValue(item);
    return this.addItem(itemValue, itemName, idName, addMode);
  }
  addItem(item, itemName, idName, addMode) {
    return this.withMutations(itemDist => {
      itemDist
        .set(itemName, this[itemName].set(item.id, item))
        .set(idName, this[idName].unshift(item.id))
        .set("itemClipboard", {
          text: item.textData,
          format: item.mainFormat
        })
        .set("addMode", addMode);
    });
  }
  deleteIds(id) {
    this._updateItems(id, { isTrashed: true });

    return this.withMutations(state => {
      state.setIn(["itemsTimeLine", id, "isTrashed"], true).set(
        "idsTimeLine",
        this.idsTimeLine.filterNot(_id => _id === id)
      );
    });
  }
  trashItem(id) {
    this._updateItems(id, { isTrashed: true });
    return this.setIn(["itemsTimeLine", id, "isTrashed"], true);
  }
  setAlwaysOnTop(alwaysOnTop) {
    this._updateWinSettings({ alwaysOnTop: !alwaysOnTop });
    return this.set("alwaysOnTop", !alwaysOnTop);
  }
  setIdSelected(id) {
    return this.set("idSelected", id);
  }
  deleteItem(ids) {
    this._deleteItemDataStore(ids);
    // const items = `ids${this.get("menuTabSelected")}`;
    const items = "itemsTimeLine";
    // const items = `items${this.get("menuTabSelected")}`;
    // return this.set(items, this[items].deleteAll(ids));
    return this.set(items, this[items].subtract(ids));
    // return this.set(
    //   items,
    //   this[items].filterNot(v => {
    //     return v === ids[0];
    //   })
    // );
  }
  favItem(id) {
    const keyPath = ["itemsTimeLine", id, "isFaved"];
    const isFaved = !this.getIn(keyPath);
    this._updateItems(id, { isFaved });
    return this.setIn(keyPath, isFaved);
  }
  saveTag() {
    const id = this.get("idSelected");
    const keyPath = ["key", "lang", "tag", "itemTagHeight"].map(prop => [
      "itemsTimeLine",
      id,
      prop
    ]);

    const keyValue = keyPath.reduce((acc, path) => {
      const prop = path[2];
      acc[prop] = this.getIn(path);
      return acc;
    }, {});
    this._updateItems(id, keyValue);
    const keyOptions = ipcRenderer.sendSync("GET_KEY_OPTIONS");
    const hashTagOptions = ipcRenderer.sendSync("GET_HASH_TAG_OPTIONS");
    return this.withMutations(state => {
      state.set("keyOptions", keyOptions).set("hashTagOptions", hashTagOptions);
    });
  }
  setItemTagHeight(itemTagHeight) {
    const idSelected = this.get("idSelected");
    const keyPath = ["itemsTimeLine", idSelected, "itemTagHeight"];
    return this.setIn(keyPath, itemTagHeight);
  }
  setKeyboardHandler() {
    const modeCurrent = this.get("keyboardHandler");
    let modeNext;
    if (modeCurrent === "") {
      modeNext = "vim";
    } else if (modeCurrent === "vim") {
      modeNext = "emacs";
    } else {
      modeNext = "";
    }

    return this.set("keyboardHandler", modeNext);
  }
  setItemTag(tag) {
    // const items = `items${this.get("menuTabSelected")}`;
    const items = "itemsTimeLine";
    const itemKey = this.get("idSelected");
    const { type, value } = tag;
    const keyPath = [items, itemKey, type];
    return this.setIn(keyPath, value);
  }
  setItemText(item) {
    const { id, textData } = item;
    const keyPath = ["itemsTimeLine", id, "textData"];
    this._updateItems(id, { textData });
    return this.setIn(keyPath, textData);
  }
  setItemRemoved(id) {
    // const items = `items${this.get("menuTabSelected")}`;
    const items = "itemsTimeLine";
    const setIn = [items, id, "removeFlg"];
    return this.setIn(setIn, true);
  }
  // Action On Item List --------------------------------------------------
  callActionOnItemList(command) {
    return this[command]();
  }
  addNewItem() {
    // this.get("itemListRef").scrollToRow(0);
    const addMode = "MANUAL";
    ipcRenderer.sendSync("ADD_NEW_ITEM", addMode);
    // setTimeout(() => {
    //   const targetId = document.getElementById("item-list").firstElementChild
    //     .firstElementChild.firstElementChild.id;
    //   document.getElementById(`${targetId}`).focus();
    //   setTimeout(() => {
    //     document.getElementsByClassName("ace_text-input")[0].focus();
    //   }, 500);
    // }, 100);
    return this;
  }
  trashAllItems() {
    console.log("trash all items");
    const idsTimeLine = this.get("idsTimeLine");
    this._updateItems(idsTimeLine.toArray(), { isTrashed: true });
    return this.withMutations(state => {
      idsTimeLine.forEach(id => {
        state.setIn(["itemsTimeLine", id, "isTrashed"], true);
      });
    });
  }
  trashAllItemsWithoutFaved() {
    console.log("trash all items without faved");
    const idsTimeLineNotFaved = this.get("idsTimeLine").filter(id => {
      return !this.getIn(["itemsTimeLine", id, "isFaved"]);
    });
    console.log(idsTimeLineNotFaved);

    this._updateItems(idsTimeLineNotFaved.toArray(), { isTrashed: true });
    return this.withMutations(state => {
      idsTimeLineNotFaved.forEach(id => {
        state.setIn(["itemsTimeLine", id, "isTrashed"], true);
      });
    });
  }
  showFilterSortSettings() {
    // setTimeout(() => {
    //   document.getElementById("filter-sort-settings-tab").focus();
    // }, 100);
    // return this.set("detailType", "filter-sort-settings");
    return this.withMutations(state => {
      state
        .set("detailType", "filter-sort-settings")
        .set("itemIdAddedManually", "_UNSET_");
    });
  }
  saveFilterSortSettings() {
    console.log("save filter sort settings");
    return this.set(
      "filterSaveModalVisibility",
      !this.get("filterSaveModalVisibility")
    );
  }
  clearFilterSortSettings() {
    console.log("clear filter sort settings");
    return this.withMutations(state => {
      state
        .set("sortOpt", [])
        .set("keywordFilterOpt", [])
        .set("idFilterOpt", [])
        .set("dataTypeFilterOpt", [])
        .set("statusFilterOpt", [])
        .set("hotKeyFilterOpt", [])
        .set("hashTagFilterOpt", [])
        .set("languageFilterOpt", []);
    });
  }
  reloadFilterSortSettings() {
    console.log("reload filter sort settings");
    return this;
  }
  storeItemOnModalOpen() {
    const listName = "itemsTimeLine";
    const id = this.get("idSelected");
    const targetItem = this.getIn([listName, id]);
    return this.set("itemStore", targetItem);
  }
  restoreItemOnCancel() {
    const listName = "itemsTimeLine";
    const id = this.get("idSelected");
    const keyPath = [listName, id];
    console.log(keyPath);
    return this.setIn(keyPath, this.get("itemStore"));
  }
  setLangOptionsSelected(langOpt) {
    const id = this.get("idSelected");
    const keyPath = ["itemsTimeLine", id, "lang"];
    return this.setIn(keyPath, langOpt);
  }
  setIdsFromDatastore() {
    const sortOpt = this.get("sortOpt");
    const filterOpt = {
      keywordFilterOpt: this.get("keywordFilterOpt"),
      idFilterOpt: this.get("idFilterOpt"),
      dataTypeFilterOpt: this.get("dataTypeFilterOpt"),
      statusFilterOpt: this.get("statusFilterOpt"),
      hotKeyFilterOpt: this.get("hotKeyFilterOpt"),
      hashTagFilterOpt: this.get("hashTagFilterOpt"),
      languageFilterOpt: this.get("languageFilterOpt")
    };
    const nextIds = ipcRenderer.sendSync("GET_IDS3", sortOpt, filterOpt);
    return this.set("idsTimeLine", List(nextIds));
  }
  saveFilterSettings() {
    const filterName = this.get("filterName");
    this._saveFilterSettings(filterName);
    return this;
  }

  addKeywordFilterOptions(keywords) {
    const prevKeywords = this.get("keywordFilterOpt");
    const wordList = prevKeywords.map(keyword => keyword.value);
    const nextKeywords = wordList.includes(keywords.value)
      ? prevKeywords
      : [...prevKeywords, keywords];
    return this.withMutations(state => {
      state
        .set("keywordFilterOpt", nextKeywords)
        .set("keywordFilterInputValue", "");
    });
  }
  removeKeywordFilterOptions(keywords) {
    const nextKeywords = keywords === null ? [] : keywords;
    return this.withMutations(state => {
      state
        .set("keywordFilterOpt", nextKeywords)
        .set("keywordFilterInputValue", "");
    });
  }
  addIdFilterOptions(ids) {
    const prevIds = this.get("idFilterOpt");
    const idList = prevIds.map(id => id.value);
    const nextIds = idList.includes(ids.value) ? prevIds : [...prevIds, ids];
    return this.withMutations(state => {
      state.set("idFilterOpt", nextIds).set("idFilterInputValue", "");
    });
  }
  removeIdFilterOptions(ids) {
    const nextIds = ids === null ? [] : ids;
    return this.withMutations(state => {
      state.set("idFilterOpt", nextIds).set("idFilterInputValue", "");
    });
  }
  addHotKeyFilterOptions(option) {
    const prevOptions = this.get("hotKeyFilterOpt");
    const prevOptionsValues = prevOptions.map(opt => opt.value);
    const nextOptions = prevOptionsValues.includes(option.value)
      ? prevOptions
      : [...prevOptions, option];
    return this.withMutations(state => {
      state
        .set("hotKeyFilterOpt", nextOptions)
        .set("hotKeyFilterInputValue", "");
    });
  }
  addHashTagFilterOptions(option) {
    const prevOptions = this.get("hashTagFilterOpt");
    const prevOptionsValues = prevOptions.map(opt => opt.value);
    const nextOptions = prevOptionsValues.includes(option.value)
      ? prevOptions
      : [...prevOptions, option];
    return this.withMutations(state => {
      state
        .set("hashTagFilterOpt", nextOptions)
        .set("hashTagFilterInputValue", "");
    });
  }
  addHashTagValue(keywords) {
    const id = this.get("idSelected");
    const keyPath = ["itemsTimeLine", id, "tag"];

    const prevKeywords = this.getIn(keyPath);
    const wordList = prevKeywords.map(keyword => keyword.value);
    const nextKeywords = wordList.includes(keywords.value)
      ? prevKeywords
      : [...prevKeywords, keywords];
    return this.withMutations(state => {
      state.set("hashTagInputValue", "").setIn(keyPath, nextKeywords);
    });
  }
  changeHashTagValue(keywords) {
    const id = this.get("idSelected");
    const keyPath = ["itemsTimeLine", id, "tag"];
    const nextKeywords = keywords === null ? [] : keywords;
    return this.withMutations(state => {
      state.set("hashTagInputValue", "").setIn(keyPath, nextKeywords);
    });
  }
  addKeyValue(keywords) {
    const id = this.get("idSelected");
    const keyPath = ["itemsTimeLine", id, "key"];

    const prevKeywords = this.getIn(keyPath);
    const nextKeywords = prevKeywords === keywords ? prevKeywords : keywords;
    return this.withMutations(state => {
      state.set("keyInputValue", "").setIn(keyPath, nextKeywords);
    });
  }
  changeKeyValue(keywords) {
    const id = this.get("idSelected");
    const keyPath = ["itemsTimeLine", id, "key"];
    const nextKeywords = keywords === null ? "" : keywords[0].value;
    return this.withMutations(state => {
      state.set("keyInputValue", "").setIn(keyPath, nextKeywords);
    });
  }
  toggleItemListToolTipVisibility(flg = "_UNSET_") {
    const currentVisible = this.get("itemListToolTipVisibility");
    let nextVisible;
    if (flg === "_UNSET_") nextVisible = !currentVisible;
    if (flg === "OFF") {
      nextVisible = false;
      if (currentVisible) {
        setTimeout(() => {
          this.get("prevFocusedElm").focus();
        }, 100);
      }
    }

    if (nextVisible) {
      return this.withMutations(item => {
        item
          .set("prevFocusedElm", document.activeElement)
          .set("itemListToolTipVisibility", nextVisible);
      });
    } else {
      return this.set("itemListToolTipVisibility", nextVisible);
    }
  }

  toggleModalVisibility(id = "__UNSET__") {
    return this.withMutations(item => {
      item
        .set("idSelected", id)
        .set("modalVisibility", !this.get("modalVisibility"));
    });
  }

  _deleteItemDataStore(ids) {
    ipcRenderer.sendSync("ITEM_ID_TO_BE_DELETED", ids);
  }

  _getIds(sortOpt, filterOpt) {
    const ids = ipcRenderer.sendSync("GET_IDS3", sortOpt, filterOpt);
    return ids;
  }
  _updateItems(id, value) {
    ipcRenderer.sendSync("UPDATE_ITEMS", id, value);
  }
  _updateWinSettings(value) {
    ipcRenderer.sendSync("SET_WIN_SETTINGS", value);
  }
  _saveFilterSettings(filterName) {
    ipcRenderer.sendSync("SAVE_FILTER_SETTINGS", filterName);
  }
}

export default State;
