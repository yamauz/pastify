import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import Select from "react-select";
import { saveFilter, updateFilter } from "../../../actions";

import styled from "@emotion/styled";

const Wrapper = styled.div`
  margin-bottom: 20px;
`;

const Button = styled.button`
  /* width: 60px; */
    /* opacity: ${props => (props.isTrashed ? 0.7 : 1)}; */
  height: 25px;
  font-size: 11px;
  background-color: #565656;
  border: none;
  color: #dddddd;
  transition: background-color 0.1s;
  &:hover {
    background-color: #8a8a8a;
  }
`;

const Component = props => {
  const { filtersList, filterName, saveFilter, updateFilter } = props;

  const filterNameList = [];
  const filterShortcutKeysList = [];
  filtersList.forEach(val => {
    const filterName = val.get("filterName");
    const filterShortcutKeyOpt = val.get("filterShortcutKeyOpt");
    filterNameList.push(filterName);
    if (filterShortcutKeyOpt !== null) {
      filterShortcutKeysList.push(filterShortcutKeyOpt.label);
    }
  });

  const isFilterNameAlreadyExists = filterNameList.includes(filterName);

  return (
    <Wrapper>
      <Button
        onClick={e => {
          isFilterNameAlreadyExists ? updateFilter() : saveFilter();
        }}
      >
        {isFilterNameAlreadyExists ? "Update Current Settings" : "Save as New"}
      </Button>
    </Wrapper>
  );
};

const mapStateToProps = state => ({
  filtersList: state.get("filtersList"),
  filterName: state.get("filterName")
});

export default connect(mapStateToProps, {
  saveFilter,
  updateFilter
})(Component);
