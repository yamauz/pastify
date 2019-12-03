import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import Select from "react-select";
import {
  setLanguageFilterOptions,
  setIdsFromDatastore
} from "../../../actions";
import Select from "react-select";
import setUnsetOptions from "../../../../common/setUnsetOptions";
import langOptions from "../../../../common/langOptions";

import styled from "@emotion/styled";

const svgCode =
  "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20576%20512%22%3E%3Cpath%20d%3D%22M234.8%20511.7L196%20500.4c-4.2-1.2-6.7-5.7-5.5-9.9L331.3%205.8c1.2-4.2%205.7-6.7%209.9-5.5L380%2011.6c4.2%201.2%206.7%205.7%205.5%209.9L244.7%20506.2c-1.2%204.3-5.6%206.7-9.9%205.5zm-83.2-121.1l27.2-29c3.1-3.3%202.8-8.5-.5-11.5L72.2%20256l106.1-94.1c3.4-3%203.6-8.2.5-11.5l-27.2-29c-3-3.2-8.1-3.4-11.3-.4L2.5%20250.2c-3.4%203.2-3.4%208.5%200%2011.7L140.3%20391c3.2%203%208.2%202.8%2011.3-.4zm284.1.4l137.7-129.1c3.4-3.2%203.4-8.5%200-11.7L435.7%20121c-3.2-3-8.3-2.9-11.3.4l-27.2%2029c-3.1%203.3-2.8%208.5.5%2011.5L503.8%20256l-106.1%2094.1c-3.4%203-3.6%208.2-.5%2011.5l27.2%2029c3.1%203.2%208.1%203.4%2011.3.4z%22%2F%3E%3C%2Fsvg%3E";

const Wrapper = styled.div``;

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

const LanguageInput = props => {
  const {
    languageFilterOpt,
    setLanguageFilterOptions,
    setIdsFromDatastore
  } = props;
  return (
    <Wrapper>
      <FilterHeader>
        Filter : <FilterBy>Label > Language</FilterBy>
      </FilterHeader>
      <FilterDescription>
        Select Language. Allows multi-registration.
      </FilterDescription>
      <Select
        placeholder={null}
        isMulti
        options={setLanguageOptions(languageFilterOpt)}
        // defaultValue={languageFilterOpt}
        value={languageFilterOpt}
        styles={customStyles}
        onChange={opt => {
          const options = opt === null ? [] : opt;
          setLanguageFilterOptions(options);
          setIdsFromDatastore();
        }}
        noOptionsMessage={() => null}
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
      marginRight: 5,
      marginBottom: "-2px",
      maskImage: `url(${svgCode})`,
      maskSize: "12px 12px",
      height: "12px",
      width: "12px"
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
    backgroundColor: state.data.color,
    height: 18,
    fontSize: 13,
    lineHeight: 1,
    color: "#dddddd",
    ":before": {
      backgroundColor: "#eeeeee",
      content:
        state.data.label === "Set" || state.data.label === "Unset"
          ? "normal"
          : "''",
      display: "inline-block",
      marginLeft: 5,
      marginTop: 3,
      maskImage: `url(${svgCode})`,
      maskSize: "12px 12px",
      height: "12px",
      width: "12px"
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
    backgroundColor: state.isFocused ? state.data.color : "none",
    opacity: state.isFocused ? "1" : "0.5",
    "&:hover": {
      backgroundColor: state.data.color,
      color: "#fff",
      opacity: "1"
    }
  })
};

const setLanguageOptions = languageFilterOpt => {
  let nextOptions;
  if (languageFilterOpt.length === 0) {
    nextOptions = [...setUnsetOptions, ...langOptions];
  } else {
    switch (languageFilterOpt[0].value) {
      case "__SET__":
      case "__UNSET__":
        nextOptions = [];
        break;
      default:
        nextOptions = [...langOptions];
        break;
    }
  }
  return nextOptions;
};

const mapStateToProps = state => ({
  languageFilterOpt: state.get("languageFilterOpt")
});

export default connect(mapStateToProps, {
  setLanguageFilterOptions,
  setIdsFromDatastore
})(LanguageInput);
