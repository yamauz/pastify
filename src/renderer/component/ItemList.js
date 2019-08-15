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
  setItemListRef
} from "../actions";
import _ from "lodash";

import { AutoSizer, List } from "react-virtualized";

const Wrapper = styled.div`
  height: 100%;
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
    idSelected,
    setItemTagHeight,
    setItemDisplayRange,
    setItemListRef
  } = props;
  useEffect(() => {
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
    <Wrapper>
      {/* below tab must not show!!!! */}
      <Tab
        id="filter-sort-settings"
        tabFor="filter-sort-settings"
        style={{ background: "red", height: "0px", position: "absolute" }}
      >
        {""}
      </Tab>
      <AutoSizer disableWidth>
        {({ height }) => (
          <List
            id="item-list"
            ref={ref => {
              list = ref;
              setItemListRef(ref);
            }}
            height={height}
            rowCount={ids.size}
            rowHeight={({ index }) => {
              const id = ids.get(index);
              const { itemHeight, itemTagHeight } = itemsTimeLine.get(id);
              return itemHeight + itemTagHeight;
            }}
            onScroll={({ clientHeight, scrollHeight, scrollTop }) => {
              // console.log(scrollTop);
              st = scrollTop;
            }}
            rowRenderer={({ key, index, style, parent, isVisible }) => {
              const id = ids.get(index);
              return (
                <Item key={id} item={itemsTimeLine.get(id)} style={style} />
              );
            }}
            onRowsRendered={({ overscanStartIndex, overscanStopIndex }) => {
              // if (idSelected) {
              //   const current = ids.findIndex(idSelected);
              // }
              // const current = idSelected
              //   ? ids.findIndex(id => id === idSelected)
              //   : null;
              // console.log(current);
              setDisplayRange(setItemDisplayRange, {
                // current,
                start: overscanStartIndex,
                stop: overscanStopIndex + 1
              });
            }}
            width={300}
            overscanRowCount={8}
          />
        )}
      </AutoSizer>
    </Wrapper>
  );
};

const mapStateToProps = state => ({
  itemsTimeLine: state.get("itemsTimeLine"),
  idSelected: state.get("idSelected")
});

export default connect(
  mapStateToProps,
  { setItemDisplayRange, setItemTagHeight, setItemListRef }
)(ItemList);
