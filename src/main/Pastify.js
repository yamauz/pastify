const CF = require("./CF");
const robot = require("robotjs");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const unzipper = require("unzipper");

module.exports = class Pastify {
  constructor() {
    this.isCopiedBySelf = false;
  }

  copyClipId(props) {
    const { id } = props;
    this.isCopiedBySelf = true;
    CF.get("TEXT").write(id);
    return null;
  }

  copyClip(props, { dataStore, settings, win }) {
    const { id, isReturn, copyOnly, copyAs, surround } = props;
    const clip = dataStore.getClipById(id);
    const _copyAs = copyAs === "_ORIGINAL_" ? clip.mainFormat : copyAs;
    this.isCopiedBySelf = true;

    let textExpanded = undefined;
    if (_copyAs === "TEXT") {
      textExpanded = CF.get(_copyAs).createTextToWrite(
        clip,
        surround,
        dataStore
      );
    }

    CF.get(_copyAs).write(clip, textExpanded);
    if (!copyOnly) {
      this._pasteClip(settings, win, isReturn);
    }
    return null;
  }

  exportClips(props, { dataStore }) {
    const { idsTimeLine, exportPath } = props;
    const clipsExport = dataStore.readClipsById(idsTimeLine);
    const imageClips = clipsExport.filter(clip => clip.mainFormat === "IMAGE");
    const distDir = process.env.PORTABLE_EXECUTABLE_DIR || ".";
    const imageClipsPath = imageClips.map(
      clip =>
        `${path.resolve(distDir, "resource", "temp", "images")}\\${clip.id}`
    );
    const exportJSONPath = `${path.resolve(
      distDir,
      "resource",
      "temp",
      "export"
    )}\\export.json`;
    fs.writeFileSync(exportJSONPath, JSON.stringify(clipsExport));

    const output = fs.createWriteStream(exportPath);
    const archive = archiver("zip", {
      zlib: { level: 9 } // Sets the compression level.
    });
    archive.pipe(output);
    archive.file(exportJSONPath, {
      name: `__PASTIFY__/${path.basename(exportJSONPath)}`
    });
    imageClipsPath.forEach(imgPath => {
      archive.file(imgPath, {
        name: `__PASTIFY__/images/${path.basename(imgPath)}`
      });
    });
    archive.finalize();
    output.on("close", function() {
      const archive_size = archive.pointer();
      console.log(`complete! total size : ${archive_size} bytes`);
    });

    return null;
  }

  importClips(props, { dataStore, win }) {
    const { importPath } = props;
    const distDir = process.env.PORTABLE_EXECUTABLE_DIR || ".";

    const unzipPath = `${path.resolve(distDir, "resource", "temp", "import")}`;
    fs.createReadStream(importPath)
      .pipe(unzipper.Parse())
      .on("entry", function(entry) {
        const fileName = entry.path;
        const rootDir = fileName.split("/")[0];
        const imageDir = fileName.split("/")[1];
        if (rootDir === "__PASTIFY__") {
          let unzipFileName;
          if (imageDir === "images") {
            unzipFileName = `${path.resolve(
              distDir,
              unzipPath,
              "images",
              path.basename(fileName)
            )}`;
          } else {
            unzipFileName = `${path.resolve(
              distDir,
              unzipPath,
              path.basename(fileName)
            )}`;
          }
          entry.pipe(fs.createWriteStream(unzipFileName));
        } else {
          console.log("invalid export file");
          entry.autodrain();
        }
      })
      .on("error", () => {
        console.log("error!!!");
      })
      .promise()
      .then(() => {
        const importJSONPath = `${path.resolve(
          distDir,
          "resource",
          "temp",
          "import"
        )}\\export.json`;
        const importJSON = JSON.parse(fs.readFileSync(importJSONPath));
        dataStore.createByImport(importJSON, win);
      });

    return null;
  }

  checkBlockCopying(clip, settings) {
    if (settings.disableClipListener) {
      console.log("Now disable Pastify.");
      return true;
    }
    if (this._checkBlockDataType(clip.format, settings)) {
      return true;
    }
    switch (clip.format) {
      case "TEXT": {
        const _textData = clip.extracts.get("TEXT");
        if (this._checkBlockTextLength(_textData, settings)) {
          return true;
        }
        if (this._checkBlockKeywords(_textData, settings)) {
          return true;
        }
        break;
      }
      case "IMAGE": {
        const _imageSize = clip.extracts.get("IMAGE").getSize();
        if (this._checkBlockImageSize(_imageSize, settings)) {
          return true;
        }
        break;
      }
      case "FILE": {
        const _fileNames = clip.extracts.get(clip.format);
        if (this._checkBlockFileNames(_fileNames, settings)) {
          return true;
        }
        break;
      }
      default:
        break;
    }

    return false;
  }

  _checkBlockFileNames(fileNames, settings) {
    let blocking = false;
    const { blockMaxFileCount } = settings.readPreferences();
    if (blockMaxFileCount !== "" && fileNames.length > blockMaxFileCount) {
      console.log("blocked by max-file-count", blockMaxFileCount);
      blocking = true;
      return blocking;
    }
    return blocking;
  }

  _checkBlockImageSize(imageSize, settings) {
    let blocking = false;
    const { width, height } = imageSize;
    const { blockMaxImageSize } = settings.readPreferences();
    if (blockMaxImageSize !== "" && width > blockMaxImageSize) {
      console.log("blocked by max-image-size", blockMaxImageSize);
      blocking = true;
      return blocking;
    }
    if (blockMaxImageSize !== "" && height > blockMaxImageSize) {
      console.log("blocked by max-image-size", blockMaxImageSize);
      blocking = true;
      return blocking;
    }
    return blocking;
  }

  _checkBlockDataType(format, settings) {
    let blocking = false;
    const { blockDatatypeOpt } = settings.readPreferences();
    const blockType = blockDatatypeOpt.map(opt => opt.value);
    if (blockType.some(word => format.includes(word))) {
      console.log("blocked by data type");
      return true;
    }
    return blocking;
  }
  _checkBlockTextLength(textData, settings) {
    let blocking = false;
    const {
      blockMaxTextLength,
      blockMinTextLength
    } = settings.readPreferences();
    if (
      blockMaxTextLength !== "" &&
      blockMinTextLength !== "" &&
      blockMaxTextLength - blockMinTextLength <= 0
    ) {
      console.log("incorrect range", blockMaxTextLength - blockMinTextLength);
      blocking = true;
      return blocking;
    }
    if (blockMaxTextLength !== "" && textData.length > blockMaxTextLength) {
      console.log("blocked by max-text-length", blockMaxTextLength);
      blocking = true;
      return blocking;
    }
    if (blockMinTextLength !== "" && textData.length < blockMinTextLength) {
      console.log("blocked by min-text-length", blockMaxTextLength);
      blocking = true;
      return blocking;
    }
    return blocking;
  }

  _checkBlockKeywords(textData, settings) {
    const { blockKeywordsOpt } = settings.readPreferences();
    const blockwords = blockKeywordsOpt.map(opt => opt.value);
    if (blockwords.some(word => textData.includes(word))) {
      console.log("blocked by text-keywords", blockwords);
      return true;
    }
    return false;
  }

  _pasteClip(settings, win, isReturn) {
    win.showLastActiveWindow(settings);
    robot.keyTap("v", "control");
    if (isReturn) win.focus();
  }
};
