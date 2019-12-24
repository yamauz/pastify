import { OrderedMap, Set, Record, List } from "immutable";
import ItemValue from "./ItemValue";
import FilterValue from "./FilterValue";
import Message from "./Message";
import userDialog from "./../../common/dialog";
import _ from "lodash";
const dialog = window.require("electron").remote.dialog;

const StateRecord = Record({
  alwaysOnTop: false,
  winFocus: true,
  winMaximize: false,
  isCompact: false,
  isFold: true,
  detailType: "DEFAULT",
  // detailType: "filter-sort-settings",
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
  prevFocusedElm: document.activeElement,
  actionSelected: "",
  // Filter Shortcut Key -------------------------------------------------
  // CurrentFilter Settings -------------------------------------------------
  filterName: "",
  filterShortcutKeyOpt: [],
  sortOpt: null,
  idFilterOpt: [],
  idFilterInputValue: "",
  keywordFilterOpt: [],
  keywordFilterInputValue: "",
  dataTypeFilterOpt: [],
  statusFilterOpt: [],
  languageFilterOpt: [],
  hotKeyFilterOpt: [],
  hotKeyFilterInputValue: "",
  hashTagFilterOpt: [],
  hashTagFilterInputValue: "",
  hashTagOptions: [],
  hashTagInputValue: "",
  keyOptions: [],
  keyInputValue: "",
  toolTipArrowPos: "down",
  isOpenClipToolTip: false
});

class State extends StateRecord {
  constructor() {
    // initial load of items
    const allClips = new Message("dataStore", "readAll").dispatch();
    const allClipsRec = allClips.map(clip => [clip.id, new ItemValue(clip)]);
    const itemsTimeLine = OrderedMap(allClipsRec);

    // initial load of filter
    const allFilters = new Message("filters", "readAll").dispatch();
    const allFiltersRec = allFilters.map(filter => [
      filter.id,
      new FilterValue(filter)
    ]);
    const filtersList = OrderedMap(allFiltersRec);

    const hashTagOptions = new Message(
      "dataStore",
      "getHashTagOptions"
    ).dispatch();
    const keyOptions = new Message("dataStore", "getKeyOptions").dispatch();

    const clipIdsFiltered = new Message(
      "dataStore",
      "getIdsByFilter"
    ).dispatch();
    const idsTimeLine = List(clipIdsFiltered);
    const filterOptSelected = new Message("settings", "readFilter").dispatch();
    const { alwaysOnTop } = new Message("settings", "readWin").dispatch();
    super({
      // windows settings
      alwaysOnTop,
      itemsTimeLine,
      idsTimeLine,
      filtersList,
      ...filterOptSelected,
      hashTagOptions,
      keyOptions
    });
  }

  setScrollToRow(scrollToRow, itemIdAddedManually) {
    const idSelected = this.get("idsTimeLine").get(scrollToRow);
    return this.withMutations(state => {
      state
        .set("idSelected", idSelected)
        .set("scrollToRow", scrollToRow)
        .set("itemIdAddedManually", itemIdAddedManually);
    });
  }

