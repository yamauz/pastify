import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFireAlt } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  margin-right: 3px;
  line-height: 1.5;
  display: ${props => (props.keyTag === "" ? "none" : "inline-block")};
`;
const KeyTag = styled.div`
  display: inline-block;
  color: #ffffff;
  padding: 0px 8px 1px 6px;
  margin: 0;
  font-size: 10px;
  border-radius: 10px;
  background-color: #a0323ce0;
`;

const IconWrapper = styled.span`
  display: inline-block;
  margin-right: 3px;
`;
const KeyName = styled.span`
  color: #dcdcdc;
  font-weight: lighter;
`;

const Key = props => {
  const { keyTag } = props;
  return (
    <Wrapper keyTag={keyTag}>
      <KeyTag>
        <IconWrapper>
          <FontAwesomeIcon icon={faFireAlt} size="sm" />
        </IconWrapper>
        <KeyName>{keyTag}</KeyName>
      </KeyTag>
    </Wrapper>
  );
};

export default Key;
