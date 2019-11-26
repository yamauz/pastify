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

const Wrapper = styled.div`
  height: 100%;
  user-select: none;
`;

const ListItem = styled.div``;

let list; // ref to List Component

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
    // list.scrollToPosition(st);
    list.recomputeRowHeights();
  });

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
        const mode = e.shiftKey ? "RETURN" : "NORMAL";
        pasteItem(ids.get(scrollToRow), mode);
      }}
      onKeyDown={e => {
        const { DELETE, END, HOME, PAGEDOWN, PAGEUP, ENTER } = keyCode;
        let visibleElmCount, distRow;

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
            visibleElmCount = getVisibleItemCount();
            distRow = scrollToRow - visibleElmCount + 1;
            if (distRow > 0) {
              setScrollToRow(distRow);
            } else {
              setScrollToRow(0);
            }
            break;
          case PAGEDOWN:
            visibleElmCount = getVisibleItemCount();
            distRow = scrollToRow + visibleElmCount - 1;
            if (distRow < ids.size - 1) {
              setScrollToRow(distRow);
            } else {
              setScrollToRow(ids.size - 1);
            }
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
  const styles = {
    ...style,
    listStyle: "none",
    // background: isActive && isFocused ? "#666" : "inherit"
    transition: "background 0.1s",
    background:
      isActive && focusItemList ? "rgba(110, 148, 255, 0.12)" : "inherit"
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

const getVisibleItemCount = () => {
  let elmHeightSum = 0;
  let visibleElmCount = 0;
  const listHeight = document.getElementById("item-list").clientHeight;
  const itemElms = document.getElementsByClassName("list-item");
  for (const elm of itemElms) {
    elmHeightSum = elmHeightSum + elm.clientHeight;
    if (elmHeightSum < listHeight) visibleElmCount++;
    else break;
  }
  return visibleElmCount;
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
