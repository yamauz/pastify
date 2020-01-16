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
    archive.file(exportJSONPath, { name: path.basename(exportJSONPath) });
    imageClipsPath.forEach(imgPath => {
      archive.file(imgPath, { name: `images/${path.basename(imgPath)}` });
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
      .pipe(unzipper.Extract({ path: unzipPath }))
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
      default:
        break;
    }

    return false;
  }

  _checkBlockImageSize(imageSize, settings) {
    let blocking = false;
    const { width, height } = imageSize;
    const {
      blockMaxImageWidth,
      blockMaxImageHeight
    } = settings.readPreferences();
    console.log(width);
    console.log(height);
    if (blockMaxImageWidth !== "" && width > blockMaxImageWidth) {
      console.log("blocked by max-image-width", blockMaxImageWidth);
      blocking = true;
      return blocking;
    }
    if (blockMaxImageHeight !== "" && height > blockMaxImageHeight) {
      console.log("blocked by max-image-height", blockMaxImageHeight);
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
