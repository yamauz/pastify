import React, { useState, useEffect, useCallback } from "react";
import ReactTooltip from "react-tooltip";
import keycode from "keycode";
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
  toggleClipToolTip,
  setMainFold,
  toggleMainFold,
  toggleListMode,
  importClips,
  addImportClips,
  setIdsFromDatastore,
  callActionOnItemList,
  setUserFilterByKey,
  updateWinState,
  setClipListenerState,
  setCurrentClipboardText,
  showExportToast
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
import "../styles/rc-menu.css";
import "../styles/toasted-notes.css";

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
  grid-template-rows: 35px 1fr;
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
    toggleClipToolTip,
    setMainFold,
    toggleMainFold,
    toggleListMode,
    isFold,
    isCompact,
    addImportClips,
    importClips,
    setIdsFromDatastore,
    callActionOnItemList,
    setUserFilterByKey,
    updateWinState,
    setClipListenerState,
    setCurrentClipboardText,
    showExportToast
  } = props;
  useEffect(() => {
    ipcRenderer.on("useIpc", (event, triger, args) => {
      switch (triger) {
        case "CURRENT_CLIPBOARD":
          const { currentClipboardText } = args;
          setCurrentClipboardText(currentClipboardText);
          break;
        case "DISABLE_PASTIFY":
          const { disableClipListener } = args;
          setClipListenerState(disableClipListener);
          break;
        case "SHOW":
          const { command } = args;
          document.getElementById("searchbar").focus();
          break;
        case "COPY": {
          const { clip, mode } = args;
          addItemClipboard(clip, "TimeLine", mode);
          break;
        }
        case "IMPORT": {
          const { status, clip } = args;
          addImportClips(status, clip);
          setIdsFromDatastore();
          break;
        }
        case "EXPORT": {
          showExportToast(args);
          break;
        }
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
          const { isFold } = args;
          setMainFold(isFold);
          const focusElmId = document.activeElement.id;
          if (
            isFold &&
            focusElmId !== "item-list" &&
            focusElmId !== "searchbar"
          ) {
            document.getElementById("searchbar").focus();
          }
          break;
        default:
          break;
      }
      ReactTooltip.rebuild();
    });

    document.getElementById("searchbar").focus();
    setTimeout(() => {
      console.log("rebuild_initial");
      ReactTooltip.rebuild();
    }, 0);
    document.ondragover = document.ondrop = function(e) {
      e.preventDefault();
    };
    document.body.addEventListener("drop", function(e) {
      console.log("file dropped:", e.dataTransfer.files[0].path);
      importClips(e.dataTransfer.files[0].path);
    });
  }, []);

  const handleKeyDown = useCallback(
    e => {
      const { shiftKey, ctrlKey, altKey } = e;

      console.log(keycode(e));
      switch (keycode(e)) {
        case "=": {
          if (!ctrlKey) return;
          if (document.activeElement === document.getElementById("list-menu")) {
            document.getElementById(prevFocusedElm).focus();
          } else {
            setPrevFocusedElm(document.activeElement);
            document.getElementById("list-menu").focus();
          }
          break;
        }
        case ".": {
          if (!ctrlKey) return;
          toggleMainFold();
          break;
        }
        case ",": {
          if (!ctrlKey) return;
          toggleListMode();
          break;
        }
        case "f5": {
          const action = "reloadFilterSortSettings";
          callActionOnItemList(action);
          setIdsFromDatastore();
          break;
        }
        case "space": {
          if (!ctrlKey) return;
          const action = "clearFilterSortSettings";
          callActionOnItemList(action);
          setIdsFromDatastore();
          break;
        }
        case ";": {
          if (!ctrlKey) return;
          const action = "showFilterSortSettings";
          callActionOnItemList(action);
          setIdsFromDatastore();
          break;
        }
        case "/": {
          if (!ctrlKey) return;
          const action = "showPreferences";
          callActionOnItemList(action);
          setIdsFromDatastore();
          updateWinState("alwaysOnTop");
          break;
        }
        case "`": {
          if (!ctrlKey) return;
          updateWinState("alwaysOnTop");
          break;
        }
        default:
          const regx = /^[0-9A-Za-z]$/;
          if (regx.test(keycode(e)) && (shiftKey || ctrlKey || altKey)) {
            setUserFilterByKey(keycode(e), { shiftKey, ctrlKey, altKey });
          }
          break;
      }
    },
    [prevFocusedElm, isFold, isCompact]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [handleKeyDown]);

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
        afterShow={e => {
          const [id, index] = e.target.id.split(":");
          console.log(index);
          setPrevFocusedElm(document.activeElement);
          toggleClipToolTip(id, index);
          setTimeout(() => {
            document.getElementById("item-tooltip").focus();
          }, 0);
        }}
        afterHide={() => {
          console.log("afterHide");
          toggleClipToolTip();
          document.getElementById(prevFocusedElm).focus();
          // prevFocusedElm.focus();
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
                top = top - 168;
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
  isOpenClipToolTip: state.get("isOpenClipToolTip"),
  modalVisibility: state.get("modalVisibility"),
  filterSaveModalVisibility: state.get("filterSaveModalVisibility"),
  isFold: state.get("isFold"),
  isCompact: state.get("isCompact")
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
  toggleClipToolTip,
  setMainFold,
  toggleMainFold,
  toggleListMode,
  addImportClips,
  importClips,
  setIdsFromDatastore,
  callActionOnItemList,
  setUserFilterByKey,
  updateWinState,
  setClipListenerState,
  setCurrentClipboardText,
  showExportToast
})(Main);
