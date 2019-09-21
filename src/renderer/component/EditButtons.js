import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  toggleModalVisibility,
  storeItemOnModalOpen,
  deleteItem,
  setActionSelected,
  favItem
} from "../actions";
import "semantic-ui-css/semantic.min.css";
import styled from "@emotion/styled";
import Icon from "react-eva-icons";
import Star from "../../icon/editbutton/star.svg";
import StarSolid from "../../icon/editbutton/star-solid.svg";
import Tag from "../../icon/editbutton/tag.svg";
import TrashAlt from "../../icon/editbutton/trash-alt.svg";
import ClipboardList from "../../icon/editbutton/clipboard-list.svg";

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
  const { id, isFaved, favItem, toggleModalVisibility } = props;
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
          // setActionAttribute(id, "action-star");
          favItem(id);
        }}
      >
        {/* <Icon
          // name="star-outline"
          name={starIcon}
          // fill="#bab586"
          fill={fill}
          size="medium" // small, medium, large, xlarge
        /> */}
        {toggleStarIcon(isFaved)}
      </IconWrapper>
      <IconWrapper
        id={`${id}-action-tag`}
        onClick={() => {
          // setActionAttribute(id, "action-tag");
          toggleModalVisibility(id);
          // props.storeItemOnModalOpen(id);
        }}
      >
        <Icon
          name="pricetags-outline"
          width="5px"
          height="5px"
          fill="#af86ba"
        />
      </IconWrapper>
      <IconWrapper
        id={`${id}-action-delete`}
        onClick={() => {
          // setActionAttribute(id, "action-delete");
          // const tabElm = document.getElementById(`${id}-tab`);
          // tabElm.setAttribute("data-action", "DELETE");
          // props.setActionSelected("DELETE");
        }}
      >
        <Icon name="trash-2-outline" width="5px" height="5px" fill="#b6b3b7" />
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

// export default Container;
export default connect(
  mapStateToProps,
  {
    toggleModalVisibility,
    storeItemOnModalOpen,
    deleteItem,
    setActionSelected,
    favItem
  }
)(EditButtons);
