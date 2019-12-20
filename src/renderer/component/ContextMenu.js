import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  callActionOnItemList,
  setIdsFromDatastore,
  setDetailType,
  deleteUserFilter
} from "../actions";

import styled from "@emotion/styled";

const Wrapper = styled.div`
  width: 23px;
  height: 23px;
  display: flex;
  align-items: center;
  text-align: left;
  color: #dcdcdc;
  position: absolute;
  right: 0;
  transition: opacity 0.1s;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%23888888%22%20viewBox%3D%220%200%20512%20512%22%3E%3Cpath%20d%3D%22M304%20256c0%2026.5-21.5%2048-48%2048s-48-21.5-48-48%2021.5-48%2048-48%2048%2021.5%2048%2048zm120-48c-26.5%200-48%2021.5-48%2048s21.5%2048%2048%2048%2048-21.5%2048-48-21.5-48-48-48zm-336%200c-26.5%200-48%2021.5-48%2048s21.5%2048%2048%2048%2048-21.5%2048-48-21.5-48-48-48z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-size: 18px 18px;
  background-position: center;
  &:hover {
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%23dcdcdc%22%20viewBox%3D%220%200%20512%20512%22%3E%3Cpath%20d%3D%22M304%20256c0%2026.5-21.5%2048-48%2048s-48-21.5-48-48%2021.5-48%2048-48%2048%2021.5%2048%2048zm120-48c-26.5%200-48%2021.5-48%2048s21.5%2048%2048%2048%2048-21.5%2048-48-21.5-48-48-48zm-336%200c-26.5%200-48%2021.5-48%2048s21.5%2048%2048%2048%2048-21.5%2048-48-21.5-48-48-48z%22%2F%3E%3C%2Fsvg%3E");
  }
  &:active {
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%23dcdcdc%22%20viewBox%3D%220%200%20512%20512%22%3E%3Cpath%20d%3D%22M304%20256c0%2026.5-21.5%2048-48%2048s-48-21.5-48-48%2021.5-48%2048-48%2048%2021.5%2048%2048zm120-48c-26.5%200-48%2021.5-48%2048s21.5%2048%2048%2048%2048-21.5%2048-48-21.5-48-48-48zm-336%200c-26.5%200-48%2021.5-48%2048s21.5%2048%2048%2048%2048-21.5%2048-48-21.5-48-48-48z%22%2F%3E%3C%2Fsvg%3E");
  }
`;

const Icon = styled.div`
  /* background-color: blue; */
  &:hover {
    background-color: red;
  }
`;

const Component = props => {
  const { index, isOpen, id } = props;

  return (
    <Wrapper
      isOpen={isOpen}
      data-tip={`${id}:${index}`}
      // data-tip={index}
      data-place={"left"}
      id={`${id}-option`}
      data-for="global"
    >
      <Icon></Icon>
      {/* <ReactTooltip type="info" effect="float" /> */}
    </Wrapper>
  );
};

const mapStateToProps = state => ({
  filtersList: state.get("filtersList"),
  prevFocusedElm: state.get("prevFocusedElm")
});

export default connect(mapStateToProps, {
  callActionOnItemList,
  setIdsFromDatastore,
  setDetailType,
  deleteUserFilter
})(Component);
