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
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "side main";
  box-sizing: border-box;
  height: 100%;
  width: 100vw;
`;

const Side = styled.div`
  grid-area: side;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 23px 1fr;
  grid-template-areas:
    "listheader"
    "listmain";
`;

const GridListHeader = styled.div`
  grid-area: listheader;
`;

const GridListMain = styled.div`
  grid-area: listmain;
`;

const Main = styled.div`
  grid-area: main;
`;

const Container = props => {
  const { ids, setIdSelected } = props;

  return (
    <Wrapper>
      <Side>
        <GridListHeader>
          <ListHeader ids={ids} />
        </GridListHeader>
        <GridListMain>
          <ItemList ids={ids} />
        </GridListMain>
      </Side>
      <Main>
        <ItemDetail ids={ids} />
      </Main>
      {/* <Tabs
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
      </Tabs> */}
    </Wrapper>
  );
};

export default connect(null, { setIdSelected })(Container);
