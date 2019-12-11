const { app, ipcMain } = require("electron");
const robot = require("robotjs");
const Window = require("./Window");
const Key = require("./Key");
const ClipboardListener = require("./ClipboardListener");
const ClipboardFormatFinder = require("./ClipboardFormatFinder");
const ClipboardExtractor = require("./ClipboardExtractor");
const RendererListener = require("./RendererListener");
const CF = require("./CF");
const ProcessBridge = require("./ProcessBridge");
const Pastify = require("./Pastify");

//DB
const DataStore = require("./DataStore");
const Filters = require("./Filters");
const Settings = require("./Settings");

let isCopiedSelf = false;

app.on("ready", () => {
  const clipboardListener = new ClipboardListener();
  const clipboardFormatFinder = new ClipboardFormatFinder();
  const dataStore = new DataStore();
  const filters = new Filters();
  const settings = new Settings();
  const processBridge = new ProcessBridge();
  const rendererListener = new RendererListener();

  const instances = { dataStore, filters, settings };

  rendererListener.subscribe(instances);

  const win = new Window(settings);
  win.setEventListener(settings);
  win.open(settings);

  const key = new Key(win);
  key.register("shift", "");
  key.register("alt", "F11");
  // key.register("ctrl", "a");

  ipcMain.on("ON_LOAD_ITEM_FIRST", (event, arg) => {
    const dataTimeLine = dataStore.initialLoad();
    processBridge.sendItemToRenderer(dataTimeLine, itemToRenderer => {
      event.returnValue = itemToRenderer;
    });
  });
  ipcMain.on("ON_LOAD_FILTER_FIRST", event => {
    const filter = filters.initialLoad();
    processBridge.sendFiltersToRenderer(filter, itemToRenderer => {
      event.returnValue = itemToRenderer;
    });
  });
  ipcMain.on("GET_IDS", (event, arg) => {
    // const sortSettings = settings.getSortSettings();
    // const filterSettings = settings.getFilterSettings();
    const filterParam = settings.createFilterParam();
    const ids = dataStore.getIds3(filterParam);
    event.returnValue = ids;
  });
  ipcMain.on("GET_WIN_SETTINGS", event => {
    const options = settings.getWinSettings();
    event.returnValue = options;
  });
  ipcMain.on("SET_WIN_SETTINGS", (event, winSettings) => {
    settings.setWinSettings(winSettings);
    win.setWinSettings(winSettings);
    event.returnValue = null;
  });
  ipcMain.on("MINIMIZE_WINDOW", event => {
    win.minimizeWindow();
    event.returnValue = null;
  });
  ipcMain.on("MAXIMIZE_WINDOW", event => {
    win.maximizeWindow();
    event.returnValue = null;
  });
  ipcMain.on("GET_FILTER_SORT_OPTIONS_SELECTED", event => {
    const options = settings.getFilterSortOptions();
    event.returnValue = options;
  });
  ipcMain.on("GET_HASH_TAG_OPTIONS", event => {
    const hashTagOptions = dataStore.getHashTagOptions();
    event.returnValue = hashTagOptions;
  });
  ipcMain.on("GET_KEY_OPTIONS", event => {
    const keyOptions = dataStore.getKeyOptions();
    event.returnValue = keyOptions;
  });
  ipcMain.on("GET_IDS3", (event, filterOpt) => {
    settings.setFilterOptions(filterOpt);
    const filterParam = settings.createFilterParam();
    const ids = dataStore.getIds3(filterParam);

    // const ids = dataStore.getIds3(sortSettings, filterSettings);
    event.returnValue = ids;
  });
  ipcMain.on(
    "SAVE_FILTER_SETTINGS",
    (event, filterName, filterShortcutKeyOpt) => {
      const id = filters.saveFilterSettings(filterName, filterShortcutKeyOpt);
      event.returnValue = id;
    }
  );
  ipcMain.on("UPDATE_ITEMS", (event, id, value) => {
    if (Array.isArray(id)) {
      id.forEach(i => {
        dataStore.update(i, value);
      });
    } else {
      dataStore.update(id, value);
    }
    event.returnValue = null;
  });
  // ipcMain.on("GET_ITEM", (event, id) => {
  //   const item = dataStore.getItem("TIME_LINE", id);
  //   event.returnValue = item;
  // });
  ipcMain.on("ADD_NEW_ITEM", (event, addMode) => {
    const pastify = new Pastify("TEXT", new Map([["TEXT", ""]]));
    const dataTimeLine = pastify.createPastifyData();
    dataStore.write(dataTimeLine);
    processBridge.sendItemToRenderer([dataTimeLine], itemToRenderer => {
      win.sendToRenderer("ON_COPY", itemToRenderer, addMode);
    });
    event.returnValue = null;
  });
  ipcMain.on("PASTE_ITEM", (event, { id, mode }) => {
    isCopiedSelf = true;
    const text = dataStore.getTextById(id);
    CF.get("TEXT").write(text);
    win.showLastActiveWindow(settings);
    robot.keyTap("v", "control");

    if (mode === "RETURN") win.focus();

    event.returnValue = null;
  });

  clipboardListener.subscribe((hwnd, uMsg, wParam, lParam) => {
    // check the condition of clipboard listener
    if (uMsg !== 797) return;
    if (wParam === 0) return;
    if (isCopiedSelf) {
      isCopiedSelf = false;
      return;
    }

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
    const addMode = "AUTO";
    dataStore.write(dataTimeLine);
    processBridge.sendItemToRenderer([dataTimeLine], itemToRenderer => {
      win.sendToRenderer("ON_COPY", itemToRenderer, addMode);
    });
  });
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {});
