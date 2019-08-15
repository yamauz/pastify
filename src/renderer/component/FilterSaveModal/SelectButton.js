import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import { toggleFilterSaveModalVisibility } from "../../actions";
import { Button } from "semantic-ui-react";

const Wrapper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
`;
const DivLoop = styled.div``;

const SelectButton = props => {
  const { toggleFilterSaveModalVisibility } = props;
  return (
    <Wrapper>
      <Button
        id="cancel-save-filter"
        basic
        compact
        inverted
        onClick={e => {
          toggleFilterSaveModalVisibility();
        }}
      >
        Cancel
      </Button>
      <Button
        id="accept-save-filter"
        basic
        compact
        inverted
        onClick={e => {
          toggleFilterSaveModalVisibility();
        }}
        onKeyDown={e => {
          if (e.keyCode === 9) {
            if (e.shiftKey) {
              const elm = document.getElementById("accept-save-filter");
              elm.focus();
            } else {
              const elm = document.getElementById("divloop-start");
              elm.focus();
            }
          }
        }}
      >
        Save
      </Button>
      <DivLoop id="divloop-end" tabIndex={0} />
    </Wrapper>
  );
};

export default connect(
  null,
  {
    toggleFilterSaveModalVisibility
  }
)(SelectButton);
