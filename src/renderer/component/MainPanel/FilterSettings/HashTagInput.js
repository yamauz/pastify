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
import defaultHashTagOptions from "../../../../common/hashTagOptions";

import styled from "@emotion/styled";

const Wrapper = styled.div``;

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
      <CreatableSelect
        placeholder={"Select or Type hash tag"}
        inputValue={hashTagFilterInputValue}
        options={setHashTagOption(hashTagOptions, hashTagFilterOpt)}
        isClearable={false}
        isMulti
        value={hashTagFilterOpt}
        styles={customStyles}
        onChange={opt => {
          const options = opt === null ? [] : opt;
          setHashTagFilterOptions(options);
          setIdsFromDatastore();
        }}
        onInputChange={value => {
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
  multiValue: (styles, { data }) => ({
    ...styles,
    backgroundColor: "green"
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    backgroundColor: "red"
    // color: data.color,
    // color: "red"
  })
  // multiValueRemove: (styles, { data }) => ({
  //   ...styles,
  //   color: data.color,
  //   ':hover': {
  //     backgroundColor: data.color,
  //     color: 'white',
  //   },
  // }),
};

const setHashTagOption = (hashTagOptions, hashTagFilterOpt) => {
  let nextOptions;
  if (hashTagFilterOpt.length === 0) {
    nextOptions = [...defaultHashTagOptions, ...hashTagOptions];
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

export default connect(
  mapStateToProps,
  {
    setHashTagFilterOptions,
    setIdsFromDatastore,
    changeHashTagFilterInputValue,
    addHashTagFilterOptions
  }
)(HashTagInput);
