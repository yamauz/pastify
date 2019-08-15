import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  addKeywordFilterOptions,
  removeKeywordFilterOptions,
  changeKeywordFilterInputValue,
  setIdsFromDatastore
} from "../../../actions";
import CreatableSelect from "react-select/creatable";

import styled from "@emotion/styled";

const Wrapper = styled.div``;

const KeywordsInput = props => {
  const {
    keywordFilterOpt,
    keywordFilterInputValue,
    addKeywordFilterOptions,
    removeKeywordFilterOptions,
    changeKeywordFilterInputValue,
    setIdsFromDatastore
  } = props;

  return (
    <Wrapper>
      <CreatableSelect
        components={components}
        inputValue={keywordFilterInputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        placeholder="Select keyword ..."
        value={keywordFilterOpt}
        onChange={value => {
          removeKeywordFilterOptions(value);
          setIdsFromDatastore();
        }}
        onInputChange={value => {
          changeKeywordFilterInputValue(value);
        }}
        onKeyDown={e => {
          if (!e.target.value) return;
          switch (e.key) {
            case "Enter":
            case "Tab":
              const label = e.target.value;
              addKeywordFilterOptions({ label, value: label });
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
  keywordFilterOpt: state.get("keywordFilterOpt"),
  keywordFilterInputValue: state.get("keywordFilterInputValue")
});

export default connect(
  mapStateToProps,
  {
    addKeywordFilterOptions,
    removeKeywordFilterOptions,
    changeKeywordFilterInputValue,
    setIdsFromDatastore
  }
)(KeywordsInput);
