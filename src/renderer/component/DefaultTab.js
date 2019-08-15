import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { TabPanel } from "../../util/react-web-tabs-item/lib";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #2f3129;
`;
const DefaultTab = props => {
  const { id } = props;
  return (
    <TabPanel tabId={id}>
      <Wrapper />
    </TabPanel>
  );
};

export default DefaultTab;
