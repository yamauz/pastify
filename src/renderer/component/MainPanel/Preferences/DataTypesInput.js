import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import Select from "react-select";
import {
  setDataTypeFilterOptions,
  setIdsFromDatastore
} from "../../../actions";
import Select from "react-select";
import defaultDataTypeOptions from "../../../../common/dataTypeOptions";

import styled from "@emotion/styled";

const svgText =
  "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20576%20512%22%3E%3Cpath%20d%3D%22M259.3%2017.8L194%20150.2%2047.9%20171.5c-26.2%203.8-36.7%2036.1-17.7%2054.6l105.7%20103-25%20145.5c-4.5%2026.3%2023.2%2046%2046.4%2033.7L288%20439.6l130.7%2068.7c23.2%2012.2%2050.9-7.4%2046.4-33.7l-25-145.5%20105.7-103c19-18.5%208.5-50.8-17.7-54.6L382%20150.2%20316.7%2017.8c-11.7-23.6-45.6-23.9-57.4%200z%22%2F%3E%3C%2Fsvg%3E";

const svgImage =
  "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20576%20512%22%3E%3Cpath%20d%3D%22M528.1%20171.5L382%20150.2%20316.7%2017.8c-11.7-23.6-45.6-23.9-57.4%200L194%20150.2%2047.9%20171.5c-26.2%203.8-36.7%2036.1-17.7%2054.6l105.7%20103-25%20145.5c-4.5%2026.3%2023.2%2046%2046.4%2033.7L288%20439.6l130.7%2068.7c23.2%2012.2%2050.9-7.4%2046.4-33.7l-25-145.5%20105.7-103c19-18.5%208.5-50.8-17.7-54.6zM388.6%20312.3l23.7%20138.4L288%20385.4l-124.3%2065.3%2023.7-138.4-100.6-98%20139-20.2%2062.2-126%2062.2%20126%20139%2020.2-100.6%2098z%22%2F%3E%3C%2Fsvg%3E";
const svgFile =
  "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20448%20512%22%3E%3Cpath%20d%3D%22M268%20416h24a12%2012%200%200%200%2012-12V188a12%2012%200%200%200-12-12h-24a12%2012%200%200%200-12%2012v216a12%2012%200%200%200%2012%2012zM432%2080h-82.41l-34-56.7A48%2048%200%200%200%20274.41%200H173.59a48%2048%200%200%200-41.16%2023.3L98.41%2080H16A16%2016%200%200%200%200%2096v16a16%2016%200%200%200%2016%2016h16v336a48%2048%200%200%200%2048%2048h288a48%2048%200%200%200%2048-48V128h16a16%2016%200%200%200%2016-16V96a16%2016%200%200%200-16-16zM171.84%2050.91A6%206%200%200%201%20177%2048h94a6%206%200%200%201%205.15%202.91L293.61%2080H154.39zM368%20464H80V128h288zm-212-48h24a12%2012%200%200%200%2012-12V188a12%2012%200%200%200-12-12h-24a12%2012%200%200%200-12%2012v216a12%2012%200%200%200%2012%2012z%22%2F%3E%3C%2Fsvg%3E";
const svgSheet =
  "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20448%20512%22%3E%3Cpath%20d%3D%22M268%20416h24a12%2012%200%200%200%2012-12V188a12%2012%200%200%200-12-12h-24a12%2012%200%200%200-12%2012v216a12%2012%200%200%200%2012%2012zM432%2080h-82.41l-34-56.7A48%2048%200%200%200%20274.41%200H173.59a48%2048%200%200%200-41.16%2023.3L98.41%2080H16A16%2016%200%200%200%200%2096v16a16%2016%200%200%200%2016%2016h16v336a48%2048%200%200%200%2048%2048h288a48%2048%200%200%200%2048-48V128h16a16%2016%200%200%200%2016-16V96a16%2016%200%200%200-16-16zM171.84%2050.91A6%206%200%200%201%20177%2048h94a6%206%200%200%201%205.15%202.91L293.61%2080H154.39zM368%20464H80V128h288zm-212-48h24a12%2012%200%200%200%2012-12V188a12%2012%200%200%200-12-12h-24a12%2012%200%200%200-12%2012v216a12%2012%200%200%200%2012%2012z%22%2F%3E%3C%2Fsvg%3E";

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

const DataTypesInput = props => {
  const {
    dataTypeFilterOpt,
    setDataTypeFilterOptions,
    setIdsFromDatastore
  } = props;
  return (
    <Wrapper>
      <FilterHeader>
        Filter : <FilterBy>Datatype</FilterBy>
      </FilterHeader>
      <FilterDescription>
        Select Datatype. Allows multi-registration.
      </FilterDescription>
      <Select
        noOptionsMessage={() => null}
        menuPosition={"fixed"}
        placeholder={null}
        isMulti
        options={defaultDataTypeOptions}
        // defaultValue={dataTypeFilterOpt}
        value={dataTypeFilterOpt}
        styles={customStyles}
        onChange={opt => {
          const options = opt === null ? [] : opt;
          setDataTypeFilterOptions(options);
          setIdsFromDatastore();
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
    backgroundColor: state.data.color,
    opacity: state.isFocused ? "1" : "0.5",
    "&:hover": {
      backgroundColor: state.data.color,
      color: "#fff",
      opacity: "1"
    }
  })
};

const mapStateToProps = state => ({
  dataTypeFilterOpt: state.get("dataTypeFilterOpt")
});

export default connect(mapStateToProps, {
  setDataTypeFilterOptions,
  setIdsFromDatastore
})(DataTypesInput);
