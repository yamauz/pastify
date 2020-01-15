const { globalShortcut } = require("electron");
const ioHook = require("../util/iohook");
const robot = require("robotjs");

module.exports = class Key {
  constructor(win) {
    ioHook.start();
    this.win = win;
    this.pressed = false;
    this.key = {
      SHIFT: 42,
      CTRL: 29,
      ALT: 56
    };
    this.shiftKey = false;
    this.ctrlKey = false;
    this.altKey = false;
  }

  register(modifier, key) {
    const keyEvent = `_on_${modifier}${key}`;
    this[keyEvent]();
  }

  getModifierKey() {
    const keys = {
      shiftKey: this.shiftKey,
      altKey: this.altKey,
      ctrlKey: this.ctrlKey
    };
    return keys;
  }

  _on_shift() {
    const DURATION = 300;
    ioHook.on("keyup", e => {
      switch (e.keycode) {
        case this.key.SHIFT:
          this.shiftKey = false;
          if (!this.pressed) {
            this.pressed = true;
            setTimeout(() => {
              this.pressed = false;
            }, DURATION);
          } else {
            this.win.show();
            robot.keyTap("f11", "alt");
            // this.win.focus();
            // this.win.foreground();
          }
          break;
        case this.key.CTRL:
          this.ctrlKey = false;
          break;
        case this.key.ALT:
          this.altKey = false;
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

  _on_altF11() {
    globalShortcut.register("alt+F11", () => {
      // this.win.show();
      this.win.foreground();
      // this.win.focus();
    });
  }

  _on_ctrla() {
    globalShortcut.register("ctrl+a", () => {
      this.win.showLastActiveWindow();
    });
  }
};
