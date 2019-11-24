import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

// Components
import { connect } from "react-redux";
import {
  callActionOnItemList,
  setIdsFromDatastore,
  toggleItemListToolTipVisibility,
  setDetailType
} from "../actions";
// Common
import keyCode from "../../common/keycode";

const Wrapper = styled.div`
  width: 280px;
  padding-top: 10px;
  padding-bottom: 10px;
`;
const ListContainer = styled.div`
  cursor: default;
  font-family: sans-serif;
  font-size: 13px;
  text-align: justify;
  padding-left: 15px;
  padding-top: 3px;
  padding-bottom: 3px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
  &:focus {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const ToolTipList = props => {
  return (
    <Wrapper>
      {actionList.map((action, index) => {
        return (
          <ListContainer
            id={`tooltip-row-${index}`}
            key={index}
            tabIndex="0"
            onKeyDown={e => {
              const pressKey = e.keyCode;
              const { UP_ARROW, DOWN_ARROW, ENTER } = keyCode;
              const currentFocus = document.activeElement;
              const EDGE_INDEX = actionList.length - 1;
              switch (pressKey) {
                case DOWN_ARROW:
                  if (index === EDGE_INDEX) {
                    document.getElementById("tooltip-row-0").focus();
                  } else {
                    currentFocus.nextElementSibling.focus();
                  }
                  break;
                case UP_ARROW:
                  if (index === 0) {
                    document
                      .getElementById(`tooltip-row-${EDGE_INDEX}`)
                      .focus();
                  } else {
                    currentFocus.previousElementSibling.focus();
                  }
                  break;
                case ENTER:
                  // callActionOnItemList(action.command);
                  callAction(action.command, props);
                  // setIdsFromDatastore("OFF");
                  break;

                default:
                  break;
              }
            }}
            onClick={e => {
              callAction(action.command, props);
              // callActionOnItemList(action.command);
            }}
          >
            {action.label}
          </ListContainer>
        );
      })}
    </Wrapper>
  );
};

const callAction = (command, props) => {
  const {
    callActionOnItemList,
    setIdsFromDatastore,
    toggleItemListToolTipVisibility,
    setDetailType
  } = props;
  callActionOnItemList(command);

  switch (command) {
    case "trashAllItems":
      setDetailType("DEFAULT");
      setIdsFromDatastore();
      break;
    case "trashAllItemsWithoutFaved":
      setIdsFromDatastore();
      break;
    case "clearFilterSortSettings":
      setIdsFromDatastore();
      break;
    case "reloadFilterSortSettings":
      setIdsFromDatastore();
      break;
    default:
      break;
  }
  toggleItemListToolTipVisibility();
};

const actionList = [
  { label: "Add new item", command: "addNewItem", key: "Ctrl+Shift+N" },
  { label: "Trash all items", command: "trashAllItems", key: "Ctrl+Shift+D" },
  {
    label: "Trash all items ( excludes faved )",
    command: "trashAllItemsWithoutFaved",
    key: "Ctrl+Shift+D"
  },
  {
    label: "Show filter/sort settings",
    command: "showFilterSortSettings",
    key: "Ctrl+Shift+F"
  },
  {
    label: "Save filter/sort settings",
    command: "saveFilterSortSettings",
    key: "Ctrl+Shift+S"
  },
  {
    label: "Clear filter/sort settings",
    command: "clearFilterSortSettings",
    key: "Ctrl+Shift+C"
  },
  {
    label: "Reload filter/sort settings",
    command: "reloadFilterSortSettings",
    key: "Ctrl+Shift+C"
  }
];

// const mapStateToProps = state => ({
//   itemsTimeLine: state.get("itemsTimeLine"),
//   itemListToolTipVisibility: state.get("itemListToolTipVisibility")
// });

export default connect(null, {
  callActionOnItemList,
  setIdsFromDatastore,
  toggleItemListToolTipVisibility,
  setDetailType
})(ToolTipList);
