import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import Select from "react-select";
import {
  setHashTagFilterOptions,
  changeHashTagFilterInputValue,
  setIdsFromDatastore,
  addHashTagFilterOptions
} from "../../../actions";
import CreatableSelect from "react-select/creatable";
import setUnsetOptions from "../../../../common/setUnsetOptions";

import styled from "@emotion/styled";

const svgHashtag =
  "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20448%20512%22%3E%3Cpath%20d%3D%22M440.667%20182.109l7.143-40c1.313-7.355-4.342-14.109-11.813-14.109h-74.81l14.623-81.891C377.123%2038.754%20371.468%2032%20363.997%2032h-40.632a12%2012%200%200%200-11.813%209.891L296.175%20128H197.54l14.623-81.891C213.477%2038.754%20207.822%2032%20200.35%2032h-40.632a12%2012%200%200%200-11.813%209.891L132.528%20128H53.432a12%2012%200%200%200-11.813%209.891l-7.143%2040C33.163%20185.246%2038.818%20192%2046.289%20192h74.81L98.242%20320H19.146a12%2012%200%200%200-11.813%209.891l-7.143%2040C-1.123%20377.246%204.532%20384%2012.003%20384h74.81L72.19%20465.891C70.877%20473.246%2076.532%20480%2084.003%20480h40.632a12%2012%200%200%200%2011.813-9.891L151.826%20384h98.634l-14.623%2081.891C234.523%20473.246%20240.178%20480%20247.65%20480h40.632a12%2012%200%200%200%2011.813-9.891L315.472%20384h79.096a12%2012%200%200%200%2011.813-9.891l7.143-40c1.313-7.355-4.342-14.109-11.813-14.109h-74.81l22.857-128h79.096a12%2012%200%200%200%2011.813-9.891zM261.889%20320h-98.634l22.857-128h98.634l-22.857%20128z%22%2F%3E%3C%2Fsvg%3E";
const hashtagColor = "#154030";

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

const HashTagInput = props => {
  const {
    hashTagOptions,
    hashTagFilterOpt,
    hashTagFilterInputValue,
    changeHashTagFilterInputValue,
    addHashTagFilterOptions,
    setHashTagFilterOptions,
    setIdsFromDatastore
  } = props;
  return (
    <Wrapper>
      <FilterHeader>
        Filter : <FilterBy>Label > Hashtag</FilterBy>
      </FilterHeader>
      <FilterDescription>
        Select or Type Hashtag. Allows multi-selection.
      </FilterDescription>
      <CreatableSelect
        noOptionsMessage={() => null}
        menuPosition={"fixed"}
        placeholder={null}
        inputValue={hashTagFilterInputValue}
        options={setHashTagOption(hashTagOptions, hashTagFilterOpt)}
        isMulti
        value={hashTagFilterOpt}
        styles={customStyles}
        onChange={opt => {
          const options = opt === null ? [] : opt;
          setHashTagFilterOptions(options);
          setIdsFromDatastore();
        }}
        onInputChange={value => {
          const filterLabels = hashTagFilterOpt.map(opt => opt.label);
          if (filterLabels.includes("Set") || filterLabels.includes("Unset"))
            return;
          if (value.length < 17) changeHashTagFilterInputValue(value);
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
              addHashTagFilterOptions(option);
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
      marginRight: 3,
      marginBottom: "-2px",
      maskImage: `url(${svgHashtag})`,
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
    backgroundColor:
      state.data.label === "Set" || state.data.label === "Unset"
        ? state.data.color
        : hashtagColor,
    height: 18,
    fontSize: 13,
    lineHeight: 1,
    color: "#dddddd",
    paddingLeft: -5,
    ":before": {
      backgroundColor: "#eeeeee",
      content:
        state.data.label === "Set" || state.data.label === "Unset"
          ? "normal"
          : "''",
      display: "inline-block",
      marginLeft: 5,
      marginTop: 3,
      maskImage: `url(${svgHashtag})`,
      maskSize: "11px 11px",
      height: "11px",
      width: "11px"
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
    // backgroundColor: state.isSelected ? state.data.color : "none",
    backgroundColor: state.isSelected
      ? state.data.label === "Set" || state.data.label === "Unset"
        ? state.data.color
        : hashtagColor
      : "none",
    opacity: state.isFocused ? "1" : "0.5",
    "&:hover": {
      backgroundColor:
        state.data.label === "Set" || state.data.label === "Unset"
          ? state.data.color
          : hashtagColor,
      color: "#fff",
      opacity: "1"
    }
  })
};

const setHashTagOption = (hashTagOptions, hashTagFilterOpt) => {
  let nextOptions;
  if (hashTagFilterOpt.length === 0) {
    nextOptions = [...setUnsetOptions, ...hashTagOptions];
  } else {
    switch (hashTagFilterOpt[0].value) {
      case "__SET__":
      case "__UNSET__":
        nextOptions = [];
        break;
      default:
        nextOptions = [...hashTagOptions];
        break;
    }
  }
  return nextOptions;
};

const mapStateToProps = state => ({
  hashTagOptions: state.get("hashTagOptions"),
  hashTagFilterOpt: state.get("hashTagFilterOpt"),
  hashTagFilterInputValue: state.get("hashTagFilterInputValue")
});

export default connect(mapStateToProps, {
  setHashTagFilterOptions,
  setIdsFromDatastore,
  changeHashTagFilterInputValue,
  addHashTagFilterOptions
})(HashTagInput);
