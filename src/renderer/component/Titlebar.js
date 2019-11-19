import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
// Components
import { connect } from "react-redux";
import { setAlwaysOnTop } from "../actions";
import Close from "../../icon/titlebar/close.svg";
import Maximize from "../../icon/titlebar/maximize.svg";
import Minimize from "../../icon/titlebar/minimize.svg";
import UnMaximize from "../../icon/titlebar/unMaximize.svg";
import StickOff from "../../icon/titlebar/stickoff.svg";
import StickOn from "../../icon/titlebar/stickon.svg";

const { ipcRenderer } = window.require("electron");

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  background-color: #0c0d19;
  display: flex;
  justify-content: space-between;
  opacity: ${props => (props.winFocus ? 1 : 0.98)};
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
  const { setAlwaysOnTop, alwaysOnTop, winFocus } = props;

  return (
    <Wrapper winFocus={winFocus}>
      <LeftBlock>left</LeftBlock>
      <RightBlock>
        <ControlWrapper onClick={() => setAlwaysOnTop(alwaysOnTop)}>
          {setIcon("Stick", props)}
        </ControlWrapper>
        <ControlWrapper onClick={() => minimizeWindow()}>
          {setIcon("Minimize", props)}
        </ControlWrapper>
        <ControlWrapper onClick={() => maximizeWindow()}>
          {setIcon("Maximize", props)}
        </ControlWrapper>
        <ControlWrapperClose>{setIcon("Close", props)}</ControlWrapperClose>
      </RightBlock>
    </Wrapper>
  );
};

const setIcon = (type, props) => {
  const { alwaysOnTop, winFocus, winMaximize } = props;
  const style = {
    opacity: winFocus ? "1" : 0.5,
    transition: "opacity 0.1s"
  };
  switch (type) {
    case "Close":
      style.width = "12px";
      return <Close style={style}></Close>;
    case "Minimize":
      style.width = "12px";
      return <Minimize style={style}></Minimize>;
    case "Maximize":
      style.width = "12px";
      if (winMaximize) {
        return <UnMaximize style={style}></UnMaximize>;
      } else {
        return <Maximize style={style}></Maximize>;
      }
    case "Stick":
      style.width = "13px";
      if (alwaysOnTop) {
        return <StickOn style={style}></StickOn>;
      } else {
        return <StickOff style={style}></StickOff>;
      }
  }
};

const minimizeWindow = () => {
  ipcRenderer.sendSync("MINIMIZE_WINDOW");
};
const maximizeWindow = () => {
  ipcRenderer.sendSync("MAXIMIZE_WINDOW");
};

const mapStateToProps = state => ({
  alwaysOnTop: state.get("alwaysOnTop"),
  winFocus: state.get("winFocus"),
  winMaximize: state.get("winMaximize")
});

export default connect(mapStateToProps, { setAlwaysOnTop })(TitleBar);
