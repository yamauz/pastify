const { clipboard, nativeImage } = require("electron");
const ffi = require("ffi");
const ref = require("ref");
const fs = require("fs");
const moment = require("moment");
const xlsx = require("xlsx-style");
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
      },
      write: clip => {
        const excelBuf = Buffer.from(clip.contents.SHEET.data);
        clipboard.writeBuffer("XML Spreadsheet", excelBuf);
      }
    }
  ],
  [
    "IMAGE",
    {
      fNum: 2,
      extract: () => {
        // console.log(clipboard.readImage().getBitmap().byteLength);
        return clipboard.readImage();
      },
      addText: (_, id) => {
        const extension = ".png";
        // return `${id}${extension}`;
        return `${id}`;
      },
      write: clip => {
        const imagePath = path.resolve(
          distDir,
          "resource",
          "temp",
          "images",
          clip.id
        );
        const imageData = nativeImage.createFromPath(imagePath);
        // clipboard.writeBuffer("image/png", imageData.toPNG());
        // clipboard.writeImage(imageData);
        clipboard.write({ image: imageData });
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
            filePath = getTextFilePath(clip);
            break;
          case "IMAGE":
            filePath = getImageFilePath(clip);
            break;
          case "SHEET":
            filePath = getSheetFilePath(clip);
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
      extract: settings => {
        const { maxTextLength } = settings.readPreferences();
        const clipText = clipboard.readText();
        const textToExtract =
          clipText.length > maxTextLength
            ? clipText.slice(0, maxTextLength)
            : clipText;

        return textToExtract;
        // return clipboard.readText();
      },
      createTextToWrite: (clip, surround = undefined, dataStore) => {
        const _textTemp = expandTextMacro(clip.textData, dataStore);
        const _textToWrite =
          surround === undefined
            ? _textTemp
            : `${surround.left}${_textTemp}${surround.right}`;
        return _textToWrite;
      },
      write: (clip, textExpanded) => {
        const _textToWrite =
          textExpanded === undefined ? clip.textData : textExpanded;
        return clipboard.writeText(_textToWrite);
      },

      writeId: id => clipboard.writeText(id)
    }
  ]
]);

const expandTextMacro = (textData, dataStore) => {
  const macroReplacer = (match, i) => {
    let _obj;
    eval("_obj=" + match.slice(1));
    const [macroKey] = Object.keys(_obj);
    let _text;
    if (macroKey === "ID") {
      if (dataStore.getClipById(_obj.ID) !== undefined) {
        _text = dataStore.getClipById(_obj.ID).textData;
      } else {
        _text = "";
      }
    } else {
      _text = moment().format(_obj.DT);
    }
    return _text;
  };

  const macroProps = ["ID", "DT", "CB"].join("|");
  const regStr = `(\\$\{\\s*(?:${macroProps})\\s*:\\s*["'].+["']\\s*\\})`;
  const regex = new RegExp(regStr, "gm");

  const textMacroExpanded = textData.replace(regex, macroReplacer);

  return textMacroExpanded;
};

const getTextFilePath = clip => {
  const filePath = `${path.resolve(
    distDir,
    "resource",
    "temp",
    "files"
  )}\\${moment().format("YYYYMMDDhhmmss")}.txt`;
  fs.writeFileSync(filePath, clip.textData);
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

const getSheetFilePath = clip => {
  const buffer = Buffer.from(clip.contents.SHEET.data);
  const type = "buffer";
  const cellStyles = true;
  const bookType = "xlsx";
  const bookSST = false;
  const wb = xlsx.read(buffer, { type, cellStyles });
  const content = xlsx.write(wb, {
    type,
    bookType,
    bookSST
  });
  const filePath = `${path.resolve(
    distDir,
    "resource",
    "temp",
    "files"
  )}\\${moment().format("YYYYMMDDhhmmss")}.xlsx`;
  fs.writeFileSync(filePath, content);
  return filePath;
};

module.exports = CF;
