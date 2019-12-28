const ffi = require("ffi");
const ref = require("ref");
const Struct = require("ref-struct");
const iconv = require("iconv-lite");
const fs = require("fs");

const user32 = new ffi.Library("user32", {
  OpenClipboard: ["int8", ["ulong"]],
  CloseClipboard: ["int8", []],
  GetClipboardData: ["pointer", ["uint"]],
  EmptyClipboard: ["bool", []],
  RegisterClipboardFormatA: ["uint", ["string"]],
  SetClipboardData: ["ulong", ["uint", "pointer"]]
});

// const poiterType = ref.refType(ref.types.void);

const kernel32 = new ffi.Library("kernel32", {
  GlobalLock: ["pointer", ["pointer"]],
  GlobalUnlock: ["pointer", ["pointer"]],
  GlobalAlloc: ["pointer", ["uint", "ulong"]]
});

const shell32 = new ffi.Library("Shell32", {
  DragQueryFileA: ["uint", ["pointer", "uint", "string", "uint"]]
});

module.exports = filePath => {
  const _path = Array.isArray(filePath) ? filePath : [filePath];
  if (!user32.OpenClipboard(0)) return console.log("failed to open clipboard");
  user32.EmptyClipboard();
  var endianness = ref.endianness;
  var uintsize32 = ref.types.uint32.size;
  var pdhGblEffect = kernel32.GlobalAlloc(
    // platform.GMEM.MOVEABLE,
    0x0002,
    uintsize32
  );
  if (!pdhGblEffect) {
    return;
  }
  var pDWDropEffect = kernel32.GlobalLock(pdhGblEffect);
  if (ref.isNull(pDWDropEffect)) {
    return;
  }
  var pDWDropEffectTo = ref.reinterpret(pDWDropEffect, uintsize32, 0);
  pDWDropEffectTo["writeUInt32" + endianness](
    // platform.PD.DROPEFFECT_COPY,
    1,
    0
  );
  kernel32.GlobalUnlock(pdhGblEffect);
  var POINT = Struct({
    x: ref.types.long,
    y: ref.types.long
  });
  var DROPFILES = Struct({
    pFiles: ref.types.uint32,
    pt: POINT,
    fNC: ref.types.uint32,
    fWide: ref.types.uint32
  });
  var dropFiles = new DROPFILES({
    pFiles: DROPFILES.size,
    pt: new POINT({ x: 0, y: 0 }),
    fNC: 0,
    fWide: 1
  });
  var dropFilesRef = dropFiles.ref();
  var fileStrsBuf = [];
  for (var i = 0; i < _path.length; i++) {
    if (existsFile(_path[i])) {
      fileStrsBuf.push(iconv.encode(_path[i], "utf16", { addBOM: false }));
      fileStrsBuf.push(Buffer.alloc(2));
    }
  }
  fileStrsBuf.push(Buffer.alloc(2));
  var fileBuf = Buffer.concat(fileStrsBuf);
  var thebuf = Buffer.concat([dropFilesRef, fileBuf]);
  var size = thebuf.length;
  var hGblFiles = kernel32.GlobalAlloc(
    // platform.GMEM.MOVEABLE,
    0x0002,
    size
  );
  if (!hGblFiles) {
    return;
  }
  var pWDFiles = kernel32.GlobalLock(hGblFiles);
  if (ref.isNull(pWDFiles)) {
    return;
  }
  var pWDFilesTmp = ref.reinterpret(pWDFiles, size, 0);
  for (var i = 0; i < thebuf.length; i++) {
    pWDFilesTmp.writeUInt8(thebuf.readUInt8(i), i);
  }
  kernel32.GlobalUnlock(hGblFiles);

  var cpFormatName = ref.allocCString("Preferred DropEffect", "utf8");
  var cpCf = user32.RegisterClipboardFormatA(cpFormatName);
  var setPd = user32.SetClipboardData(
    // platform.CF.PD,
    cpCf,
    pdhGblEffect
  );
  var setHdrop = user32.SetClipboardData(
    // platform.CF.HDROP,
    15,
    hGblFiles
  );
  user32.CloseClipboard();
  return setPd && setHdrop;
};

const existsFile = file => {
  try {
    fs.statSync(file);
    return true;
  } catch (err) {
    if (err.code === "ENOENT") return false;
  }
};
