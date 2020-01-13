import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import Select from "react-select";
import { saveFilter, updateFilter } from "../../../actions";

import styled from "@emotion/styled";

const Wrapper = styled.div`
  margin-bottom: 20px;
  display: flex;
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
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  &:hover {
    background-color: #8a8a8a;
  }
`;

const ErrorMessage = styled.div`
  padding-top: 2px;
  margin-left: 10px;
  color: #c37171;
  font-size: 10px;
`;

const Component = props => {
  const {
    filterShortcutKeyOpt,
    filtersList,
    filterName,
    saveFilter,
    updateFilter
  } = props;

  const filterNameList = [];
  const filterShortcutKeyList = [];
  filtersList.forEach(val => {
    const _filterName = val.get("filterName");
    const _filterShortcutKeyOpt = val.get("filterShortcutKeyOpt");
    filterNameList.push(_filterName);
    if (_filterShortcutKeyOpt !== null) {
      if (_filterShortcutKeyOpt.label !== undefined) {
        filterShortcutKeyList.push({
          name: _filterName,
          key: _filterShortcutKeyOpt.label
        });
      }
    }
  });

  const isFilterNameAlreadyExists = filterNameList.includes(filterName);

  let isFilterShortcutKeyAlreadyExists;
  if (filterShortcutKeyOpt !== null) {
    isFilterShortcutKeyAlreadyExists = filterShortcutKeyList.some(
      list =>
        filterShortcutKeyOpt.label === list.key && filterName !== list.name
    );
  }

  return (
    <Wrapper>
      <Button
        disabled={isFilterShortcutKeyAlreadyExists}
        onClick={e => {
          isFilterNameAlreadyExists ? updateFilter() : saveFilter();
        }}
      >
        {isFilterNameAlreadyExists ? "Update Current Settings" : "Save as New"}
      </Button>
      <ErrorMessage>
        {setErrorMessage(filterName, isFilterShortcutKeyAlreadyExists)}{" "}
      </ErrorMessage>
    </Wrapper>
  );
};

const setErrorMessage = (filterName, isFilterShortcutKeyAlreadyExists) => {
  let message;
  if (filterName === "") {
    message = "Set this settings name.";
  } else if (isFilterShortcutKeyAlreadyExists) {
    message = "Designated keybinding is already used.";
  } else {
    message = "";
  }
  return message;
};

const mapStateToProps = state => ({
  filterShortcutKeyOpt: state.get("filterShortcutKeyOpt"),
  filtersList: state.get("filtersList"),
  filterName: state.get("filterName")
});

export default connect(mapStateToProps, {
  saveFilter,
  updateFilter
})(Component);
