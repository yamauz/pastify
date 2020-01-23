module.exports = {
  MAX_ITEMS_ON_DISPLAY: 50,
  MAX_SEARCH_RESULT_SHOW: 50,
  DEFAULT_ITEM_HEIGHT: 90,
  LAUNCH_KEY_DURATION: 200,
  WIDTH_UNFOLD: 630,
  APP_DIR: process.env.PORTABLE_EXECUTABLE_DIR || ".",
  TRAY_ICON_PATH: {
    on: "src/icon/icon_on.ico",
    off: "src/icon/icon_off.ico"
  }
};
