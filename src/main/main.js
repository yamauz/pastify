const { app } = require("electron");
const Window = require("./Window");
const Key = require("./Key");
const ClipboardListener = require("./ClipboardListener");
const ClipboardFormatFinder = require("./ClipboardFormatFinder");
const ClipboardExtractor = require("./ClipboardExtractor");
const Pastify = require("./Pastify");
//DB
const DataStore = require("./DataStore");
const Filters = require("./Filters");
const Settings = require("./Settings");

app.on("ready", () => {
  const clipboardListener = new ClipboardListener();
  const clipboardFormatFinder = new ClipboardFormatFinder();
  const dataStore = new DataStore();
  const filters = new Filters();
  const settings = new Settings();
  const pastify = new Pastify();
  const win = new Window(settings);
  const key = new Key(win);
  key.register("shift", "");
  key.register("alt", "F11");
  // key.register("ctrl", "a");
  const instances = { dataStore, filters, settings, pastify, win, key };
  win.setIpcListener(instances);
  win.setEventListener(settings);
  win.open(settings);

  clipboardListener.subscribe((hwnd, uMsg, wParam, lParam) => {
    // check the condition of clipboard listener
    if (uMsg !== 797) return;
    if (wParam === 0) return;
    if (pastify.isCopiedBySelf) {
      pastify.isCopiedBySelf = false;
      return;
    }

    const validFormats = clipboardFormatFinder.getFormat();
    // check if array of clipboard format is not empty
    if (!validFormats || !validFormats.length) return;

    const clipboardExtractor = new ClipboardExtractor();
    clipboardExtractor.extract(validFormats, settings);

    const copiedData = {
      format: validFormats[0],
      extracts: clipboardExtractor.extractDataList
    };
    const blocking = pastify.checkBlockCopying(copiedData, settings);

    if (blocking) {
      console.log("blocking by user filter");
      return;
    }
    dataStore.createByCopy(copiedData, win);
  });
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {});
