import React, { useState, useEffect } from "react";
import keycode from "keycode";
import { connect } from "react-redux";
// import Select from "react-select";
import { setShortcutKeyOpt, setIdsFromDatastore } from "../../../actions";
import CreatableSelect from "react-select/creatable";
import keybindingsOptions from "../../../../common/keybindingsOptions";

import styled from "@emotion/styled";
const tagColor = "#34502d";

const Wrapper = styled.div`
  margin-bottom: 20px;
`;

const FilterHeader = styled.div`
  color: #bbbbbb;
`;

const FilterDescription = styled.div`
  font-size: 10px;
  color: #bbbbbb;
  margin-bottom: 5px;
`;

const HighLight = styled.span`
  color: #f5f5f5;
`;

const Component = props => {
  const {
    setShortcutKeyOpt,
    setIdsFromDatastore,
    filterShortcutKeyOpt
  } = props;
  return (
    <Wrapper>
      <FilterHeader>Keybindings</FilterHeader>
      <FilterDescription>
        Type a key from<HighLight> A-Z</HighLight> with modifier key
        <HighLight> Shift,Ctrl,Alt</HighLight>
        <br />
        CAUTION : This setting will overrides if same keybinding already exists.
      </FilterDescription>
      <CreatableSelect
        styles={customStyles}
        components={components}
        value={filterShortcutKeyOpt}
        isClearable
        isMulti
        menuIsOpen={false}
        placeholder={null}
        onChange={value => {
          setShortcutKeyOpt([]);
        }}
        onInputChange={value => {
          return "";
        }}
        onKeyDown={e => {
          const { shiftKey, ctrlKey, altKey } = e;
          const SHIFT = shiftKey ? "Shift+" : "";
          const CTRL = ctrlKey ? "Ctrl+" : "";
          const ALT = altKey ? "Alt+" : "";
          if (shiftKey || ctrlKey || altKey) {
            const keyPressed = keycode(e).toUpperCase();
            const regx = /^[0-9A-Z]$/;
            if (
              regx.test(keyPressed) &&
              keyPressed !== "SHIFT" &&
              keyPressed !== "CTRL" &&
              keyPressed !== "ALT"
            ) {
              const label = `${CTRL}${SHIFT}${ALT}${keyPressed}`;
              const value = `${CTRL}${SHIFT}${ALT}${keyPressed}`.toLowerCase();
              if (!!filterShortcutKeyOpt) {
                if (value === filterShortcutKeyOpt.value) {
                  console.log("same key");
                  return;
                } else {
                }
              }
              setShortcutKeyOpt({ label, value });
              setIdsFromDatastore();
            }
          }
        }}
        onKeyUp={e => {
          console.log("onkeyUp");
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
  control: (styles, state) => ({
    ...styles,
    backgroundColor: "#333335",
    "&:hover": { border: state.isFocused ? "solid 1px #5c5d37" : "none" },
    border: state.isFocused ? "solid 1px #5c5d37" : "none",
    boxShadow: "none", // no box-shadow
    borderRadius: "0px",
    minHeight: "25px",
    maxWidth: "200px"
  }),
  valueContainer: base => ({
    ...base,
    padding: "0px 6px"
  }),
  multiValue: (styles, state) => ({
    ...styles,
    backgroundColor: tagColor,
    height: 18,
    fontSize: 13,
    lineHeight: 1,
    color: "#dddddd"
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
    backgroundColor: state.isFocused ? tagColor : "none",
    opacity: state.isFocused ? "1" : "0.5",
    "&:hover": {
      backgroundColor: tagColor,
      color: "#fff",
      opacity: "1"
    }
  })
};

const setkeybindingsOptions = options => {
  const nextOptions = options.length < 1 ? keybindingsOptions : [];
  return nextOptions;
};

const components = {
  DropdownIndicator: null
};

const mapStateToProps = state => ({
  filterShortcutKeyOpt: state.get("filterShortcutKeyOpt")
});

export default connect(mapStateToProps, {
  setShortcutKeyOpt,
  setIdsFromDatastore
})(Component);
