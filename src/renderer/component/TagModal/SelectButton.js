import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import {
  toggleModalVisibility,
  restoreItemOnCancel,
  saveTag
} from "../../actions";
import { Button } from "semantic-ui-react";

const Wrapper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
`;
const DivLoop = styled.div``;

const SelectButton = props => {
  const { id, toggleModalVisibility, restoreItemOnCancel, saveTag } = props;
  return (
    <Wrapper>
      <Button
        id="cancel-change-tag"
        basic
        compact
        inverted
        onClick={e => {
          toggleModalVisibility(id);
          restoreItemOnCancel();
          const elm = document.getElementById("item-list");
          elm.focus();
        }}
      >
        Cancel
      </Button>
      <Button
        id="accept-change-tag"
        basic
        compact
        inverted
        onClick={e => {
          toggleModalVisibility(id);
          saveTag();
          const elm = document.getElementById("item-list");
          elm.focus();
        }}
        onKeyDown={e => {
          if (e.keyCode === 9) {
            if (e.shiftKey) {
              const elm = document.getElementById("accept-change-tag");
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
    toggleModalVisibility,
    restoreItemOnCancel,
    saveTag
  }
)(SelectButton);
