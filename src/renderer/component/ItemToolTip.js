import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { setScrollToRow } from "../actions";
import ReactTooltip from "react-tooltip";
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

const Command = styled.span`
  color: #cccccc;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Key = styled.span`
  color: #999999;
`;

const handleAction = prevFocusedElm => {
  return () => {
    console.log("handleAction");
    ReactTooltip.hide();
    prevFocusedElm.focus();
  };
};

const Component = props => {
  const { index, setScrollToRow, prevFocusedElm, toolTipArrowPos } = props;
  if (index !== null) {
    setScrollToRow(Number(index));
  }
  return (
    <Wrapper toolTipArrowPos={toolTipArrowPos}>
      {/* <BottomArrow></BottomArrow> */}
      <Menu
        onSelect={handleAction(prevFocusedElm)}
        defaultActiveFirst
        id={"item-tooltip"}
      >
        <MenuItemGroup title="Edit Clip" key="editclip">
          {EDITCLIP.map(action => {
            return (
              <MenuItem
                key={action.command}
                command={action.command}
                tabIndex={1}
              >
                <ItemWrapper>
                  <Command> {action.command}</Command>
                  <Key>{action.shortcutKey}</Key>
                </ItemWrapper>
              </MenuItem>
            );
          })}
        </MenuItemGroup>
        <MenuItemGroup title="Paste as" key="pasteas">
          {PASTEAS.map(action => {
            return (
              <MenuItem
                key={action.command}
                command={action.command}
                tabIndex={1}
              >
                <ItemWrapper>
                  <Command> {action.command}</Command>
                  <Key>{action.shortcutKey}</Key>
                </ItemWrapper>
              </MenuItem>
            );
          })}
        </MenuItemGroup>
        <MenuItemGroup title="Other" key="other">
          {OTHER.map(action => {
            return (
              <MenuItem
                key={action.command}
                command={action.command}
                tabIndex={1}
              >
                <ItemWrapper>
                  <Command> {action.command}</Command>
                  <Key>{action.shortcutKey}</Key>
                </ItemWrapper>
              </MenuItem>
            );
          })}
        </MenuItemGroup>
      </Menu>
    </Wrapper>
  );
  // return <div>test</div>;
};

const EDITCLIP = [
  { command: "Fav", shortcutKey: "F" },
  { command: "Label", shortcutKey: "L" },
  { command: "Trash", shortcutKey: "Del" },
  { command: "Remove", shortcutKey: "Ctrl+Del" }
];
const PASTEAS = [
  { command: "Text", shortcutKey: "T" },
  { command: "Image", shortcutKey: "I" },
  { command: "File", shortcutKey: "F" },
  { command: "Excel", shortcutKey: "E" }
];
const OTHER = [{ command: "Copy Clip ID", shortcutKey: "C" }];

const mapStateToProps = state => ({
  prevFocusedElm: state.get("prevFocusedElm"),
  toolTipArrowPos: state.get("toolTipArrowPos")
});
export default connect(mapStateToProps, {
  setScrollToRow
})(Component);
