import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { TOAST, CLIP, FILTER } from "../../common/imageDataUrl";

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

const createToastWithFilterName = ({ args }, message) => {
  const { filterName } = args;
  const _filterName = filterName === "" ? "Untitled" : filterName;
  return (
    <Message>
      {`${message} : `}
      <Filter>{_filterName}</Filter>
    </Message>
  );
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
    "TRASH_ALL",
    {
      icon: CLIP.TRASH_ON,
      message: "Trashed",
      toast: createToastWithClipCount
    }
  ],
  [
    "DELETE_ALL",
    {
      icon: CLIP.TRASH_ON,
      message: "Deleted",
      toast: createToastWithClipCount
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
  ],
  [
    "CREATE_NEW",
    {
      icon: CLIP.FORMAT_TEXT,
      message: "Added New",
      toast: createToastWithId
    }
  ],
  [
    "ADD_TEXT",
    {
      icon: CLIP.FORMAT_TEXT,
      message: "Added",
      toast: createToastWithId
    }
  ],
  [
    "ADD_IMAGE",
    {
      icon: CLIP.FORMAT_IMAGE,
      message: "Added",
      toast: createToastWithId
    }
  ],
  [
    "ADD_FILE",
    {
      icon: CLIP.FORMAT_FILE,
      message: "Added",
      toast: createToastWithId
    }
  ],
  [
    "ADD_SHEET",
    {
      icon: CLIP.FORMAT_SHEET,
      message: "Added",
      toast: createToastWithId
    }
  ],
  [
    "COPY_CLIP_ID",
    {
      icon: CLIP.CLIP,
      message: "Copied ID",
      toast: createToastWithId
    }
  ],
  [
    "COPY_CLIP",
    {
      icon: CLIP.CLIP,
      message: "Copied",
      toast: createToastWithId
    }
  ],
  [
    "APPLY_FILTER",
    {
      icon: FILTER.ON,
      message: "Filtered",
      toast: createToastWithFilterName
    }
  ],
  [
    "CLEAR_FILTER",
    {
      icon: FILTER.OFF,
      message: "Clear Filter",
      toast: createToast
    }
  ],
  [
    "MONITOR_ON",
    {
      icon: TOAST.INFO,
      message: "Clipboard Monitoring Started",
      toast: createToast
    }
  ],
  [
    "MONITOR_OFF",
    {
      icon: TOAST.INFO,
      message: "Clipboard Monitoring Paused",
      toast: createToast
    }
  ]
]);

export default Component;
