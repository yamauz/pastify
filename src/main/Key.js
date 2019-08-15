const { globalShortcut } = require("electron");
const ioHook = require("../util/iohook");

module.exports = class Key {
  constructor(win) {
    ioHook.start();
    this.win = win;
    this.pressed = false;
    this.key = {
      SHIFT: 42
    };
  }

  register(modifier, key) {
    const keyEvent = `_on_${modifier}${key}`;
    // call each key event
    this[keyEvent]();
  }

  _on_shift() {
    const DURATION = 500;
    ioHook.on("keyup", e => {
      if (e.keycode === this.key.SHIFT) {
        if (!this.pressed) {
          this.pressed = true;
          setTimeout(() => {
            this.pressed = false;
          }, DURATION);
        } else {
          this.win.foreground();
        }
      }
    });
  }

  _on_altF11() {
    globalShortcut.register("alt+F11", () => {
      this.win.show();
      this.win.focus();
    });
  }

  _on_ctrla() {
    globalShortcut.register("ctrl+a", () => {
      this.win.showLastActiveWindow();
    });
  }
};
