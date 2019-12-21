import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import CreatableSelect from "react-select/creatable";
import { setKeyInputValue, addKeyValue, changeKeyValue } from "../../actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFireAlt } from "@fortawesome/free-solid-svg-icons";

const svgHotkey =
  "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20448%20512%22%3E%3Cpath%20d%3D%22M400%2032H48C21.49%2032%200%2053.49%200%2080v352c0%2026.51%2021.49%2048%2048%2048h352c26.51%200%2048-21.49%2048-48V80c0-26.51-21.49-48-48-48zm-6%20400H54a6%206%200%200%201-6-6V86a6%206%200%200%201%206-6h340a6%206%200%200%201%206%206v340a6%206%200%200%201-6%206zm-50-292v232c0%206.627-5.373%2012-12%2012h-24c-6.627%200-12-5.373-12-12v-92H152v92c0%206.627-5.373%2012-12%2012h-24c-6.627%200-12-5.373-12-12V140c0-6.627%205.373-12%2012-12h24c6.627%200%2012%205.373%2012%2012v92h144v-92c0-6.627%205.373-12%2012-12h24c6.627%200%2012%205.373%2012%2012z%22%2F%3E%3C%2Fsvg%3E";
const hotkeyColor = "#5a120f";

const Wrapper = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.div`
  color: #d4d4d4;
  font-size: 11px;
  margin-bottom: 3px;
  margin-left: 3px;
`;

const Description = styled.span`
  font-family: sans-serif;
  display: inline-block;
  color: #dddddd;
  font-size: 10px;
  vertical-align: top;
  &:before {
    display: inline-block;
    content: " ";
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20448%20512%22%20fill%3D%22%23dddddd%22%3E%3Cpath%20d%3D%22M400%2032H48C21.49%2032%200%2053.49%200%2080v352c0%2026.51%2021.49%2048%2048%2048h352c26.51%200%2048-21.49%2048-48V80c0-26.51-21.49-48-48-48zm-6%20400H54a6%206%200%200%201-6-6V86a6%206%200%200%201%206-6h340a6%206%200%200%201%206%206v340a6%206%200%200%201-6%206zm-50-292v232c0%206.627-5.373%2012-12%2012h-24c-6.627%200-12-5.373-12-12v-92H152v92c0%206.627-5.373%2012-12%2012h-24c-6.627%200-12-5.373-12-12V140c0-6.627%205.373-12%2012-12h24c6.627%200%2012%205.373%2012%2012v92h144v-92c0-6.627%205.373-12%2012-12h24c6.627%200%2012%205.373%2012%2012z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    vertical-align: middle;
    margin-right: 4px;
    width: 12px;
    height: 12px;
  }
`;

const DivLoop = styled.div``;

const KeyInput = props => {
  const key = props.hotKey === "" ? [] : createOption(props.hotKey);
  const {
    keyOptions,
    keyInputValue,
    setKeyInputValue,
    addKeyValue,
    changeKeyValue
  } = props;
  const selectRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      selectRef.current.focus();
    }, 200);
  }, []);

  return (
    <Wrapper>
      <DivLoop
        id="divloop-start"
        tabIndex={0}
        onKeyDown={e => {
          if (e.keyCode === 9) {
            if (e.shiftKey) {
              const elm = document.getElementById("divloop-end");
              elm.focus();
            } else {
            }
          }
        }}
      />
      <Label id="key-label">
        <Description>Hotkey</Description>
      </Label>
      <CreatableSelect
        ref={selectRef}
        autoFocus={true}
        id="hotkey-input"
        inputValue={keyInputValue}
        noOptionsMessage={() => null}
        menuPosition={"fixed"}
        placeholder={null}
        options={setKeyOptions(key, keyOptions)}
        isClearable={false}
        isMulti
        value={key}
        styles={customStyles}
        onChange={options => {
          changeKeyValue(options);
        }}
        onInputChange={value => {
          if (key.length >= 1) return;
          if (!value.match(/^[A-Za-z0-9]*$/)) return;
          const valueUpperCase = value.toUpperCase();
          if (value.length < 17) setKeyInputValue(valueUpperCase);
        }}
        onKeyDown={e => {
          if (!e.target.value) return;
          switch (e.key) {
            case "Tab":
            case "Enter":
              const value = e.target.value;
              addKeyValue(value);
              e.preventDefault();
          }
        }}
      />
    </Wrapper>
  );
};

