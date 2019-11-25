import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  addIdFilterOptions,
  removeIdFilterOptions,
  changeIdFilterInputValue,
  setIdsFromDatastore
} from "../../../actions";
import CreatableSelect from "react-select/creatable";

import styled from "@emotion/styled";

const Wrapper = styled.div``;

const IdInput = props => {
  const {
    idFilterOpt,
    idFilterInputValue,
    addIdFilterOptions,
    removeIdFilterOptions,
    changeIdFilterInputValue,
    setIdsFromDatastore
  } = props;

  return (
    <Wrapper>
      <CreatableSelect
        autoFocus={true}
        components={components}
        inputValue={idFilterInputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        placeholder="Select item id ..."
        value={idFilterOpt}
        onChange={value => {
          removeIdFilterOptions(value);
          setIdsFromDatastore();
        }}
        onInputChange={value => {
          changeIdFilterInputValue(value);
        }}
        onKeyDown={e => {
          if (!e.target.value) return;
          switch (e.key) {
            case "Enter":
            case "Tab":
              const label = e.target.value;
              addIdFilterOptions({ label, value: label });
              setIdsFromDatastore();
              e.preventDefault();
          }
        }}
      />
    </Wrapper>
  );
};

const components = {
  DropdownIndicator: null
};

const mapStateToProps = state => ({
  idFilterOpt: state.get("idFilterOpt"),
  idFilterInputValue: state.get("idFilterInputValue")
});

export default connect(mapStateToProps, {
  addIdFilterOptions,
  removeIdFilterOptions,
  changeIdFilterInputValue,
  setIdsFromDatastore
})(IdInput);
