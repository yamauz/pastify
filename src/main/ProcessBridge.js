const mapToObject = require("../util/mapToObject");
const objectToMap = require("../util/objectToMap");

module.exports = class ProcessBridge {
  sendItemToRenderer(pastifyData, sendFunc) {
    // const itemRenderer = new Map();
    const itemRenderer = [];
    for (const item of pastifyData) {
      const {
        id,
        date,
        mainFormat,
        lang,
        tag,
        key,
        textData,
        isFaved,
        isTrashd,
        itemHeight,
        itemTagHeight
      } = item;
      const data = {
        id,
        date,
        mainFormat,
        lang,
        tag,
        key,
        textData,
        isFaved,
        isTrashd,
        itemHeight,
        itemTagHeight
      };
      itemRenderer.push(data);
    }
    sendFunc(itemRenderer);
  }
};
