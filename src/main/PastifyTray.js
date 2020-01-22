const { Tray, Menu, nativeImage } = require("electron");
const robot = require("robotjs");
const distDir = process.env.PORTABLE_EXECUTABLE_DIR || ".";
const path = require("path");

module.exports = class PastifyTray {
  constructor(settings, win) {
    this.settings = settings;
    this.win = win;
    this.trayPath = path.join(distDir, "src/icon/icon.png");
    this.icon = nativeImage.createFromPath(this.trayPath);
    this.tray = new Tray(this.icon);
    this.tray.setToolTip("Pastify");
    this.contextMenu = this._createContextMenu();
    this.tray.setContextMenu(this.contextMenu);
    this._setEvents();
  }

  _setEvents() {
    this.tray.on("double-click", () => {
      this.win.showPastify();
    });
  }

  _createContextMenu() {
    return Menu.buildFromTemplate([
      {
        label: "Open",
        type: "normal",
        click: menu => {
          robot.keyTap("f12", "command");
        }
      },
      {
        label: "Pause",
        type: "checkbox",
        click: menu => {
          this.settings.disableClipListener = menu.checked;
        }
      },
      {
        label: "Exit",
        type: "normal",
        role: "quit"
      }
    ]);
  }
};
