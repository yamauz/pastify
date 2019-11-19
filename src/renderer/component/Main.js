import React, { useState, useEffect } from "react";
// Redux
import { connect } from "react-redux";
import {
  loadItem,
  addItemClipboard,
  deleteItem,
  toggleItemListToolTipVisibility,
  setWinFocus,
  setWinMaximize
} from "../actions";
// Components
import Container from "./Container";
import SearchBar from "./SearchBar";
import TitleBar from "./TitleBar";
import Modal from "./Modal";
import FilterSaveModal from "./FilterSaveModal/FilterSaveModal";
import Footer from "./Footer";
// Style
import "../styles/style.css";
import "../styles/react-virtulized.css";
import "../styles/rc-tooltip.css";
import "rodal/lib/rodal.css";
import "electron-react-titlebar/assets/style.css";
import styled from "@emotion/styled";
// Common
import keyCode from "../../common/keycode";

const Wrapper = styled.div`
  display: grid;
  box-sizing: border-box;
  grid-template-columns: 1fr;
  grid-template-rows: 28px 1fr 23px;
  grid-template-areas:
    "header"
    "main"
    "footer";
  height: 100vh;
  width: 100vw;
`;
const GridHeader = styled.div`
  grid-area: header;
  width: 100%;
`;
const GridMain = styled.div`
  grid-area: main;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 40px 1fr;
  grid-template-areas:
    "searchbar"
    "itempanel";
  background-color: #272822;
`;

const GridSearchBar = styled.div`
  grid-area: searchbar;
`;

const GridItemPanel = styled.div`
  grid-area: itempanel;
`;

const GridFooter = styled.div`
  grid-area: footer;
  background-color: #50505f;
`;

const { ipcRenderer } = window.require("electron");

const Main = props => {
  const {
    modalVisibility,
    filterSaveModalVisibility,
    addItemClipboard,
    idsTimeLine,
    toggleItemListToolTipVisibility,
    setWinFocus,
    setWinMaximize
  } = props;
  useEffect(() => {
    ipcRenderer.on("ON_COPY", (event, item) => {
      addItemClipboard(item, "TimeLine");
    });
    ipcRenderer.on("ON_BLUR", () => {
      setWinFocus(false);
    });
    ipcRenderer.on("ON_FOCUS", () => {
      setWinFocus(true);
    });
    ipcRenderer.on("ON_MAXIMIZE", () => {
      setWinMaximize(true);
    });
    ipcRenderer.on("ON_UNMAXIMIZE", () => {
      setWinMaximize(false);
    });
    document.getElementById("searchbar").focus();
    window.addEventListener(
      "keydown",
      e => {
        const { shiftKey, ctrlKey } = e;
        const pressKey = e.keyCode;
        const { O } = keyCode;

        if (ctrlKey && !shiftKey) {
          if (pressKey === O) toggleItemListToolTipVisibility();
        } else if (!ctrlKey && shiftKey) {
        } else if (ctrlKey && shiftKey) {
        }
      },
      true
    );
    window.addEventListener(
      "click",
      e => {
        if (document.activeElement.id !== "item-list-setting") {
          toggleItemListToolTipVisibility("OFF");
        }
      },
      true
    );
  }, []);

  return (
    <Wrapper tabIndex="0">
      <GridHeader>
        <TitleBar />
      </GridHeader>
      <GridMain>
        <GridSearchBar>
          <SearchBar />
        </GridSearchBar>
        <GridItemPanel>
          <Container ids={idsTimeLine} />
        </GridItemPanel>
      </GridMain>
      <GridFooter>
        <Footer />
      </GridFooter>
      {viewTagModal(modalVisibility)}
      {viewFilterSaveModal(filterSaveModalVisibility)}
    </Wrapper>
  );
};

const viewTagModal = visible => (visible ? <Modal /> : null);
const viewFilterSaveModal = visible => (visible ? <FilterSaveModal /> : null);

const mapStateToProps = state => ({
  itemsTimeLine: state.get("itemsTimeLine"),
  idsTimeLine: state.get("idsTimeLine"),
  modalVisibility: state.get("modalVisibility"),
  filterSaveModalVisibility: state.get("filterSaveModalVisibility")
});
export default connect(mapStateToProps, {
  loadItem,
  addItemClipboard,
  deleteItem,
  toggleItemListToolTipVisibility,
  setWinFocus,
  setWinMaximize
})(Main);
