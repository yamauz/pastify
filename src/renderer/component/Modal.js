import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Rodal from "rodal";
// import Select from "react-select";
import { toggleModalVisibility, restoreItemOnCancel } from "../actions";

import styled from "@emotion/styled";

// Input Component
import LanguageInput from "./TagModal/LanguageInput";
import KeyInput from "./TagModal/KeyInput";
import HashTagInput from "./TagModal/HashTagInput";
import SelectButton from "./TagModal/SelectButton";

const Wrapper = styled.div``;

const Modal = props => {
  const {
    idSelected,
    modalVisibility,
    toggleModalVisibility,
    restoreItemOnCancel,
    menuTabSelected
  } = props;
  const items = props[`items${menuTabSelected}`];
  const itemProps = items.get(idSelected) || {
    lang: "",
    key: [],
    tag: []
  };

  return (
    <Wrapper id="tag-modal" name={idSelected}>
      <Rodal
        width={280}
        height={300}
        visible={modalVisibility}
        onClose={() => {
          toggleModalVisibility(idSelected);
          restoreItemOnCancel();
          const elm = document.getElementById("item-list");
          elm.focus();
        }}
        duration={50}
        showCloseButton={false}
        // closeOnEsc={true}
        customStyles={{
          backgroundColor: "rgb(34, 39, 41)",
          borderRadius: 0
        }}
      >
        <KeyInput hotKey={itemProps.key} />
        <LanguageInput lang={itemProps.lang} />
        <HashTagInput tag={itemProps.tag} />
        <SelectButton id={idSelected} />
      </Rodal>
    </Wrapper>
  );
};

const mapStateToProps = state => ({
  itemsTimeLine: state.get("itemsTimeLine"),
  itemsFav: state.get("itemsFav"),
  idSelected: state.get("idSelected"),
  menuTabSelected: state.get("menuTabSelected"),
  modalVisibility: state.get("modalVisibility")
});

export default connect(mapStateToProps, {
  toggleModalVisibility,
  restoreItemOnCancel
})(Modal);
