const ffi = require("ffi");
const ref = require("ref");
const { ipcMain } = require("electron");
const { WIDTH_UNFOLD } = require("../common/settings");
const _ = require("lodash");
const { BrowserWindow } = require("electron");
const user32 = new ffi.Library("user32", {
  GetActiveWindow: ["pointer", []],
  GetWindow: ["pointer", ["pointer", "int32"]],
  GetParent: ["pointer", ["pointer"]],
  GetDesktopWindow: ["pointer", []],
  GetShellWindow: ["pointer", []],
  GetClassNameW: ["int32", ["pointer", "pointer", "uint32"]],
  BringWindowToTop: ["bool", ["pointer"]],
  FindWindowA: ["pointer", ["string", "string"]],
  AttachThreadInput: ["bool", ["int", "long", "bool"]],
  SetWindowPos: [
    "bool",
    ["pointer", "int", "int", "int", "int", "int", "uint"]
  ],
  GetForegroundWindow: ["pointer", []],
  GetWindowThreadProcessId: ["uint32", ["pointer", "pointer"]],
  SetForegroundWindow: ["bool", ["pointer"]]
});
const kernel32 = new ffi.Library("kernel32", {
  GetCurrentThreadId: ["uint32", []]
});

module.exports = class Window {
  constructor(settings) {
    const {
      alwaysOnTop,
      width,
      minWidth,
      height,
      x,
      y,
      isMaximized
    } = settings.readWin();

    this.window = new BrowserWindow({
      title: "Pastify",
      skipTaskbar: true,
      x,
      y,
      width,
      height,
      minWidth,
      minHeight: 500,
      frame: false,
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        experimentalFeatures: true,
        blinkFeatures: "CSSBackdropFilter"
      },
      alwaysOnTop
    });
    this.window.setMenu(null);

    if (isMaximized) {
      this.window.maximize();
    }

    this.lastActiveWindowClassName = this._getCurrentWindowClassName();
    this.prevWidth = settings.readWin().width;
    this.isResizedByFolding = false;
  }
  open() {
    const MODE = process.env.NODE_ENV;
    // Check running mode by NODE_ENV
    if (MODE === "development") {
      this.window.loadURL("http://localhost:8080");
    } else {
      this.window.loadFile("./dist/index.html");
    }
    console.log(`running on ${MODE} mode...`);

    this.hide();
    this._openDevTools();
  }

  setIpcListener(instance) {
    const { dataStore, settings, filters, pastify, win, key } = instance;
    ipcMain.on("useIpc", (event, msg) => {
      event.returnValue = eval(msg.DB)[msg.command](msg.args, instance);
    });
  }

  setEventListener(settings, key) {
    this.window.on("focus", () => {
      this.sendToRenderer("useIpc", "FOCUS");
    });
    this.window.on("blur", () => {
      const { alwaysOnTop } = settings.readWin();
      if (!alwaysOnTop && !key.shiftKey) {
        this.hide();
      } else {
        this.sendToRenderer("useIpc", "BLUR");
      }
    });
    this.window.on("always-on-top-changed", () => {
      settings.updateWin({ alwaysOnTop: !this.window.isAlwaysOnTop() });
      this.sendToRenderer("useIpc", "ALWAYS_ON_TOP_CHANGED");
    });
    this.window.on("maximize", () => {
      settings.updateWin({ isMaximized: true });
      this.sendToRenderer("useIpc", "MAXIMIZE");
    });
    this.window.on("unmaximize", () => {
      settings.updateWin({ isMaximized: false });
      const { width, height } = settings.readWin();
      this.window.setSize(width, height);
      this.sendToRenderer("useIpc", "UNMAXIMIZE");
    });
    this.window.on("will-resize", (e, newBounds) => {
      this.prevWidth = newBounds.width;
    });
    this.window.on(
      "resize",
      _.debounce(() => {
        if (!this.window.isMaximized()) {
          const [width, height] = this.window.getSize();
          const { minWidth } = settings.readWin();
          if (this.isResizedByFolding) {
            settings.updateWin({ width, height });
          } else {
            const widthUnfold =
              this.prevWidth < WIDTH_UNFOLD ? WIDTH_UNFOLD : width;
            settings.updateWin({ width, height, widthUnfold });
          }
          this.isResizedByFolding = false;
          const isFold = width === minWidth ? true : false;
          this.sendToRenderer("useIpc", "RESIZE", { isFold });
          settings.updateWin({ isFold });
        }
      }, 100)
    );
    this.window.on(
      "move",
      _.debounce(() => {
        if (!this.window.isMaximized()) {
          const x = this.window.getPosition()[0];
          const y = this.window.getPosition()[1];
          settings.updateWin({ x, y });
        }
      }, 200)
    );

    this.window.on("closed", () => {
      console.log("onClosed");
      win = null;
    });
  }

  updateWinState(state, { settings }) {
    switch (state) {
      case "foldWindow": {
        const { minWidth } = settings.readWin();
        const [_, height] = this.window.getSize();
        this.isResizedByFolding = true;
        this.window.setSize(minWidth, height);
        break;
      }
      case "unfoldWindow": {
        const { widthUnfold } = settings.readWin();
        const [_, height] = this.window.getSize();
        this.window.setSize(widthUnfold, height);
        break;
      }
      case "hide":
        this.window.hide();
        break;
      case "alwaysOnTop":
        this.window.setAlwaysOnTop(!this.window.isAlwaysOnTop());
        break;
      case "minimize":
        this.window.minimize();
        break;
      case "maximize":
        if (this.window.isMaximized()) {
          this.window.unmaximize();
        } else {
          this.window.maximize();
        }
        break;
      default:
        break;
    }
    return null;
  }

  _openDevTools() {
    // loadDevtool(loadDevtool.REDUX_DEVTOOLS);
    // loadDevtool(loadDevtool.REACT_DEVELOPER_TOOLS);
    // installExtension(REACT_DEVELOPER_TOOLS)
    //   .then(name => console.log(`Added Extension:  ${name}`))
    //   .catch(err => console.log("An error occurred: ", err));
    this.window.webContents.openDevTools();
  }

  sendToRenderer(event, useIpc, triger, arg) {
    this.window.webContents.send(event, useIpc, triger, arg);
  }

  show() {
    this.window.show();
  }
  hide() {
    this.window.hide();
  }

  focus() {
    this.window.focus();
  }

  foreground() {
    this.lastActiveWindowClassName = this._getCurrentWindowClassName();
    this.window.setSkipTaskbar(false);
    const foregroundHWnd = user32.GetForegroundWindow();
    const currentThreadId = kernel32.GetCurrentThreadId();
    const windowThreadProcessId = user32.GetWindowThreadProcessId(
      foregroundHWnd,
      null
    );
    user32.AttachThreadInput(windowThreadProcessId, currentThreadId, 1);
    user32.AttachThreadInput(windowThreadProcessId, currentThreadId, 0);
    this.window.setSkipTaskbar(true);

    // robot.keyTap("f11", "alt");
    this.window.focus();
    this.sendToRenderer("useIpc", "SHOW");
  }

  showLastActiveWindow(settings) {
    const { alwaysOnTop } = settings.readWin();
    const desktopClassName = ["Progman", "WorkerW"];

    this.window.setSkipTaskbar(false);
    if (alwaysOnTop) {
      this.window.setAlwaysOnTop(false);
    }
    const curerntHandle = user32.GetActiveWindow();
    let tempHandle = user32.GetWindow(curerntHandle, 2);
    let lastWindowHandle;

    while (!ref.isNull(tempHandle)) {
      lastWindowHandle = tempHandle;
      tempHandle = user32.GetParent(lastWindowHandle);
    }

    const distHandle = desktopClassName.includes(this.lastActiveWindowClassName)
      ? user32.GetShellWindow()
      : lastWindowHandle;

    const currentThreadId = kernel32.GetCurrentThreadId();

    const lpdwProcessId = ref.refType(ref.types.ulong);
    const pidAddress = ref.alloc(lpdwProcessId);
    const windowThreadProcessId = user32.GetWindowThreadProcessId(
      distHandle,
      pidAddress
    );

    user32.SetWindowPos(distHandle, -1, 0, 0, 0, 0, 0x0001 | 0x0002);
    user32.SetWindowPos(distHandle, -2, 0, 0, 0, 0, 0x0001 | 0x0002 | 0x0040);
    user32.AttachThreadInput(currentThreadId, windowThreadProcessId, 1);
    user32.SetForegroundWindow(distHandle);
    user32.AttachThreadInput(currentThreadId, windowThreadProcessId, 0);

    if (alwaysOnTop) {
      this.window.setAlwaysOnTop(true);
    }
    this.window.setSkipTaskbar(true);
  }

  _getCurrentWindowClassName() {
    const foregroundHWnd = user32.GetForegroundWindow();
    const pnameLength = 1024;
    const pnameBuf = Buffer.alloc(pnameLength);
    pnameBuf.type = ref.types.CString;
    const bl = user32.GetClassNameW(foregroundHWnd, pnameBuf, pnameLength);
    const className = ref.reinterpretUntilZeros(pnameBuf, bl).toString("ucs2");
    return className;
  }
};
