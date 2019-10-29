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
  height: 100%;
  width: 100%;
`;

const FileList = styled.ol`
  position: relative;
  z-index: 2;
  list-style: none;
  counter-reset: ol_li;
  margin: 0;
  height: 100%;
  width: 100%;
  overflow: overlay;
  -webkit-background-clip: text;
  transition: background-color 0.3s;
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
  font-family: sans-serif;
  margin-left: 22px;
  word-break: break-all;
  padding-left: 3em;
  text-indent: -3em;
  &:before {
    vertical-align: middle;
    line-height: 10px;
    counter-increment: ol_li;
    /* content: counter(ol_li) "　　"
      url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1NzYgNTEyIj48cGF0aCBmaWxsPSIjZmZlNjhlIiBkPSJNNTI3Ljk1IDIyNEg0ODB2LTQ4YzAtMjYuNTEtMjEuNDktNDgtNDgtNDhIMjcybC02NC02NEg0OEMyMS40OSA2NCAwIDg1LjQ5IDAgMTEydjI4OGMwIDI2LjUxIDIxLjQ5IDQ4IDQ4IDQ4aDM4NS4wNTdjMjguMDY4IDAgNTQuMTM1LTE0LjczMyA2OC41OTktMzguODRsNjcuNDUzLTExMi40NjRDNTg4LjI0IDI2NC44MTIgNTY1LjI4NSAyMjQgNTI3Ljk1IDIyNHpNNDggOTZoMTQ2Ljc0NWw2NCA2NEg0MzJjOC44MzcgMCAxNiA3LjE2MyAxNiAxNnY0OEgxNzEuMTc3Yy0yOC4wNjggMC01NC4xMzUgMTQuNzMzLTY4LjU5OSAzOC44NEwzMiAzODAuNDdWMTEyYzAtOC44MzcgNy4xNjMtMTYgMTYtMTZ6bTQ5My42OTUgMTg0LjIzMmwtNjcuNDc5IDExMi40NjRBNDcuOTk3IDQ3Ljk5NyAwIDAgMSA0MzMuMDU3IDQxNkg0NC44MjNsODIuMDE3LTEzNi42OTZBNDggNDggMCAwIDEgMTY4IDI1NmgzNTkuOTc1YzEyLjQzNyAwIDIwLjExOSAxMy41NjggMTMuNzIgMjQuMjMyeiIvPjwvc3ZnPg=="); */
    display: inline-block;
    ${props =>
      props.isDir
        ? css`
            width: 13px;
            content: counter(ol_li) "　　"
              url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1NzYgNTEyIj48cGF0aCBmaWxsPSIjZmZlNjhlIiBkPSJNNTI3Ljk1IDIyNEg0ODB2LTQ4YzAtMjYuNTEtMjEuNDktNDgtNDgtNDhIMjcybC02NC02NEg0OEMyMS40OSA2NCAwIDg1LjQ5IDAgMTEydjI4OGMwIDI2LjUxIDIxLjQ5IDQ4IDQ4IDQ4aDM4NS4wNTdjMjguMDY4IDAgNTQuMTM1LTE0LjczMyA2OC41OTktMzguODRsNjcuNDUzLTExMi40NjRDNTg4LjI0IDI2NC44MTIgNTY1LjI4NSAyMjQgNTI3Ljk1IDIyNHpNNDggOTZoMTQ2Ljc0NWw2NCA2NEg0MzJjOC44MzcgMCAxNiA3LjE2MyAxNiAxNnY0OEgxNzEuMTc3Yy0yOC4wNjggMC01NC4xMzUgMTQuNzMzLTY4LjU5OSAzOC44NEwzMiAzODAuNDdWMTEyYzAtOC44MzcgNy4xNjMtMTYgMTYtMTZ6bTQ5My42OTUgMTg0LjIzMmwtNjcuNDc5IDExMi40NjRBNDcuOTk3IDQ3Ljk5NyAwIDAgMSA0MzMuMDU3IDQxNkg0NC44MjNsODIuMDE3LTEzNi42OTZBNDggNDggMCAwIDEgMTY4IDI1NmgzNTkuOTc1YzEyLjQzNyAwIDIwLjExOSAxMy41NjggMTMuNzIgMjQuMjMyeiIvPjwvc3ZnPg==");
          `
        : css`
            width: 10px;
            content: counter(ol_li) "　　"
              url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj48cGF0aCBmaWxsPSIjZGRkZGRkIiBkPSJNMzY5LjkgOTcuOUwyODYgMTRDMjc3IDUgMjY0LjgtLjEgMjUyLjEtLjFINDhDMjEuNSAwIDAgMjEuNSAwIDQ4djQxNmMwIDI2LjUgMjEuNSA0OCA0OCA0OGgyODhjMjYuNSAwIDQ4LTIxLjUgNDgtNDhWMTMxLjljMC0xMi43LTUuMS0yNS0xNC4xLTM0em0tMjIuNiAyMi43YzIuMSAyLjEgMy41IDQuNiA0LjIgNy40SDI1NlYzMi41YzIuOC43IDUuMyAyLjEgNy40IDQuMmw4My45IDgzLjl6TTMzNiA0ODBINDhjLTguOCAwLTE2LTcuMi0xNi0xNlY0OGMwLTguOCA3LjItMTYgMTYtMTZoMTc2djEwNGMwIDEzLjMgMTAuNyAyNCAyNCAyNGgxMDR2MzA0YzAgOC44LTcuMiAxNi0xNiAxNnptLTQ4LTI0NHY4YzAgNi42LTUuNCAxMi0xMiAxMkgxMDhjLTYuNiAwLTEyLTUuNC0xMi0xMnYtOGMwLTYuNiA1LjQtMTIgMTItMTJoMTY4YzYuNiAwIDEyIDUuNCAxMiAxMnptMCA2NHY4YzAgNi42LTUuNCAxMi0xMiAxMkgxMDhjLTYuNiAwLTEyLTUuNC0xMi0xMnYtOGMwLTYuNiA1LjQtMTIgMTItMTJoMTY4YzYuNiAwIDEyIDUuNCAxMiAxMnptMCA2NHY4YzAgNi42LTUuNCAxMi0xMiAxMkgxMDhjLTYuNiAwLTEyLTUuNC0xMi0xMnYtOGMwLTYuNiA1LjQtMTIgMTItMTJoMTY4YzYuNiAwIDEyIDUuNCAxMiAxMnoiLz48L3N2Zz4=");
          `}
    color: #8f908a;
    font-size: 12px;
    padding-top: 0px;
    /* margin-left: 70px; */
    text-align: right;
  }
`;

const IconWrapper = styled.span`
  width: 20px;
  margin-left: 5px;
`;

const FileName = styled.a`
  margin-left: 5px;
  font-size: 13px;
  font-family: sans-serif;
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
  ${props =>
    props.isDir
      ? css`
          margin-left: 5px;
        `
      : css`
          margin-left: 8px;
        `}
`;

const Gutter = styled.div`
  position: absolute;
  z-index: 1;
  height: calc(100vh - 91px);
  width: 53px;
  background-color: #2f3129;
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
      <Gutter></Gutter>
      <FileList className="filelist">
        {fileList.map((item, index) => {
          const fileExists = fs.existsSync(item);
          return (
            <List key={index} isDir={isDir(item)}>
              {/* <IconWrapper>{selectFileIcon(item, fileExists)}</IconWrapper> */}
              <FileName
                onClick={e => childProcess.exec(`start "" "${item}"`)}
                href="#"
                fileExists={fileExists}
                isDir={isDir(item)}
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
