import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { setItemText } from "../actions";
import styled from "@emotion/styled";

import AceEditor from "react-ace";
import "brace/mode/c_cpp";
import "brace/mode/csharp";
import "brace/mode/css";
import "brace/mode/dockerfile";
import "brace/mode/elm";
import "brace/mode/erlang";
import "brace/mode/gitignore";
import "brace/mode/golang";
import "brace/mode/haskell";
import "brace/mode/html";
import "brace/mode/java";
import "brace/mode/javascript";
import "brace/mode/json";
import "brace/mode/jsx";
import "brace/mode/kotlin";
import "brace/mode/latex";
import "brace/mode/lua";
import "brace/mode/markdown";
import "brace/mode/mysql";
import "brace/mode/ocaml";
import "brace/mode/perl";
import "brace/mode/php";
import "brace/mode/plain_text";
import "brace/mode/powershell";
import "brace/mode/python";
import "brace/mode/ruby";
import "brace/mode/rust";
import "brace/mode/tsx";
import "brace/mode/svg";
import "brace/mode/swift";
import "brace/mode/xml";
import "brace/mode/yaml";
import "brace/theme/monokai";
import "brace/keybinding/vim";
import "brace/keybinding/emacs";

const Wrapper = styled.div`
  height: 100%;
`;

const TextDetail = props => {
  const { id, data, keyboardHandler, setItemText } = props;
  return (
    <Wrapper>
      <AceEditor
        name={id}
        mode={setModeByLang(data.lang)}
        theme="monokai"
        width="100%"
        height="100%"
        editorProps={{ $blockScrolling: Infinity }}
        value={data.textData}
        wrapEnabled={true}
        showPrintMargin={false}
        style={{ lineHeight: 1.5 }}
        fontSize={"13px"}
        keyboardHandler={keyboardHandler}
        debounceChangePeriod={1000}
        onChange={textData => {
          setItemText({ id, textData });
        }}
        setOptions={{
          indentedSoftWrap: false,
          tabSize: 4,
          showLineNumbers: true,
          useWorker: false
        }}
      />
    </Wrapper>
  );
};

const setModeByLang = lang => {
  const mode = lang === "" ? "plain_text" : lang;
  return mode;
};

const mapStateToProps = state => ({
  keyboardHandler: state.get("keyboardHandler")
});

export default connect(
  mapStateToProps,
  { setItemText }
)(TextDetail);
