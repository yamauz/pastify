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
  font-size: 10px;
  padding-left: 6px;
  padding-right: 6px;
  border-radius: 10px;
  /* background-color: #6b8c37; */
  box-sizing: border-box;
  border: solid 0.5px #cccccc;
  opacity: 0.9;
  display: inline-block;
  margin: 0;
  margin-right: 3px;
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
