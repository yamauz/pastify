import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import Select from "react-select";
import { setStatusFilterOptions, setIdsFromDatastore } from "../../../actions";
import Select from "react-select";
import defaultStatusOptions from "../../../../common/statusOptions";

import styled from "@emotion/styled";

const Wrapper = styled.div``;

const StatusInput = props => {
  const {
    statusFilterOpt,
    setStatusFilterOptions,
    setIdsFromDatastore
  } = props;
  return (
    <Wrapper>
      <Select
        placeholder={"Select item status"}
        isMulti
        options={setStatusOptions(statusFilterOpt)}
        value={statusFilterOpt}
        // defaultValue={statusFilterOpt}
        styles={customStyles}
        onChange={opt => {
          const options = opt === null ? [] : opt;
          setStatusFilterOptions(options);
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

const setStatusOptions = options => {
  const nextOptions = options.length < 1 ? defaultStatusOptions : [];
  return nextOptions;
};

const mapStateToProps = state => ({
  statusFilterOpt: state.get("statusFilterOpt")
});

export default connect(
  mapStateToProps,
  { setStatusFilterOptions, setIdsFromDatastore }
)(StatusInput);
