import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import arraySort from "array-sort";
import keycode from "keycode";
// import Select from "react-select";
import {
  callActionOnItemList,
  setIdsFromDatastore,
  setDetailType,
  deleteUserFilter
} from "../actions";
import Select, { components } from "react-select";
import Ellipsis from "../../icon/listheader/ellipsis-v.svg";
import Cog from "../../icon/listheader/cog.svg";

import styled from "@emotion/styled";

const Wrapper = styled.div`
  text-align: left;
`;

const GroupTitle = styled.div`
  display: inline-block;
`;

const OptionWrapper = styled.div`
  display: flex;
  font-style: sans-serif;
`;

const OptionLeftSec = styled.div`
  width: 15px;
`;

const OptionRightSec = styled.div`
  display: flex;
  justify-content: space-between;
  width: 280px;
  padding-left: 4px;
  padding-right: 8px;
`;

const DelIcon = styled.div`
  display: ${props =>
    props.isFocused && props.type === "user" ? "block" : "none"};
  padding-left: 5px;
  color: #aaaaaa;
  background-color: transparent;
  &:hover {
    color: #eeeeee;
  }
`;

const Command = styled.span`
  color: #cccccc;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-right: 5px;
`;

const ShortcutKey = styled.span`
  color: #999999;
  font-size: 10px;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 0;
  padding-left: 2px;
  width: 25px;
`;

const Component = props => {
  const selectRef = useRef(null);
  const {
    filtersList,
    callActionOnItemList,
    setIdsFromDatastore,
    setDetailType,
    deleteUserFilter,
    prevFocusedElm
  } = props;

  const DropdownIndicator = props => {
    return (
      <components.DropdownIndicator {...props}>
        <IconWrapper>
          <Cog
            style={{
              width: "15px",
              fill: "#dddddd",
              marginTop: "4px",
              marginLeft: "-5px"
            }}
          ></Cog>
        </IconWrapper>
      </components.DropdownIndicator>
    );
  };

  const Option = optProps => {
    return (
      <components.Option {...optProps}>
        <OptionWrapper
          id={
            optProps.isFocused && optProps.data.type === "user"
              ? "selected"
              : ""
          }
        >
          <OptionLeftSec id={optProps.data.id}>
            <DelIcon
              type={optProps.data.type}
              isFocused={optProps.isFocused}
              onClick={e => {
                e.stopPropagation();
                deleteUserFilter(optProps.data.id);
                selectRef.current.blur();
              }}
            >
              X
            </DelIcon>
          </OptionLeftSec>
          <OptionRightSec>
            <Command> {optProps.data.label}</Command>
            <ShortcutKey>{optProps.data.shortcutKey}</ShortcutKey>
          </OptionRightSec>
        </OptionWrapper>
      </components.Option>
    );
  };

  return (
    <Wrapper>
      <Select
        openMenuOnFocus={true}
        inputId={"list-menu"}
        ref={selectRef}
        noOptionsMessage={() => null}
        menuPosition={"fixed"}
        options={createGroupedOptions(filtersList)}
        formatGroupLabel={formatGroupLabel}
        placeholder={null}
        value={null}
        components={{
          DropdownIndicator,
          Option
        }}
        onKeyDown={e => {
          e.stopPropagation();
          if (keycode(e) === "delete") {
            const selectedElm = document.getElementById("selected");
            if (selectedElm !== null) {
              const { id } = selectedElm.firstElementChild;
              deleteUserFilter(id);
              selectRef.current.blur();
            }
          }
        }}
        onMenuClose={() => {
          prevFocusedElm.focus();
        }}
        onChange={opt => {
          const { type, command, id } = opt;
          if (type === "system") {
            callActionOnItemList(command);
          } else {
            callActionOnItemList(command, id);
          }

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
        }}
        styles={customStyles}
      />
    </Wrapper>
  );
};

const formatGroupLabel = data => (
  <GroupTitle label={data.label}>{data.label}</GroupTitle>
);

