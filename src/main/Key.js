const { globalShortcut } = require("electron");
const ioHook = require("../util/iohook");
const robot = require("robotjs");
const { LAUNCH_KEY_DURATION } = require("../common/settings");

module.exports = class Key {
  constructor(win, settings, tray) {
    ioHook.start();
    this.win = win;
    this.settings = settings;
    this.tray = tray;
    this.pressed = false;
    this.shiftFirstPressed = false;
    this.ctrlFirstPressed = false;
    this.altFirstPressed = false;
    this.key = {
      SHIFT: 42,
      CTRL: 29,
      ALT: 56
    };
    this.shiftKey = false;
    this.ctrlKey = false;
    this.altKey = false;
    this.launchCommand = "";
  }

  register(modifier, key, settings) {
    const keyEvent = `_on_${modifier}${key}`;
    this[keyEvent](settings);
  }

  getModifierKey() {
    const keys = {
      shiftKey: this.shiftKey,
      altKey: this.altKey,
      ctrlKey: this.ctrlKey
    };
    return keys;
  }

  _on_shift(settings) {
    let DURATION;
    ioHook.on("keyup", e => {
      switch (e.keycode) {
        case this.key.SHIFT:
          DURATION = this._setDuration(settings);
          this.shiftKey = false;
          if (!this.shiftFirstPressed) {
            this.shiftFirstPressed = true;
            setTimeout(() => {
              this.shiftFirstPressed = false;
            }, DURATION);
          } else {
            this._setLaunchCommand("shift");
            robot.keyTap("f12", "command");
          }
          break;
        case this.key.CTRL:
          this.ctrlKey = false;
          DURATION = this._setDuration(settings);
          if (!this.ctrlFirstPressed) {
            this.ctrlFirstPressed = true;
            setTimeout(() => {
              this.ctrlFirstPressed = false;
            }, DURATION);
          } else {
            this._setLaunchCommand("ctrl");
            robot.keyTap("f12", "command");
          }
          break;
        case this.key.ALT:
          this.altKey = false;
          DURATION = this._setDuration(settings);
          if (!this.altFirstPressed) {
            this.altFirstPressed = true;
            setTimeout(() => {
              this.altFirstPressed = false;
            }, DURATION);
          } else {
            this._setLaunchCommand("alt");
            robot.keyTap("f12", "command");
          }
          break;
        default:
          break;
      }
    });
    ioHook.on("keydown", e => {
      switch (e.keycode) {
        case this.key.SHIFT:
          this.shiftKey = true;
          break;
        case this.key.CTRL:
          this.ctrlKey = true;
          break;
        case this.key.ALT:
          this.altKey = true;
          break;
        default:
          break;
      }
    });
  }

  _on_superF12() {
    const launchKeys = [
      "Super+F12",
      "Shift+Super+F12",
      "Ctrl+Super+F12",
      "Alt+Super+F12"
    ];
    // win + f12
    launchKeys.forEach(key => {
      globalShortcut.register(key, () => {
        const { launchKeyOpt } = this.settings.readPreferences();
        if (this.launchCommand === launchKeyOpt.value) {
          this.win.showPastify(this.launchCommand);
        }
      });
    });
  }

  _on_ctrla() {
    globalShortcut.register("ctrl+a", () => {
      // this.win.showLastActiveWindow();
      console.log("test");
    });
  }
  _on_altF1() {
    globalShortcut.register("Alt+F1", () => {
      this.tray.togglePause();
    });
  }

  _setDuration(settings) {
    const { launchKeyDuration } = settings.readPreferences();
    const duration =
      launchKeyDuration === "" ? LAUNCH_KEY_DURATION : launchKeyDuration;
    return duration;
  }

  _setLaunchCommand(baseKey) {
    let _modKeys;
    switch (baseKey) {
      case "shift":
        _modKeys = ["ctrlKey", "altKey"];
        break;
      case "ctrl":
        _modKeys = ["shiftKey", "altKey"];
        break;
      case "alt":
        _modKeys = ["shiftKey", "ctrlKey"];
        break;
      default:
        break;
    }
    if (!this[_modKeys[0]] && this[_modKeys[1]]) {
      this.launchCommand = `${baseKey}-double-with-${_modKeys[1]}`;
    } else if (this[_modKeys[0]] && !this[_modKeys[1]]) {
      this.launchCommand = `${baseKey}-double-with-${_modKeys[0]}`;
    } else {
      this.launchCommand = `${baseKey}-double`;
    }
  }
};
