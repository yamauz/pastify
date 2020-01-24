const ffi = require("ffi");
const { dialog } = require("electron");
const ref = require("ref");
const Struct = require("ref-struct");
const WndClassEx = Struct({
  cbSize: "uint32",
  style: "uint32",
  lpfnWndProc: "pointer", // callback 'int32', ['pointer', 'uint32', 'int32', 'uint32']
  cbClsExtra: "int32",
  cbWndExtra: "int32",
  hInstance: "pointer", // can be 0?
  hIcon: "pointer",
  hCursor: "pointer",
  hbrBackground: "pointer",
  lpszMenuName: "pointer",
  lpszClassName: "pointer",
  hIconSm: "pointer"
});
const WndClassExPtr = ref.refType(WndClassEx);
const user32 = new ffi.Library("user32", {
  RegisterClassExW: ["int32", [WndClassExPtr]],
  CreateWindowExW: [
    "pointer",
    [
      "int32",
      "pointer",
      "pointer",
      "int32", // style, name, name, style
      "int32",
      "int32",
      "int32",
      "int32", // x, y, w, h
      "pointer",
      "pointer",
      "pointer",
      "pointer"
    ]
  ],
  AddClipboardFormatListener: ["bool", ["pointer"]],
  RemoveClipboardFormatListener: ["bool", ["pointer"]]
});

module.exports = class ClipboardListener {
  constructor(app) {
    this.app = app;
  }

  subscribe(messageHandler) {
    const wProc = this._createCallback(messageHandler);

    const errorMsgTitle = "Error";
    const errorMsgContent = "failed to open clipboard";

    const wClass = this._createClass(wProc);
    if (!wClass) {
      dialog.showErrorBox(errorMsgTitle, errorMsgContent);
      console.log("\x1b[36m%s\x1b[0m", "failed to create class");
      this.app.quit();
    }

    const atom = this._registerClass(wClass);
    if (!atom) {
      dialog.showErrorBox(errorMsgTitle, errorMsgContent);
      console.log("\x1b[36m%s\x1b[0m", "failed to register class");
      this.app.quit();
    }

    const wHandle = this._createWindow(wClass);
    if (ref.isNull(wHandle)) {
      dialog.showErrorBox(errorMsgTitle, errorMsgContent);
      console.log("\x1b[36m%s\x1b[0m", "failed to create window");
      this.app.quit();
    }

    user32.AddClipboardFormatListener(wHandle);
    console.log(
      "\x1b[36m%s\x1b[0m",
      "Added clipboard format listener successfully!"
    );

    // Make an extra reference to the callback pointer to avoid GC
    process.on("exit", () => wClass);
  }

  _createCallback(callback) {
    const wProc = ffi.Callback(
      "uint32",
      ["pointer", "uint32", "int32", "pointer"],
      (hwnd, uMsg, wParam, lParam) => {
        callback(hwnd, uMsg, wParam, lParam);
      }
    );
    return wProc;
  }

  _createClass(wProc) {
    const className = Buffer.from("Pastify WinForms Class\0", "ucs-2");
    const wClass = new WndClassEx();
    wClass.lpszClassName = className;
    wClass.lpfnWndProc = wProc;
    wClass.cbSize = 80;
    return wClass;
  }

  _registerClass(wClass) {
    const atom = user32.RegisterClassExW(wClass.ref());
    return atom;
  }

  _createWindow(wClass) {
    const windowName = Buffer.from("Pastify WinForms App\0", "ucs-2");
    const wHandle = user32.CreateWindowExW(
      0,
      wClass.lpszClassName,
      windowName,
      0,
      0,
      0,
      0,
      0,
      null,
      null,
      null,
      null
    );

    return wHandle;
  }
};
