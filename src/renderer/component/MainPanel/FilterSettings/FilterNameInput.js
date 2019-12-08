import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { setFilterName } from "../../../actions";
import Select from "react-select";

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

const NameInput = styled.input`
  background-color: #333335;
  border: none;
  height: 25px;
  padding-left: 8px;
  caret-color: #eeeeee;
  color: #dddddd;
  width: 100%;
  max-width: 400px;
  &:focus {
    border: solid 1px #5c5d37;
  }
`;

const Component = props => {
  const { setFilterName, filterName } = props;

  return (
    <Wrapper>
      <FilterHeader>Name</FilterHeader>
      <FilterDescription>
        Type the name of this settings. the name will show on item list header.
      </FilterDescription>
      {/* <Select
        autoFocus={true}
        noOptionsMessage={() => null}
        menuPosition={"fixed"}
        placeholder={null}
        components={components}
        inputValue={filterName}
        isClearable
        menuIsOpen={false}
        // value={filterName}
        styles={customStyles}
        onChange={value => {
          console.log("test");
        }}
        onBlur={() => null}
        onInputChange={value => {
          console.log("onInputChange");
          setFilterName(value);
        }}
      /> */}
      <NameInput
        value={filterName}
        onChange={e => {
          setFilterName(e.target.value);
        }}
      ></NameInput>
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
  keywordFilterInputValue: state.get("keywordFilterInputValue"),
  filterName: state.get("filterName")
});

export default connect(mapStateToProps, {
  setFilterName
})(Component);