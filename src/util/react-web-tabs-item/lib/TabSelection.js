"use strict";
const { OrderedSet } = require("immutable");
const _ = require("lodash");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var TabSelection = (function() {
  function TabSelection() {
    var _ref =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      defaultTab = _ref.defaultTab,
      _ref$vertical = _ref.vertical,
      vertical = _ref$vertical === undefined ? false : _ref$vertical,
      _ref$collapsible = _ref.collapsible,
      collapsible = _ref$collapsible === undefined ? false : _ref$collapsible,
      onChange = _ref.onChange;

    _classCallCheck(this, TabSelection);

    this.selected = defaultTab;
    // this.tabs = [];
    this.tabs = OrderedSet();
    this.prevTab = "firstTab";
    this.prevPrevTab = "";
    this.nextTab = "";
    this.subscribtions = [];
    this.onChange = onChange;
    this.vertical = vertical;
    this.collapsible = collapsible;
  }
  const deleteThrottle = _.throttle(
    (that, options) => {
      const prevTabBefore = that.prevTab;
      const nextTabBefore = that.nextTab;
      if (that.tabs.size === 2) {
        // size is 2 because includes "filter-sort-settings" tab
        options.delfunc.deleteIds(that.selected);
      } else {
        if (that.nextTab !== "lastTab") {
          that.select(that.nextTab, options);
          options.delfunc.deleteIds(that.prevTab);
          that.prevTab = prevTabBefore;
        } else {
          that.select(that.prevTab, options);
          options.delfunc.deleteIds(that.nextTab);
          that.nextTab = nextTabBefore;
        }
      }
    },
    150,
    { trailing: false }
  );

  const selectNextThrottle = _.throttle(
    (that, options) => {
      if (that.nextTab !== "lastTab") {
        that.select(that.nextTab, options);
      }
    },
    100,
    { trailing: false }
  );
  const selectPreviousThrottle = _.throttle(
    (that, options) => {
      if (that.prevTab !== "firstTab") {
        that.select(that.prevTab, options);
      }
    },
    100,
    { trailing: false }
  );

  _createClass(TabSelection, [
    {
      key: "select",
      value: function select(tabId, options) {
        var _ref2 =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : {},
          _ref2$focus = _ref2.focus,
          // focus = _ref2$focus === undefined ? false : _ref2$focus;
          focus = true;

        this.selected = tabId;

        this.subscribtions.forEach(function(callback) {
          return callback({ focus });
        });

        if (this.onChange) {
          this.onChange(tabId);
        }
      }
    },
    {
      key: "selectPrevious",
      value: function selectPrevious(options) {
        selectPreviousThrottle(this, options);
        // if (this.prevTab !== "firstTab") {
        //   this.select(this.prevTab, options);
        // }
      }
    },
    {
      key: "selectNext",
      value: function selectNext(options) {
        selectNextThrottle(this, options);
        // if (this.nextTab !== "lastTab") {
        //   this.select(this.nextTab, options);
        // }
      }
    },
    {
      key: "deleteItem",
      value: function deleteItem(options) {
        deleteThrottle(this, options);
      }
    },
    {
      key: "favItem",
      value: function favItem(options) {
        options.favfunc.favItem(this.selected);
      }
    },
    {
      key: "tagItem",
      value: function tagItem(options) {
        options.tagfunc.toggleModalVisibility();
        options.storefunc.storeItemOnModalOpen();
      }
    },
    {
      key: "selectFirst",
      value: function selectFirst(options) {
        this.select(this.tabs[0], options);
      }
    },
    {
      key: "selectLast",
      value: function selectLast(options) {
        this.select(this.tabs[this.tabs.length - 1], options);
      }
    },
    {
      key: "isSelected",
      value: function isSelected(tabId) {
        return tabId === this.selected;
      }
    },
    {
      key: "isVertical",
      value: function isVertical() {
        return this.vertical;
      }
    },
    {
      key: "register",
      value: function register(tabId, option) {
        if (this.tabs.includes(tabId)) {
          return;
        }
        this.tabs = this.tabs.add(tabId);
        if (!this.selected) {
          this.select(tabId, option);
        }
      }
    },
    {
      key: "unregister",
      value: function unregister(tabId) {
        this.tabs = this.tabs.filter(function(id) {
          return id !== tabId;
        });
      }
    },
    {
      key: "subscribe",
      value: function subscribe(callback) {
        this.subscribtions.push(callback);
      }
    },
    {
      key: "unsubscribe",
      value: function unsubscribe(callback) {
        this.subscribtions = this.subscribtions.filter(function(cb) {
          return cb !== callback;
        });
      }
    }
  ]);

  return TabSelection;
})();

exports.default = TabSelection;