  pasteItem(id, mode) {
    const args = { id, mode };
    new Message("pastify", "pasteClip", args).dispatch();
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
    const clip = this._getClipStateById(id);

    // if (!clip.isFaved) {
    //   return this._deleteClip(clip);
    // } else {
    //   const options = userDialog.get("DELETE_FAVED_CLIP");
    //   const resNum = dialog.showMessageBox(null, options);
    //   if (resNum === 0) {
    //     return this._deleteClip(clip);
    //   } else {
    //     return this;
    //   }
    // }

    const value = { isTrashed: !clip.isTrashed };
    new Message("dataStore", "update", { id: clip.id, value }).dispatch();
    const statusFilterOpt = this.get("statusFilterOpt");
    const scrollToRow = this.get("scrollToRow");
    const idsTimeLine = this.get("idsTimeLine");

    if (
      // !clip.isTrashed &&
      statusFilterOpt.length !== 0 &&
      statusFilterOpt[0].value.hasOwnProperty("isTrashed") &&
      statusFilterOpt[0].value.isTrashed
    ) {
      return this._setClipState(clip.id, "isTrashed", !clip.isTrashed);
    }

    const nextRow =
      scrollToRow === idsTimeLine.size - 1 ? idsTimeLine.size - 2 : scrollToRow;
    const nextId =
      scrollToRow === idsTimeLine.size - 1
        ? idsTimeLine.get(nextRow)
        : idsTimeLine.get(nextRow + 1);
    // console.log(`clip.id : ${clip.id}`);
    // console.log(`scrollToRow : ${scrollToRow}`);
    // console.log(`idsTimeLine.size : ${idsTimeLine.size}`);
    // console.log(`nextRow : ${nextRow}`);
    // console.log(`nextId : ${nextId}`);

    return this.withMutations(state => {
      state
        .setIn(["itemsTimeLine", clip.id, "isTrashed"], !clip.isTrashed)
        .set(
          "idsTimeLine",
          this.idsTimeLine.filterNot(_id => _id === clip.id)
        )
        .set("idSelected", nextId)
        .set("scrollToRow", nextRow);
    });
  }

