import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import Select from "react-select";
import { setSortOptions, setIdsFromDatastore } from "../../../actions";
import Select from "react-select";
import defaultSortOptions from "../../../../common/sortOptions";

import styled from "@emotion/styled";

const Wrapper = styled.div``;

const SortInput = props => {
  const { sortOpt, setSortOptions, setIdsFromDatastore } = props;
  return (
    <Wrapper>
      <Select
        isMulti
        name="colors"
        options={createSortOptions(sortOpt)}
        // defaultValue={sortOpt}
        value={sortOpt}
        className="basic-multi-select"
        classNamePrefix="select"
        styles={sortStyles}
        onChange={opt => {
          const options = opt === null ? [] : opt;
          setSortOptions(options);
          setIdsFromDatastore();
        }}
      />
    </Wrapper>
  );
};

const createSortOptions = options => {
  const selectedValues = options.map(option => option.value);
  const oppositeIndexes = defaultSortOptions.map(option => {
    if (selectedValues.includes(option.value)) {
      return option.oppositeIndex;
    }
  });
  const nextOptions = defaultSortOptions.filter(
    (_, index) => !oppositeIndexes.includes(index)
  );

  return nextOptions;
};

const sortStyles = {
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
  sortOpt: state.get("sortOpt")
});

export default connect(
  mapStateToProps,
  { setSortOptions, setIdsFromDatastore }
)(SortInput);
