import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import CreatableSelect from "react-select/creatable";
import { setKeyInputValue, addKeyValue, changeKeyValue } from "../../actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFireAlt } from "@fortawesome/free-solid-svg-icons";

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
  font-size: 12px;
  margin-right: 5px;
`;

const Description = styled.span`
  color: #d4d4d4;
  font-size: 10px;
`;

const DivLoop = styled.div``;

const KeyInput = props => {
  // const key = props.hotKey === "" ? [] : [props.hotKey];
  const key = props.hotKey === "" ? [] : createOption(props.hotKey);
  const {
    keyOptions,
    keyInputValue,
    setKeyInputValue,
    addKeyValue,
    changeKeyValue
  } = props;
  useEffect(() => {
    const elm = document.getElementById("hotkey-input");
    setTimeout(() => {
      elm.focus();
    }, 100);
  }, []);

  return (
    <Wrapper>
      <DivLoop
        id="divloop-start"
        tabIndex={0}
        onKeyDown={e => {
          if (e.keyCode === 9) {
            if (e.shiftKey) {
              const elm = document.getElementById("divloop-end");
              elm.focus();
            } else {
            }
          }
        }}
      />
      <Label id="key-label">
        <IconWrapper>
          <FontAwesomeIcon fixedWidth icon={faFireAlt} size="sm" />
        </IconWrapper>
        Hotkey <Description>( for pasting the item )</Description>
      </Label>
      <CreatableSelect
        id="hotkey-input"
        inputValue={keyInputValue}
        options={setKeyOptions(key, keyOptions)}
        // options={keyOptions}
        isClearable={false}
        isMulti
        placeholder="hot key"
        value={key}
        styles={customStyles}
        onChange={options => {
          changeKeyValue(options);
        }}
        onInputChange={value => {
          if (key.length >= 1) return;
          if (!value.match(/^[A-Za-z0-9]*$/)) return;
          const valueUpperCase = value.toUpperCase();
          if (value.length < 17) setKeyInputValue(valueUpperCase);
        }}
        onKeyDown={e => {
          if (!e.target.value) return;
          switch (e.key) {
            case "Tab":
            case "Enter":
              const value = e.target.value;
              addKeyValue(value);
              e.preventDefault();
          }
        }}
      />
    </Wrapper>
  );
};

const customStyles = {
  input: () => ({})
};

const setKeyOptions = (keySelected, keyOptions) => {
  const nextKeySelected = keySelected.length < 1 ? keyOptions : [];
  return nextKeySelected;
};

const mapStateToProps = state => ({
  keyOptions: state.get("keyOptions"),
  keyInputValue: state.get("keyInputValue")
});

const createOption = key => {
  const option = {
    label: key,
    value: key
  };

  return [option];
};

export default connect(
  mapStateToProps,
  {
    setKeyInputValue,
    addKeyValue,
    changeKeyValue
  }
)(KeyInput);
