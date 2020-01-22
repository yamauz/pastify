import { OrderedMap, Map, Record, List } from "immutable";
import ItemValue from "./ItemValue";
import FilterValue from "./FilterValue";
import Message from "./Message";
import popupKeyValue from "./../../common/popupKeyValue";
import searchLabelOptionsAll from "./../../common/searchLabelOptionsAll";
import searchInputOptionsAll from "./../../common/searchInputOptionsAll";
import _ from "lodash";
import * as React from "react";
import toast from "toasted-notes";

const StateRecord = Record({
  alwaysOnTop: false,
  winFocus: true,
  winMaximize: false,
  isCompact: true,
  isFold: false,
  notify: true,
  // detailType: "DEFAULT",
  detailType: "preferences",
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
  // prevFocusedElm: document.activeElement,
  prevFocusedElm: "searchbar",
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
  isOpenClipToolTip: false,
  searchInputValue: "",
  searchOpt: Map([
    ["LABEL", Map()],
    ["STATUS", Map()],
    ["DATATYPE", Map()],
    ["SURROUND", Map()]
  ]),
  blockKeywordsInputValue: "",
  blockKeywordsOpt: [],
  blockDatatypeOpt: [],
  blockMaxTextLength: "",
  blockMinTextLength: "",
  blockMaxImageSize: "",
  blockMaxFileCount: "",
  launchKeyOpt: [],
  launchKeyDuration: "",
  maxTextLength: "",
  maxImageSize: "",
  clipForApplyLabel: undefined
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
    const preferencesOptSelected = new Message(
      "settings",
      "readPreferences"
    ).dispatch();
    const { alwaysOnTop, isFold, isCompact } = new Message(
      "settings",
      "readWin"
    ).dispatch();
    super({
      // windows settings
      alwaysOnTop,
      isFold,
      isCompact,
      itemsTimeLine,
      idsTimeLine,
      filtersList,
      ...filterOptSelected,
      ...preferencesOptSelected,
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

  copyClip(isReturn, copyOnly, copyAs) {
    const id = this.get("idSelected");
    const args = { id, isReturn, copyOnly, copyAs };
    new Message("pastify", "copyClip", args).dispatch();
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
      if (clip.isTrashed) {
        this._toast(`Recover : ${clip.id}`);
      } else {
        this._toast(`Trash : ${clip.id}`);
      }
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

    this._toast(`Trash : ${clip.id}`);
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
    this._toast(`Delete : ${clip.id}`);

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
    isFaved ? this._toast(`Fav : ${id}`) : this._toast(`UnFav : ${id}`);
    const value = { isFaved };
    new Message("dataStore", "update", { id, value }).dispatch();
    return this.setIn(keyPath, isFaved);
  }
  saveTag() {
    const id = this.get("idSelected");
    this._toast(`Change Label : ${id}`);
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
    const args = { textValue: "" };
    new Message("dataStore", "createByUser", args).dispatch();
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
    const isFold = this.get("isFold");
    if (isFold) {
      new Message("win", "updateWinState", "unfoldWindow").dispatch();
      setTimeout(() => {
        document.getElementById("keyword-input").focus();
      }, 200);
    }
    return this.withMutations(state => {
      state
        .set("detailType", "filter-sort-settings")
        .set("itemIdAddedManually", "_UNSET_");
    });
  }
  showPreferences() {
    const isFold = this.get("isFold");
    if (isFold) {
      new Message("win", "updateWinState", "unfoldWindow").dispatch();
      // setTimeout(() => {
      //   document.getElementById("keyword-input").focus();
      // }, 200);
    }
    return this.withMutations(state => {
      state
        .set("detailType", "preferences")
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
  setUserFilterByKey(keyCode, modifier) {
    let _id;
    this.get("filtersList").forEach(filter => {
      const _key = filter.get("filterShortcutKeyOpt");
      if (!Array.isArray(_key)) {
        const _keySplit = _key.value.split("+");
        const _keyCode = _keySplit[_keySplit.length - 1];
        const _shiftKey = _keySplit.includes("shift") ? true : false;
        const _ctrlKey = _keySplit.includes("ctrl") ? true : false;
        const _altKey = _keySplit.includes("alt") ? true : false;
        if (
          keyCode === _keyCode &&
          modifier.shiftKey === _shiftKey &&
          modifier.ctrlKey === _ctrlKey &&
          modifier.altKey === _altKey
        ) {
          _id = filter.get("id");
        }
      }
    });
    if (_id !== undefined) {
      const userFilter = this.get("filtersList").get(_id);

      const sortOpt = userFilter.get("sortOpt");
      const filterName = userFilter.get("filterName");
      const filterShortcutKeyOpt = userFilter.get("filterShortcutKeyOpt");
      const keywordFilterOpt = userFilter.get("keywordFilterOpt");
      const idFilterOpt = userFilter.get("idFilterOpt");
      const dataTypeFilterOpt = userFilter.get("dataTypeFilterOpt");
      const statusFilterOpt = userFilter.get("statusFilterOpt");
      const hotKeyFilterOpt = userFilter.get("hotKeyFilterOpt");
      const hashTagFilterOpt = userFilter.get("hashTagFilterOpt");
      const languageFilterOpt = userFilter.get("languageFilterOpt");
      const options = {
        sortOpt,
        filterName,
        filterShortcutKeyOpt,
        keywordFilterOpt,
        idFilterOpt,
        dataTypeFilterOpt,
        statusFilterOpt,
        hotKeyFilterOpt,
        hashTagFilterOpt,
        languageFilterOpt
      };

      new Message("settings", "updateFilter", options).dispatch();

      const idsFiltered = new Message(
        "dataStore",
        "getIdsByFilter",
        options
      ).dispatch();

      return this.withMutations(state => {
        state
          .set("filterName", filterName)
          .set("filterShortcutKeyOpt", filterShortcutKeyOpt)
          .set("sortOpt", sortOpt)
          .set("keywordFilterOpt", keywordFilterOpt)
          .set("idFilterOpt", idFilterOpt)
          .set("dataTypeFilterOpt", dataTypeFilterOpt)
          .set("statusFilterOpt", statusFilterOpt)
          .set("hotKeyFilterOpt", hotKeyFilterOpt)
          .set("hashTagFilterOpt", hashTagFilterOpt)
          .set("languageFilterOpt", languageFilterOpt)
          .set("idsTimeLine", List(idsFiltered))
          .set("scrollToRow", 0);
      });
    } else {
      return this;
    }
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
    console.log(langOpt);
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
    return this.withMutations(state => {
      state.set("idsTimeLine", List(idsFiltered)).set("scrollToRow", 0);
    });
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

  toggleMainFold() {
    const isFold = this.get("isFold");
    const command = isFold ? "unfoldWindow" : "foldWindow";
    new Message("win", "updateWinState", command).dispatch();
    return this;
  }
  toggleListMode() {
    const isCompact = this.get("isCompact");
    const args = { isCompact: !isCompact };
    new Message("settings", "updatePreferences", args).dispatch();
    return this.set("isCompact", !isCompact);
  }
  updateWinState(props) {
    new Message("win", "updateWinState", props).dispatch();
    return this;
  }
  copyClipId() {
    const args = { id: this.get("idSelected") };
    new Message("pastify", "copyClipId", args).dispatch();
    return this;
  }
  setSearchInputValue(value) {
    const { shiftKey, ctrlKey } = this._getModifierKeys();
    const _searchOpt = this.get("searchOpt");
    const inputOpt = searchInputOptionsAll.has(value)
      ? searchInputOptionsAll.get(value)
      : undefined;

    if (inputOpt !== undefined) {
      const _labels = searchLabelOptionsAll.get(inputOpt.type);
      const _newSearchOpt = _searchOpt.set(
        inputOpt.type,
        Map([[inputOpt.subType, _labels.get(inputOpt.subType)]])
      );
      // return this.set("searchOpt", _newSearchOpt);
      return this.withMutations(state => {
        state.set("searchInputValue", "").set("searchOpt", _newSearchOpt);
      });
    }

    const conditions = ["LABEL", "STATUS", "DATATYPE"];
    const condSelect = new Map();
    conditions.forEach(cond => {
      const opt = _searchOpt.get(cond).first();
      const type = opt !== undefined ? opt.label : null;
      condSelect.set(cond, type);
    });
    if (_searchOpt.get("LABEL").has("HOTKEY")) {
      const clips = new Message("dataStore", "readHasHotKey", {
        condSelect: Array.from(condSelect)
      }).dispatch();
      const clipsHasInputValue = clips.filter(
        clip => clip.key.toLowerCase() === value.toLowerCase()
      );
      switch (clipsHasInputValue.length) {
        case 0:
          return this.set("searchInputValue", value);
        case 1:
          const id = clipsHasInputValue[0].id;
          const isReturn = shiftKey;
          const copyOnly = ctrlKey;
          const copyAs = clipsHasInputValue[0].mainFormat;
          const surround =
            _searchOpt.get("SURROUND").size !== 0 && copyAs === "TEXT"
              ? _searchOpt.get("SURROUND").first()
              : undefined;

          const _args = { id, isReturn, copyOnly, copyAs, surround };
          new Message("pastify", "copyClip", _args).dispatch();
          return this.withMutations(state => {
            state
              .set("searchInputValue", "")
              .set("searchOpt", this._getEmptySearchOpt());
          });
        default:
          return this.set("searchInputValue", value);
      }
    } else if (_searchOpt.get("LABEL").has("LISTKEY")) {
      const { startIndex, stopIndex } = this.get("itemDisplayRange");
      const popupIndex = popupKeyValue.indexOf(value.toUpperCase());
      if (popupIndex !== -1) {
        if (popupIndex < stopIndex - startIndex + 1) {
          const targetIndex = popupIndex + startIndex;
          const id = this.get("idsTimeLine").get(targetIndex);
          const clip = this._getClipStateById(id);
          const isReturn = shiftKey;
          const copyOnly = ctrlKey;
          const copyAs = clip.mainFormat;
          const surround =
            _searchOpt.get("SURROUND").size !== 0 && copyAs === "TEXT"
              ? _searchOpt.get("SURROUND").first()
              : undefined;
          const _args = { id, isReturn, copyOnly, copyAs, surround };
          new Message("pastify", "copyClip", _args).dispatch();
        }
      }
      return this.withMutations(state => {
        state
          .set("searchInputValue", "")
          .set("searchOpt", this._getEmptySearchOpt());
      });
    } else {
      return this.set("searchInputValue", value);
    }
  }
  setSearchOpt(handle, args) {
    if (handle === "onKeyDown") {
      let _type, _mapKey;
      const keycode = args;
      const _searchOpt = this.get("searchOpt");
      switch (keycode) {
        case "space": {
          _type = "LABEL";
          _mapKey = _searchOpt.get("LABEL").has("HOTKEY")
            ? "LISTKEY"
            : "HOTKEY";
          break;
        }
        default:
          return this;
      }
      const _labels = searchLabelOptionsAll.get(_type);
      const _newSearchOpt = _searchOpt.set(
        _type,
        Map([[_mapKey, _labels.get(_mapKey)]])
      );
      return this.set("searchOpt", _newSearchOpt);
    } else {
      //onChange スペースキー/ブラー/クリア時
      const _opt = args;
      const _newSearchOpt = this._optionsToMap(_opt);
      const selectClip = _opt.filter(opt => opt.hasOwnProperty("id"));
      if (selectClip.length !== 0) {
        const { shiftKey, ctrlKey } = new Message(
          "key",
          "getModifierKey",
          {}
        ).dispatch();
        const id = selectClip[0].id;
        const isReturn = shiftKey;
        const copyOnly = ctrlKey;
        const copyAs = selectClip[0].mainFormat;
        const surround =
          _newSearchOpt.get("SURROUND").size !== 0 && copyAs === "TEXT"
            ? _newSearchOpt.get("SURROUND").first()
            : undefined;

        const _args = { id, isReturn, copyOnly, copyAs, surround };
        new Message("pastify", "copyClip", _args).dispatch();
      }
      return this.set("searchOpt", _newSearchOpt);
    }
  }

  selectClipToPaste(id, modifier) {
    const { mainFormat } = this._getClipStateById(id);
    const searchOpt = this.get("searchOpt");
    const isReturn = modifier.shiftKey;
    const copyOnly = modifier.ctrlKey;
    const copyAs = mainFormat;
    const surround =
      searchOpt.get("SURROUND").size !== 0 && copyAs === "TEXT"
        ? searchOpt.get("SURROUND").first()
        : undefined;
    const _args = { id, isReturn, copyOnly, copyAs, surround };
    new Message("pastify", "copyClip", _args).dispatch();
    return this.withMutations(state => {
      state
        .set("searchInputValue", "")
        .set("searchOpt", this._getEmptySearchOpt());
    });
  }

  addNewItemByInputValue(textValue, modifier) {
    const args = { textValue };
    const clip = new Message(
      "dataStore",
      "createBySearchInputValue",
      args
    ).dispatch();
    const searchOpt = this.get("searchOpt");
    const id = clip.id;
    const isReturn = modifier.shiftKey;
    const copyOnly = modifier.ctrlKey;
    const copyAs = clip.mainFormat;
    const surround =
      searchOpt.get("SURROUND").size !== 0 && copyAs === "TEXT"
        ? searchOpt.get("SURROUND").first()
        : undefined;
    const _args = { id, isReturn, copyOnly, copyAs, surround };
    new Message("pastify", "copyClip", _args).dispatch();
    return this.withMutations(state => {
      state
        .set("searchInputValue", "")
        .set("searchOpt", this._getEmptySearchOpt());
    });
  }

  exportClips(exportPath) {
    const idsTimeLine = this.get("idsTimeLine").toArray();
    const _args = { idsTimeLine, exportPath };

    new Message("pastify", "exportClips", _args).dispatch();
    return this;
  }

  importClips(importPath) {
    const _args = { importPath };
    new Message("pastify", "importClips", _args).dispatch();
    return this;
  }

  addImportClips(clips) {
    const allClipsRec = clips.map(clip => [clip.id, new ItemValue(clip)]);
    const itemsTimeLine = this.get("itemsTimeLine");
    return this.set("itemsTimeLine", itemsTimeLine.merge(allClipsRec));
    // return this;
  }

  addBlockKeywordsOptions(keywords) {
    const prevKeywords = this.get("blockKeywordsOpt");
    const wordList = prevKeywords.map(keyword => keyword.value);
    const blockKeywordsOpt = wordList.includes(keywords.value)
      ? prevKeywords
      : [...prevKeywords, keywords];
    const args = { blockKeywordsOpt };
    new Message("settings", "updatePreferences", args).dispatch();
    return this.withMutations(state => {
      state
        .set("blockKeywordsOpt", blockKeywordsOpt)
        .set("blockKeywordsInputValue", "");
    });
  }
  removeBlockKeywordsOptions(keywords) {
    const blockKeywordsOpt = keywords === null ? [] : keywords;
    const args = { blockKeywordsOpt };
    new Message("settings", "updatePreferences", args).dispatch();
    return this.withMutations(state => {
      state
        .set("blockKeywordsOpt", blockKeywordsOpt)
        .set("blockKeywordsInputValue", "");
    });
  }

  setBlockDatatypeOptions(blockDatatypeOpt) {
    const args = { blockDatatypeOpt };
    new Message("settings", "updatePreferences", args).dispatch();
    return this.set("blockDatatypeOpt", blockDatatypeOpt);
  }
  setLaunchKeyOptions(launchKeyOpt) {
    const args = { launchKeyOpt };
    new Message("settings", "updatePreferences", args).dispatch();
    return this.set("launchKeyOpt", launchKeyOpt);
  }
  setLaunchKeyDuration(launchKeyDuration) {
    const args = { launchKeyDuration };
    new Message("settings", "updatePreferences", args).dispatch();
    return this.set("launchKeyDuration", launchKeyDuration);
  }

  setBlockMaxTextLength(blockMaxTextLength) {
    const args = { blockMaxTextLength };
    new Message("settings", "updatePreferences", args).dispatch();
    return this.set("blockMaxTextLength", blockMaxTextLength);
  }
  setBlockMinTextLength(blockMinTextLength) {
    const args = { blockMinTextLength };
    new Message("settings", "updatePreferences", args).dispatch();
    return this.set("blockMinTextLength", blockMinTextLength);
  }

  setBlockMaxImageSize(blockMaxImageSize) {
    const args = { blockMaxImageSize };
    new Message("settings", "updatePreferences", args).dispatch();
    return this.set("blockMaxImageSize", blockMaxImageSize);
  }
  setBlockMaxFileCount(blockMaxFileCount) {
    const args = { blockMaxFileCount };
    new Message("settings", "updatePreferences", args).dispatch();
    return this.set("blockMaxFileCount", blockMaxFileCount);
  }
  setMaxTextLength(maxTextLength) {
    const args = { maxTextLength };
    new Message("settings", "updatePreferences", args).dispatch();
    return this.set("maxTextLength", maxTextLength);
  }
  setMaxImageSize(maxImageSize) {
    const args = { maxImageSize };
    new Message("settings", "updatePreferences", args).dispatch();
    return this.set("maxImageSize", maxImageSize);
  }
  setMaxFileLength(maxFileLength) {
    const args = { maxFileLength };
    new Message("settings", "updatePreferences", args).dispatch();
    return this.set("maxFileLength", maxFileLength);
  }
  saveClipForApplyLabel(id) {
    const clip = this._getClipStateById(id);
    this._toast(`Store Label : ${id}`);
    return this.set("clipForApplyLabel", clip);
  }
  applyClipLabel(idSelected) {
    if (this.get("clipForApplyLabel") === undefined) {
      return this;
    } else {
      this._toast(`Apply Label : ${id}`);
      const { id, lang, tag, key } = this.get("clipForApplyLabel");
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
      new Message("dataStore", "update", { id: idSelected, value }).dispatch();

      return this.withMutations(state => {
        state
          .setIn(["itemsTimeLine", idSelected, "key"], key)
          .setIn(["itemsTimeLine", idSelected, "tag"], tag)
          .setIn(["itemsTimeLine", idSelected, "lang"], lang);
      });
    }
  }

  applyLabelFilter(option) {
    return this.withMutations(state => {
      state
        .set("sortOpt", [])
        .set("keywordFilterOpt", [])
        .set("idFilterOpt", [])
        .set("dataTypeFilterOpt", [])
        .set("statusFilterOpt", [])
        .set("hotKeyFilterOpt", [])
        .set("hashTagFilterOpt", [option])
        .set("languageFilterOpt", [])
        .set("filterShortcutKeyOpt", [])
        .set("filterName", option.label);
    });
  }
  applyLangFilter(option) {
    return this.withMutations(state => {
      state
        .set("sortOpt", [])
        .set("keywordFilterOpt", [])
        .set("idFilterOpt", [])
        .set("dataTypeFilterOpt", [])
        .set("statusFilterOpt", [])
        .set("hotKeyFilterOpt", [])
        .set("hashTagFilterOpt", [])
        .set("languageFilterOpt", [option])
        .set("filterShortcutKeyOpt", [])
        .set("filterName", option.label);
    });
  }

  applyIdFilter(id) {
    const _option = { label: id, value: id };
    return this.withMutations(state => {
      state
        .set("sortOpt", [])
        .set("keywordFilterOpt", [])
        .set("idFilterOpt", [_option])
        .set("dataTypeFilterOpt", [])
        .set("statusFilterOpt", [])
        .set("hotKeyFilterOpt", [])
        .set("hashTagFilterOpt", [])
        .set("languageFilterOpt", [])
        .set("filterShortcutKeyOpt", [])
        .set("filterName", id)
        .set("searchInputValue", "")
        .set("searchOpt", this._getEmptySearchOpt());
    });
  }

  _getModifierKeys() {
    return new Message("key", "getModifierKey", {}).dispatch();
  }

  _optionsToMap(options) {
    const _labels = [];
    const _status = [];
    const _dataType = [];
    const _surround = [];
    options.forEach(opt => {
      switch (opt.origType) {
        case "LABEL":
          _labels.push([opt.label, opt]);
          break;
        case "STATUS":
          _status.push([opt.label, opt]);
          break;
        case "DATATYPE":
          _dataType.push([opt.label, opt]);
          break;
        case "SURROUND":
          _surround.push([opt.label, opt]);
          break;
        default:
          break;
      }
    });
    return Map([
      ["LABEL", Map(_labels)],
      ["STATUS", Map(_status)],
      ["DATATYPE", Map(_dataType)],
      ["SURROUND", Map(_surround)]
    ]);
  }

  _getEmptySearchOpt() {
    return Map([
      ["LABEL", Map()],
      ["STATUS", Map()],
      ["DATATYPE", Map()],
      ["SURROUND", Map()]
    ]);
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

  _toast(message) {
    const notify = this.get("notify");
    if (notify) {
      toast.notify(message, {
        position: "bottom-right",
        duration: 2000
      });
    }
  }
}

export default State;
