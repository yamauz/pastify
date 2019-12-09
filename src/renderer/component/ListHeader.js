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
    ids,
    isCompact,
    isFold,
    itemListToolTipVisibility,
    toggleItemListToolTipVisibility,
    toggleListMode,
    toggleMainPanel,
    filterName
  } = props;

  return (
    <Wrapper>
      <Left>
        <ItemText>{_setFiltersName(ids.size, filterName)}</ItemText>
      </Left>
      {/* <Tooltip
        visible={itemListToolTipVisibility}
        placement="bottomRight"
        trigger={["click"]}
        overlay={<ToolTipList />}
        onVisibleChange={() => {}}
        align={{
          offset: [-10, -5]
        }}
      > */}
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
      {/* </Tooltip> */}
    </Wrapper>
  );
};

const _setFiltersName = (size, name) => {
  const dispName = name === "" ? `All Items(${size})` : `${name}(${size})`;
  return dispName;
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
