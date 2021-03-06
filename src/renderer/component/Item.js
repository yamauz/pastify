import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  deleteIds,
  setItemRemoved,
  favItem,
  toggleModalVisibility,
  storeItemOnModalOpen
} from "../actions";
import styled from "@emotion/styled";
import diffMoment from "../../util/diffMoment";
import { Tab } from "../../util/react-web-tabs-item/lib";
import _ from "lodash";
//SVG
import Excel from "../../icon/format/EXCEL.svg";
import Image from "../../icon/format/Image.svg";
import File from "../../icon/format/File.svg";
import Text from "../../icon/format/Text.svg";
//Components
import ItemImage from "./ItemImage";
import ItemText from "./ItemText";
import EditButtons from "./EditButtons";
import TextLanguage from "./TextLanguage";
import Key from "./Key";
import Hash from "./Hash";

const Wrapper = styled.div`
  font-family: sans-serif;
  transition: background-color 0.1s;
  &:hover {
    background-color: rgba(110, 148, 255, 0.05);
  }
  z-index: 2;
`;
const ItemContainer = styled.div`
  border-bottom: solid 2px #1d1d1d;
  display: flex;
`;
const ContainerLeft = styled.div`
  width: 65px;
`;
const ContainerRight = styled.div`
  width: 230px;
`;
const IconContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
`;
const IconWrapper = styled.div`
  margin-top: 8px;
  width: 48px;
  height: 48px;
  padding-left: 9px;

  border-radius: 50%;
  background-color: #1e1f1c;
`;
const InfoContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const InfoTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;
const FormatIdBlock = styled.div`
  padding: 2px;
`;
const Format = styled.span`
  font-size: 14px;
  color: #efefef;
  font-weight: bold;
  opacity: ${props => (props.isTrashed ? 0.7 : 1)};
`;
const Id = styled.span`
  margin-left: 10px;
  font-size: 11px;
  color: #7b7b7b;
`;
const DateBlock = styled.div`
  padding-right: 5px;
  padding-top: 2px;
  flex-basis: 45px;
  text-align: right;
`;
const Date = styled.span`
  font-size: 12px;
  color: #6f8488;
  font-family: sans-serif;
`;
const InfoMid = styled.div`
  width: 230px;
  min-height: 30px;
  margin: 0 0 3px 0;
`;

const InfoBottom = styled.div`
  text-align: left;
  white-space: nowrap;
  overflow: overlay;
  overflow-y: hidden;
  margin-right: 10px;
  padding: 3px 3px 0px 3px;
  user-select: contain;
  -webkit-background-clip: text;
  transition: background-color 0.3s;
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  &::-webkit-scrollbar {
    height: 5px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb:horizontal {
    background-color: inherit;
    width: 5px !important;
  }
`;

const DetectPosBlockTop = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
`;

const DetectPosBlockBottom = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  bottom: 0;
  left: 0;
`;

const createSVGIcon = format => {
  switch (format) {
    case "TEXT":
      return <Text style={{ marginTop: "8px" }} />;
    case "FILE":
      return <File style={{ marginTop: "8px" }} />;
    case "SHEET":
      return <Excel style={{ marginTop: "9px" }} />;
    case "IMAGE":
      return <Image style={{ marginTop: "6px" }} />;
    default:
      break;
  }
};

const toLowerCase = format => {
  return (
    format.substring(0, 1).toUpperCase() + format.substring(1).toLowerCase()
  );
};

const Container = props => {
  const {
    style,
    // id,
    // itemsTimeLine,
    moment,
    favItem,
    deleteIds,
    toggleModalVisibility,
    storeItemOnModalOpen,
    item,
    index
  } = props;

  const {
    id,
    date,
    mainFormat,
    textData,
    key,
    lang,
    tag,
    isFaved,
    isTrashed
  } = item;

  return (
    <Wrapper
      id={id}
      style={style}
      className="list-item"
      onFocus={() => {
        console.log("asdlkfjad;fsk");
      }}
    >
      <ItemContainer>
        <ContainerLeft>
          <DetectPosBlockTop id="detect-pos-block" />
          <DetectPosBlockBottom id="detect-pos-block" />
          <IconContainer>
            <IconWrapper>{createSVGIcon(mainFormat)}</IconWrapper>
          </IconContainer>
        </ContainerLeft>
        <ContainerRight>
          <InfoContainer>
            <InfoTop>
              <FormatIdBlock>
                <Format isTrashed={isTrashed}>{toLowerCase(mainFormat)}</Format>
                <Id>{id}</Id>
              </FormatIdBlock>
              <DateBlock>
                <Date>{diffMoment(moment, date)}</Date>
              </DateBlock>
            </InfoTop>
            <InfoMid>
              <ItemText
                text={textData}
                format={mainFormat}
                isTrashed={isTrashed}
              />
              <ItemImage id={id} format={mainFormat} />
            </InfoMid>
            <InfoBottom id={`${id}-taginfo`}>
              <Key keyTag={key} />
              <TextLanguage lang={lang} />
              <Hash tag={tag} />
            </InfoBottom>
            <EditButtons
              id={id}
              index={index}
              isFaved={isFaved}
              isTrashed={isTrashed}
              hasTags={checkTags(key, tag, lang)}
            />
          </InfoContainer>
        </ContainerRight>
      </ItemContainer>
    </Wrapper>
  );
};

const checkTags = (key, tag, lang) => {
  const hasKey = key === "" ? false : true;
  const hasHashTags = tag.length === 0 ? false : true;
  const hasLang = lang.length === 0 ? false : true;
  let hasTag;
  if (hasKey || hasHashTags || hasLang) {
    hasTag = true;
  } else {
    hasTag = false;
  }
  return hasTag;
};

const mapStateToProps = state => ({
  actionSelected: state.get("actionSelected")
});

export default Container;

// export default connect(
//   mapStateToProps,
//   {
//     deleteIds,
//     setItemRemoved,
//     favItem,
//     toggleModalVisibility,
//     storeItemOnModalOpen
//   }
// )(Container);
