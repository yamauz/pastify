const { Tray, Menu, nativeImage } = require("electron");
const robot = require("robotjs");
const distDir = process.env.PORTABLE_EXECUTABLE_DIR || ".";
const path = require("path");

module.exports = class PastifyTray {
  constructor(settings) {
    this.settings = settings;
    this.trayPath = path.join(distDir, "src/icon/icon.png");
    this.icon = nativeImage.createFromPath(this.trayPath);
    this.tray = new Tray(this.icon);
    this.tray.setToolTip("Pastify");
    this.contextMenu = this._createContextMenu();
    this.tray.setContextMenu(this.contextMenu);
  }

  _createContextMenu() {
    return Menu.buildFromTemplate([
      {
        label: "Open",
        type: "normal",
        click: menu => {
          robot.keyTap("f11", "alt");
        }
      },
      {
        label: "Pause",
        type: "checkbox",
        click: menu => {
          const disableClipListener = menu.checked;
          this.settings.updatePreferences({ disableClipListener });
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
