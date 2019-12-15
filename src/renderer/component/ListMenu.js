import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import Select from "react-select";
import {
  callActionOnItemList,
  setIdsFromDatastore,
  setDetailType
} from "../actions";
import Select, { components } from "react-select";
import Ellipsis from "../../icon/listheader/ellipsis-v.svg";

import styled from "@emotion/styled";

const svgFav =
  "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20576%20512%22%3E%3Cpath%20d%3D%22M259.3%2017.8L194%20150.2%2047.9%20171.5c-26.2%203.8-36.7%2036.1-17.7%2054.6l105.7%20103-25%20145.5c-4.5%2026.3%2023.2%2046%2046.4%2033.7L288%20439.6l130.7%2068.7c23.2%2012.2%2050.9-7.4%2046.4-33.7l-25-145.5%20105.7-103c19-18.5%208.5-50.8-17.7-54.6L382%20150.2%20316.7%2017.8c-11.7-23.6-45.6-23.9-57.4%200z%22%2F%3E%3C%2Fsvg%3E";

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
`;

const Component = props => {
  const {
    filtersList,
    callActionOnItemList,
    setIdsFromDatastore,
    setDetailType
  } = props;

  return (
    <Wrapper>
      <Select
        noOptionsMessage={() => null}
        menuPosition={"fixed"}
        // options={groupedOptions}
        options={createGroupedOptions(filtersList)}
        formatGroupLabel={formatGroupLabel}
        placeholder={null}
        value={null}
        components={{ DropdownIndicator, Option }}
        onChange={opt => {
          console.log(document.activeElement);
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

const DropdownIndicator = props => {
  return (
    <components.DropdownIndicator {...props}>
      <IconWrapper>
        <Ellipsis
          style={{ width: "2.6px", fill: "#dddddd", marginTop: "0.5px" }}
        ></Ellipsis>
      </IconWrapper>
    </components.DropdownIndicator>
  );
};

const Option = props => {
  return (
    <components.Option {...props}>
      <OptionWrapper>
        <OptionLeftSec>
          <DelIcon
            type={props.data.type}
            isFocused={props.isFocused}
            onClick={e => {
              e.stopPropagation();
              console.log(e);
            }}
          >
            X
          </DelIcon>
        </OptionLeftSec>
        <OptionRightSec>
          <Command> {props.data.label}</Command>
          <ShortcutKey>{props.data.shortcutKey}</ShortcutKey>
        </OptionRightSec>
      </OptionWrapper>
    </components.Option>
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
    // max-height: ${() => `${window.innerHeight - 125}px`};

    position: "absolute",
    top: -10,
    left: -275,
    backgroundColor: "#111514",
    paddingBottom: "6px"

    // "&::-webkit-scrollbar-thumb": {
    //   backgroundColor: "red"
    // }
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
      options: filtersToRender
    };
    groupedOptions[2] = userFilterOptions;
  }
  return groupedOptions;
};

const EDIT = [
  {
    type: "system",
    label: "Add new",
    command: "addNewItem",
    shortcutKey: "Ctrl+Shift+N"
  },
  {
    type: "system",
    label: "Trash All On List ",
    command: "trashAllItems",
    shortcutKey: "Ctrl+Shift+D"
  },
  {
    type: "system",
    label: "Trash all items ( excludes faved )",
    command: "trashAllItemsWithoutFaved",
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
  filtersList: state.get("filtersList")
});

export default connect(mapStateToProps, {
  callActionOnItemList,
  setIdsFromDatastore,
  setDetailType
})(Component);
