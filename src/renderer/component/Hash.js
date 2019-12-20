import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  margin-right: 3px;
  line-height: 1.5;
  display: ${props => (props.tag.length === 0 ? "none" : "inline-block")};
`;
const HashTag = styled.div`
  color: #ffffff;
  font-family: sans-serif;
  display: inline-block;
  padding: 1px 8px 1px 6px;
  margin: 0;
  font-size: 8.5px;
  border-radius: 10px;
  background-color: #154030;
`;

const IconWrapper = styled.span`
  display: inline-block;
  margin-right: 3px;
`;
const HashName = styled.span`
  color: #dcdcdc;
  font-weight: lighter;
`;
const Hash = props => {
  return <Wrapper tag={props.tag}>{renderHashTag(props.tag)}</Wrapper>;
};

const renderHashTag = tags => {
  const tagList = [];
  for (const tag of tags) {
    tagList.push(
      <HashTag key={tag.value}>
        <IconWrapper>
          <FontAwesomeIcon icon={faHashtag} size="sm" />
        </IconWrapper>
        <HashName>{tag.value}</HashName>
      </HashTag>
    );
  }
  return tagList;
};

export default Hash;
