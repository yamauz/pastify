const { Tray, Menu, nativeImage } = require("electron");
const robot = require("robotjs");
const distDir = process.env.PORTABLE_EXECUTABLE_DIR || ".";
const path = require("path");
const { APP_DIR, TRAY_ICON_PATH } = require("../common/settings");
const { APP_ICON } = require("../common/imageDataUrl");

module.exports = class PastifyTray {
  constructor(settings, win) {
    this.settings = settings;
    this.win = win;
    this.trayPath = path.join(distDir, "src/icon/icon_on.ico");
    this.icon = nativeImage.createFromPath(this.trayPath);

    this.iconOnImage = nativeImage.createFromDataURL(APP_ICON.LISTENER_ON);
    this.iconOFFImage = nativeImage.createFromDataURL(APP_ICON.LISTENER_OFF);
    this.tray = new Tray(this.iconOnImage);

    // this.tray = new Tray(this.icon);
    this.tray.setToolTip("Pastify");
    this.contextMenu = this._createContextMenu();
    this.tray.setContextMenu(this.contextMenu);
    this._setEvents();
  }

  togglePause() {
    // const nextBool = !this.contextMenu.items[1].checked;
    const nextBool = !this.settings.disableClipListener;
    this.contextMenu.items[1].checked = nextBool;
    this.settings.disableClipListener = nextBool;

    const _iamge = nextBool ? this.iconOFFImage : this.iconOnImage;
    this.tray.setImage(_iamge);
    // this.trayPath = nextBool ? TRAY_ICON_PATH.off : TRAY_ICON_PATH.on;
    // this.tray.setImage(path.join(APP_DIR, this.trayPath));

    this.win.sendToRenderer("useIpc", "DISABLE_PASTIFY", {
      disableClipListener: nextBool
    });
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
          // this.settings.disableClipListener = menu.checked;
          this.togglePause();
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
