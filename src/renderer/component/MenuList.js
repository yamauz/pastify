import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "@emotion/styled";

// Components
import {
  callActionOnItemList,
  setIdsFromDatastore,
  toggleItemListToolTipVisibility,
  setDetailType
} from "../actions";

import Menu, { SubMenu, Item as MenuItem, Divider } from "rc-menu";

const Wrapper = styled.div`
  font-family: sans-serif;
  position: absolute;
  top: 82px;
  left: 5px;
  width: 290px;
`;

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 5px;
  padding-right: 10px;
`;

const Command = styled.span``;
const Key = styled.span`
  color: #aaaaaa;
`;

const Component = props => {
  const {
    filtersList,
    itemListToolTipVisibility,
    callActionOnItemList,
    setIdsFromDatastore,
    toggleItemListToolTipVisibility,
    setDetailType
  } = props;

  useEffect(() => {
    document.getElementById("item-menu-list").focus();
  }, [itemListToolTipVisibility]);

  const callAction = command => {
    toggleItemListToolTipVisibility();
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
  };

  const handleAction = info => {
    console.log(info);
    const command = info.item.props.command;
    callAction(command);
  };

  return (
    <Wrapper>
      <Menu onSelect={handleAction} defaultActiveFirst id={"item-menu-list"}>
        {actionList.map((action, index) => {
          return (
            <MenuItem key={index} command={action.command}>
              <ItemWrapper>
                <Command> {action.label}</Command>
                <Key>{action.key}</Key>
              </ItemWrapper>
            </MenuItem>
          );
        })}
        <Divider />
        {filtersList.map((filter, index) => {
          return (
            <MenuItem key={index}>
              <Command>{filter.get("name")}</Command>
            </MenuItem>
          );
        })}
      </Menu>
    </Wrapper>
  );
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

const mapStateToProps = state => ({
  itemListToolTipVisibility: state.get("itemListToolTipVisibility"),
  filtersList: state.get("filtersList")
});

export default connect(mapStateToProps, {
  callActionOnItemList,
  setIdsFromDatastore,
  toggleItemListToolTipVisibility,
  setDetailType
})(Component);
