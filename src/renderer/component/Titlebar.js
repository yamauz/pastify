import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
// Components
import { connect } from "react-redux";
import { setAlwaysOnTop } from "../actions";
import Close from "../../icon/titlebar/close.svg";
import Maximize from "../../icon/titlebar/maximize.svg";
import Minimize from "../../icon/titlebar/minimize.svg";
import Restore from "../../icon/titlebar/restore.svg";
import StickOff from "../../icon/titlebar/stickoff.svg";
import StickOn from "../../icon/titlebar/stickon.svg";

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  background-color: #0c0d19;
  display: flex;
  justify-content: space-between;
`;

const LeftBlock = styled.div`
  -webkit-app-region: drag;
  width: 100%;
`;
const RightBlock = styled.div`
  display: flex;
`;

const ControlWrapper = styled.div`
  width: 45px;
  height: 26px;
  text-align: center;
  padding-top: 4px;
  background-color: #0c0d19;
  transition: opacity 0.2s;
  transition: background-color 0.2s;
  &:hover {
    background-color: #414252;
  }
`;

const ControlWrapperClose = styled.div`
  width: 45px;
  height: 26px;
  text-align: center;
  padding-top: 4px;
  background-color: #0c0d19;
  transition: background-color 0.2s;
  &:hover {
    background-color: #e81123;
  }
`;

const TitleBar = props => {
  const { setAlwaysOnTop, alwaysOnTop } = props;

  return (
    <Wrapper>
      <LeftBlock>left</LeftBlock>
      <RightBlock>
        <ControlWrapper onClick={() => setAlwaysOnTop(alwaysOnTop)}>
          {changeStickIcon(alwaysOnTop)}
        </ControlWrapper>
        {/* <ControlWrapper>
          <Restore
            style={{
              width: "12px"
            }}
          ></Restore>
        </ControlWrapper> */}
        <ControlWrapper>
          <Minimize
            style={{
              width: "12px"
            }}
          ></Minimize>
        </ControlWrapper>
        <ControlWrapper>
          <Maximize
            style={{
              width: "11px"
            }}
          ></Maximize>
        </ControlWrapper>
        <ControlWrapperClose>
          <Close
            style={{
              width: "12px"
            }}
          ></Close>
        </ControlWrapperClose>
      </RightBlock>
    </Wrapper>
  );
};

const changeStickIcon = alwaysOnTop => {
  const style = {
    width: "13px"
  };
  if (alwaysOnTop) {
    return <StickOn style={style}></StickOn>;
  } else {
    return <StickOff style={style}></StickOff>;
  }
};

const mapStateToProps = state => ({
  alwaysOnTop: state.get("alwaysOnTop")
});

export default connect(mapStateToProps, { setAlwaysOnTop })(TitleBar);