  deleteClipCompletely(id) {
    const clip = this._getClipStateById(id);

    new Message("dataStore", "delete", { id: clip.id }).dispatch();
    const scrollToRow = this.get("scrollToRow");
    const idsTimeLine = this.get("idsTimeLine");

    const nextRow =
      scrollToRow === idsTimeLine.size - 1 ? idsTimeLine.size - 2 : scrollToRow;
    const nextId =
      scrollToRow === idsTimeLine.size - 1
        ? idsTimeLine.get(nextRow)
        : idsTimeLine.get(nextRow + 1);

    // console.log(`clip.id : ${clip.id}`);
    // console.log(`scrollToRow : ${scrollToRow}`);
    // console.log(`idsTimeLine.size : ${idsTimeLine.size}`);
    // console.log(`nextRow : ${nextRow}`);
    // console.log(`nextId : ${nextId}`);

    return this.withMutations(state => {
      state
        .set(
          "idsTimeLine",
          this.idsTimeLine.filterNot(_id => _id === clip.id)
        )
        .set(
          "itemsTimeLine",
          this.itemsTimeLine.filterNot(item => item.get("id") === clip.id)
        )
        .set("idSelected", nextId)
        .set("scrollToRow", nextRow);
    });
  }
  trashItem(id) {
    // this._updateItems(id, { isTrashed: true });
    const value = { isTrashed: true };
    new Message("dataStore", "update", { id, value }).dispatch();
    return this.setIn(["itemsTimeLine", id, "isTrashed"], true);
  }
  setIdSelected(id) {
    return this.set("idSelected", id);
  }
  deleteItem(ids) {
    this._deleteItemDataStore(ids);
    const items = "itemsTimeLine";
    return this.set(items, this[items].subtract(ids));
  }
  favItem(id) {
    const keyPath = ["itemsTimeLine", id, "isFaved"];
    const isFaved = !this.getIn(keyPath);
    // this._updateItems(id, { isFaved });
    const value = { isFaved };
    new Message("dataStore", "update", { id, value }).dispatch();
    return this.setIn(keyPath, isFaved);
  }
  saveTag() {
    const id = this.get("idSelected");
    const keyPath = ["key", "lang", "tag", "itemTagHeight"].map(prop => [
      "itemsTimeLine",
      id,
      prop
    ]);

    const value = keyPath.reduce((acc, path) => {
      const prop = path[2];
      acc[prop] = this.getIn(path);
      return acc;
    }, {});
    // this._updateItems(id, keyValue);
    new Message("dataStore", "update", { id, value }).dispatch();

    const hashTagOptions = new Message(
      "dataStore",
      "getHashTagOptions"
    ).dispatch();
    const keyOptions = new Message("dataStore", "getKeyOptions").dispatch();
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
    const items = "itemsTimeLine";
    const itemKey = this.get("idSelected");
    const { type, value } = tag;
    const keyPath = [items, itemKey, type];
    return this.setIn(keyPath, value);
  }
  setItemText(item) {
    const { id, textData } = item;
    const keyPath = ["itemsTimeLine", id, "textData"];
    // this._updateItems(id, { textData });
    const value = { textData };
    new Message("dataStore", "update", { id, value }).dispatch();

    return this.setIn(keyPath, textData);
  }
  setItemRemoved(id) {
    const items = "itemsTimeLine";
    const setIn = [items, id, "removeFlg"];
    return this.setIn(setIn, true);
  }
  // Action On Item List --------------------------------------------------
  callActionOnItemList(command, filterId) {
    return this[command](filterId);
  }
  addNewItem() {
    new Message("dataStore", "createByUser").dispatch();
    return this;
  }
  trashAllItems() {
    const idsTimeLine = this.get("idsTimeLine");
    // this._updateItems(idsTimeLine.toArray(), { isTrashed: true });
    const ids = idsTimeLine.toArray();
    const value = { isTrashed: true };
    new Message("dataStore", "updateAll", {
      ids,
      value
    }).dispatch();

    return this.withMutations(state => {
      idsTimeLine.forEach(id => {
        state.setIn(["itemsTimeLine", id, "isTrashed"], true);
      });
    });
  }
  trashAllItemsWithoutFaved() {
    const idsTimeLineNotFaved = this.get("idsTimeLine").filter(id => {
      return !this.getIn(["itemsTimeLine", id, "isFaved"]);
    });

    // this._updateItems(idsTimeLineNotFaved.toArray(), { isTrashed: true });
    const ids = idsTimeLineNotFaved.toArray();
    const value = { isTrashed: true };
    new Message("dataStore", "updateAll", {
      ids,
      value
    }).dispatch();
    return this.withMutations(state => {
      idsTimeLineNotFaved.forEach(id => {
        state.setIn(["itemsTimeLine", id, "isTrashed"], true);
      });
    });
  }
  showFilterSortSettings() {
    return this.withMutations(state => {
      state
        .set("detailType", "filter-sort-settings")
        .set("itemIdAddedManually", "_UNSET_");
    });
  }
  saveFilterSortSettings() {
    return this.set(
      "filterSaveModalVisibility",
      !this.get("filterSaveModalVisibility")
    );
  }
  clearFilterSortSettings() {
    return this.withMutations(state => {
      state
        .set("sortOpt", [])
        .set("keywordFilterOpt", [])
        .set("idFilterOpt", [])
        .set("dataTypeFilterOpt", [])
        .set("statusFilterOpt", [])
        .set("hotKeyFilterOpt", [])
        .set("hashTagFilterOpt", [])
        .set("languageFilterOpt", [])
        .set("filterShortcutKeyOpt", [])
        .set("filterName", "");
    });
  }
  reloadFilterSortSettings() {
    return this;
  }
  setUserFilter(filterId) {
    const userFilter = this.get("filtersList").get(filterId);

    return this.withMutations(state => {
      state
        .set("filterName", userFilter.get("filterName"))
        .set("filterShortcutKeyOpt", userFilter.get("filterShortcutKeyOpt"))
        .set("sortOpt", userFilter.get("sortOpt"))
        .set("keywordFilterOpt", userFilter.get("keywordFilterOpt"))
        .set("idFilterOpt", userFilter.get("idFilterOpt"))
        .set("dataTypeFilterOpt", userFilter.get("dataTypeFilterOpt"))
        .set("statusFilterOpt", userFilter.get("statusFilterOpt"))
        .set("hotKeyFilterOpt", userFilter.get("hotKeyFilterOpt"))
        .set("hashTagFilterOpt", userFilter.get("hashTagFilterOpt"))
        .set("languageFilterOpt", userFilter.get("languageFilterOpt"));
    });
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
    return this.setIn(keyPath, this.get("itemStore"));
  }
  setLangOptionsSelected(langOpt) {
    const id = this.get("idSelected");
    const keyPath = ["itemsTimeLine", id, "lang"];
    return this.setIn(keyPath, langOpt);
  }
  setIdsFromDatastore() {
    const options = {
      sortOpt: this.get("sortOpt"),
      filterName: this.get("filterName"),
      filterShortcutKeyOpt: this.get("filterShortcutKeyOpt"),
      keywordFilterOpt: this.get("keywordFilterOpt"),
      idFilterOpt: this.get("idFilterOpt"),
      dataTypeFilterOpt: this.get("dataTypeFilterOpt"),
      statusFilterOpt: this.get("statusFilterOpt"),
      hotKeyFilterOpt: this.get("hotKeyFilterOpt"),
      hashTagFilterOpt: this.get("hashTagFilterOpt"),
      languageFilterOpt: this.get("languageFilterOpt")
    };
    new Message("settings", "updateFilter", options).dispatch();

    const idsFiltered = new Message(
      "dataStore",
      "getIdsByFilter",
      options
    ).dispatch();
    return this.set("idsTimeLine", List(idsFiltered));
  }
  saveFilter() {
    const filterName = this.get("filterName");
    const filterShortcutKeyOpt = this.get("filterShortcutKeyOpt");
    const filterId = new Message("filters", "create", {
      filterName,
      filterShortcutKeyOpt
    }).dispatch();

    const filter = {
      id: filterId,
      filterName,
      filterShortcutKeyOpt,
      sortOpt: this.get("sortOpt"),
      keywordFilterOpt: this.get("keywordFilterOpt"),
      idFilterOpt: this.get("idFilterOpt"),
      dataTypeFilterOpt: this.get("dataTypeFilterOpt"),
      statusFilterOpt: this.get("statusFilterOpt"),
      hotKeyFilterOpt: this.get("hotKeyFilterOpt"),
      hashTagFilterOpt: this.get("hashTagFilterOpt"),
      languageFilterOpt: this.get("languageFilterOpt")
    };

    const filterValue = new FilterValue(filter);
    return this.set("filtersList", this.filtersList.set(filterId, filterValue));
  }

