import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  favItem,
  toggleModalVisibility,
  storeItemOnModalOpen,
  deleteIds,
  deleteClipCompletely,
  copyClipId,
  copyClip
} from "../actions";
import ReactTooltip from "react-tooltip";
import keycode from "keycode";
import Menu, {
  Item as MenuItem,
  Divider,
  ItemGroup as MenuItemGroup
} from "rc-menu";

import styled from "@emotion/styled";
import { css } from "@emotion/core";

const Wrapper = styled.div`
  position: relative;
  background-color: #111514;
  height: 100%;
  width: 140px;
  font-style: sans-serif;
  color: #dcdcdc;
  &:after {
    position: absolute;
    content: "";
    right: 4px;
    width: 0px;
    height: 0px;
    margin: auto;
    ${props => {
      return props.toolTipArrowPos === "down"
        ? css`
            bottom: -6px;
            border-style: solid;
            border-color: #111514 transparent transparent transparent;
            border-width: 6px 6px 0 6px;
          `
        : css`
            top: -6px;
            border-right: 6px solid transparent;
            border-bottom: 6px solid #020213;
            border-left: 6px solid transparent;
          `;
    }}
  }
`;

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 5px;
  padding-right: 10px;
  align-items: center;
`;

const Label = styled.span`
  color: #cccccc;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: ${props => (props.disabled ? "0.5" : "1")};
`;

const Key = styled.span`
  color: #999999;
  opacity: ${props => (props.disabled ? "0.5" : "1")};
`;

const handleAction = props => {
  const {
    id,
    favItem,
    toggleModalVisibility,
    storeItemOnModalOpen,
    deleteIds,
    deleteClipCompletely,
    copyClipId,
    copyClip
  } = props;
  return info => {
    info.domEvent.stopPropagation();
    switch (info.key) {
      case "Fav":
        favItem(id);
        break;
      case "Label":
        toggleModalVisibility(id);
        storeItemOnModalOpen(id);
        break;
      case "Trash":
        deleteIds(id);
        break;
      case "Remove":
        console.log("deleteClipCompletely");
        deleteClipCompletely();
        break;
      case "Copy Clip ID":
        copyClipId();
        break;
      case "Text":
        copyClip(info.domEvent, "TEXT");
        break;
      case "Image":
        copyClip(info.domEvent, "IMAGE");
        break;
      case "File":
        copyClip(info.domEvent, "FILE");
        break;
      case "Sheet":
        copyClip(info.domEvent, "SHEET");
        break;
      default:
        break;
    }
    ReactTooltip.hide();
  };
};

const handleKeyDown = e => {
  switch (keycode(e)) {
    case "esc":
    case "o":
      ReactTooltip.rebuild();
      ReactTooltip.hide();
      break;

    default:
      break;
  }
};

const Component = props => {
  const {
    index,
    toolTipArrowPos,
    isOpenClipToolTip,
    idsTimeLine,
    itemsTimeLine
  } = props;

  const idSelected = idsTimeLine.get(index);
  const clip = itemsTimeLine.get(idSelected);

  return (
    <Wrapper
      toolTipArrowPos={toolTipArrowPos}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {isOpenClipToolTip && (
        <Menu
          onSelect={handleAction(props)}
          defaultActiveFirst
          id={"item-tooltip"}
          activeKey={"Fav"}
        >
          <MenuItemGroup title="Edit Status" key="editclip">
            {EDITCLIP.map(action => {
              const labelShow = getClipLabelShow(clip, action);
              return createMenuItem(action, labelShow);
            })}
          </MenuItemGroup>
          <MenuItemGroup title="Paste as" key="pasteas">
            {PASTEAS.map(action => {
              const disabled = getClipDisabled(clip, action);
              return createMenuItem(action, action.label, disabled);
            })}
          </MenuItemGroup>
          <MenuItemGroup title="Other" key="other">
            {OTHER.map(action => {
              return createMenuItem(action, action.label);
            })}
          </MenuItemGroup>
        </Menu>
      )}
    </Wrapper>
  );
};

const getClipLabelShow = (clip, action) => {
  const { isFaved, isTrashed } = clip.toJS();
  const { label, undoLabel } = action;
  switch (label) {
    case "Fav":
      return isFaved ? undoLabel : label;
    case "Trash":
      return isTrashed ? undoLabel : label;
    default:
      return label;
  }
};

const getClipDisabled = (clip, action) => {
  const { mainFormat } = clip.toJS();
  const { label } = action;
  switch (label) {
    case "Image":
      if (mainFormat === "TEXT") return true;
      if (mainFormat === "FILE") return true;
      break;
    case "Sheet":
      if (mainFormat === "FILE") return true;
      if (mainFormat === "TEXT") return true;
      if (mainFormat === "IMAGE") return true;
      break;
    default:
      break;
  }
  return false;
};

const createMenuItem = (action, labelShow, disabled = false) => {
  return (
    <MenuItem key={action.label} disabled={disabled}>
      <ItemWrapper>
        <Label disabled={disabled}> {labelShow}</Label>
        <Key disabled={disabled}>{action.shortcutKey}</Key>
      </ItemWrapper>
    </MenuItem>
  );
};

const EDITCLIP = [
  { label: "Fav", undoLabel: "Undo Fav", shortcutKey: "F" },
  { label: "Label", shortcutKey: "L" },
  { label: "Trash", undoLabel: "Undo Trash", shortcutKey: "Del" },
  { label: "Remove", shortcutKey: "Ctrl+Del" }
];
const PASTEAS = [
  { label: "Text", shortcutKey: "0" },
  { label: "Image", shortcutKey: "1" },
  { label: "File", shortcutKey: "2" },
  { label: "Sheet", shortcutKey: "3" }
];
const OTHER = [{ label: "Copy Clip ID", shortcutKey: "@" }];

const mapStateToProps = state => ({
  idsTimeLine: state.get("idsTimeLine"),
  itemsTimeLine: state.get("itemsTimeLine"),
  toolTipArrowPos: state.get("toolTipArrowPos"),
  isOpenClipToolTip: state.get("isOpenClipToolTip")
});
export default connect(mapStateToProps, {
  favItem,
  toggleModalVisibility,
  storeItemOnModalOpen,
  deleteIds,
  deleteClipCompletely,
  copyClipId,
  copyClip
})(Component);
