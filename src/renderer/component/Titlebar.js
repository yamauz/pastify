import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
// Components
import { connect } from "react-redux";
import { updateWinState } from "../actions";
import Close from "../../icon/titlebar/close.svg";
import Maximize from "../../icon/titlebar/maximize.svg";
import Minimize from "../../icon/titlebar/minimize.svg";
import UnMaximize from "../../icon/titlebar/unMaximize.svg";
import StickOff from "../../icon/titlebar/stickoff.svg";
import StickOn from "../../icon/titlebar/stickon.svg";
import path from "path";
import { APP_DIR, TRAY_ICON_PATH } from "../../common/settings";
import { APP_ICON } from "../../common/imageDataUrl";

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

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  margin-top: 3px;
  margin-left: 5px;
  /* border: solid 1px white; */
`;

const ImageWrapper = styled.div`
  vertical-align: middle;
  max-height: 15px;
  max-height: 20px;
`;

const Image = styled.img`
  text-align: center;
  max-width: 100%;
  max-height: 15px;
  height: 100%;
  border-radius: 2px;
  display: block;
`;

const TitleBar = props => {
  const {
    updateWinState,
    winFocus,
    disableClipListener,
    onIconDataURL,
    offIconDataURL
  } = props;

  const imagePath = disableClipListener
    ? APP_ICON.LISTENER_OFF
    : APP_ICON.LISTENER_ON;

  return (
    <Wrapper winFocus={winFocus}>
      <LeftBlock>
        <IconWrapper>
          <ImageWrapper>
            <Image src={imagePath} />
          </ImageWrapper>
        </IconWrapper>
      </LeftBlock>
      <RightBlock>
        <ControlWrapper onClick={() => updateWinState("alwaysOnTop")}>
          {setIcon("Stick", props)}
        </ControlWrapper>
        {/* <ControlWrapper onClick={() => updateWinState("hide")}>
          {setIcon("Minimize", props)}
        </ControlWrapper> */}
        <ControlWrapper onClick={() => updateWinState("maximize")}>
          {setIcon("Maximize", props)}
        </ControlWrapper>
        <ControlWrapperClose
          onClick={() => {
            updateWinState("hide");
          }}
        >
          {setIcon("Close", props)}
        </ControlWrapperClose>
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

const mapStateToProps = state => ({
  alwaysOnTop: state.get("alwaysOnTop"),
  winFocus: state.get("winFocus"),
  winMaximize: state.get("winMaximize"),
  disableClipListener: state.get("disableClipListener"),
  onIconDataURL: state.get("onIconDataURL"),
  offIconDataURL: state.get("offIconDataURL")
});

export default connect(mapStateToProps, { updateWinState })(TitleBar);
