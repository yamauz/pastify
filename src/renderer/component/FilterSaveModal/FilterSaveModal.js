import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Rodal from "rodal";
// import Select from "react-select";
import {
  toggleFilterSaveModalVisibility,
  restoreItemOnCancel
} from "../../actions";

import styled from "@emotion/styled";

import SelectButton from "./SelectButton";

const Wrapper = styled.div``;

const InputWrapper = styled.div`
  height: 25px;
`;
const FilterNameInput = styled.input``;
const DivLoop = styled.div``;

const FilterSaveModal = props => {
  const {
    idSelected,
    filterSaveModalVisibility,
    toggleFilterSaveModalVisibility,
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
        visible={filterSaveModalVisibility}
        onClose={() => {
          toggleFilterSaveModalVisibility();
          const elm = document.getElementById(`${idSelected}-tab`);
          elm.focus();
        }}
        // animation="fade"
        duration={50}
        showCloseButton={false}
        closeOnEsc={true}
        customStyles={{
          backgroundColor: "#3e3d32",
          borderRadius: 0
        }}
      >
        <DivLoop
          id="divloop-start"
          tabIndex={0}
          onKeyDown={e => {
            if (e.keyCode === 9) {
              if (e.shiftKey) {
                const elm = document.getElementById("divloop-end");
                elm.focus();
              } else {
              }
            }
          }}
        />
        <InputWrapper>
          <FilterNameInput />
        </InputWrapper>
        <SelectButton />
      </Rodal>
    </Wrapper>
  );
};

const mapStateToProps = state => ({
  itemsTimeLine: state.get("itemsTimeLine"),
  itemsFav: state.get("itemsFav"),
  idSelected: state.get("idSelected"),
  menuTabSelected: state.get("menuTabSelected"),
  filterSaveModalVisibility: state.get("filterSaveModalVisibility")
});

export default connect(
  mapStateToProps,
  {
    toggleFilterSaveModalVisibility,
    restoreItemOnCancel
  }
)(FilterSaveModal);
