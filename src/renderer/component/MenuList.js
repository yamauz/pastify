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

import Menu, {
  Item as MenuItem,
  Divider,
  ItemGroup as MenuItemGroup
} from "rc-menu";

const Wrapper = styled.div`
  font-family: sans-serif;
  position: absolute;
  top: 92px;
  width: 300px;
  overflow: overlay;
  /* height: 200px; */
  /* max-height: 600px; */
  max-height: ${() => `${window.innerHeight - 125}px`};
  -webkit-background-clip: text;
  transition: background-color 0.3s;
  &::-webkit-scrollbar {
    padding-top: 20px;
    width: 0.5em;
    background-color: transparent;
  }
  &::-webkit-scrollbar:horizontal {
    display: none;
  }
  &::-webkit-scrollbar-thumb {
    background-color: inherit;
    max-height: 5px;
    min-height: 5px;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
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

const DeleteIcon = styled.button`
  text-align: center;
  position: absolute;
  margin-top: -2px;
  margin-left: -17px;
  padding-bottom: 3px;
  color: #aaaaaa;
  width: 20px;
  height: 25px;
  background-color: transparent;
  border: none;
  &:hover {
    color: #dddddd;
    background-color: #272f3d;
  }
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

  console.log(window.innerHeight);

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
        <MenuItemGroup title="Edit" key="edit">
          {EDIT.map(action => {
            return (
              <MenuItem key={action.command} command={action.command}>
                <ItemWrapper tabIndex={1}>
                  <Command> {action.label}</Command>
                  <Key>{action.key}</Key>
                </ItemWrapper>
              </MenuItem>
            );
          })}
        </MenuItemGroup>
        <MenuItemGroup title="Filter Settings" key="filter-settings">
          {FILTER_SETTINGS.map(action => {
            return (
              <MenuItem key={action.command} command={action.command}>
                <ItemWrapper tabIndex={1}>
                  <Command> {action.label}</Command>
                  <Key>{action.key}</Key>
                </ItemWrapper>
              </MenuItem>
            );
          })}
        </MenuItemGroup>
        <MenuItemGroup title="Apply User Filter" key="apply-user-filter">
          {filtersToRender.map(filter => {
            const [isOpen, setIsOpen] = useState(false);
            const toggleDeleteButton = () => setIsOpen(!isOpen);
            return (
              <MenuItem
                key={filter.id}
                command={"setUserFilter"}
                filterid={filter.id}
                onMouseEnter={toggleDeleteButton}
                onMouseLeave={toggleDeleteButton}
                tabIndex={1}
              >
                {isOpen && (
                  <DeleteIcon
                    onFocus={e => {
                      console.log(`Delete Item : ${filter.id}`);
                    }}
                  >
                    X
                  </DeleteIcon>
                )}
                <ItemWrapper>
                  <Command> {filter.filterName}</Command>
                  <Key>{filter.shortcutKey}</Key>
                </ItemWrapper>
              </MenuItem>
            );
          })}
        </MenuItemGroup>
      </Menu>
    </Wrapper>
  );
};

const EDIT = [
  {
    type: "edit",
    label: "Add new",
    command: "addNewItem",
    key: "Ctrl+Shift+N"
  },
  {
    type: "edit",
    label: "Trash All On List ",
    command: "trashAllItems",
    key: "Ctrl+Shift+D"
  },
  {
    type: "edit",
    label: "Trash all items ( excludes faved )",
    command: "trashAllItemsWithoutFaved",
    key: "Ctrl+Shift+D"
  }
];

const FILTER_SETTINGS = [
  {
    type: "filter",
    label: "Open Setting panel",
    command: "showFilterSortSettings",
    key: "Ctrl+Shift+F"
  },
  {
    type: "filter",
    label: "Save",
    command: "saveFilterSortSettings",
    key: "Ctrl+Shift+S"
  },
  {
    type: "filter",
    label: "Clear",
    command: "clearFilterSortSettings",
    key: "Ctrl+Shift+C"
  },
  {
    type: "filter",
    label: "Reload",
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
