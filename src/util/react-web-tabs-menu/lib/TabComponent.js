"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

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

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }
  return target;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === "object" || typeof call === "function")
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError(
      "Super expression must either be null or a function, not " +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

var TabComponent = (function(_Component) {
  _inherits(TabComponent, _Component);

  function TabComponent() {
    _classCallCheck(this, TabComponent);

    return _possibleConstructorReturn(
      this,
      (TabComponent.__proto__ || Object.getPrototypeOf(TabComponent)).apply(
        this,
        arguments
      )
    );
  }

  _createClass(TabComponent, [
    {
      key: "render",
      value: function render() {
        var _props = this.props,
          tabFor = _props.tabFor,
          children = _props.children,
          className = _props.className,
          selected = _props.selected,
          focusable = _props.focusable,
          tabRef = _props.tabRef,
          onClick = _props.onClick,
          onKeyDown = _props.onKeyDown,
          props = _objectWithoutProperties(_props, [
            "tabFor",
            "children",
            "className",
            "selected",
            "focusable",
            "tabRef",
            "onClick",
            "onKeyDown"
          ]);

        return _react2.default.createElement(
          "button",
          _extends({}, props, {
            id: tabFor + "-tab",
            role: "tab",
            "aria-selected": selected,
            "aria-controls": tabFor,
            onClick: onClick,
            onKeyDown: onKeyDown,
            tabIndex: focusable || selected ? "0" : "-1",
            className: "rwt__tab__menu " + (className || ""),
            ref: tabRef
          }),
          children
        );
      }
    }
  ]);

  return TabComponent;
})(_react.Component);

TabComponent.defaultProps = {
  className: "",
  selected: false,
  focusable: false,
  onClick: undefined,
  onKeyDown: undefined,
  tabRef: undefined
};
TabComponent.propTypes = {
  tabFor: _propTypes2.default.string.isRequired,
  children: _propTypes2.default.node.isRequired,
  className: _propTypes2.default.string,
  selected: _propTypes2.default.bool,
  focusable: _propTypes2.default.bool,
  onClick: _propTypes2.default.func,
  onKeyDown: _propTypes2.default.func,
  tabRef: _propTypes2.default.func
};
exports.default = TabComponent;
