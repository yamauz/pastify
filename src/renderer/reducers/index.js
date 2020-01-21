import { handleActions } from "redux-actions";
import State from "../models/State";
import _ from "lodash";
import shortid from "shortid";

export default handleActions(
  {
    COPY_CLIP_ID: (state, { payload: id }) => {
      return state.copyClipId(id);
    },
    COPY_CLIP: (state, { payload: { isReturn, copyOnly, copyAs } }) => {
      return state.copyClip(isReturn, copyOnly, copyAs);
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
    DELETE_CLIP_COMPLETELY: (state, { payload: ids }) => {
      return state.deleteClipCompletely(ids);
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
    TOGGLE_MAIN_FOLD: state => {
      return state.toggleMainFold();
    },
    SET_MAIN_FOLD: (state, { payload: isFold }) => {
      return state.set("isFold", isFold);
    },
    TOGGLE_LIST_MODE: state => {
      return state.toggleListMode();
      // return state.set("isCompact", !state.get("isCompact"));
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
    SET_ALWAYS_ON_TOP: state => {
      return state.set("alwaysOnTop", !state.get("alwaysOnTop"));
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
    SAVE_FILTER: state => {
      return state.saveFilter();
    },
    UPDATE_FILTER: state => {
      return state.updateFilter();
    },
    DELETE_USER_FILTER: (state, { payload: id }) => {
      return state.deleteUserFilter(id);
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
    },
    UPDATE_WIN_STATE: (state, { payload: props }) => {
      return state.updateWinState(props);
    },
    SET_PREV_FOCUSED_ELM: (state, { payload: elm }) => {
      let id;
      if (!!elm.id) {
        id = elm.id;
      } else {
        id = shortid.generate();
        elm.setAttribute("id", id);
      }
      return state.set("prevFocusedElm", id);
    },
    SET_TOOL_TIP_ARROW_POS: (state, { payload: pos }) => {
      return state.set("toolTipArrowPos", pos);
    },
    TOGGLE_CLIP_TOOL_TIP: state => {
      return state.set("isOpenClipToolTip", !state.get("isOpenClipToolTip"));
    },
    SET_SEARCH_INPUT_VALUE: (state, { payload: value }) => {
      return state.setSearchInputValue(value);
    },
    SELECT_CLIP_TO_PASTE: (state, { payload: { id, modifier } }) => {
      return state.selectClipToPaste(id, modifier);
    },
    SET_SEARCH_OPT: (state, { payload: { handle, args } }) => {
      return state.setSearchOpt(handle, args);
    },
    EXPORT_CLIPS: (state, { payload: exportPath }) => {
      return state.exportClips(exportPath);
    },
    IMPORT_CLIPS: (state, { payload: importPath }) => {
      return state.importClips(importPath);
    },
    ADD_IMPORT_CLIPS: (state, { payload: clips }) => {
      return state.addImportClips(clips);
    },
    SET_USER_FILTER_BY_KEY: (state, { payload: { keycode, modifier } }) => {
      return state.setUserFilterByKey(keycode, modifier);
    },
    // [Preferences] Launch Key-------------------------------------
    SET_LAUNCH_KEY_OPTIONS: (state, { payload: options }) => {
      return state.setLaunchKeyOptions(options);
    },
    SET_LAUNCH_KEY_DURATION: (state, { payload: value }) => {
      return state.setLaunchKeyDuration(value);
    },
    //  by keyword --------------------------------------------
    ADD_BLOCK_KEYWORDS_OPTIONS: (state, { payload: value }) => {
      return state.addBlockKeywordsOptions(value);
    },
    REMOVE_BLOCK_KEYWORDS_OPTIONS: (state, { payload: value }) => {
      return state.removeBlockKeywordsOptions(value);
    },
    CHANGE_BLOCK_KEYWORDS_INPUT_VALUE: (state, { payload: value }) => {
      return state.set("blockKeywordsInputValue", value);
    },
    ADD_NEW_ITEM_BY_INPUT_VALUE: (state, { payload: { value, modifier } }) => {
      return state.addNewItemByInputValue(value, modifier);
    },
    // Filter by data type ------------------------------------------
    SET_BLOCK_DATATYPE_OPTIONS: (state, { payload: options }) => {
      return state.setBlockDatatypeOptions(options);
    },
    SET_BLOCK_MAX_TEXT_LENGTH: (state, { payload: value }) => {
      return state.setBlockMaxTextLength(value);
    },
    SET_BLOCK_MIN_TEXT_LENGTH: (state, { payload: value }) => {
      return state.setBlockMinTextLength(value);
    },
    SET_BLOCK_MAX_IMAGE_SIZE: (state, { payload: value }) => {
      return state.setBlockMaxImageSize(value);
    },
    SET_BLOCK_MAX_FILE_COUNT: (state, { payload: value }) => {
      return state.setBlockMaxFileCount(value);
    },
    SET_MAX_TEXT_LENGTH: (state, { payload: value }) => {
      return state.setMaxTextLength(value);
    },
    SET_MAX_IMAGE_SIZE: (state, { payload: value }) => {
      return state.setMaxImageSize(value);
    },
    SET_MAX_FILE_LENGTH: (state, { payload: value }) => {
      return state.setMaxFileLength(value);
    },
    SAVE_CLIP_FOR_APPLY_LABEL: (state, { payload: id }) => {
      return state.saveClipForApplyLabel(id);
    },
    APPLY_CLIP_LABEL: (state, { payload: id }) => {
      return state.applyClipLabel(id);
    },
    APPLY_LABEL_FILTER: (state, { payload: option }) => {
      return state.applyLabelFilter(option);
    },
    APPLY_LANG_FILTER: (state, { payload: option }) => {
      return state.applyLangFilter(option);
    }
  },
  new State()
);
