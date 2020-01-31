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

const Filter = styled.span`
  font-size: 10px;
  color: #969494;
`;

const Component = props => {
  const { icon, message, toast } = ToastMessage.get(props.messageKey);
  return (
    <Wrapper>
      <Icon icon={icon} />
      {toast(props, message)}
    </Wrapper>
  );
};

const createToast = (_, message) => {
  return <Message>{message}</Message>;
};

const createToastWithId = ({ args }, message) => {
  return (
    <Message>
      {`${message} : `}
      <Id>{args.id}</Id>
    </Message>
  );
};

const createToastWithClipCount = ({ args }, message) => {
  return <Message>{`${message} ${args.clipCount} clips.`}</Message>;
};

const ToastMessage = new Map([
  [
    "FAV_ON",
    {
      icon: CLIP.FAV_ON,
      message: "Fav ON",
      toast: createToastWithId
    }
  ],
  [
    "FAV_OFF",
    {
      icon: CLIP.FAV_OFF,
      message: "Fav OFF",
      toast: createToastWithId
    }
  ],
  [
    "TRASH_ON",
    {
      icon: CLIP.TRASH_ON,
      message: "Trash ON",
      toast: createToastWithId
    }
  ],
  [
    "TRASH_OFF",
    {
      icon: CLIP.TRASH_OFF,
      message: "Trash OFF",
      toast: createToastWithId
    }
  ],
  [
    "UPDATE_LABEL",
    {
      icon: CLIP.LABEL_ON,
      message: "Update Label",
      toast: createToastWithId
    }
  ],
  [
    "COPY_LABEL",
    {
      icon: CLIP.LABEL_ON,
      message: "Copy Label",
      toast: createToastWithId
    }
  ],
  [
    "APPLY_LABEL",
    {
      icon: CLIP.LABEL_ON,
      message: "Apply Label",
      toast: createToastWithId
    }
  ],
  [
    "IMPORT_SUCCESS",
    {
      icon: TOAST.SUCCESS,
      message: "Imported",
      toast: createToastWithClipCount
    }
  ],
  [
    "IMPORT_FAIL",
    {
      icon: TOAST.ERROR,
      message: "Clip Importing Failed.",
      toast: createToast
    }
  ],
  [
    "EXPORT_SUCCESS",
    {
      icon: TOAST.SUCCESS,
      message: "Exported",
      toast: createToastWithClipCount
    }
  ],
  [
    "EXPORT_FAIL",
    {
      icon: TOAST.ERROR,
      message: "Clip Exporting Failed.",
      toast: createToast
    }
  ]
]);

export default Component;
