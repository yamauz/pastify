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

const Wrapper = styled.div``;

const DataTypesInput = props => {
  const {
    dataTypeFilterOpt,
    setDataTypeFilterOptions,
    setIdsFromDatastore
  } = props;
  return (
    <Wrapper>
      <Select
        placeholder={"Select data type"}
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

const mapStateToProps = state => ({
  dataTypeFilterOpt: state.get("dataTypeFilterOpt")
});

export default connect(
  mapStateToProps,
  { setDataTypeFilterOptions, setIdsFromDatastore }
)(DataTypesInput);
