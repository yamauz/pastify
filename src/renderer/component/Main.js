import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
// Redux
import { connect } from "react-redux";
import {
  loadItem,
  addItemClipboard,
  deleteItem,
  setWinFocus,
  setWinMaximize,
  setAlwaysOnTop,
  setPrevFocusedElm,
  setToolTipArrowPos,
  toggleClipToolTip
} from "../actions";
// Components
import Container from "./Container";
import SearchBar from "./SearchBar";
import TitleBar from "./TitleBar";
import Modal from "./Modal";
import ItemToolTip from "./ItemToolTip";
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
    addItemClipboard,
    idsTimeLine,
    setWinFocus,
    setWinMaximize,
    setAlwaysOnTop,
    setPrevFocusedElm,
    setToolTipArrowPos,
    toggleClipToolTip
  } = props;
  useEffect(() => {
    ipcRenderer.on("useIpc", (event, triger, args) => {
      switch (triger) {
        case "COPY":
          const { clip, mode } = args;
          addItemClipboard(clip, "TimeLine", mode);
          break;
        case "BLUR":
          setWinFocus(false);
          break;
        case "FOCUS":
          setWinFocus(true);
          break;
        case "MAXIMIZE":
          setWinMaximize(true);
          break;
        case "UNMAXIMIZE":
          setWinMaximize(false);
          break;
        case "ALWAYS_ON_TOP_CHANGED":
          setAlwaysOnTop();
          break;
        case "RESIZE":
          break;
        default:
          break;
      }
      console.log("rebuild");
      ReactTooltip.rebuild();
    });

    document.getElementById("searchbar").focus();
    setTimeout(() => {
      console.log("rebuild");
      ReactTooltip.rebuild();
    }, 0);
    // ipcRenderer.on("ON_COPY", (event, item, addMode) => {
    //   addItemClipboard(item, "TimeLine", addMode);
    // });
    // ipcRenderer.on("ON_BLUR", () => {
    //   setWinFocus(false);
    // });
    // ipcRenderer.on("ON_FOCUS", () => {
    //   setWinFocus(true);
    // });
    // ipcRenderer.on("ON_MAXIMIZE", () => {
    //   setWinMaximize(true);
    // });
    // ipcRenderer.on("ON_UNMAXIMIZE", () => {
    //   setWinMaximize(false);
    // });
    // ipcRenderer.on("ON_ALWAYS_ON_TOP_CHANGED", () => {
    //   setAlwaysOnTop();
    // });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", toggleToolTipByKeyDown, true);
    return () => {
      window.removeEventListener("keydown", toggleToolTipByKeyDown, true);
    };
  }, [prevFocusedElm]);

  const toggleToolTipByKeyDown = e => {
    const { shiftKey, ctrlKey } = e;
    const pressKey = e.keyCode;
    const { O } = keyCode;

    if (ctrlKey && !shiftKey) {
      if (pressKey === O) {
        if (document.activeElement === document.getElementById("list-menu")) {
          document.getElementById("list-menu").blur();
          prevFocusedElm.focus();
        } else {
          setPrevFocusedElm();
          document.getElementById("list-menu").focus();
        }
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
      {viewTagModal(modalVisibility)}
      {viewFilterSaveModal(filterSaveModalVisibility)}
      <ReactTooltip
        effect="solid"
        id="global"
        globalEventOff="click"
        event="click"
        clickable={true}
        scrollHide={true}
        resizeHide={true}
        className="item-tooltip"
        afterShow={() => {
          setPrevFocusedElm();
          toggleClipToolTip();
          setTimeout(() => {
            document.getElementById("item-tooltip").focus();
          }, 0);
        }}
        afterHide={() => {
          toggleClipToolTip();
          prevFocusedElm.focus();
        }}
        overridePosition={(
          { left, top },
          currentEvent,
          currentTarget,
          node,
          place
        ) => {
          const listHeight =
            document.getElementById("item-list").clientHeight - 50;
          const clientRect = currentTarget.getBoundingClientRect();
          const targetOffsetTop = clientRect.top - 91;
          switch (place) {
            case "top":
              left = left - 61;
              break;
            case "bottom":
              left = left - 61;
              top = top + 4;
              break;
            case "left":
              if (targetOffsetTop < listHeight / 2) {
                top = top + 20;
                left = left + 22;
                setToolTipArrowPos("up");
              } else {
                top = top - 245;
                left = left + 22;
                setToolTipArrowPos("down");
              }
              break;
            case "right":
              break;

            default:
              break;
          }

          return { top, left };
        }}
        getContent={clip => {
          const [id, index] = clip !== null ? clip.split(":") : [null, null];
          return <ItemToolTip index={index} id={id}></ItemToolTip>;
        }}
      ></ReactTooltip>
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
  filterSaveModalVisibility: state.get("filterSaveModalVisibility")
});
export default connect(mapStateToProps, {
  loadItem,
  addItemClipboard,
  deleteItem,
  setWinFocus,
  setWinMaximize,
  setAlwaysOnTop,
  setPrevFocusedElm,
  setToolTipArrowPos,
  toggleClipToolTip
})(Main);
