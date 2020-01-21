import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import langOptions from "../../../common/langOptions";
import Select from "react-select";
import { setLangOptionsSelected } from "../../actions";
const svgCode =
  "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20576%20512%22%3E%3Cpath%20d%3D%22M234.8%20511.7L196%20500.4c-4.2-1.2-6.7-5.7-5.5-9.9L331.3%205.8c1.2-4.2%205.7-6.7%209.9-5.5L380%2011.6c4.2%201.2%206.7%205.7%205.5%209.9L244.7%20506.2c-1.2%204.3-5.6%206.7-9.9%205.5zm-83.2-121.1l27.2-29c3.1-3.3%202.8-8.5-.5-11.5L72.2%20256l106.1-94.1c3.4-3%203.6-8.2.5-11.5l-27.2-29c-3-3.2-8.1-3.4-11.3-.4L2.5%20250.2c-3.4%203.2-3.4%208.5%200%2011.7L140.3%20391c3.2%203%208.2%202.8%2011.3-.4zm284.1.4l137.7-129.1c3.4-3.2%203.4-8.5%200-11.7L435.7%20121c-3.2-3-8.3-2.9-11.3.4l-27.2%2029c-3.1%203.3-2.8%208.5.5%2011.5L503.8%20256l-106.1%2094.1c-3.4%203-3.6%208.2-.5%2011.5l27.2%2029c3.1%203.2%208.1%203.4%2011.3.4z%22%2F%3E%3C%2Fsvg%3E";

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
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20512%22%20fill%3D%22%23dddddd%22%3E%3Cpath%20d%3D%22M278.9%20511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2%208.7c1.8-6.4%208.5-10%2014.9-8.2l61%2017.7c6.4%201.8%2010%208.5%208.2%2014.9L293.8%20503.3c-1.9%206.4-8.5%2010.1-14.9%208.2zm-114-112.2l43.5-46.4c4.6-4.9%204.3-12.7-.8-17.2L117%20256l90.6-79.7c5.1-4.5%205.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8%20247.2c-5.1%204.7-5.1%2012.8%200%2017.5l144.1%20135.1c4.9%204.6%2012.5%204.4%2017-.5zm327.2.6l144.1-135.1c5.1-4.7%205.1-12.8%200-17.5L492.1%20112.1c-4.8-4.5-12.4-4.3-17%20.5L431.6%20159c-4.6%204.9-4.3%2012.7.8%2017.2L523%20256l-90.6%2079.7c-5.1%204.5-5.5%2012.3-.8%2017.2l43.5%2046.4c4.5%204.9%2012.1%205.1%2017%20.6z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    vertical-align: middle;
    margin-right: 4px;
    width: 12px;
    height: 12px;
  }
`;

const LanguageInput = props => {
  const { lang, setLangOptionsSelected } = props;
  return (
    <Wrapper>
      <Label id="key-label">
        <Description>Language</Description>
      </Label>
      <Select
        noOptionsMessage={() => null}
        menuPosition={"fixed"}
        isMulti
        placeholder={null}
        name="colors"
        options={lang.length > 0 ? [] : langOptions}
        defaultValue={lang}
        className="basic-multi-select"
        classNamePrefix="select"
        styles={customStyles}
        onInputChange={value => (lang.length > 0 ? "" : value)}
        onChange={opt => {
          const _option = opt === null ? [] : opt;
          setLangOptionsSelected(_option);
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

const setLangOptions = langSelected => {
  const nextLangSelected = langSelected === "" ? langOptions : [];
  return nextLangSelected;
};

const createLangValue = lang => {
  const langValue = langOptions.filter(option => lang === option.value);
  return langValue;
};

export default connect(null, {
  setLangOptionsSelected
})(LanguageInput);
