import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import styled from "@emotion/styled";
import SortInput from "./SortInput";
import KeywordsInput from "./KeywordsInput";
import DataTypesInput from "./DataTypesInput";
import StatusInput from "./StatusInput";
import HotKeyInput from "./HotKeyInput";
import HashTagInput from "./HashTagInput";
import LanguageInput from "./LanguageInput";
import IdInput from "./IdInput";

const Wrapper = styled.div``;

const FilterSettings = props => {
  return (
    <Wrapper>
      <IdInput />
      <LanguageInput />
      <HashTagInput />
      <HotKeyInput />
      <StatusInput />
      <DataTypesInput />
      <SortInput />
      <KeywordsInput />
    </Wrapper>
  );
};

export default connect(null, null)(FilterSettings);
