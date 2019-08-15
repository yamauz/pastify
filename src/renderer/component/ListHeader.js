import React, { useState, useEffect } from "react";
import Tooltip from "rc-tooltip";
import styled from "@emotion/styled";

// Components
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import ToolTipList from "./ToolTipList";
import { toggleItemListToolTipVisibility } from "../actions";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #404040;
  color: #b5b5b5;
  height: 23px;
  width: 301px;
  border-bottom: 1px solid #212121;
`;

const Left = styled.div`
  max-width: 300px;
  flex-grow: 2;
  display: flex;
  align-items: center;
  margin-left: 5px;
`;
const Right = styled.div`
  display: flex;
  align-items: center;
  vertical-align: middle;
  margin-right: 5px;
`;

const EllipsisWrapper = styled.div`
  display: inline-block;
  text-align: center;
  width: 20px;
  padding-bottom: 2px;
`;

const ItemText = styled.p`
  color: #b5b5b5;
  font-family: sans-serif;
  font-size: 12px;
`;

const ListHeader = props => {
  const {
    ids,
    toggleItemListToolTipVisibility,
    itemListToolTipVisibility
  } = props;

  return (
    <Wrapper>
      <Left>
        <ItemText>{ids.size} items</ItemText>
      </Left>
      <Tooltip
        visible={itemListToolTipVisibility}
        placement="bottomRight"
        trigger={["click"]}
        overlay={<ToolTipList />}
        onVisibleChange={() => {}}
        align={{
          offset: [-10, -5]
        }}
      >
        <Right id="item-list-setting" tabIndex="0">
          <EllipsisWrapper
            onClick={() => {
              toggleItemListToolTipVisibility();
            }}
          >
            <FontAwesomeIcon
              fixedWidth
              icon={faEllipsisV}
              size="sm"
              color={"#b5b5b5"}
            />
          </EllipsisWrapper>
        </Right>
      </Tooltip>
    </Wrapper>
  );
};

const mapStateToProps = state => ({
  itemsTimeLine: state.get("itemsTimeLine"),
  itemListToolTipVisibility: state.get("itemListToolTipVisibility")
});

export default connect(
  mapStateToProps,
  { toggleItemListToolTipVisibility }
)(ListHeader);
