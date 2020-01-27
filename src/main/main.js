const { app, clipboard } = require("electron");
const colors = require("colors");
const path = require("path");
const fs = require("fs");
const del = require("del");
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
  const resoucePath = createResoucePath();
  const clipboardListener = new ClipboardListener(app);
  const clipboardFormatFinder = new ClipboardFormatFinder();
  const settings = new Settings();
  const dataStore = new DataStore(settings);
  const filters = new Filters();
  const pastify = new Pastify();
  const win = new Window(settings);
  tray = new PastifyTray(settings, win);
  const key = new Key(win, settings, tray);
  key.register("shift", "", settings);
  key.register("super", "F12"); // win + f12
  key.register("alt", "F1"); //
  // key.register("ctrl", "a");
  const instances = { dataStore, filters, settings, pastify, win, key };
  win.setIpcListener(instances);
  win.setEventListener(settings, key);
  deleteResouces(resoucePath, dataStore);
  win.open(settings);

  clipboardListener.subscribe((hwnd, uMsg, wParam, lParam) => {
    // check the condition of clipboard listener
    if (uMsg !== 797) return;
    if (wParam === 0) return;

    // send Renderer to show current clipboard text contents
    win.sendToRenderer("useIpc", "CURRENT_CLIPBOARD", {
      currentClipboardText: clipboard.readText()
    });

    if (pastify.isCopiedBySelf) {
      console.log("Blocked because saved clipboard self");
      pastify.isCopiedBySelf = false;
      return;
    }
    if (win.checkCopiedSelf()) return;

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
  const exportImagePath = path.resolve(exportPath, "images");
  const importPath = path.resolve(tempPath, "import");
  const importImagePath = path.resolve(importPath, "images");
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
    if (!fs.existsSync(importImagePath)) {
      fs.mkdirSync(importImagePath);
    }
  }
  return {
    resourcePath,
    tempPath,
    imagesPath,
    filesPath,
    exportPath,
    exportImagePath,
    importPath,
    importImagePath
  };
};

const deleteResouces = (rPath, dataStore) => {
  (async () => {
    const imageFiles = fs.readdirSync(rPath.imagesPath);
    const clipIds = dataStore.readAllIds();
    const idsDelete = imageFiles.filter(id => !clipIds.includes(id));
    const deletedFilePaths = await del(
      [
        path.resolve(rPath.importPath, "export.json"),
        path.resolve(rPath.importImagePath, "*"),
        path.resolve(rPath.exportPath, "export.json"),
        path.resolve(rPath.exportImagePath, "*"),
        path.resolve(rPath.filesPath, "*")
      ].concat(idsDelete.map(id => path.resolve(rPath.imagesPath, id)))
    );
    console.log(colors.info("Deleted files:\n", deletedFilePaths.join("\n")));
  })();
  return;
};
