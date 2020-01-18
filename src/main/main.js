const { app } = require("electron");
const path = require("path");
const fs = require("fs");
const Window = require("./Window");
const Key = require("./Key");
const ClipboardListener = require("./ClipboardListener");
const ClipboardFormatFinder = require("./ClipboardFormatFinder");
const ClipboardExtractor = require("./ClipboardExtractor");
const Pastify = require("./Pastify");
const PastifyTray = require("./PastifyTray");
//DB
const DataStore = require("./DataStore");
const Filters = require("./Filters");
const Settings = require("./Settings");
const distDir = process.env.PORTABLE_EXECUTABLE_DIR || ".";
let tray;

app.on("ready", () => {
  createResoucePath();
  const clipboardListener = new ClipboardListener();
  const clipboardFormatFinder = new ClipboardFormatFinder();
  const settings = new Settings();
  const dataStore = new DataStore(settings);
  const filters = new Filters();
  const pastify = new Pastify();
  const win = new Window(settings);
  tray = new PastifyTray(settings);
  const key = new Key(win, settings);
  key.register("shift", "", settings);
  key.register("super", "F12"); // win + f12
  // key.register("ctrl", "a");
  const instances = { dataStore, filters, settings, pastify, win, key };
  win.setIpcListener(instances);
  win.setEventListener(settings, key);
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
    if (blocking) return;

    dataStore.createByCopy(copiedData, win);
  });
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    console.log("quit");
    app.quit();
  }
});

app.on("activate", () => {});

const createResoucePath = () => {
  const resourcePath = path.resolve(distDir, "resource");
  const tempPath = path.resolve(resourcePath, "temp");
  const imagesPath = path.resolve(tempPath, "images");
  const filesPath = path.resolve(tempPath, "files");
  const exportPath = path.resolve(tempPath, "export");
  const importPath = path.resolve(tempPath, "import");
  const exportImagePath = path.resolve(exportPath, "images");
  if (!fs.existsSync(resourcePath)) {
    fs.mkdirSync(resourcePath);
  }
  if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath);
  }
  if (!fs.existsSync(imagesPath)) {
    fs.mkdirSync(imagesPath);
  }
  if (!fs.existsSync(filesPath)) {
    fs.mkdirSync(filesPath);
  }
  if (!fs.existsSync(exportPath)) {
    fs.mkdirSync(exportPath);
    if (!fs.existsSync(exportImagePath)) {
      fs.mkdirSync(exportImagePath);
    }
  }
  if (!fs.existsSync(importPath)) {
    fs.mkdirSync(importPath);
  }
  return resourcePath;
};
