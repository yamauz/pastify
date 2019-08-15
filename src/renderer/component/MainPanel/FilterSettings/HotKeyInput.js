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
import defaultHotKeyOptions from "../../../../common/hotKeyOptions";

import styled from "@emotion/styled";

const Wrapper = styled.div``;

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
      <CreatableSelect
        placeholder={"Select or Type hot key"}
        inputValue={hotKeyFilterInputValue}
        // options={setKeyOptions(key, keyOptions)}
        options={setKeyOptions(keyOptions, hotKeyFilterOpt)}
        isClearable={false}
        isMulti
        value={hotKeyFilterOpt}
        styles={customStyles}
        onChange={opt => {
          const options = opt === null ? [] : opt;
          setHotKeyFilterOptions(options);
          setIdsFromDatastore();
        }}
        onInputChange={value => {
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
  multiValue: (styles, { data }) => ({
    ...styles,
    backgroundColor: "green"
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    backgroundColor: "red"
    // color: data.color,
    // color: "red"
  })
  // multiValueRemove: (styles, { data }) => ({
  //   ...styles,
  //   color: data.color,
  //   ':hover': {
  //     backgroundColor: data.color,
  //     color: 'white',
  //   },
  // }),
};

const setKeyOptions = (keyOptions, hotKeyFilterOpt) => {
  let nextOptions;
  if (hotKeyFilterOpt.length === 0) {
    nextOptions = [...defaultHotKeyOptions, ...keyOptions];
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

export default connect(
  mapStateToProps,
  {
    setHotKeyFilterOptions,
    setIdsFromDatastore,
    changeHotKeyFilterInputValue,
    addHotKeyFilterOptions
  }
)(HotKeyInput);
