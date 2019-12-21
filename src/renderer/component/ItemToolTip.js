import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  setScrollToRow,
  favItem,
  toggleModalVisibility,
  storeItemOnModalOpen
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
`;

const Key = styled.span`
  color: #999999;
`;

const handleAction = props => {
  const { id, favItem, toggleModalVisibility, storeItemOnModalOpen } = props;
  return info => {
    switch (info.key) {
      case "Fav":
        favItem(id);
        break;
      case "Label":
        toggleModalVisibility(id);
        storeItemOnModalOpen(id);
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
    case "p":
      ReactTooltip.hide();
      break;

    default:
      break;
  }
};

const Component = props => {
  const { index, setScrollToRow, toolTipArrowPos, isOpenClipToolTip } = props;
  if (index !== null) {
    setScrollToRow(Number(index));
  }

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
          <MenuItemGroup title="Edit Clip" key="editclip">
            {EDITCLIP.map(action => {
              return (
                <MenuItem key={action.label}>
                  <ItemWrapper>
                    <Label> {action.label}</Label>
                    <Key>{action.shortcutKey}</Key>
                  </ItemWrapper>
                </MenuItem>
              );
            })}
          </MenuItemGroup>
          <MenuItemGroup title="Paste as" key="pasteas">
            {PASTEAS.map(action => {
              return (
                <MenuItem key={action.label}>
                  <ItemWrapper>
                    <Label> {action.label}</Label>
                    <Key>{action.shortcutKey}</Key>
                  </ItemWrapper>
                </MenuItem>
              );
            })}
          </MenuItemGroup>
          <MenuItemGroup title="Other" key="other">
            {OTHER.map(action => {
              return (
                <MenuItem key={action.label}>
                  <ItemWrapper>
                    <Label> {action.label}</Label>
                    <Key>{action.shortcutKey}</Key>
                  </ItemWrapper>
                </MenuItem>
              );
            })}
          </MenuItemGroup>
        </Menu>
      )}
    </Wrapper>
  );
};

const EDITCLIP = [
  { label: "Fav", shortcutKey: "F" },
  { label: "Label", shortcutKey: "L" },
  { label: "Trash", shortcutKey: "Del" },
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
  toolTipArrowPos: state.get("toolTipArrowPos"),
  isOpenClipToolTip: state.get("isOpenClipToolTip")
});
export default connect(mapStateToProps, {
  setScrollToRow,
  favItem,
  toggleModalVisibility,
  storeItemOnModalOpen
})(Component);
