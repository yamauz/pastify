import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

// Components
import { connect } from "react-redux";
import ListMenu from "./ListMenu";
import AngleDoubleRight from "../../icon/listheader/angle-double-right.svg";
import AngleDoubleLeft from "../../icon/listheader/angle-double-left.svg";
import Bars from "../../icon/listheader/bars.svg";
import ThList from "../../icon/listheader/th-list.svg";

import {
  toggleMainFold,
  toggleListMode,
  clearFilterSortSettings,
  setIdsFromDatastore
} from "../actions";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* background-color: #0c0f1f; */
  transition: background-color 0.3s;
  background-color: ${props => (props.isFilter ? "#331313" : "#0c0f1f")};
  color: #b5b5b5;
  width: 301px;
  cursor: default;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  padding-left: 5px;
  pointer-events: none;
`;
const Right = styled.div`
  display: flex;
  align-items: center;
  vertical-align: middle;
`;

const IconWrapper = styled.div`
  overflow: hidden;
  text-align: center;
  width: 25px;
  height: 22px;
  transition: background-color 0.1s;
  &:hover {
    background-color: #444444;
  }
`;

const ItemText = styled.span`
  max-width: 180px;
  color: #cccccc;
  font-family: sans-serif;
  font-size: 12px;
  overflow: hidden;
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const ItemCount = styled.span`
  margin-left: 5px;
  color: #cccccc;
  font-family: sans-serif;
  font-size: 12px;
`;

const FilterIcon = styled.div`
  pointer-events: auto;
  overflow: hidden;
  text-align: center;
  display: inline-block;
  content: " ";
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%20fill%3D%22%23dcdcdc%22%3E%3Cpath%20d%3D%22M487.976%200H24.028C2.71%200-8.047%2025.866%207.058%2040.971L192%20225.941V432c0%207.831%203.821%2015.17%2010.237%2019.662l80%2055.98C298.02%20518.69%20320%20507.493%20320%20487.98V225.941l184.947-184.97C520.021%2025.896%20509.338%200%20487.976%200z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  vertical-align: top;
  margin-right: 4px;
  width: 13px;
  height: 13px;
  &:hover {
    margin-right: 0px;
    margin-left: 2px;
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20352%20512%22%20fill%3D%22%23dcdcdc%22%3E%3Cpath%20d%3D%22M242.72%20256l100.07-100.07c12.28-12.28%2012.28-32.19%200-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48%200L176%20189.28%2075.93%2089.21c-12.28-12.28-32.19-12.28-44.48%200L9.21%20111.45c-12.28%2012.28-12.28%2032.19%200%2044.48L109.28%20256%209.21%20356.07c-12.28%2012.28-12.28%2032.19%200%2044.48l22.24%2022.24c12.28%2012.28%2032.2%2012.28%2044.48%200L176%20322.72l100.07%20100.07c12.28%2012.28%2032.2%2012.28%2044.48%200l22.24-22.24c12.28-12.28%2012.28-32.19%200-44.48L242.72%20256z%22%2F%3E%3C%2Fsvg%3E");
    width: 15px;
    height: 15px;
  }
`;

const ListHeader = props => {
  const {
    ids,
    isCompact,
    isFold,
    toggleListMode,
    toggleMainFold,
    filterName,
    clearFilterSortSettings,
    setIdsFromDatastore
  } = props;
  const isFilter = _detectFilter(props);

  return (
    <Wrapper isFilter={isFilter}>
      <Left>
        {isFilter && (
          <FilterIcon
            onClick={e => {
              clearFilterSortSettings();
              setIdsFromDatastore();
            }}
          />
        )}

        <ItemText>{_setFilterName(isFilter, filterName)}</ItemText>
        <ItemCount>{`(${ids.size})`}</ItemCount>
      </Left>
      <Right id="tooltip" tabIndex="0">
        <IconWrapper
          onClick={() => {
            toggleMainFold();
          }}
        >
          {_toggleMainFold(isFold)}
        </IconWrapper>
        <IconWrapper
          onClick={() => {
            toggleListMode();
          }}
        >
          {_toggleListMode(isCompact)}
        </IconWrapper>
        <IconWrapper>
          <ListMenu />
        </IconWrapper>
      </Right>
    </Wrapper>
  );
};

const _setFilterName = (isFilter, filterName) => {
  if (filterName !== "") {
    return filterName;
  } else {
    return isFilter ? "Untitled" : "All Clips";
  }
};

const _detectFilter = props => {
  const {
    sortOpt,
    filterShortcutKeyOpt,
    keywordFilterOpt,
    idFilterOpt,
    dataTypeFilterOpt,
    statusFilterOpt,
    hotKeyFilterOpt,
    hashTagFilterOpt,
    languageFilterOpt
  } = props;

  if (
    sortOpt.length !== 0 ||
    filterShortcutKeyOpt.length !== 0 ||
    keywordFilterOpt.length !== 0 ||
    idFilterOpt.length !== 0 ||
    dataTypeFilterOpt.length !== 0 ||
    statusFilterOpt.length !== 0 ||
    hotKeyFilterOpt.length !== 0 ||
    hashTagFilterOpt.length !== 0 ||
    languageFilterOpt.length !== 0
  ) {
    return true;
  } else {
    return false;
  }
};

const _toggleMainFold = isFold => {
  const style = {
    width: "14px",
    fill: "#dddddd"
  };
  if (isFold) {
    return <AngleDoubleRight style={style}></AngleDoubleRight>;
  } else {
    return <AngleDoubleLeft style={style}></AngleDoubleLeft>;
  }
};

const _toggleListMode = isCompact => {
  const style = {};
  if (isCompact) {
    style.width = "14px";
    style.marginTop = "4px";
    style.fill = "#dddddd";
    return <ThList style={style}></ThList>;
  } else {
    style.width = "14px";
    style.marginTop = "3px";
    style.fill = "#ffffff";
    return <Bars style={style}></Bars>;
  }
};

const mapStateToProps = state => ({
  filterName: state.get("filterName"),
  sortOpt: state.get("sortOpt"),
  filterShortcutKeyOpt: state.get("filterShortcutKeyOpt"),
  keywordFilterOpt: state.get("keywordFilterOpt"),
  idFilterOpt: state.get("idFilterOpt"),
  dataTypeFilterOpt: state.get("dataTypeFilterOpt"),
  statusFilterOpt: state.get("statusFilterOpt"),
  hotKeyFilterOpt: state.get("hotKeyFilterOpt"),
  hashTagFilterOpt: state.get("hashTagFilterOpt"),
  languageFilterOpt: state.get("languageFilterOpt"),
  isCompact: state.get("isCompact"),
  isFold: state.get("isFold"),
  itemsTimeLine: state.get("itemsTimeLine")
});

export default connect(mapStateToProps, {
  toggleListMode,
  toggleMainFold,
  clearFilterSortSettings,
  setIdsFromDatastore
})(ListHeader);
