import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen, faFileAlt } from "@fortawesome/free-regular-svg-icons";

const fs = window.require("fs");
const childProcess = window.require("child_process");

const APP_PATH = window.require("electron").remote.app.getAppPath();
const TEMP_PATH = `file:///${APP_PATH}/resource/temp/`;

const Wrapper = styled.div`
  display: grid;
  box-sizing: border-box;
  grid-template-columns: 58px 1fr;
  grid-template-rows: 100%;
  grid-template-areas: "left right";
  height: 100%;
  width: 100%;
`;

const ContainerLeft = styled.div`
  grid-area: left;
  background-color: #2f3129;
  width: 100%;
`;
const ContainerRight = styled.div`
  grid-area: right;
  display: flex;
  transition: background-color 0.3s;
  position: relative;
  z-index: 1;
  height: auto;
  width: 100%;
`;

const FileList = styled.ol`
  height: 100%;
  list-style-type: none;
  counter-reset: level1;
  margin-left: 0;
  padding: 0 0 0 0px;
  position: absolute;
  top: -15px;
  z-index: 1;
  overflow: overlay;
  -webkit-background-clip: text;
  &::-webkit-scrollbar {
    width: 0.5em;
  }
  &::-webkit-scrollbar-thumb {
    background-color: inherit;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;
const List = styled.li`
  margin: 0;
  word-break: break-all;
  padding-left: 7.2em;
  text-indent: -7.4em;
  &:before {
    display: inline-block;
    content: counter(level1) " ";
    counter-increment: level1;
    color: white;
    opacity: 0.3;
    text-align: right;
    width: 35px;
  }
`;

const IconWrapper = styled.span`
  width: 20px;
  margin-left: 33px;
`;

const FileName = styled.a`
  margin-left: 7px;
  ${props =>
    props.fileExists
      ? css`
          color: #9bdcff;
          &:hover {
            background-color: #083d5a;
            color: #9bdcff;
            text-decoration: none;
          }
        `
      : css`
          color: gray;
          pointer-events: none;
        `}
`;

const isDir = filepath => {
  // return fs.existsSync(filepath) && fs.statSync(filepath).isDirectory();
  return fs.existsSync(filepath) && fs.statSync(filepath).isDirectory();
};

const selectFileIcon = (item, fileExists) => {
  if (isDir(item)) {
    const color = fileExists ? "#FFe68E" : "gray";
    return (
      <FontAwesomeIcon fixedWidth icon={faFolderOpen} size="sm" color={color} />
    );
  } else {
    const color = fileExists ? "#DDDDDD" : "gray";
    return (
      <FontAwesomeIcon fixedWidth icon={faFileAlt} size="sm" color={color} />
    );
  }
};

const FileDetail = props => {
  const { id, data } = props;
  const fileList = data.textData.split("\n");

  return (
    <Wrapper>
      <ContainerLeft />
      <ContainerRight />
      <FileList className="filelist">
        {fileList.map((item, index) => {
          const fileExists = fs.existsSync(item);
          return (
            <List key={index}>
              <IconWrapper>{selectFileIcon(item, fileExists)}</IconWrapper>
              <FileName
                onClick={e => childProcess.exec(`start "" "${item}"`)}
                href="#"
                fileExists={fileExists}
              >
                {item}
              </FileName>
            </List>
          );
        })}
      </FileList>
    </Wrapper>
  );
};

export default FileDetail;
