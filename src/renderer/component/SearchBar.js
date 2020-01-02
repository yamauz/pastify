import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { setSearchInputValue, setSearchOpt } from "../actions";
import AsyncSelect from "react-select/async";
import AsyncCreatableSelect from "react-select/async-creatable";
import _ from "lodash";
import Select, { components } from "react-select";
import Highlighter from "react-highlight-words";
import keycode from "keycode";

import "semantic-ui-css/semantic.min.css";
import styled from "@emotion/styled";
import Message from "../models/Message";

const Wrapper = styled.div`
  background-color: #2f3129;
  padding: 5px 5px;
  width: 100vw;
`;

const createInputKeys = inputValue => {
  return inputValue
    .toLowerCase()
    .split(" ")
    .filter(key => key !== "");
};

const createOptions = searchOpt => {
  let clips = [];
  if (searchOpt.length !== 0) {
    switch (searchOpt[0].label) {
      case "H":
        clips = new Message("dataStore", "readHasHotKey").dispatch();
        break;
      default:
        clips = new Message("dataStore", "readNotTrashed").dispatch();
        break;
    }
  } else {
    clips = new Message("dataStore", "readNotTrashed").dispatch();
  }
  const options = clips.map(clip => {
    return {
      label: clip.textData,
      value: clip.textData,
      id: clip.id,
      mainFormat: clip.mainFormat
    };
  });
  return options;
};

const filterOptions = (inputValue, searchOpt) => {
  const options = createOptions(searchOpt);
  const inputKeys = createInputKeys(inputValue);
  return options.filter(i => {
    return inputKeys.every(key => i.label.toLowerCase().includes(key));
  });
};

const promiseOptions = searchOpt => {
  return inputValue =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve(filterOptions(inputValue, searchOpt));
      }, 100);
    });
};

const createOptionComponent = props => {
  const { searchInputValue } = props;

  return optProps => {
    return (
      <components.Option {...optProps}>
        <Highlighter
          highlightClassName="YourHighlightClass"
          searchWords={createInputKeys(searchInputValue)}
          autoEscape={true}
          textToHighlight={optProps.data.label}
        />
      </components.Option>
    );
  };
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
  option: (provided, state) => ({
    ...provided,
    color: "#dddddd",
    backgroundColor: state.isFocused ? "#354154" : "none",
    "&:hover": { backgroundColor: "#2F353D" },
    ":before": {
      backgroundColor: "#aaaaaa",
      content: "''",
      display: "inline-block",
      marginRight: 3,
      marginBottom: "-3px",
      maskImage: `url(${state.data.icon})`,
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
    zIndex: 9999
  }),
  menuList: (provided, state) => ({
    ...provided,
    borderRadius: "0px",
    backgroundColor: "#333335"
  }),
  control: (styles, state) => ({
    ...styles,
    backgroundColor: "#ececec",
    "&:hover": { border: state.isFocused ? "solid 1px #5c5d37" : "none" },
    border: state.isFocused ? "solid 1px #5c5d37" : "none",
    boxShadow: "none", // no box-shadow
    borderRadius: "15px",
    minHeight: "25px"
  }),
  valueContainer: base => ({
    ...base,
    padding: "0px 6px"
  }),
  multiValue: (styles, state) => ({
    ...styles,
    // backgroundColor: state.data.color,
    backgroundColor: "red",
    height: 18,
    fontSize: 13,
    lineHeight: 1,
    color: "#dddddd",
    paddingLeft: -5,
    ":before": {
      backgroundColor: "#eeeeee",
      content: "''",
      display: "inline-block",
      marginLeft: 5,
      marginTop: 2,
      maskImage: `url(${state.data.icon})`,
      maskSize: "13px 13px",
      height: "13px",
      width: "13px"
    }
  }),
  input: (styles, { data }) => ({
    ...styles,
    paddingLeft: 10
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: "#dddddd",
    "&:hover": { color: "#ffffff" }
  }),
  multiValueRemove: (styles, state) => ({
    ...styles,
    backgroundColor: state.data.color,
    opacity: state.isFocused ? "1" : "0.5",
    "&:hover": {
      backgroundColor: state.data.color,
      color: "#fff",
      opacity: "1"
    }
  })
};

const SearchBar = props => {
  const {
    searchInputValue,
    setSearchInputValue,
    searchOpt,
    setSearchOpt
  } = props;
  return (
    <Wrapper>
      <AsyncCreatableSelect
        name="seacrhbar"
        isClearable
        isMulti
        placeholder={null}
        menuIsOpen={!!searchInputValue}
        isClearable
        inputId={"searchbar"}
        // cacheOptions
        // defaultOptions={createOptions()}
        defaultOptions
        loadOptions={promiseOptions(searchOpt)}
        components={{
          Option: createOptionComponent(props),
          DropdownIndicator: () => null
        }}
        value={searchOpt}
        onChange={value => {
          const _value = value === null ? [] : value;
          setSearchOpt("onChange", _value);
        }}
        inputValue={searchInputValue}
        styles={customStyles}
        onInputChange={value => {
          setSearchInputValue(value);
        }}
        onKeyDown={e => {
          switch (keycode(e)) {
            case "space":
              setSearchOpt("onKeyDown", keycode(e));
              break;
            default:
              break;
          }
        }}
      />
    </Wrapper>
  );
};

const mapStateToProps = state => ({
  searchInputValue: state.get("searchInputValue"),
  searchOpt: state.get("searchOpt")
});

export default connect(mapStateToProps, { setSearchInputValue, setSearchOpt })(
  SearchBar
);
