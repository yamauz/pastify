import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  addIdFilterOptions,
  removeIdFilterOptions,
  changeIdFilterInputValue,
  setIdsFromDatastore
} from "../../../actions";
import CreatableSelect from "react-select/creatable";

import styled from "@emotion/styled";

const tagColor = "#053446";
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

const HighLight = styled.span`
  color: #f5f5f5;
`;

const IdInput = props => {
  const {
    idFilterOpt,
    idFilterInputValue,
    addIdFilterOptions,
    removeIdFilterOptions,
    changeIdFilterInputValue,
    setIdsFromDatastore
  } = props;

  return (
    <Wrapper>
      <FilterHeader>
        Filter : <FilterBy>ID</FilterBy>
      </FilterHeader>
      <FilterDescription>
        Type item ID <HighLight>starts from '@'</HighLight>. Allows
        multi-selection.
      </FilterDescription>
      <CreatableSelect
        styles={customStyles}
        autoFocus={true}
        components={components}
        inputValue={idFilterInputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        placeholder={null}
        value={idFilterOpt}
        onChange={value => {
          removeIdFilterOptions(value);
          setIdsFromDatastore();
        }}
        onInputChange={value => {
          if (value !== "" && !value.startsWith("@")) return;
          changeIdFilterInputValue(value);
        }}
        onKeyDown={e => {
          if (!e.target.value) return;
          switch (e.key) {
            case "Enter":
            case "Tab":
              const label = e.target.value;
              addIdFilterOptions({ label, value: label });
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

const components = {
  DropdownIndicator: null
};

const mapStateToProps = state => ({
  idFilterOpt: state.get("idFilterOpt"),
  idFilterInputValue: state.get("idFilterInputValue")
});

export default connect(mapStateToProps, {
  addIdFilterOptions,
  removeIdFilterOptions,
  changeIdFilterInputValue,
  setIdsFromDatastore
})(IdInput);
