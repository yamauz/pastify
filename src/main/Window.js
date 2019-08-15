const ffi = require("ffi");
const ref = require("ref");
const loadDevtool = require("electron-load-devtool");
const robot = require("robotjs");
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
  constructor() {
    this.window = new BrowserWindow({
      title: "Pastify",
      width: 1200,
      height: 600,
      minWidth: 301,
      minHeight: 400,
      frame: false,
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        experimentalFeatures: true,
        blinkFeatures: "CSSBackdropFilter"
      }
    });
    this.window.setMenu(null);

    this.window.on("blur", e => {
      console.log("onBlur");
      // e.preventDefault();
      // this.window.hide();
    });

    this.window.on("closed", () => {
      console.log("onClosed");
      win = null;
    });
    this.lastActiveWindowClassName = this._getCurrentWindowClassName();
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

    this._openDevTools();
  }

  _openDevTools() {
    loadDevtool(loadDevtool.REDUX_DEVTOOLS);
    loadDevtool(loadDevtool.REACT_DEVELOPER_TOOLS);
    this.window.webContents.openDevTools();
  }

  sendToRenderer(event, data) {
    this.window.webContents.send(event, data);
  }

  show() {
    this.window.show();
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
    robot.keyTap("f11", "alt");
  }

  showLastActiveWindow() {
    const desktopClassName = ["Progman", "WorkerW"];

    this.window.setSkipTaskbar(false);
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
