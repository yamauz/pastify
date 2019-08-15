module.exports = class RendererData {
  createSaveFormattedItem(pastifyData) {
    const rendererObject = pastifyData;
    const { contents } = rendererObject;
    const textData = contents.get("TEXT");
    rendererObject.contents = textData;
    return rendererObject;
  }

  createRendererItem(createSaveFormattedItem) {}
};