  updateFilter() {
    const filterName = this.get("filterName");
    const filterShortcutKeyOpt = this.get("filterShortcutKeyOpt");
    const id = new Message("filters", "update", {
      filterName,
      filterShortcutKeyOpt
    }).dispatch();

    return this.withMutations(state => {
      state.setIn(
        ["filtersList", id, "filterShortcutKeyOpt"],
        this.get("filterShortcutKeyOpt")
      );
      state.setIn(["filtersList", id, "sortOpt"], this.get("sortOpt"));
      state.setIn(
        ["filtersList", id, "keywordFilterOpt"],
        this.get("keywordFilterOpt")
      );
      state.setIn(["filtersList", id, "idFilterOpt"], this.get("idFilterOpt"));
      state.setIn(
        ["filtersList", id, "dataTypeFilterOpt"],
        this.get("dataTypeFilterOpt")
      );
      state.setIn(
        ["filtersList", id, "statusFilterOpt"],
        this.get("statusFilterOpt")
      );
      state.setIn(
        ["filtersList", id, "hotKeyFilterOpt"],
        this.get("hotKeyFilterOpt")
      );
      state.setIn(
        ["filtersList", id, "hashTagFilterOpt"],
        this.get("hashTagFilterOpt")
      );
      state.setIn(
        ["filtersList", id, "languageFilterOpt"],
        this.get("languageFilterOpt")
      );
    });
  }

  deleteUserFilter(id) {
    new Message("filters", "delete", { id }).dispatch();
    return this.set(
      "filtersList",
      this.filtersList.filter(filter => {
        return filter.id !== id;
      })
    );
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
  updateWinState(props) {
    new Message("win", "updateWinState", props).dispatch();
    return this;
  }

  _getClipStateById(id = null) {
    if (id === null) {
      const idSelected = this.get("idSelected");
      return this.getIn(["itemsTimeLine", idSelected]).toJS();
    } else {
      return this.getIn(["itemsTimeLine", id]).toJS();
    }
  }

  _setClipState(id, stateName, state) {
    return this.setIn(["itemsTimeLine", id, stateName], state);
  }

  _deleteClip(clip) {}
}

export default State;
