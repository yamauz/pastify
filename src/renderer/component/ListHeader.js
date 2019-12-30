import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

// Components
import { connect } from "react-redux";
import ListMenu from "./ListMenu";
import AngleDoubleRight from "../../icon/listheader/angle-double-right.svg";
import AngleDoubleLeft from "../../icon/listheader/angle-double-left.svg";
import Bars from "../../icon/listheader/bars.svg";
import ThList from "../../icon/listheader/th-list.svg";

import { toggleMainFold, toggleListMode } from "../actions";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #0c0f1f;
  color: #b5b5b5;
  width: 301px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  padding-left: 5px;
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

const ListHeader = props => {
  const { ids, isCompact, isFold, toggleListMode, toggleMainFold } = props;

  return (
    <Wrapper>
      <Left>
        <ItemText>{_setFiltersName(props)}</ItemText>
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

const _setFiltersName = props => {
  const {
    filterName,
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

  let headerTitle;

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
    if (filterName !== "") {
      headerTitle = filterName;
    } else {
      headerTitle = "Untitled";
    }
  } else {
    if (filterName !== "") {
      headerTitle = filterName;
    } else {
      headerTitle = "All Clips";
    }
  }

  return headerTitle;
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
  toggleMainFold
})(ListHeader);
