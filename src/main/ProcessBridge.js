const mapToObject = require("../util/mapToObject");
const objectToMap = require("../util/objectToMap");

module.exports = class ProcessBridge {
  sendItemToRenderer(pastifyData, sendFunc) {
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
        isTrashed,
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
        isTrashed,
        itemHeight,
        itemTagHeight
      };
      itemRenderer.push(data);
    }
    sendFunc(itemRenderer);
  }
  sendFiltersToRenderer(filters, sendFunc) {
    const filtersToRenderer = [];
    for (const flt of filters) {
      const {
        id,
        filterName,
        filterShortcutKeyOpt,
        sortOpt,
        dataTypeFilterOpt,
        keywordFilterOpt,
        idFilterOpt,
        statusFilterOpt,
        hotKeyFilterOpt,
        hashTagFilterOpt,
        languageFilterOpt
      } = flt;
      const data = {
        id,
        filterName,
        filterShortcutKeyOpt,
        sortOpt,
        dataTypeFilterOpt,
        keywordFilterOpt,
        idFilterOpt,
        statusFilterOpt,
        hotKeyFilterOpt,
        hashTagFilterOpt,
        languageFilterOpt
      };
      filtersToRenderer.push(data);
    }
    sendFunc(filtersToRenderer);
  }
};
