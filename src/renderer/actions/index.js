import { createActions } from "redux-actions";

export const {
  loadItem,
  addItemClipboard,
  deleteIds,
  deleteItem,
  favItem,
  getMoment,
  toggleModalVisibility,
  toggleFilterSaveModalVisibility,
  toggleItemListToolTipVisibility,
  saveTag,
  setIdSelected,
  setMenuTabSelected,
  setKeyboardHandler,
  setItemTag,
  setItemRemoved,
  setItemDisplayRange,
  setItemTagHeight,
  setItemListRef,
  setScrollToRow,
  setFocusItemList,
  setItemText,
  setDataTypeOptionsSelected,
  setLangOptionsSelected,
  setIdsFromDatastore,
  // Sort --------------------------------------------------------
  setSortOptions,
  // Filter by keyword --------------------------------------------
  changeKeywordFilterInputValue,
  addKeywordFilterOptions,
  removeKeywordFilterOptions,
  // Filter by id --------------------------------------------
  changeIdFilterInputValue,
  addIdFilterOptions,
  removeIdFilterOptions,
  // Filter by data type -----------------------------------------
  setDataTypeFilterOptions,
  // Filter by status --------------------------------------------
  setStatusFilterOptions,
  // Filter by language --------------------------------------------
  setLanguageFilterOptions,
  // Filter by hot key ----------------------------------------
  setHotKeyFilterOptions,
  addHotKeyFilterOptions,
  changeHotKeyFilterInputValue,
  // Filter by hash tag ----------------------------------------
  setHashTagFilterOptions,
  addHashTagFilterOptions,
  changeHashTagFilterInputValue,
  // Set item status by hash tag ----------------------------------
  setHashTagInputValue,
  addHashTagValue,
  changeHashTagValue,
  // Set item status by hot key ------------------------------------
  setKeyInputValue,
  addKeyValue,
  changeKeyValue,
  callActionOnItemList,
  updateTextLang,
  updateKey,
  updateTag,
  storeItemOnModalOpen,
  restoreItemOnCancel,
  setActionSelected,
  increment,
  decrement
} = createActions({
  LOAD_ITEM: item => item,
  ADD_ITEM_CLIPBOARD: (item, dist) => ({ item, dist }),
  DELETE_IDS: ids => ids,
  DELETE_ITEM: ids => ids,
  FAV_ITEM: id => id,
  GET_MOMENT: (currentTime = new Date().getTime()) => currentTime,
  TOGGLE_MODAL_VISIBILITY: () => {},
  TOGGLE_FILTER_SAVE_MODAL_VISIBILITY: () => {},
  TOGGLE_ITEM_LIST_TOOL_TIP_VISIBILITY: flg => flg,
  SAVE_TAG: () => {},
  SET_ID_SELECTED: id => id,
  SET_MENU_TAB_SELECTED: menuTab => menuTab,
  SET_KEYBOARD_HANDLER: () => {},
  SET_ITEM_TAG: itemTag => itemTag,
  SET_ITEM_REMOVED: id => id,
  SET_ITEM_DISPLAY_RANGE: range => range,
  SET_ITEM_TAG_HEIGHT: itemTagHeight => itemTagHeight,
  SET_ITEM_LIST_REF: ref => ref,
  SET_SCROLL_TO_ROW: scrollToRow => scrollToRow,
  SET_FOCUS_ITEM_LIST: focus => focus,
  SET_ITEM_TEXT: item => item,
  SET_SCROLL_TOP: scrollTop => scrollTop,
  SET_DATA_TYPE_OPTIONS_SELECTED: options => options,
  SET_LANG_OPTIONS_SELECTED: options => options,
  SET_IDS_FROM_DATASTORE: () => {},
  // Sort --------------------------------------------------------
  SET_SORT_OPTIONS: options => options,
  // Filter by keyword --------------------------------------------
  ADD_KEYWORD_FILTER_OPTIONS: value => value,
  REMOVE_KEYWORD_FILTER_OPTIONS: value => value,
  CHANGE_KEYWORD_FILTER_INPUT_VALUE: value => value,
  // Filter by id --------------------------------------------
  ADD_ID_FILTER_OPTIONS: value => value,
  REMOVE_ID_FILTER_OPTIONS: value => value,
  CHANGE_ID_FILTER_INPUT_VALUE: value => value,
  // Set item status by hash tag ----------------------------------
  SET_HASH_TAG_INPUT_VALUE: value => value,
  ADD_HASH_TAG_VALUE: value => value,
  CHANGE_HASH_TAG_VALUE: value => value,
  // Filter by data type -----------------------------------------
  SET_DATA_TYPE_FILTER_OPTIONS: options => options,
  // Filter by status --------------------------------------------
  SET_STATUS_FILTER_OPTIONS: options => options,
  // Filter by language --------------------------------------------
  SET_LANGUAGE_FILTER_OPTIONS: options => options,
  // Filter by hot key -------------------------------------------
  SET_HOT_KEY_FILTER_OPTIONS: options => options,
  ADD_HOT_KEY_FILTER_OPTIONS: options => options,
  CHANGE_HOT_KEY_FILTER_INPUT_VALUE: value => value,
  // Filter by hash tag -------------------------------------------
  SET_HASH_TAG_FILTER_OPTIONS: options => options,
  ADD_HASH_TAG_FILTER_OPTIONS: options => options,
  CHANGE_HASH_TAG_FILTER_INPUT_VALUE: value => value,
  // Set item status by hot key ------------------------------------
  SET_KEY_INPUT_VALUE: value => value,
  ADD_KEY_VALUE: value => value,
  CHANGE_KEY_VALUE: value => value,
  CALL_ACTION_ON_ITEM_LIST: command => command,
  UPDATE_TEXT_LANG: lang => lang,
  UPDATE_KEY: key => key,
  UPDATE_TAG: tag => tag,
  STORE_ITEM_ON_MODAL_OPEN: () => {},
  RESTORE_ITEM_ON_CANCEL: () => {},
  SET_ACTION_SELECTED: actionSelected => actionSelected,
  INCREMENT: (amount = 1) => ({ amount }),
  DECREMENT: (amount = 1) => ({ amount: -amount })
});
