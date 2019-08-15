const ffi = require("ffi");
const ref = require("ref");
const iconv = require("iconv-lite");
const fs = require("fs");

const user32 = new ffi.Library("user32", {
  OpenClipboard: ["int8", ["ulong"]],
  CloseClipboard: ["int8", []],
  GetClipboardData: ["pointer", ["uint"]]
});

const kernel32 = new ffi.Library("kernel32", {
  GlobalLock: ["pointer", ["pointer"]],
  GlobalUnlock: ["pointer", ["pointer"]]
});

const shell32 = new ffi.Library("Shell32", {
  DragQueryFileA: ["uint", ["pointer", "uint", "string", "uint"]]
});

module.exports = () => {
  if (!user32.OpenClipboard(0)) return console.log("failed to open clipboard");

  const filecf = 15;
  var handle = user32.GetClipboardData(filecf);
  var result;
  const dir = [];
  const file = [];

  var gRef = kernel32.GlobalLock(handle);
  if (ref.isNull(gRef)) return console.log("failed to global lock");

  var tmp = Buffer.alloc(512);
  tmp.type = ref.types.CString;
  var fileLength = shell32.DragQueryFileA(gRef, 0xffffffff, tmp, 512);
  for (var i = 0; i < fileLength; i++) {
    var charNum = shell32.DragQueryFileA(gRef, i, ref.NULL_POINTER, 0);
    var fileName = Buffer.alloc(charNum + 1);
    fileName.type = ref.types.CString;
    shell32.DragQueryFileA(gRef, i, fileName, charNum + 1);

    const filePath = iconv.decode(
      ref.reinterpretUntilZeros(fileName, 1, 0),
      "Shift_JIS"
    );
    if (fs.statSync(filePath).isDirectory()) {
      dir.push(filePath);
    } else {
      file.push(filePath);
    }
  }
  result = dir.sort().concat(file.sort());

  kernel32.GlobalUnlock(handle);
  user32.CloseClipboard();

  return result;
};
