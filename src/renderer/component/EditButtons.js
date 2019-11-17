import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  toggleModalVisibility,
  storeItemOnModalOpen,
  deleteIds,
  setActionSelected,
  favItem
} from "../actions";
import styled from "@emotion/styled";
import Icon from "react-eva-icons";
import Star from "../../icon/editbutton/star.svg";
import StarSolid from "../../icon/editbutton/star-solid.svg";
import Tag from "../../icon/editbutton/tag.svg";
import TagSolid from "../../icon/editbutton/tag-solid.svg";
import Trash from "../../icon/editbutton/trash.svg";
import TrashFill from "../../icon/editbutton/trash-fill.svg";

const Wrapper = styled.div`
  flex-basis: 20px;
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  margin-bottom: 5px;
  padding-left: 20px;
  padding-right: 20px;
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
`;

const EditButtons = props => {
  const {
    id,
    isFaved,
    isTrashed,
    favItem,
    hasTags,
    toggleModalVisibility,
    storeItemOnModalOpen,
    deleteIds
  } = props;
  return (
    <Wrapper>
      <IconWrapper
        id={`${id}-action-paste`}
        onClick={() => {
          setActionAttribute(id, "action-paste");
        }}
      >
        <Icon
          name="clipboard-outline"
          width="5px"
          height="5px"
          fill="#869cba"
        />
      </IconWrapper>
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
        onClick={() => {
          console.log("trashed");
          deleteIds(id);
        }}
      >
        {toggleTrashIcon(isTrashed)}
      </IconWrapper>
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

const setActionAttribute = (tabId, actionIdSelected) => {
  const actionIds = [
    "action-paste",
    "action-star",
    "action-tag",
    "action-delete"
  ];

  actionIds.forEach(actionId => {
    const tabElm = document.getElementById(`${tabId}-${actionId}`);
    console.log(tabElm);
    if (actionId === actionIdSelected) {
      tabElm.setAttribute("data-action", actionId);
    } else {
      tabElm.setAttribute("data-action", null);
    }
  });
};

const mapStateToProps = state => ({
  modalVisibility: state.get("modalVisibility")
});

export default connect(mapStateToProps, {
  toggleModalVisibility,
  storeItemOnModalOpen,
  deleteIds,
  setActionSelected,
  favItem
})(EditButtons);
