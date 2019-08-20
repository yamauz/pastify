import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import "../../util/react-web-tabs-item/dist/react-web-tabs.css";
import { Tab } from "../../util/react-web-tabs-item/lib";
// Components
import Item from "./Item";
import { connect } from "react-redux";
import {
  setItemTagHeight,
  setItemDisplayRange,
  setItemListRef,
  setScrollToRow
} from "../actions";
import _ from "lodash";

import { ArrowKeyStepper, AutoSizer, List } from "react-virtualized";

const Wrapper = styled.div`
  height: 100%;
  /* border: solid 2px white; */
`;

const ListItem = styled.div``;

const Test = styled.div`
  background-color: red;
`;

const ListWrapper = styled.div`
  height: 500px;
`;

let list; // ref to List Component
let clientHeight = 0;
let targetId = "";
let st = 0;

const setDisplayRange = _.debounce((setFn, index) => {
  setFn(index);
}, 150);

const ItemList = props => {
  const {
    ids,
    itemsTimeLine,
    scrollToRow,
    idSelected,
    setItemTagHeight,
    setItemDisplayRange,
    setItemListRef,
    setScrollToRow
  } = props;
  useEffect(() => {
    const tagModalElm = document.getElementById("tag-modal");
    if (!!tagModalElm) {
      const id = tagModalElm.getAttribute("name");
      const taginfo = document.getElementById(`${id}-taginfo`);
      setItemTagHeight(taginfo.clientHeight);
    }
    // list.scrollToPosition(st);
    // list.recomputeRowHeights();
  });
  console.log("render");

  return (
    <Wrapper>
      {/* below tab must not show!!!! */}
      {/* <Tab
        id="filter-sort-settings"
        tabFor="filter-sort-settings"
        style={{ background: "red", height: "0px", position: "absolute" }}
      >
        {""}
      </Tab> */}
      <AutoSizer disableWidth>
        {({ height }) => (
          <ArrowKeyStepper
            columnCount={1}
            // rowCount={100}
            rowCount={ids.size}
            // onScrollToChange={selectItem}
            onScrollToChange={params =>
              selectItem({ setScrollToRow, ...params })
            }
            mode="cells"
            scrollToRow={scrollToRow}
          >
            {({ onSectionRendered, scrollToRow }) => (
              <List
                height={height}
                width={300}
                // rowCount={100}
                rowCount={ids.size}
                // rowHeight={200}
                rowHeight={({ index }) => {
                  const id = ids.get(index);
                  const { itemHeight, itemTagHeight } = itemsTimeLine.get(id);
                  return itemHeight + itemTagHeight;
                }}
                onRowsRendered={onSectionRendered}
                scrollToIndex={scrollToRow}
                overscanRowCount={8}
                rowRenderer={params =>
                  itemRenderer({
                    ids,
                    itemsTimeLine,
                    scrollToRow,
                    setScrollToRow,
                    ...params
                  })
                }
              />
            )}
          </ArrowKeyStepper>
        )}
      </AutoSizer>
    </Wrapper>
  );
};

const selectItem = ({ scrollToRow, setScrollToRow }) => {
  console.log(scrollToRow);
  console.log("setScrollToRow");
  setScrollToRow(scrollToRow);
};

const itemRenderer = ({
  ids,
  itemsTimeLine,
  index,
  key,
  style,
  scrollToRow,
  setScrollToRow
}) => {
  const isActive = index === scrollToRow;
  const styles = {
    ...style,
    listStyle: "none",
    background: isActive ? "#666" : "inherit"
  };
  const id = ids.get(index);
  // const item = itemsTimeLine.get(id);
  // return (
  //   <Item
  //     key={id}
  //     item={item}
  //     style={styles}
  //     onClick={() =>
  //       selectItem({
  //         scrollToRow: index,
  //         setScrollToRow
  //       })
  //     }
  //   />
  // );

  const item = itemsTimeLine.get(id);
  const { date, mainFormat, textData, lang, tag, isFaved } = item;

  return (
    <ListItem
      style={styles}
      key={id}
      onClick={() =>
        selectItem({
          scrollToRow: index,
          setScrollToRow
        })
      }
    >
      <Item item={item} />
      {/* <div>{date}</div>
      <div>{mainFormat}</div>
      <div>{textData}</div>
      <div>{date}</div>
      <div>{lang}</div>
      <div>{isFaved}</div>
      <div>{tag}</div> */}
    </ListItem>
  );
};

const mapStateToProps = state => ({
  itemsTimeLine: state.get("itemsTimeLine"),
  idSelected: state.get("idSelected"),
  scrollToRow: state.get("scrollToRow")
});

export default connect(
  mapStateToProps,
  { setItemDisplayRange, setItemTagHeight, setItemListRef, setScrollToRow }
)(ItemList);

// <List
//   id="item-list"
//   ref={ref => {
//     list = ref;
//     setItemListRef(ref);
//   }}
//   height={height}
//   rowCount={ids.size}
//   rowHeight={({ index }) => {
//     const id = ids.get(index);
//     const { itemHeight, itemTagHeight } = itemsTimeLine.get(id);
//     return itemHeight + itemTagHeight;
//   }}
//   onScroll={({ clientHeight, scrollHeight, scrollTop }) => {
//     st = scrollTop;
//   }}
//   rowRenderer={({ key, index, style, parent, isVisible }) => {
//     const id = ids.get(index);
//     return (
//       <Item key={id} item={itemsTimeLine.get(id)} style={style} />
//     );
//   }}
//   onRowsRendered={({ overscanStartIndex, overscanStopIndex }) => {
//     setDisplayRange(setItemDisplayRange, {
//       start: overscanStartIndex,
//       stop: overscanStopIndex + 1
//     });
//   }}
//   width={300}
//   overscanRowCount={8}
// />
