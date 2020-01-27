import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  toggleModalVisibility,
  storeItemOnModalOpen,
  deleteIds,
  setActionSelected,
  favItem,
  setScrollToRow
} from "../actions";
import styled from "@emotion/styled";
import Star from "../../icon/editbutton/star.svg";
import StarSolid from "../../icon/editbutton/star-solid.svg";
import Tag from "../../icon/editbutton/tag.svg";
import TagSolid from "../../icon/editbutton/tag-solid.svg";
import Trash from "../../icon/editbutton/trash.svg";
import TrashFill from "../../icon/editbutton/trash-fill.svg";
import Ellipsis from "../../icon/editbutton/ellipsis-h.svg";

const Wrapper = styled.div`
  flex-basis: 20px;
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  margin-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
`;
const IconWrapper = styled.div`
  border-radius: 50%;
  height: 22px;
  width: 22px;
  padding-top: 2px;
  padding-left: 2px;
  transition: background-color 0.1s;
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
  pointer-events: ${props => (props.isOpenClipToolTip ? "none" : "auto")};
`;

const TooltipIconWrapper = styled.div`
  background-size: 15px 15px;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%23eeeeee%22%20viewBox%3D%220%200%20512%20512%22%3E%3Cpath%20d%3D%22M328%20256c0%2039.8-32.2%2072-72%2072s-72-32.2-72-72%2032.2-72%2072-72%2072%2032.2%2072%2072zm104-72c-39.8%200-72%2032.2-72%2072s32.2%2072%2072%2072%2072-32.2%2072-72-32.2-72-72-72zm-352%200c-39.8%200-72%2032.2-72%2072s32.2%2072%2072%2072%2072-32.2%2072-72-32.2-72-72-72z%22%2F%3E%3C%2Fsvg%3E");
  border-radius: 50%;
  height: 22px;
  width: 22px;
  padding-top: 2px;
  padding-left: 2px;
  transition: background-color 0.1s;
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
  pointer-events: ${props => (props.isOpenClipToolTip ? "none" : "auto")};
`;

const EditButtons = props => {
  const {
    id,
    index,
    isFaved,
    isTrashed,
    favItem,
    hasTags,
    toggleModalVisibility,
    storeItemOnModalOpen,
    deleteIds,
    isOpenClipToolTip
  } = props;
  return (
    <Wrapper>
      <IconWrapper
        id={`${id}-action-star`}
        onClick={() => {
          favItem(id);
        }}
      >
        {toggleStarIcon(isFaved)}
      </IconWrapper>
      <IconWrapper
        id={`${id}-action-tag`}
        onClick={() => {
          toggleModalVisibility(id);
          storeItemOnModalOpen(id);
        }}
      >
        {toggleTagIcon(hasTags)}
      </IconWrapper>
      <IconWrapper
        id={`${id}-action-delete`}
        onClick={e => {
          e.stopPropagation();
          deleteIds(id);
        }}
      >
        {toggleTrashIcon(isTrashed)}
      </IconWrapper>
      <TooltipIconWrapper
        isOpenClipToolTip={isOpenClipToolTip}
        data-tip={`${id}:${index}`}
        data-place={"left"}
        data-for="global"
        // id={`${id}-option`}
        id={`${id}:${index}`}
      >
        {/* {renderToolTipIcon()} */}
      </TooltipIconWrapper>
    </Wrapper>
  );
};

const toggleStarIcon = isFaved => {
  if (isFaved) {
    return (
      <StarSolid
        style={{
          fill: "#bab586",
          width: "17px",
          marginTop: "1px"
        }}
      />
    );
  } else {
    return (
      <Star
        style={{
          fill: "#bab586",
          width: "17px",
          marginTop: "1px"
        }}
      />
    );
  }
};
const toggleTagIcon = hasTags => {
  if (hasTags) {
    return (
      <TagSolid
        style={{
          fill: "#af86ba",
          width: "15px",
          marginTop: "2px",
          marginLeft: "2px"
        }}
      />
    );
  } else {
    return (
      <Tag
        style={{
          fill: "#af86ba",
          width: "15px",
          marginTop: "2px",
          marginLeft: "2px"
        }}
      />
    );
  }
};

const toggleTrashIcon = isTrashed => {
  const style = {
    width: "14px",
    marginTop: "1px",
    marginLeft: "2px"
  };
  if (isTrashed) {
    return <TrashFill style={style} />;
  } else {
    return <Trash style={style} />;
  }
};

const renderToolTipIcon = () => {
  const style = {
    fill: "#eeeeee",
    width: "16px",
    marginTop: "1px",
    marginLeft: "1px"
  };
  return <Ellipsis style={style} />;
};

const mapStateToProps = state => ({
  modalVisibility: state.get("modalVisibility"),
  isOpenClipToolTip: state.get("isOpenClipToolTip")
});

export default connect(mapStateToProps, {
  toggleModalVisibility,
  storeItemOnModalOpen,
  deleteIds,
  setActionSelected,
  favItem,
  setScrollToRow
})(EditButtons);
