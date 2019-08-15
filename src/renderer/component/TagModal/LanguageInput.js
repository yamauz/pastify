import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import langOptions from "../../../common/langOptions";
import Select from "react-select";
import { setLangOptionsSelected } from "../../actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.div`
  color: #d4d4d4;
  font-size: 11px;
  margin-bottom: 3px;
  margin-left: 3px;
`;

const IconWrapper = styled.span`
  margin-right: 5px;
  font-size: 12px;
`;

const Description = styled.span`
  color: #d4d4d4;
  font-size: 10px;
`;

const LanguageInput = props => {
  const { lang, setLangOptionsSelected } = props;
  return (
    <Wrapper>
      <Label>
        <IconWrapper>
          <FontAwesomeIcon fixedWidth icon={faCode} size="sm" />
        </IconWrapper>
        Language <Description>( for syntax highlighting )</Description>
      </Label>
      <Select
        isMulti
        name="colors"
        options={setLangOptions(lang)}
        defaultValue={createLangValue(lang)}
        className="basic-multi-select"
        classNamePrefix="select"
        // styles={sortStyles}
        onChange={opt => {
          const options = opt === null ? "" : opt[0].value;
          setLangOptionsSelected(options);
        }}
      />
    </Wrapper>
  );
};

const setLangOptions = langSelected => {
  const nextLangSelected = langSelected === "" ? langOptions : [];
  return nextLangSelected;
};

const createLangValue = lang => {
  const langValue = langOptions.filter(option => lang === option.value);
  return langValue;
};

export default connect(
  null,
  {
    setLangOptionsSelected
  }
)(LanguageInput);
