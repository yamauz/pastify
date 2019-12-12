const { ipcRenderer } = window.require("electron");

module.exports = class Message {
  constructor(DB, command, args) {
    this.msg = {
      DB,
      command,
      args
    };
  }

  dispatch() {
    return ipcRenderer.sendSync("useIpc", this.msg);
  }
};
