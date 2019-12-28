const { clipboard } = require("electron");
const ffi = require("ffi");
const ref = require("ref");
const fs = require("fs");
const moment = require("moment");
const path = require("path");
const extractFile = require("./CF_Sub/extractFile");
const writeFile = require("./CF_Sub/writeFile");
const user32 = new ffi.Library("user32", {
  RegisterClipboardFormatA: ["uint", ["string"]]
});
const distDir = process.env.PORTABLE_EXECUTABLE_DIR || ".";
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
      },
      write: clip => {
        let filePath;
        switch (clip.mainFormat) {
          case "FILE":
            filePath = clip.contents.FILE;
            break;
          case "TEXT":
            filePath = getTextFilePath();
            fs.writeFileSync(filePath, clip.textData);
            break;
          case "IMAGE":
            filePath = getImageFilePath(clip);
            // clipboard.writeImage(nativeImage.createFromDataURL(imageData.data));
            break;
          default:
            break;
        }
        writeFile(filePath);
      }
    }
  ],
  [
    "TEXT",
    {
      fNum: 1,
      extract: () => clipboard.readText(),
      write: clip => clipboard.writeText(clip.textData),
      writeId: id => clipboard.writeText(id)
    }
  ]
]);

const getTextFilePath = () => {
  const filePath = `${path.resolve(
    distDir,
    "resource",
    "temp",
    "files"
  )}\\${moment().format("YYYYMMDDhhmmss")}.txt`;
  return filePath;
};

const getImageFilePath = clip => {
  const _imageOrigPath = path.resolve(
    distDir,
    "resource",
    "temp",
    "images",
    clip.id
  );
  const _dirName = moment().format("YYYYMMDDhhmmss");
  const _imageDestDirPath = path.resolve(
    distDir,
    "resource",
    "temp",
    "files",
    _dirName
  );
  const _imageDestPath = path.resolve(
    _imageDestDirPath,
    `${clip.textData}.png`
  );
  fs.mkdirSync(_imageDestDirPath);
  fs.copyFileSync(_imageOrigPath, _imageDestPath);
  return _imageDestPath;
};

module.exports = CF;
