import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import Select from "react-select";
import { setSortOptions, setIdsFromDatastore } from "../../../actions";
import Select from "react-select";
// import defaultSortOptions from "../../../../common/sortOptions";
import { groupedOptions, sortOptions } from "../../../../common/sortOptions";

import styled from "@emotion/styled";
import { css } from "@emotion/core";

import SortDown from "../../../../icon/listheader/sort-amount-down.svg";
import SortUp from "../../../../icon/listheader/sort-amount-up.svg";

const svgSortDown =
  "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%3E%3Cpath%20d%3D%22M156.718%20404.24l-67.994%2072.002c-4.732%205.01-12.713%205.014-17.448%200L3.283%20404.24C-3.883%20396.652%201.428%20384%2012.007%20384H56V44c0-6.627%205.373-12%2012-12h24c6.627%200%2012%205.373%2012%2012v340h43.994c10.587%200%2015.884%2012.658%208.724%2020.24zM236%20136h264c6.627%200%2012-5.373%2012-12v-24c0-6.627-5.373-12-12-12H236c-6.627%200-12%205.373-12%2012v24c0%206.627%205.373%2012%2012%2012zm-12%2084v-24c0-6.627%205.373-12%2012-12h200c6.627%200%2012%205.373%2012%2012v24c0%206.627-5.373%2012-12%2012H236c-6.627%200-12-5.373-12-12zm0%20192v-24c0-6.627%205.373-12%2012-12h72c6.627%200%2012%205.373%2012%2012v24c0%206.627-5.373%2012-12%2012h-72c-6.627%200-12-5.373-12-12zm0-96v-24c0-6.627%205.373-12%2012-12h136c6.627%200%2012%205.373%2012%2012v24c0%206.627-5.373%2012-12%2012H236c-6.627%200-12-5.373-12-12z%22%2F%3E%3C%2Fsvg%3E";

const svgSortUp =
  "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%3E%3Cpath%20d%3D%22M3.282%20107.76l67.994-72.002c4.732-5.01%2012.713-5.014%2017.448%200l67.993%2072.002c7.166%207.587%201.856%2020.24-8.724%2020.24H104v340c0%206.627-5.373%2012-12%2012H68c-6.627%200-12-5.373-12-12V128H12.006c-10.587%200-15.884-12.658-8.724-20.24zM236%20136h264c6.627%200%2012-5.373%2012-12v-24c0-6.627-5.373-12-12-12H236c-6.627%200-12%205.373-12%2012v24c0%206.627%205.373%2012%2012%2012zm-12%2084v-24c0-6.627%205.373-12%2012-12h200c6.627%200%2012%205.373%2012%2012v24c0%206.627-5.373%2012-12%2012H236c-6.627%200-12-5.373-12-12zm0%20192v-24c0-6.627%205.373-12%2012-12h72c6.627%200%2012%205.373%2012%2012v24c0%206.627-5.373%2012-12%2012h-72c-6.627%200-12-5.373-12-12zm0-96v-24c0-6.627%205.373-12%2012-12h136c6.627%200%2012%205.373%2012%2012v24c0%206.627-5.373%2012-12%2012H236c-6.627%200-12-5.373-12-12z%22%2F%3E%3C%2Fsvg%3E";
const ascColor = "#712828";
const descColor = "#283171";
// const SVGtemplate = "data:image/svg+xml;charset=utf8,";

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

const FilterDescription = styled.p`
  font-size: 10px;
  color: #bbbbbb;
  margin-bottom: 5px;
`;

const GroupWrapper = styled.div`
  padding-left: 5px;
  width: 100%;
  display: inline-block;
`;
const GroupTitle = styled.div`
  display: inline-block;
  margin-left: 20px;
`;

const SortInput = props => {
  const { sortOpt, setSortOptions, setIdsFromDatastore } = props;
  return (
    <Wrapper>
      <FilterHeader>
        Sort : <FilterBy>Order and Key</FilterBy>
      </FilterHeader>
      <FilterDescription>
        Select a combination of sort order and key. Allows multi-selection.
      </FilterDescription>
      <Select
        isMulti
        name="sort"
        placeholder={null}
        options={createSortOptions(sortOpt)}
        // options={groupedOptions}
        formatGroupLabel={formatGroupLabel}
        // defaultValue={sortOpt}
        value={sortOpt}
        className="basic-multi-select"
        classNamePrefix="select"
        styles={customStyles}
        onChange={opt => {
          const options = opt === null ? [] : opt;
          setSortOptions(options);
          setIdsFromDatastore();
        }}
        noOptionsMessage={() => null}
        menuPosition={"fixed"}
      />
    </Wrapper>
  );
};

const formatGroupLabel = data => (
  <GroupWrapper>
    {showLabelIcon(data.label)}
    <GroupTitle label={data.label}>{data.label}</GroupTitle>
  </GroupWrapper>
);

const showLabelIcon = label => {
  console.log(label);
  const style = {
    position: "absolute",
    marginTop: 2,
    width: 15,
    fill: "#bcbcbc"
  };
  return label === "Ascending" ? (
    <SortUp style={style} />
  ) : (
    <SortDown style={style} />
  );
};

const createSortOptions = options => {
  const selectedAscOpt = options.map(opt => {
    if (opt.order === "asc") return opt.label;
  });
  const selectedDescOpt = options.map(opt => {
    if (opt.order === "desc") return opt.label;
  });
  const newAscOptions = groupedOptions[0].options.filter(
    opt => !selectedDescOpt.includes(opt.label)
  );
  const newDescOptions = groupedOptions[1].options.filter(
    opt => !selectedAscOpt.includes(opt.label)
  );
  const newGroupedOptions = [
    {
      label: "Ascending",
      options: newAscOptions
    },
    {
      label: "Descending",
      options: newDescOptions
    }
  ];
  return newGroupedOptions;
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
    backgroundColor: "#333335",
    paddingTop: 0,
    paddingBottom: 0
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
    backgroundColor: state.data.order === "asc" ? ascColor : descColor,
    height: 18,
    fontSize: 13,
    lineHeight: 1,
    color: "#dddddd",
    ":before": {
      backgroundColor: "#eeeeee",
      content: "''",
      display: "inline-block",
      marginLeft: 2,
      marginTop: 1,
      maskImage:
        state.data.order === "asc"
          ? `url(${svgSortUp})`
          : `url(${svgSortDown})`,
      maskSize: "16px 16px",
      height: "16px",
      width: "16px"
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
    backgroundColor: state.isSelected
      ? state.data.order === "asc"
        ? ascColor
        : descColor
      : "none",
    opacity: state.isFocused ? "1" : "0.5",
    "&:hover": {
      backgroundColor: state.data.order === "asc" ? ascColor : descColor,
      color: "#fff",
      opacity: "1"
    }
  }),
  group: (styles, state) => ({
    ...styles,
    padding: 0
  }),
  groupHeading: (styles, state) => ({
    ...styles,
    backgroundColor: "#2d2d33",
    padding: 0
  })
};

const mapStateToProps = state => ({
  sortOpt: state.get("sortOpt")
});

export default connect(mapStateToProps, {
  setSortOptions,
  setIdsFromDatastore
})(SortInput);
