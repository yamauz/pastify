import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import "../../styles/react-tagsinput-tag.css";
import CreatableSelect from "react-select/creatable";
import {
  setHashTagInputValue,
  addHashTagValue,
  changeHashTagValue
} from "../../actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  margin-bottom: 10px;
`;

const IconWrapper = styled.span`
  font-size: 12px;
  margin-right: 5px;
`;

const Label = styled.div`
  color: #d4d4d4;
  font-size: 11px;
  margin-bottom: 3px;
  margin-left: 3px;
`;

const HashTagInput = props => {
  const {
    tag,
    hashTagOptions,
    hashTagInputValue,
    setHashTagInputValue,
    addHashTagValue,
    changeHashTagValue
  } = props;
  console.log(hashTagOptions);
  return (
    <Wrapper>
      <Label>
        <IconWrapper>
          <FontAwesomeIcon fixedWidth icon={faHashtag} size="sm" />
        </IconWrapper>
        HashTag
      </Label>
      <CreatableSelect
        inputValue={hashTagInputValue}
        options={setHashTagOptions(tag, hashTagOptions)}
        isClearable={false}
        isMulti
        placeholder="Select..."
        value={tag}
        onChange={value => {
          changeHashTagValue(value);
        }}
        onInputChange={value => {
          if (tag.length >= 5) return;
          if (value.length < 17) setHashTagInputValue(value);
        }}
        onKeyDown={e => {
          if (!e.target.value) return;
          switch (e.key) {
            case "Enter":
              const label = e.target.value;
              addHashTagValue({ label, value: label });
              e.preventDefault();
          }
        }}
      />
    </Wrapper>
  );
};

const setHashTagOptions = (tag, hashTagOptions) => {
  const nextHashTagSelected = tag.length < 5 ? hashTagOptions : [];
  return nextHashTagSelected;
};

const mapStateToProps = state => ({
  hashTagOptions: state.get("hashTagOptions"),
  hashTagInputValue: state.get("hashTagInputValue")
});

export default connect(
  mapStateToProps,
  {
    setHashTagInputValue,
    addHashTagValue,
    changeHashTagValue
  }
)(HashTagInput);
