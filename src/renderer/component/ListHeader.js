import React, { useState, useEffect } from "react";
import Tooltip from "rc-tooltip";
import styled from "@emotion/styled";

// Components
import { connect } from "react-redux";
import AngleDoubleRight from "../../icon/listheader/angle-double-right.svg";
import AngleDoubleLeft from "../../icon/listheader/angle-double-left.svg";
import Bars from "../../icon/listheader/bars.svg";
import ThList from "../../icon/listheader/th-list.svg";
import EllipsisOff from "../../icon/listheader/ellipsis-v-alt.svg";
import Ellipsis from "../../icon/listheader/ellipsis-v.svg";
import ToolTipList from "./ToolTipList";

import {
  toggleMainPanel,
  toggleListMode,
  toggleItemListToolTipVisibility
} from "../actions";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #2f3140;
  color: #b5b5b5;
  height: 100%;
  width: 301px;
  border-bottom: 1px solid #212121;
`;

const Left = styled.div`
  max-width: 300px;
  flex-grow: 2;
  display: flex;
  align-items: center;
  margin-left: 10px;
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
    background-color: #222222;
  }
`;

const ItemText = styled.p`
  color: #dddddd;
  font-family: sans-serif;
  font-size: 12px;
`;

const ListHeader = props => {
  const {
    isCompact,
    isFold,
    toggleItemListToolTipVisibility,
    toggleListMode,
    toggleMainPanel
  } = props;

  return (
    <Wrapper>
      <Left>
        <ItemText>{_setFiltersName(props)}</ItemText>
      </Left>
      <Right id="tooltip" tabIndex="0">
        <IconWrapper
          onClick={() => {
            toggleMainPanel();
          }}
        >
          {_toggleMainPanel(isFold)}
        </IconWrapper>
        <IconWrapper
          onClick={() => {
            toggleListMode();
          }}
        >
          {_toggleListMode(isCompact)}
        </IconWrapper>
        <IconWrapper
          onClick={() => {
            toggleItemListToolTipVisibility();
          }}
        >
          <Ellipsis
            style={{ width: "2.6px", fill: "#dddddd", marginTop: "1px" }}
          ></Ellipsis>
        </IconWrapper>
      </Right>
    </Wrapper>
  );
};

const _setFiltersName = props => {
  const {
    ids,
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
    console.log(sortOpt.length);
    console.log(filterShortcutKeyOpt);
    console.log(keywordFilterOpt.length);
    console.log(idFilterOpt.length);
    console.log(dataTypeFilterOpt.length);
    console.log(statusFilterOpt.length);
    console.log(hotKeyFilterOpt.length);
    console.log(hashTagFilterOpt.length);
    console.log(languageFilterOpt.length);

    if (filterName !== "") {
      headerTitle = filterName;
    } else {
      headerTitle = "Untitled";
    }
  } else {
    if (filterName !== "") {
      headerTitle = filterName;
    } else {
      headerTitle = "All Items";
    }
  }

  return `${headerTitle}(${ids.size})`;
};

const _toggleMainPanel = isFold => {
  const style = {
    width: "14px",
    fill: "#dddddd"
  };
  if (isFold) {
    return <AngleDoubleLeft style={style}></AngleDoubleLeft>;
  } else {
    return <AngleDoubleRight style={style}></AngleDoubleRight>;
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
  itemsTimeLine: state.get("itemsTimeLine"),
  itemListToolTipVisibility: state.get("itemListToolTipVisibility")
});

export default connect(mapStateToProps, {
  toggleItemListToolTipVisibility,
  toggleListMode,
  toggleMainPanel
})(ListHeader);
