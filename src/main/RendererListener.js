const { ipcMain } = require("electron");
module.exports = class RendererListener {
  constructor() {}

  subscribe(instances) {
    const { dataStore, settings, filters } = instances;
    ipcMain.on("useIpc", (event, msg) => {
      event.returnValue = eval(msg.DB)[msg.command](msg.args, instances);
    });
  }
};
