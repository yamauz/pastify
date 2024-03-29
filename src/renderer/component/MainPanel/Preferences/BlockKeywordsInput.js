import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  addBlockKeywordsOptions,
  removeBlockKeywordsOptions,
  changeBlockKeywordsInputValue,
  setIdsFromDatastore
} from "../../../actions";
import CreatableSelect from "react-select/creatable";

import styled from "@emotion/styled";

const includeColor = "#0B0B4F";
const excludeColor = "#460505";

const Wrapper = styled.div`
  margin-bottom: 20px;
`;

const BlockHeader = styled.div`
  color: #bbbbbb;
`;

const BlockBy = styled.span`
  font-size: 12px;
  color: #dddddd;
`;

const BlockDescription = styled.div`
  font-size: 10px;
  color: #bbbbbb;
  margin-bottom: 5px;
`;

const BlockKeywordsInput = props => {
  const {
    blockKeywordsOpt,
    blockKeywordsInputValue,
    addBlockKeywordsOptions,
    removeBlockKeywordsOptions,
    changeBlockKeywordsInputValue,
    setIdsFromDatastore
  } = props;

  return (
    <Wrapper>
      <BlockHeader>
        Block : <BlockBy>Keywords</BlockBy>
      </BlockHeader>
      <BlockDescription>
        Type a search word. A word with '-' in prefix, removes from search
        results. Allows multi-registration.
      </BlockDescription>
      <CreatableSelect
        inputId={"keyword-input"}
        autoFocus={true}
        noOptionsMessage={() => null}
        menuPosition={"fixed"}
        placeholder={null}
        components={components}
        inputValue={blockKeywordsInputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        value={blockKeywordsOpt}
        styles={customStyles}
        onChange={value => {
          removeBlockKeywordsOptions(value);
          // setIdsFromDatastore();
        }}
        onInputChange={value => {
          changeBlockKeywordsInputValue(value);
        }}
        onKeyDown={e => {
          if (!e.target.value) return;
          switch (e.key) {
            case "Enter":
            case "Tab":
              const label = e.target.value;
              addBlockKeywordsOptions({ label, value: label });
            // setIdsFromDatastore();
            // e.preventDefault();
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
    backgroundColor: state.data.label[0] !== "-" ? includeColor : excludeColor,
    height: 18,
    fontSize: 13,
    lineHeight: 1,
    color: "#dddddd",
    paddingLeft: -5
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
    backgroundColor: state.data.label[0] !== "-" ? includeColor : excludeColor,
    opacity: state.isFocused ? "1" : "0.5",
    "&:hover": {
      backgroundColor:
        state.data.label[0] !== "-" ? includeColor : excludeColor,
      color: "#fff",
      opacity: "1"
    }
  })
};

const components = {
  DropdownIndicator: null
};

const mapStateToProps = state => ({
  blockKeywordsOpt: state.get("blockKeywordsOpt"),
  blockKeywordsInputValue: state.get("blockKeywordsInputValue")
});

export default connect(mapStateToProps, {
  addBlockKeywordsOptions,
  removeBlockKeywordsOptions,
  changeBlockKeywordsInputValue,
  setIdsFromDatastore
})(BlockKeywordsInput);
