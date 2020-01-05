import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import { TabPanel } from "../../util/react-web-tabs-item/lib";
// Components
import TextDetail from "./TextDetail";
import ImageDetail from "./ImageDetail";
import SheetDetail from "./SheetDetail";
import FileDetail from "./FileDetail";
import FilterSettings from "./MainPanel/FilterSettings/FilterSettings";
import _ from "lodash";

const DetailWrapper = styled.div`
  display: ${props => (props.isActive ? "block" : "none")};
  height: calc(100vh - 91px);
`;

const ItemDetail = props => {
  const {
    ids,
    itemsTimeLine,
    itemDisplayRange,
    scrollToRow,
    detailType
  } = props;

  const { overscanStartIndex, overscanStopIndex } = itemDisplayRange;
  let idsDisplay = ids.slice(overscanStartIndex, overscanStopIndex + 1);
  const currentId = scrollToRow === -1 ? "DEFAULT" : ids.get(scrollToRow);

  if (currentId !== "DEFAULT" && !idsDisplay.includes(currentId)) {
    idsDisplay = idsDisplay.push(currentId);
  }

  switch (detailType) {
    case "filter-sort-settings":
      return <FilterSettings></FilterSettings>;
    case "ITEM":
      return idsDisplay.map(id => {
        const data = itemsTimeLine.get(id);
        const isActive = id === currentId;
        return (
          <DetailWrapper key={id} isActive={isActive}>
            {renderItemByFormat(id, data)}
          </DetailWrapper>
        );
      });
    case "DEFAULT":
      return <div>default</div>;
  }
};

const renderItemByFormat = (id, data) => {
  if (data) {
    switch (data.mainFormat) {
      case "TEXT":
        return <TextDetail id={id} data={data} />;
      case "IMAGE":
        return <ImageDetail id={id} data={data} />;
      case "SHEET":
        return <SheetDetail id={id} data={data} />;
      case "FILE":
        return <FileDetail id={id} data={data} />;
      default:
        return <></>;
    }
  }
};

const mapStateToProps = state => ({
  detailType: state.get("detailType"),
  scrollToRow: state.get("scrollToRow"),
  itemsTimeLine: state.get("itemsTimeLine"),
  itemDisplayRange: state.get("itemDisplayRange")
});

export default connect(mapStateToProps, null)(ItemDetail);
