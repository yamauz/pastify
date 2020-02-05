import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { setFilterName, setIdsFromDatastore } from "../../../actions";

import styled from "@emotion/styled";

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

const NameInput = styled.input`
  background-color: #333335;
  border: none;
  height: 25px;
  padding-left: 8px;
  caret-color: #eeeeee;
  color: #dddddd;
  width: 100%;
  max-width: 400px;
  &:focus {
    border: solid 1px #5c5d37;
  }
`;

const Component = props => {
  const { setFilterName, setIdsFromDatastore, filterName } = props;

  return (
    <Wrapper>
      <FilterHeader>Name</FilterHeader>
      <FilterDescription>
        Type the name of this settings. the name will show on item list header.
      </FilterDescription>
      <NameInput
        value={filterName}
        onChange={e => {
          setFilterName(e.target.value);
          setIdsFromDatastore(false);
        }}
      ></NameInput>
    </Wrapper>
  );
};

const mapStateToProps = state => ({
  keywordFilterOpt: state.get("keywordFilterOpt"),
  keywordFilterInputValue: state.get("keywordFilterInputValue"),
  filterName: state.get("filterName")
});

export default connect(mapStateToProps, {
  setFilterName,
  setIdsFromDatastore
})(Component);
