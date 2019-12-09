import { handleActions } from "redux-actions";
import State from "../models/State";
import _ from "lodash";

export default handleActions(
  {
    PASTE_ITEM: (state, { payload: { id, mode } }) => {
      return state.pasteItem(id, mode);
    },
    LOAD_ITEM: (state, { payload: item }) => {
      return state.loadItem(item);
    },
    ADD_ITEM_CLIPBOARD: (state, { payload: { item, dist, addMode } }) => {
      return state.addItemClipboard(item, dist, addMode);
    },
    DELETE_IDS: (state, { payload: ids }) => {
      return state.deleteIds(ids);
    },
    TRASH_ITEM: (state, { payload: id }) => {
      return state.trashItem(id);
    },
    DELETE_ITEM: (state, { payload: ids }) => {
      return state.deleteItem(ids);
    },
    FAV_ITEM: (state, { payload: id }) => {
      return state.favItem(id);
    },
    GET_MOMENT: (state, { payload: currentTime }) => {
      return state.set("moment", currentTime);
    },
    TOGGLE_MAIN_PANEL: state => {
      return state.set("isFold", !state.get("isFold"));
    },
    TOGGLE_LIST_MODE: state => {
      return state.set("isCompact", !state.get("isCompact"));
    },
    TOGGLE_MODAL_VISIBILITY: (state, { payload: id }) => {
      return state.toggleModalVisibility(id);
    },
    TOGGLE_FILTER_SAVE_MODAL_VISIBILITY: state => {
      return state.set(
        "filterSaveModalVisibility",
        !state.get("filterSaveModalVisibility")
      );
    },
    TOGGLE_ITEM_LIST_TOOL_TIP_VISIBILITY: (state, { payload: flg }) => {
      return state.toggleItemListToolTipVisibility(flg);
    },
    SAVE_TAG: state => {
      return state.saveTag();
    },
    SET_ALWAYS_ON_TOP: (state, { payload: alwaysOnTop }) => {
      return state.setAlwaysOnTop(alwaysOnTop);
    },
    SET_WIN_FOCUS: (state, { payload: winFocus }) => {
      return state.set("winFocus", winFocus);
    },
    SET_WIN_MAXIMIZE: (state, { payload: winMaximize }) => {
      return state.set("winMaximize", winMaximize);
    },
    SET_ID_SELECTED: (state, { payload: id }) => {
      return state.set("idSelected", id);
    },
    SET_MENU_TAB_SELECTED: (state, { payload: menuTab }) => {
      return state.set("menuTabSelected", menuTab);
    },
    SET_KEYBOARD_HANDLER: state => {
      return state.setKeyboardHandler();
    },
    SET_ITEM_TAG: (state, { payload: itemTag }) => {
      return state.setItemTag(itemTag);
    },
    SET_ITEM_REMOVED: (state, { payload: id }) => {
      return state.setItemRemoved(id);
    },
    SET_ITEM_DISPLAY_RANGE: (state, { payload: range }) => {
      return state.set("itemDisplayRange", range);
    },
    SET_ITEM_TAG_HEIGHT: (state, { payload: itemTagHeight }) => {
      return state.setItemTagHeight(itemTagHeight);
    },
    SET_ITEM_LIST_REF: (state, { payload: ref }) => {
      return state.set("itemListRef", ref);
    },
    SET_SCROLL_TO_ROW: (
      state,
      { payload: { scrollToRow, itemIdAddedManually } }
    ) => {
      return state.setScrollToRow(scrollToRow, itemIdAddedManually);
    },
    SET_FOCUS_ITEM_LIST: (state, { payload: focus }) => {
      return state.set("focusItemList", focus);
    },
    SET_ITEM_TEXT: (state, { payload: item }) => {
      return state.setItemText(item);
    },
    SET_LANG_OPTIONS_SELECTED: (state, { payload: options }) => {
      return state.setLangOptionsSelected(options);
    },
    SET_IDS_FROM_DATASTORE: state => {
      return state.setIdsFromDatastore();
    },
    SET_DETAIL_TYPE: (state, { payload: type }) => {
      return state.set("detailType", type);
    },
    // Sort ---------------------------------------------------------
    SET_SORT_OPTIONS: (state, { payload: options }) => {
      return state.set("sortOpt", options);
    },
    // Filter by keyword --------------------------------------------
    ADD_KEYWORD_FILTER_OPTIONS: (state, { payload: value }) => {
      return state.addKeywordFilterOptions(value);
    },
    REMOVE_KEYWORD_FILTER_OPTIONS: (state, { payload: value }) => {
      return state.removeKeywordFilterOptions(value);
    },
    CHANGE_KEYWORD_FILTER_INPUT_VALUE: (state, { payload: value }) => {
      return state.set("keywordFilterInputValue", value);
    },
    // Filter by id --------------------------------------------------
    ADD_ID_FILTER_OPTIONS: (state, { payload: value }) => {
      return state.addIdFilterOptions(value);
    },
    REMOVE_ID_FILTER_OPTIONS: (state, { payload: value }) => {
      return state.removeIdFilterOptions(value);
    },
    CHANGE_ID_FILTER_INPUT_VALUE: (state, { payload: value }) => {
      return state.set("idFilterInputValue", value);
    },
    // Filter by data type ------------------------------------------
    SET_DATA_TYPE_FILTER_OPTIONS: (state, { payload: options }) => {
      return state.set("dataTypeFilterOpt", options);
    },
    // Filter by status ---------------------------------------------
    SET_STATUS_FILTER_OPTIONS: (state, { payload: options }) => {
      return state.set("statusFilterOpt", options);
    },
    // Filter by language ---------------------------------------------
    SET_LANGUAGE_FILTER_OPTIONS: (state, { payload: options }) => {
      console.log(options);
      return state.set("languageFilterOpt", options);
    },
    // Filter by hot key --------------------------------------------
    SET_HOT_KEY_FILTER_OPTIONS: (state, { payload: options }) => {
      return state.set("hotKeyFilterOpt", options);
    },
    ADD_HOT_KEY_FILTER_OPTIONS: (state, { payload: options }) => {
      return state.addHotKeyFilterOptions(options);
    },
    CHANGE_HOT_KEY_FILTER_INPUT_VALUE: (state, { payload: value }) => {
      return state.set("hotKeyFilterInputValue", value);
    },
    // Filter by hash tag --------------------------------------------
    SET_HASH_TAG_FILTER_OPTIONS: (state, { payload: options }) => {
      return state.set("hashTagFilterOpt", options);
    },
    ADD_HASH_TAG_FILTER_OPTIONS: (state, { payload: options }) => {
      return state.addHashTagFilterOptions(options);
    },
    CHANGE_HASH_TAG_FILTER_INPUT_VALUE: (state, { payload: value }) => {
      return state.set("hashTagFilterInputValue", value);
    },
    // Filter Name -------------------------------------------------
    SET_FILTER_NAME: (state, { payload: name }) => {
      return state.set("filterName", name);
    },
    // Filter Shortcut Key -------------------------------------------------
    SET_SHORTCUT_KEY_OPT: (state, { payload: opt }) => {
      return state.set("filterShortcutKeyOpt", opt);
    },
    SAVE_FILTER_SETTINGS: state => {
      return state.saveFilterSettings();
    },

    // Set item status by hash tag ----------------------------------
    SET_HASH_TAG_INPUT_VALUE: (state, { payload: value }) => {
      return state.set("hashTagInputValue", value);
    },
    ADD_HASH_TAG_VALUE: (state, { payload: value }) => {
      return state.addHashTagValue(value);
    },
    CHANGE_HASH_TAG_VALUE: (state, { payload: value }) => {
      return state.changeHashTagValue(value);
    },
    // Set item status by hot key ------------------------------------
    SET_KEY_INPUT_VALUE: (state, { payload: value }) => {
      return state.set("keyInputValue", value);
    },
    ADD_KEY_VALUE: (state, { payload: value }) => {
      return state.addKeyValue(value);
    },
    CHANGE_KEY_VALUE: (state, { payload: value }) => {
      return state.changeKeyValue(value);
    },
    CALL_ACTION_ON_ITEM_LIST: (state, { payload: { command, filterId } }) => {
      return state.callActionOnItemList(command, filterId);
    },
    STORE_ITEM_ON_MODAL_OPEN: state => {
      return state.storeItemOnModalOpen();
    },
    RESTORE_ITEM_ON_CANCEL: state => {
      return state.restoreItemOnCancel();
    },
    SET_ACTION_SELECTED: (state, { payload: actionSelected }) => {
      return state.set("actionSelected", actionSelected);
    }
  },
  new State()
);