const customStyles = {
  indicatorSeparator: (styles, { data }) => ({
    ...styles,
    display: "none"
  }),
  dropdownIndicator: (styles, { data }) => ({
    ...styles,
    color: "#bbbbbb",
    "&:hover": { color: "#ffffff" }
  }),
  option: (provided, state) => ({
    ...provided,
    color: "#dddddd",
    backgroundColor: state.isFocused ? "#354154" : "none",
    "&:hover": { backgroundColor: "#2F353D" },
    fontSize: "11px",
    fontStyle: state.data.fontStyle,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 2,
    paddingBottom: 2,
    margin: 0
  }),
  menu: (provided, state) => ({
    ...provided,
    width: 299,
    position: "absolute",
    top: -10,
    left: -275,
    backgroundColor: "#111514",
    paddingBottom: "6px"
  }),
  menuList: (provided, state) => ({
    ...provided,
    borderRadius: "0px",
    backgroundColor: "#111514",
    padding: 0,
    margin: 0,
    overflow: "overlay",
    "&::-webkit-scrollbar": {
      width: "0.5em",
      backgroundColor: "transparent"
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "inherit"
    },
    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
    WebkitBackgroundClip: "text",
    transition: "background-color 0.3s",
    maxHeight: window.innerHeight - 125
  }),
  control: (styles, state) => ({
    ...styles,
    border: "none",
    boxShadow: "none", // no box-shadow
    minHeight: "25px",
    maxWidth: "200px",
    width: 0
  }),
  input: (styles, { data }) => ({
    ...styles,
    margin: 0,
    padding: 0,
    width: 0,
    height: 0
  }),
  group: (styles, state) => ({
    ...styles,
    margin: 0,
    padding: 0
  }),
  groupHeading: (styles, state) => ({
    ...styles,
    backgroundColor: "#020213",
    fontSize: "10px",
    color: "#cbcbcb",
    margin: 0,
    padding: "0 0 0 5"
  })
};

const createGroupedOptions = filtersList => {
  const filtersToRender = [];
  filtersList.forEach(val => {
    const id = val.get("id");
    const type = "user";
    const command = "setUserFilter";
    const label = val.get("filterName");
    const filterShortcutKeyOpt = val.get("filterShortcutKeyOpt");
    const shortcutKey =
      filterShortcutKeyOpt === null ? "" : filterShortcutKeyOpt.label;

    filtersToRender.push({ type, label, command, id, shortcutKey });
  });

  if (filtersToRender.length !== 0) {
    const userFilterOptions = {
      label: "Apply User Filter",
      options: arraySort(filtersToRender, (a, b) =>
        a.label.localeCompare(b.label)
      )
    };
    groupedOptions[2] = userFilterOptions;
  } else {
    groupedOptions.splice(2, 1);
  }
  return groupedOptions;
};

const EDIT = [
  {
    type: "system",
    label: "Add New",
    command: "addNewItem",
    shortcutKey: "Ctrl+Shift+N"
  },
  {
    type: "system",
    label: "Trash All",
    command: "trashAllItems",
    shortcutKey: "Ctrl+Shift+D"
  }
];

const FILTER_SETTINGS = [
  {
    type: "system",
    label: "Open Setting panel",
    command: "showFilterSortSettings",
    shortcutKey: "Ctrl+Shift+F"
  },
  {
    type: "system",
    label: "Clear",
    command: "clearFilterSortSettings",
    shortcutKey: "Ctrl+Shift+C"
  },
  {
    type: "system",
    label: "Reload",
    command: "reloadFilterSortSettings",
    shortcutKey: "Ctrl+Shift+C"
  }
];

const groupedOptions = [
  {
    label: "Edit",
    options: EDIT
  },
  {
    label: "Filter Settings",
    options: FILTER_SETTINGS
  }
];

const mapStateToProps = state => ({
  filtersList: state.get("filtersList"),
  prevFocusedElm: state.get("prevFocusedElm")
});

export default connect(mapStateToProps, {
  callActionOnItemList,
  setIdsFromDatastore,
  setDetailType,
  deleteUserFilter
})(Component);
