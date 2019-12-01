import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import shortid from "shortid";
import keyCode from "../../common/keycode";
import "../../util/react-web-tabs-item/dist/react-web-tabs.css";
import { Tab } from "../../util/react-web-tabs-item/lib";
// Components
import Item from "./Item";
import ItemCompact from "./ItemCompact";
import { connect } from "react-redux";
import {
  setItemTagHeight,
  setItemDisplayRange,
  setItemListRef,
  setScrollToRow,
  setFocusItemList,
  setDetailType,
  deleteIds,
  pasteItem
} from "../actions";
import _ from "lodash";

import { ArrowKeyStepper, AutoSizer, List } from "react-virtualized";
import { faSleigh } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  height: 100%;
  user-select: none;
`;

const ListItem = styled.div``;

let list; // ref to List Component

let topIdOnDisp, bottomIdOnDisp;

const usePrevious = value => {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const ItemList = props => {
  const {
    addMode,
    isCompact,
    ids,
    itemsTimeLine,
    scrollToRow,
    setItemTagHeight,
    setItemDisplayRange,
    setItemListRef,
    setScrollToRow,
    setFocusItemList,
    setDetailType,
    focusItemList,
    deleteIds,
    pasteItem
  } = props;
  const prevItemSize = usePrevious(ids.size);

  useEffect(() => {
    if (!!prevItemSize) {
      const currentItemSize = ids.size;
      if (currentItemSize === prevItemSize + 1) {
        if (addMode == "MANUAL") {
          document.getElementById("item-list").focus();
          setScrollToRow(0, ids.get(scrollToRow));
        }
      }
    }

    const tagModalElm = document.getElementById("tag-modal");
    if (!!tagModalElm) {
      const id = tagModalElm.getAttribute("name");
      const taginfo = document.getElementById(`${id}-taginfo`);
      setItemTagHeight(taginfo.clientHeight);
    }
    list.recomputeRowHeights();
  });

  useEffect(() => {
    document.getElementById("item-list").focus();
  }, [isCompact]);

  return (
    <Wrapper
      tabIndex={1}
      onBlur={e => {
        // setFocusItemList(false);
        console.log("onBlur");
      }}
      onFocus={e => {
        console.log("onFocus");
        setDetailType("ITEM");
        // setFocusItemList(true);
      }}
      onDoubleClick={e => {
        if (e.target.id === "item-list") return;
        const mode = e.shiftKey ? "RETURN" : "NORMAL";
        pasteItem(ids.get(scrollToRow), mode);
      }}
      onKeyDown={e => {
        // no action when no item on list
        if (ids.size === 0) return;

        const { DELETE, END, HOME, PAGEDOWN, PAGEUP, ENTER } = keyCode;
        let visibleElmCount, distRow;

        const idSelected = ids.get(scrollToRow);

        e.preventDefault();
        switch (e.keyCode) {
          case DELETE:
            deleteIds(ids.get(scrollToRow));
            if (scrollToRow === ids.size - 1) setScrollToRow(ids.size - 2);
            break;
          case HOME:
            setScrollToRow(0);
            break;
          case END:
            setScrollToRow(ids.size - 1);
            break;
          case PAGEUP:
            moveToEdge(
              "UP",
              setScrollToRow,
              scrollToRow,
              idSelected,
              ids.size,
              isCompact
            );
            break;
          case PAGEDOWN:
            moveToEdge(
              "DOWN",
              setScrollToRow,
              scrollToRow,
              idSelected,
              ids.size,
              isCompact
            );
            break;
          case ENTER:
            const mode = e.shiftKey ? "RETURN" : "NORMAL";
            pasteItem(ids.get(scrollToRow), mode);
            break;
          default:
            break;
        }
      }}
    >
      <AutoSizer disableWidth>
        {({ height }) => (
          <ArrowKeyStepper
            columnCount={1}
            rowCount={ids.size}
            // onScrollToChange={selectItem}
            onScrollToChange={params => {
              const id = ids.get(params.scrollToRow);
              selectItem({ id, setScrollToRow, ...params });
            }}
            mode="cells"
            scrollToRow={scrollToRow}
          >
            {({ onSectionRendered, scrollToRow }) => (
              <List
                ref={ref => {
                  list = ref;
                  setItemListRef(ref);
                }}
                height={height}
                width={300}
                id={"item-list"}
                rowCount={ids.size}
                rowHeight={({ index }) => {
                  if (isCompact) {
                    return 25;
                  } else {
                    const id = ids.get(index);
                    const { itemHeight, itemTagHeight } = itemsTimeLine.get(id);
                    return itemHeight + itemTagHeight;
                  }
                }}
                onRowsRendered={({ overscanStartIndex, overscanStopIndex }) => {
                  setDisplayRange(setItemDisplayRange, {
                    start: overscanStartIndex,
                    stop: overscanStopIndex + 1
                  });
                }}
                scrollToIndex={scrollToRow}
                overscanRowCount={8}
                rowRenderer={params =>
                  itemRenderer({
                    focusItemList,
                    ids,
                    isCompact,
                    itemsTimeLine,
                    scrollToRow,
                    setScrollToRow,
                    setFocusItemList,
                    ...params
                  })
                }
                noRowsRenderer={() => <div>No Item Found</div>}
              />
            )}
          </ArrowKeyStepper>
        )}
      </AutoSizer>
    </Wrapper>
  );
};

const itemRenderer = ({
  focusItemList,
  ids,
  isCompact,
  itemsTimeLine,
  index,
  key,
  style,
  scrollToRow,
  setScrollToRow,
  setFocusItemList
}) => {
  const isFocused = document.activeElement.id === "item-list";
  const isActive = index === scrollToRow;

  let background;
  if (isActive && focusItemList) {
    background = isCompact ? "#354154" : "#2F353D";
  } else {
    background = "inherit";
  }

  const styles = {
    ...style,
    listStyle: "none",
    // background: isActive && isFocused ? "#666" : "inherit"
    transition: "background 0.05s",
    background
  };
  const id = ids.get(index);
  const item = itemsTimeLine.get(id);

  return (
    <ListItem
      style={styles}
      key={id}
      onClick={e => {
        selectItem({
          id,
          scrollToRow: index,
          setScrollToRow
        });
        setFocusItemList(true);
      }}
    >
      {isCompact ? (
        <ItemCompact item={item} index={index}></ItemCompact>
      ) : (
        <Item item={item}></Item>
      )}
    </ListItem>
  );
};

const selectItem = ({ id, scrollToRow, setScrollToRow }) => {
  setScrollToRow(scrollToRow);
};

const setDisplayRange = _.debounce((setFn, index) => {
  setFn(index);
}, 150);

const moveToEdge = (
  direction,
  setScrollToRow,
  scrollToRow,
  idSelected,
  listLen,
  isCompact
) => {
  const isUp = direction === "UP";
  const x = 0;
  const y = isUp ? 91 : getBottomPos();
  const elmForDetect = document.elementFromPoint(x, y);
  const isPosBlock = elmForDetect.id === "detect-pos-block";

  let edgeElm;
  if (isCompact) {
    if (isUp) {
      if (isPosBlock) {
        edgeElm = elmForDetect.parentElement.parentElement.firstElementChild;
      } else {
        edgeElm =
          elmForDetect.parentElement.nextElementSibling.firstElementChild;
      }
    } else {
      // move to list end item when no item on edge"
      if (elmForDetect.id === "item-list") {
        setScrollToRow(listLen - 1);
        return;
      }
      if (isPosBlock) {
        edgeElm = elmForDetect.parentElement.parentElement.firstElementChild;
      } else {
        edgeElm =
          elmForDetect.parentElement.previousElementSibling.firstElementChild;
      }
    }
  } else {
    if (isUp) {
      if (isPosBlock) {
        edgeElm =
          elmForDetect.parentElement.parentElement.parentElement.parentElement
            .firstElementChild;
      } else {
        edgeElm =
          elmForDetect.parentElement.parentElement.parentElement.parentElement
            .nextElementSibling.firstElementChild;
      }
    } else {
      // move to list end item when no item on edge"
      if (elmForDetect.id === "item-list") {
        setScrollToRow(listLen - 1);
        return;
      }
      if (isPosBlock) {
        edgeElm =
          elmForDetect.parentElement.parentElement.parentElement.parentElement
            .firstElementChild;
      } else {
        edgeElm =
          elmForDetect.parentElement.parentElement.parentElement.parentElement
            .previousElementSibling.firstElementChild;
      }
    }
  }

  let edgeRow = 0;
  let countableEdgeRow = true;

  let selectedRow = 0;
  let countableSelectedRow = true;

  const listHeight = document.getElementById("item-list").clientHeight;
  const itemElms = document.getElementsByClassName("list-item");
  let heightSum = 0;
  let countableHeightSum = true;
  let visibleElm = 0;

  for (const elm of itemElms) {
    if (countableEdgeRow) {
      if (elm.id !== edgeElm.id) {
        edgeRow++;
      } else {
        countableEdgeRow = false;
      }
    }

    if (countableSelectedRow) {
      if (elm.id !== idSelected) {
        selectedRow++;
      } else {
        countableSelectedRow = false;
      }
    }

    if (countableHeightSum) {
      heightSum = heightSum + elm.clientHeight;
      if (heightSum < listHeight) {
        visibleElm++;
      } else {
        countableHeightSum = false;
      }
    }
  }

  // コンパクトモード時のスクロール位置の微調整
  if (isCompact) {
    visibleElm = visibleElm - 3;
  }

  const distRow = computeDistRow(
    direction,
    edgeRow,
    selectedRow,
    visibleElm,
    scrollToRow,
    listLen
  );

  setScrollToRow(distRow);
};

const getBottomPos = () => {
  const bodyHeight = document.documentElement.clientHeight;
  const footerHeight = document.getElementById("footer").clientHeight;
  return bodyHeight - footerHeight - 1;
};

const computeDistRow = (
  direction,
  edgeRow,
  selectedRow,
  visibleElm,
  scrollToRow,
  listLen
) => {
  const isUp = direction === "UP";
  const rowDiff = isUp ? selectedRow - edgeRow : edgeRow - selectedRow;
  const hasDiff = rowDiff !== 0;
  const tempRow = isUp
    ? hasDiff
      ? scrollToRow - rowDiff
      : scrollToRow - visibleElm
    : hasDiff
    ? scrollToRow + rowDiff
    : scrollToRow + visibleElm;
  const distRow = isUp
    ? tempRow < 0
      ? 0
      : tempRow
    : tempRow > listLen
    ? listLen - 1
    : tempRow;
  // console.log("------------------------");
  // console.log(`edgeRow : ${edgeRow}`);
  // console.log(`isUp : ${isUp}`);
  // console.log(`rowDiff : ${rowDiff}`);
  // console.log(`hasDiff : ${hasDiff}`);
  // console.log(`tempRow : ${tempRow}`);
  // console.log(`scrollToRow : ${scrollToRow}`);
  // console.log(`distRow : ${distRow}`);

  return distRow;
};

const mapStateToProps = state => ({
  itemsTimeLine: state.get("itemsTimeLine"),
  addMode: state.get("addMode"),
  isCompact: state.get("isCompact"),
  idSelected: state.get("idSelected"),
  scrollToRow: state.get("scrollToRow"),
  focusItemList: state.get("focusItemList")
});

export default connect(mapStateToProps, {
  setItemDisplayRange,
  setItemTagHeight,
  setItemListRef,
  setScrollToRow,
  setFocusItemList,
  setDetailType,
  deleteIds,
  pasteItem
})(ItemList);
