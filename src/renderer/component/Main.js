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
  toggleListMode
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
    toggleClipToolTip,
    setMainFold,
    toggleMainFold,
    toggleListMode,
    isFold,
    isCompact
  } = props;
  useEffect(() => {
    ipcRenderer.on("useIpc", (event, triger, args) => {
      switch (triger) {
        case "SHOW":
          document.getElementById("searchbar").focus();
          break;
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
          const { isFold } = args;
          setMainFold(isFold);
          break;
        default:
          break;
      }
      console.log("rebuild_useIpc");
      // console.log(new Date().getTime());
      ReactTooltip.rebuild();
    });

    document.getElementById("searchbar").focus();
    setTimeout(() => {
      console.log("rebuild_initial");
      ReactTooltip.rebuild();
    }, 0);
  }, []);

  const handleKeyDown = useCallback(
    e => {
      const { shiftKey, ctrlKey, altKey } = e;

      if (!altKey) return;

      switch (keycode(e)) {
        case "o": {
          if (document.activeElement === document.getElementById("list-menu")) {
            document.getElementById(prevFocusedElm).focus();
          } else {
            setPrevFocusedElm(document.activeElement);
            document.getElementById("list-menu").focus();
          }
          break;
        }
        case "w": {
          toggleMainFold();
          break;
        }
        case "q": {
          toggleListMode();
          break;
        }
        case "j": {
          document.getElementById("item-list").focus();
          break;
        }
        case "k": {
          document.getElementById("searchbar").focus();
          break;
        }

        default:
          break;
      }

      // if (ctrlKey && !shiftKey) {
      //   if (pressKey === O) {
      //     if (document.activeElement === document.getElementById("list-menu")) {
      //       document.getElementById(prevFocusedElm).focus();
      //     } else {
      //       setPrevFocusedElm(document.activeElement);
      //       document.getElementById("list-menu").focus();
      //     }
      //   }
      // }
    },
    [prevFocusedElm, isFold, isCompact]
  );

  useEffect(() => {
    // const handleKeyDown = e => {
    //   const { shiftKey, ctrlKey } = e;
    //   const pressKey = e.keyCode;
    //   const { O } = keyCode;

    //   if (ctrlKey && !shiftKey) {
    //     if (pressKey === O) {
    //       if (document.activeElement === document.getElementById("list-menu")) {
    //         document.getElementById(prevFocusedElm).focus();
    //       } else {
    //         setPrevFocusedElm(document.activeElement);
    //         document.getElementById("list-menu").focus();
    //       }
    //     }
    //   }
    // };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    console.log("isFold");
    // window.addEventListener("keydown", handleKeyDown, true);
    // return () => {
    //   window.removeEventListener("keydown", handleKeyDown, true);
    // };
  }, [isFold]);

  // useEffect(() => {
  //   const toggleClipToolTipByClick = () => {
  //     const currentElmId = document.activeElement.id;
  //     const regex = /^clip-tooltip/;
  //     console.log(regex.test(currentElmId));
  //     if (isOpenClipToolTip && !regex.test(currentElmId)) {
  //       toggleClipToolTip();
  //     }
  //   };
  //   window.addEventListener("click", toggleClipToolTipByClick, true);
  //   return () => {
  //     console.log("unmount");
  //     window.removeEventListener("click", toggleClipToolTipByClick, true);
  //   };
  // }, [isOpenClipToolTip]);

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
          setPrevFocusedElm(document.activeElement);
          toggleClipToolTip();
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
  toggleListMode
})(Main);