const customStyles = {
  indicatorSeparator: (styles, { data }) => ({
    ...styles,
    display: "none"
  }),
  clearIndicator: (styles, { data }) => ({
    ...styles,
    color: "#bbbbbb",
    padding: 2,
    "&:hover": { color: "#ffffff" }
  }),
  dropdownIndicator: (styles, { data }) => ({
    ...styles,
    color: "#bbbbbb",
    padding: 2,
    "&:hover": { color: "#ffffff" }
  }),
  option: (provided, state) => ({
    ...provided,
    color: "#dddddd",
    backgroundColor: state.isFocused ? "#354154" : "none",
    "&:hover": { backgroundColor: "#2F353D" },
    ":before": {
      backgroundColor: "#aaaaaa",
      content:
        state.data.label === "Set" || state.data.label === "Unset"
          ? "normal"
          : "''",
      display: "inline-block",
      marginRight: 3,
      marginBottom: "-3px",
      maskImage: `url(${svgHotkey})`,
      maskSize: "14px 14px",
      height: "14px",
      width: "14px"
    },
    fontSize: "11px",
    fontStyle: state.data.fontStyle,
    padding: "5px"
  }),
  menu: (provided, state) => ({
    ...provided,
    maxWidth: "400px"
  }),
  menuList: (provided, state) => ({
    ...provided,
    borderRadius: "0px",
    backgroundColor: "#333335"
  }),
  control: (styles, state) => ({
    ...styles,
    backgroundColor: "#333335",
    "&:hover": { border: state.isFocused ? "solid 1px #5c5d37" : "none" },
    border: state.isFocused ? "solid 1px #5c5d37" : "none",
    boxShadow: "none", // no box-shadow
    borderRadius: "0px",
    minHeight: "25px",
    maxWidth: "400px"
  }),
  valueContainer: base => ({
    ...base,
    padding: "0px 6px"
  }),
  multiValue: (styles, state) => ({
    ...styles,
    backgroundColor:
      state.data.label === "Set" || state.data.label === "Unset"
        ? state.data.color
        : hotkeyColor,
    height: 18,
    fontSize: 13,
    lineHeight: 1,
    color: "#dddddd",
    paddingLeft: -5,
    ":before": {
      backgroundColor: "#eeeeee",
      content:
        state.data.label === "Set" || state.data.label === "Unset"
          ? "normal"
          : "''",
      display: "inline-block",
      marginLeft: 5,
      marginTop: 2,
      maskImage: `url(${svgHotkey})`,
      maskSize: "13px 13px",
      height: "13px",
      width: "13px"
    }
  }),
  input: (styles, { data }) => ({
    ...styles,
    color: "#dddddd",
    margin: 0,
    padding: 0
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: "#dddddd",
    "&:hover": { color: "#ffffff" }
  }),
  multiValueRemove: (styles, state) => ({
    ...styles,
    // backgroundColor: state.isSelected ? state.data.color : "none",
    backgroundColor: state.isSelected
      ? state.data.label === "Set" || state.data.label === "Unset"
        ? state.data.color
        : hotkeyColor
      : "none",
    opacity: state.isFocused ? "1" : "0.5",
    "&:hover": {
      backgroundColor:
        state.data.label === "Set" || state.data.label === "Unset"
          ? state.data.color
          : hotkeyColor,
      color: "#fff",
      opacity: "1"
    }
  })
};

const setKeyOptions = (keySelected, keyOptions) => {
  const nextKeySelected = keySelected.length < 1 ? keyOptions : [];
  return nextKeySelected;
};

const mapStateToProps = state => ({
  keyOptions: state.get("keyOptions"),
  keyInputValue: state.get("keyInputValue")
});

const createOption = key => {
  const option = {
    label: key,
    value: key
  };

  return [option];
};

export default connect(mapStateToProps, {
  setKeyInputValue,
  addKeyValue,
  changeKeyValue
})(KeyInput);
