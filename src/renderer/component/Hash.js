import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

const HashTag = styled.span`
  font-family: sans-serif;
  display: inline-block;
  color: #dddddd;
  padding: 1px 6px 0px 6px;
  margin: 2px 4px 10px 0;
  font-size: 9px;
  border-radius: 10px;
  line-height: 1.5;
  background-color: #154030;
  &:before {
    display: inline-block;
    content: " ";
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20448%20512%22%20fill%3D%22%23dddddd%22%3E%3Cpath%20d%3D%22M440.667%20182.109l7.143-40c1.313-7.355-4.342-14.109-11.813-14.109h-74.81l14.623-81.891C377.123%2038.754%20371.468%2032%20363.997%2032h-40.632a12%2012%200%200%200-11.813%209.891L296.175%20128H197.54l14.623-81.891C213.477%2038.754%20207.822%2032%20200.35%2032h-40.632a12%2012%200%200%200-11.813%209.891L132.528%20128H53.432a12%2012%200%200%200-11.813%209.891l-7.143%2040C33.163%20185.246%2038.818%20192%2046.289%20192h74.81L98.242%20320H19.146a12%2012%200%200%200-11.813%209.891l-7.143%2040C-1.123%20377.246%204.532%20384%2012.003%20384h74.81L72.19%20465.891C70.877%20473.246%2076.532%20480%2084.003%20480h40.632a12%2012%200%200%200%2011.813-9.891L151.826%20384h98.634l-14.623%2081.891C234.523%20473.246%20240.178%20480%20247.65%20480h40.632a12%2012%200%200%200%2011.813-9.891L315.472%20384h79.096a12%2012%200%200%200%2011.813-9.891l7.143-40c1.313-7.355-4.342-14.109-11.813-14.109h-74.81l22.857-128h79.096a12%2012%200%200%200%2011.813-9.891zM261.889%20320h-98.634l22.857-128h98.634l-22.857%20128z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    vertical-align: top;
    margin-right: 2px;
    width: 11px;
    height: 11px;
  }
`;

const Hash = props => {
  const { tag } = props;
  return tag.map((tg, index) => <HashTag key={index}>{tg.value}</HashTag>);
  // return !!keyTag && <KeyTag>{keyTag}</KeyTag>;
};

export default Hash;
