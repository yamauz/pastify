const { Tray, Menu, nativeImage } = require("electron");
const distDir = process.env.PORTABLE_EXECUTABLE_DIR || ".";
const path = require("path");

module.exports = class PastifyTray {
  constructor() {
    this.trayPath = path.join(distDir, "src/icon/icon.png");
    this.icon = nativeImage.createFromPath(this.trayPath);
    this.tray = new Tray(this.icon);
    this.contextMenu = Menu.buildFromTemplate([
      { label: "xxxxx", type: "normal" },
      { label: "Item2", type: "normal" },
      { label: "Item3", type: "normal" },
      { label: "Pause", type: "checkbox", checked: true }
    ]);
    this.tray.setToolTip("This is my application.");
    this.tray.setContextMenu(this.contextMenu);
    console.log("tray class created..");
  }
};
