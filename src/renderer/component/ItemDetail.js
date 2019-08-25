import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import { TabPanel } from "../../util/react-web-tabs-item/lib";
// Components
import TextDetail from "./TextDetail";
import ImageDetail from "./ImageDetail";
import SheetDetail from "./SheetDetail";
import FileDetail from "./FileDetail";
import _ from "lodash";

const DetailWrapper = styled.div`
  display: ${props => (props.isActive ? "block" : "none")};
  height: 100%;
`;

const ItemDetail = props => {
  const { ids, itemsTimeLine, itemDisplayRange, scrollToRow } = props;

  const { start, stop } = itemDisplayRange;
  let idsDisplay = ids.slice(start, stop);
  const currentId = scrollToRow === -1 ? "DEFAULT" : ids.get(scrollToRow);

  // if (idSelected && idSelected[0] === "@" && !idsDisplay.includes(idSelected))
  if (currentId !== "DEFAULT" && !idsDisplay.includes(currentId)) {
    idsDisplay = idsDisplay.push(currentId);
  }

  return idsDisplay.map(id => {
    const data = itemsTimeLine.get(id);
    const isActive = id === currentId;
    // console.log(scrollToRow);
    return (
      <DetailWrapper key={id} isActive={isActive}>
        {/* <div>{id}</div> */}
        {renderItemByFormat(id, data)}
      </DetailWrapper>
      // <TabPanel key={id} tabId={id}>
      //   {renderItemByFormat(id, data)}
      // </TabPanel>
    );
  });
};

const renderItemByFormat = (id, data) => {
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
};

const mapStateToProps = state => ({
  scrollToRow: state.get("scrollToRow"),
  itemsTimeLine: state.get("itemsTimeLine"),
  itemDisplayRange: state.get("itemDisplayRange")
});

export default connect(
  mapStateToProps,
  null
)(ItemDetail);
