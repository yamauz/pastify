import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { TOAST, CLIP } from "../../common/imageDataUrl";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  font-family: sans-serif;
`;

const Icon = styled.div`
  background-image: ${props => `url(${props.icon})`};
  background-repeat: no-repeat;
  width: 13px;
  height: 13px;
  margin-right: 5px;
`;

const Message = styled.div`
  font-size: 11px;
`;

const Id = styled.span`
  font-size: 10px;
  color: #969494;
`;

const Component = props => {
  const { messageKey } = props;
  console.log(messageKey);
  const _icon = ToastMessage.get(messageKey).icon;
  const _component = ToastMessage.get(messageKey).component(props);
  return (
    <Wrapper>
      <Icon icon={_icon} />
      {_component}
    </Wrapper>
  );
};

const ToastMessage = new Map([
  [
    "FAV_ON",
    {
      icon: CLIP.FAV_ON,
      component: props => {
        const { args } = props;
        return (
          <Message>
            {"Fav ON : "}
            <Id>{args.id}</Id>
          </Message>
        );
      }
    }
  ],
  [
    "FAV_OFF",
    {
      icon: CLIP.FAV_OFF,
      component: props => {
        const { args } = props;
        return (
          <Message>
            {"Fav OFF : "}
            <Id>{args.id}</Id>
          </Message>
        );
      }
    }
  ]
]);

export default Component;
