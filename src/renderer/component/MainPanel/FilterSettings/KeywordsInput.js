import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  addKeywordFilterOptions,
  removeKeywordFilterOptions,
  changeKeywordFilterInputValue,
  setIdsFromDatastore
} from "../../../actions";
import CreatableSelect from "react-select/creatable";

import styled from "@emotion/styled";

const includeColor = "#0B0B4F";
const excludeColor = "#460505";

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

const KeywordsInput = props => {
  const {
    keywordFilterOpt,
    keywordFilterInputValue,
    addKeywordFilterOptions,
    removeKeywordFilterOptions,
    changeKeywordFilterInputValue,
    setIdsFromDatastore
  } = props;

  return (
    <Wrapper>
      <FilterHeader>
        Filter : <FilterBy>Keywords</FilterBy>
      </FilterHeader>
      <FilterDescription>
        Type a search word. A word with '-' in prefix, removes from search
        results. Allows multi-registration.
      </FilterDescription>
      <CreatableSelect
        autoFocus={true}
        noOptionsMessage={() => null}
        menuPosition={"fixed"}
        placeholder={null}
        components={components}
        inputValue={keywordFilterInputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        value={keywordFilterOpt}
        styles={customStyles}
        onChange={value => {
          removeKeywordFilterOptions(value);
          setIdsFromDatastore();
        }}
        onInputChange={value => {
          changeKeywordFilterInputValue(value);
        }}
        onKeyDown={e => {
          if (!e.target.value) return;
          switch (e.key) {
            case "Enter":
            case "Tab":
              const label = e.target.value;
              addKeywordFilterOptions({ label, value: label });
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
  keywordFilterOpt: state.get("keywordFilterOpt"),
  keywordFilterInputValue: state.get("keywordFilterInputValue")
});

export default connect(mapStateToProps, {
  addKeywordFilterOptions,
  removeKeywordFilterOptions,
  changeKeywordFilterInputValue,
  setIdsFromDatastore
})(KeywordsInput);
