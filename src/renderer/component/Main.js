import React, { useState, useEffect } from "react";
// Redux
import { connect } from "react-redux";
import {
  loadItem,
  addItemClipboard,
  deleteItem,
  toggleItemListToolTipVisibility,
  setWinFocus,
  setWinMaximize,
  setAlwaysOnTop
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
import MenuList from "./MenuList";
import "../styles/rc-menu.css";

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
    prevFocusedElm,
    modalVisibility,
    filterSaveModalVisibility,
    itemListToolTipVisibility,
    addItemClipboard,
    idsTimeLine,
    toggleItemListToolTipVisibility,
    setWinFocus,
    setWinMaximize,
    setAlwaysOnTop
  } = props;
  useEffect(() => {
    ipcRenderer.on("ON_COPY", (event, item, addMode) => {
      addItemClipboard(item, "TimeLine", addMode);
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
    ipcRenderer.on("ON_ALWAYS_ON_TOP_CHANGED", () => {
      setAlwaysOnTop();
    });
    document.getElementById("searchbar").focus();
    // window.addEventListener(
    //   "keydown",
    //   e => {
    //     const { shiftKey, ctrlKey } = e;
    //     const pressKey = e.keyCode;
    //     const { O } = keyCode;

    //     if (ctrlKey && !shiftKey) {
    //       if (pressKey === O) toggleItemListToolTipVisibility();
    //     } else if (!ctrlKey && shiftKey) {
    //     } else if (ctrlKey && shiftKey) {
    //     }
    //   },
    //   true
    // );
  }, []);

  useEffect(() => {
    window.addEventListener("click", toggleToolTipByClick, true);
    window.addEventListener("keydown", toggleToolTipByKeyDown, true);
    return () => {
      window.removeEventListener("click", toggleToolTipByClick, true);
      window.removeEventListener("keydown", toggleToolTipByKeyDown, true);
    };
  }, [itemListToolTipVisibility]);

  const toggleToolTipByClick = () => {
    const regex1 = /^tooltip/;
    const regex2 = /^rc-/;
    if (!regex1.test(document.activeElement.id) && itemListToolTipVisibility) {
      if (!regex2.test(document.activeElement.className)) {
        toggleItemListToolTipVisibility();
      }
    }
  };
  const toggleToolTipByKeyDown = e => {
    const { shiftKey, ctrlKey } = e;
    const pressKey = e.keyCode;
    const { O } = keyCode;

    if (ctrlKey && !shiftKey) {
      if (pressKey === O) {
        toggleItemListToolTipVisibility();
        if (itemListToolTipVisibility) prevFocusedElm.focus();
      }
    } else if (!ctrlKey && shiftKey) {
    } else if (ctrlKey && shiftKey) {
    }
  };

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
      {itemListToolTipVisibility && <MenuList />}

      {viewTagModal(modalVisibility)}
      {viewFilterSaveModal(filterSaveModalVisibility)}
    </Wrapper>
  );
};

const viewTagModal = visible => (visible ? <Modal /> : null);
const viewFilterSaveModal = visible => (visible ? <FilterSaveModal /> : null);

const mapStateToProps = state => ({
  prevFocusedElm: state.get("prevFocusedElm"),
  itemsTimeLine: state.get("itemsTimeLine"),
  idsTimeLine: state.get("idsTimeLine"),
  modalVisibility: state.get("modalVisibility"),
  filterSaveModalVisibility: state.get("filterSaveModalVisibility"),
  itemListToolTipVisibility: state.get("itemListToolTipVisibility")
});
export default connect(mapStateToProps, {
  loadItem,
  addItemClipboard,
  deleteItem,
  toggleItemListToolTipVisibility,
  setWinFocus,
  setWinMaximize,
  setAlwaysOnTop
})(Main);
