import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import Select from "react-select";
import {
  setHotKeyFilterOptions,
  changeHotKeyFilterInputValue,
  setIdsFromDatastore,
  addHotKeyFilterOptions
} from "../../../actions";
import CreatableSelect from "react-select/creatable";
import setUnsetOptions from "../../../../common/setUnsetOptions";

import styled from "@emotion/styled";

const svgHotkey =
  "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20448%20512%22%3E%3Cpath%20d%3D%22M400%2032H48C21.49%2032%200%2053.49%200%2080v352c0%2026.51%2021.49%2048%2048%2048h352c26.51%200%2048-21.49%2048-48V80c0-26.51-21.49-48-48-48zm-6%20400H54a6%206%200%200%201-6-6V86a6%206%200%200%201%206-6h340a6%206%200%200%201%206%206v340a6%206%200%200%201-6%206zm-50-292v232c0%206.627-5.373%2012-12%2012h-24c-6.627%200-12-5.373-12-12v-92H152v92c0%206.627-5.373%2012-12%2012h-24c-6.627%200-12-5.373-12-12V140c0-6.627%205.373-12%2012-12h24c6.627%200%2012%205.373%2012%2012v92h144v-92c0-6.627%205.373-12%2012-12h24c6.627%200%2012%205.373%2012%2012z%22%2F%3E%3C%2Fsvg%3E";

const hotkeyColor = "#5a120f";

const Wrapper = styled.div`
  margin-bottom: 20px;
`;

const FilterHeader = styled.div`
  color: #bbbbbb;
`;

const FilterBy = styled.span`
  font-size: 12px;
  color: #dddddd;
`;

const FilterDescription = styled.div`
  font-size: 10px;
  color: #bbbbbb;
  margin-bottom: 5px;
`;

const HotKeyInput = props => {
  const {
    keyOptions,
    hotKeyFilterOpt,
    hotKeyFilterInputValue,
    changeHotKeyFilterInputValue,
    addHotKeyFilterOptions,
    setHotKeyFilterOptions,
    setIdsFromDatastore
  } = props;
  return (
    <Wrapper>
      <FilterHeader>
        Filter : <FilterBy>Label > Hotkey</FilterBy>
      </FilterHeader>
      <FilterDescription>
        Select or Type Hotkey. Allows multi-selection.
      </FilterDescription>
      <CreatableSelect
        noOptionsMessage={() => null}
        menuPosition={"fixed"}
        placeholder={null}
        inputValue={hotKeyFilterInputValue}
        // options={setKeyOptions(key, keyOptions)}
        options={setKeyOptions(keyOptions, hotKeyFilterOpt)}
        isMulti
        value={hotKeyFilterOpt}
        styles={customStyles}
        onChange={opt => {
          const options = opt === null ? [] : opt;
          setHotKeyFilterOptions(options);
          setIdsFromDatastore();
        }}
        onInputChange={value => {
          const filterLabels = hotKeyFilterOpt.map(opt => opt.label);
          if (filterLabels.includes("Set") || filterLabels.includes("Unset"))
            return;
          if (!value.match(/^[A-Za-z0-9]*$/)) return;
          const valueUpperCase = value.toUpperCase();
          if (value.length < 17) changeHotKeyFilterInputValue(valueUpperCase);
        }}
        onKeyDown={e => {
          if (!e.target.value) return;
          switch (e.key) {
            case "Tab":
            case "Enter":
              const value = e.target.value;
              const option = {
                label: value,
                value: value
              };
              addHotKeyFilterOptions(option);
              setIdsFromDatastore();
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

const setKeyOptions = (keyOptions, hotKeyFilterOpt) => {
  let nextOptions;
  if (hotKeyFilterOpt.length === 0) {
    nextOptions = [...setUnsetOptions, ...keyOptions];
  } else {
    switch (hotKeyFilterOpt[0].value) {
      case "__SET__":
      case "__UNSET__":
        nextOptions = [];
        break;
      default:
        nextOptions = [...keyOptions];
        break;
    }
  }
  return nextOptions;
};

const mapStateToProps = state => ({
  keyOptions: state.get("keyOptions"),
  hotKeyFilterOpt: state.get("hotKeyFilterOpt"),
  hotKeyFilterInputValue: state.get("hotKeyFilterInputValue")
});

export default connect(mapStateToProps, {
  setHotKeyFilterOptions,
  setIdsFromDatastore,
  changeHotKeyFilterInputValue,
  addHotKeyFilterOptions
})(HotKeyInput);
