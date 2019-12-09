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

  const filtersToRender = [];
  filtersList.forEach(val => {
    const id = val.get("id");
    const filterName = val.get("filterName");
    const filterShortcutKeyOpt = val.get("filterShortcutKeyOpt");
    const shortcutKey =
      filterShortcutKeyOpt === null ? "" : filterShortcutKeyOpt.label;

    filtersToRender.push({ id, filterName, shortcutKey });
  });

  const callAction = (command, filterId) => {
    toggleItemListToolTipVisibility();
    callActionOnItemList(command, filterId);

    switch (command) {
      case "trashAllItems":
        setDetailType("DEFAULT");
        setIdsFromDatastore();
        break;
      case "trashAllItemsWithoutFaved":
      case "clearFilterSortSettings":
      case "reloadFilterSortSettings":
      case "setUserFilter":
        setIdsFromDatastore();
        break;
        // setIdsFromDatastore();
        break;
      default:
        break;
    }
  };

  const handleAction = info => {
    const command = info.item.props.command;
    const filterid = info.item.props.filterid;
    callAction(command, filterid);
  };

  return (
    <Wrapper>
      <Menu onSelect={handleAction} defaultActiveFirst id={"item-menu-list"}>
        {actionList.map(action => {
          return (
            <MenuItem key={action.command} command={action.command}>
              <ItemWrapper>
                <Command> {action.label}</Command>
                <Key>{action.key}</Key>
              </ItemWrapper>
            </MenuItem>
          );
        })}
        <Divider />
        {filtersToRender.map(filter => {
          return (
            <MenuItem
              key={filter.filterName}
              command={"setUserFilter"}
              filterid={filter.id}
            >
              <ItemWrapper>
                <Command> {filter.filterName}</Command>
                <Key>{filter.shortcutKey}</Key>
              </ItemWrapper>
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
