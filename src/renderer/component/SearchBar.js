import React, { useState, useEffect } from "react";
import "semantic-ui-css/semantic.min.css";
import { Search } from "semantic-ui-react";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  background-color: #2f3129;
  padding: 5px 5px;
  width: 100vw;
`;

const SearchBar = props => {
  const { id, data } = props;
  return (
    <Wrapper>
      {/* <div id="searchbar"></div> */}
      <Search
        id="searchbar"
        category
        fluid
        // resultRenderer={this.resultRenderer}
        // loading={isLoading}
        // onResultSelect={this.handleResultSelect}
        // onSearchChange={this.handleSearchChange}
        // onFocus={this.setCurrentFocus}
        selectFirstResult
        // results={results}
        showNoResults={false}
        // value={value}
        input={{
          fluid: true,
          iconPosition: "left"
        }}
        size="mini"
      />
    </Wrapper>
  );
};

export default SearchBar;
