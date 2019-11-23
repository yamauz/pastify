const { clipboard } = require("electron");
const ffi = require("ffi");
const ref = require("ref");
const extractFile = require("./Extractor_Sub/extractFile");
const user32 = new ffi.Library("user32", {
  RegisterClipboardFormatA: ["uint", ["string"]]
});
const formatNameEXCEL = ref.allocCString("XML Spreadsheet", "utf8");
const CF = new Map([
  [
    "SHEET",
    {
      fNum: user32.RegisterClipboardFormatA(formatNameEXCEL),
      extract: () => {
        return clipboard.readBuffer("XML Spreadsheet").toJSON();
      }
    }
  ],
  [
    "IMAGE",
    {
      fNum: 2,
      extract: () => {
        return clipboard.readImage();
      },
      addText: (_, id) => {
        const extension = ".png";
        // return `${id}${extension}`;
        return `${id}`;
      }
    }
  ],
  [
    "FILE",
    {
      fNum: 15,
      extract: extractFile,
      addText: files => {
        return files.join("\n");
      }
    }
  ],
  [
    "TEXT",
    {
      fNum: 1,
      extract: () => clipboard.readText(),
      write: text => clipboard.writeText(text)
    }
  ]
]);
module.exports = CF;
