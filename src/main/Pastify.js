const CF = require("./CF");
const robot = require("robotjs");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

module.exports = class Pastify {
  constructor() {
    this.isCopiedBySelf = false;
  }

  // pasteClip(props, { dataStore, settings, win }) {
  //   const { id, mode } = props;
  //   this.isCopiedBySelf = true;
  //   const text = dataStore.getTextById(id);
  //   CF.get("TEXT").write(text);
  //   win.showLastActiveWindow(settings);
  //   robot.keyTap("v", "control");

  //   if (mode === "RETURN") win.focus();

  //   return null;
  // }
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

    if (_copyAs === "TEXT") {
      clip.textData = CF.get(_copyAs).createTextToWrite(
        clip,
        surround,
        dataStore
      );
    }

    CF.get(_copyAs).write(clip);
    if (!copyOnly) {
      this._pasteClip(settings, win, isReturn);
    }
    return null;
  }

  exportClips(props, { dataStore }) {
    const { idsTimeLine, exportPath } = props;
    const clipsExport = dataStore.readClipsById(idsTimeLine);
    const imageClips = clipsExport.filter(clip => clip.mainFormat === "IMAGE");
    console.log(imageClips);
    const distDir = process.env.PORTABLE_EXECUTABLE_DIR || ".";
    const imageClipsPath = imageClips.map(
      clip =>
        `${path.resolve(distDir, "resource", "temp", "images")}\\${clip.id}`
    );
    console.log(imageClipsPath);
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
      archive.file(imgPath, { name: path.basename(imgPath) });
    });
    archive.finalize();
    output.on("close", function() {
      const archive_size = archive.pointer();
      console.log(`complete! total size : ${archive_size} bytes`);
    });

    return null;
  }

  _pasteClip(settings, win, isReturn) {
    win.showLastActiveWindow(settings);
    robot.keyTap("v", "control");
    if (isReturn) win.focus();
  }
};
