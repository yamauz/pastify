const { app, ipcMain } = require("electron");
const Window = require("./Window");
const Key = require("./Key");
const ClipboardListener = require("./ClipboardListener");
const ClipboardFormatFinder = require("./ClipboardFormatFinder");
const ClipboardExtractor = require("./ClipboardExtractor");
const ProcessBridge = require("./ProcessBridge");
const Pastify = require("./Pastify");
const DataStore = require("./DataStore");
const Settings = require("./Settings");

app.on("ready", () => {
  const win = new Window();
  win.open();

  const key = new Key(win);
  // key.register("shift", "");
  key.register("alt", "F11");
  // key.register("ctrl", "a");

  const clipboardListener = new ClipboardListener();
  const clipboardFormatFinder = new ClipboardFormatFinder();
  const dataStore = new DataStore();
  const settings = new Settings();
  const processBridge = new ProcessBridge();

  ipcMain.on("ON_LOAD_FIRST", (event, arg) => {
    const dataTimeLine = dataStore.initialLoad("TIME_LINE");
    processBridge.sendItemToRenderer(dataTimeLine, itemToRenderer => {
      event.returnValue = itemToRenderer;
    });
  });
  ipcMain.on("GET_IDS", (event, arg) => {
    const sortSettings = settings.getSortSettings("CURRENT");
    const filterSettings = settings.getFilterSettings("CURRENT");
    const ids = dataStore.getIds3("TIME_LINE", sortSettings, filterSettings);
    event.returnValue = ids;
  });
  ipcMain.on("GET_FILTER_SORT_OPTIONS_SELECTED", event => {
    const options = settings.getFilterSortOptions("CURRENT");
    event.returnValue = options;
  });
  ipcMain.on("GET_HASH_TAG_OPTIONS", event => {
    const hashTagOptions = dataStore.getHashTagOptions("TIME_LINE");
    event.returnValue = hashTagOptions;
  });
  ipcMain.on("GET_KEY_OPTIONS", event => {
    const keyOptions = dataStore.getKeyOptions("TIME_LINE");
    event.returnValue = keyOptions;
  });
  // ipcMain.on("GET_IDS2", (event, sortOpt) => {
  //   const ids = dataStore.getIds2("TIME_LINE", sortOpt);
  //   event.returnValue = ids;
  // });
  ipcMain.on("GET_IDS3", (event, sortOpt, filterOpt) => {
    settings.setSortOptions("CURRENT", sortOpt);
    const sortSettings = settings.getSortSettings("CURRENT");

    settings.setFilterOptions("CURRENT", filterOpt);
    const filterSettings = settings.getFilterSettings("CURRENT");

    const ids = dataStore.getIds3("TIME_LINE", sortSettings, filterSettings);
    event.returnValue = ids;
  });
  ipcMain.on("UPDATE_ITEMS", (event, id, value) => {
    if (Array.isArray(id)) {
      id.forEach(i => {
        dataStore.update("TIME_LINE", i, value);
      });
    } else {
      dataStore.update("TIME_LINE", id, value);
    }
    event.returnValue = null;
  });
  // ipcMain.on("GET_ITEM", (event, id) => {
  //   const item = dataStore.getItem("TIME_LINE", id);
  //   event.returnValue = item;
  // });
  ipcMain.on("ADD_NEW_ITEM", event => {
    const pastify = new Pastify("TEXT", new Map([["TEXT", ""]]));
    const dataTimeLine = pastify.createPastifyData();
    dataStore.write("TIME_LINE", dataTimeLine);
    processBridge.sendItemToRenderer([dataTimeLine], itemToRenderer => {
      win.sendToRenderer("ON_COPY", itemToRenderer);
    });
    event.returnValue = null;
  });
  // ipcMain.on("ITEM_ID_TO_BE_DELETED", (event, idList) => {
  //   dataStore.delete("TIME_LINE", idList);
  //   event.returnValue = null;
  // });
  // ipcMain.on("ON_MODAL_CLOSED", (event, id) => {
  //   win.sendToRenderer("ON_MODAL_CLOSED", id);
  // });

  clipboardListener.subscribe((hwnd, uMsg, wParam, lParam) => {
    // check the condition of clipboard listener
    if (uMsg !== 797) return;
    if (wParam === 0) return;

    const validFormats = clipboardFormatFinder.getFormat();

    // check array of clipboard format is empty
    if (!validFormats || !validFormats.length) return;

    const clipboardExtractor = new ClipboardExtractor();
    clipboardExtractor.extract(validFormats);

    const pastify = new Pastify(
      validFormats[0], //main format
      clipboardExtractor.extractDataList
    );
    const dataTimeLine = pastify.createPastifyData();
    dataStore.write("TIME_LINE", dataTimeLine);
    processBridge.sendItemToRenderer([dataTimeLine], itemToRenderer => {
      win.sendToRenderer("ON_COPY", itemToRenderer);
    });
  });
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => { });