import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Tabs, TabList, TabPanel } from "../../util/react-web-tabs-item/lib";
import "../../util/react-web-tabs-item/dist/react-web-tabs.css";
// Components
import ItemDetail from "./ItemDetail";
import ItemList from "./ItemList";
import ListHeader from "./ListHeader";
import FilterSetting from "./MainPanel/FilterSettings/FilterSettings";
import { connect } from "react-redux";
import { setIdSelected } from "../actions";

const Wrapper = styled.div`
  box-sizing: border-box;
  height: 100%;
`;

const Container = props => {
  const { ids, setIdSelected } = props;

  return (
    <Wrapper>
      <Tabs
        defaultTab="default"
        vertical
        onChange={tabId => {
          setIdSelected(tabId);
        }}
      >
        <TabList>
          <ListHeader ids={ids} />
          <ItemList ids={ids} />
        </TabList>
        <TabPanel tabId={"filter-sort-settings"}>
          <FilterSetting />
        </TabPanel>
        <ItemDetail ids={ids} />
      </Tabs>
    </Wrapper>
  );
};

export default connect(
  null,
  { setIdSelected }
)(Container);
