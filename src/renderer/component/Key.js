import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

const KeyTag = styled.span`
  font-family: sans-serif;
  display: inline-block;
  color: #dddddd;
  padding: 1px 6px 0px 6px;
  margin: 2px 4px 10px 0;
  font-size: 9px;
  border-radius: 10px;
  line-height: 1.5;
  background-color: #670d15e0;
  &:before {
    display: inline-block;
    content: " ";
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20448%20512%22%20fill%3D%22%23ffffff%22%3E%3Cpath%20d%3D%22M400%2032H48C21.49%2032%200%2053.49%200%2080v352c0%2026.51%2021.49%2048%2048%2048h352c26.51%200%2048-21.49%2048-48V80c0-26.51-21.49-48-48-48zm-6%20400H54a6%206%200%200%201-6-6V86a6%206%200%200%201%206-6h340a6%206%200%200%201%206%206v340a6%206%200%200%201-6%206zm-50-292v232c0%206.627-5.373%2012-12%2012h-24c-6.627%200-12-5.373-12-12v-92H152v92c0%206.627-5.373%2012-12%2012h-24c-6.627%200-12-5.373-12-12V140c0-6.627%205.373-12%2012-12h24c6.627%200%2012%205.373%2012%2012v92h144v-92c0-6.627%205.373-12%2012-12h24c6.627%200%2012%205.373%2012%2012z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    vertical-align: top;
    margin-right: 2px;
    width: 12px;
    height: 12px;
  }
`;

const Key = props => {
  const { keyTag } = props;
  return !!keyTag && <KeyTag>{keyTag}</KeyTag>;
};

export default Key;
