import React, { useState, useEffect, useRef } from "react";
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
  const { id, data, itemIdAddedManually, isVim, setItemText } = props;

  useEffect(() => {
    if (itemIdAddedManually !== "_UNSET_") {
      // console.log(itemIdAddedManually);
      // document.getElementsByClassName("ace_text-input")[0].focus();
    }
  });
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
        keyboardHandler={isVim ? "vim" : null}
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
        commands={[
          {
            name: "Alt+j",
            bindKey: { win: "Alt-J" },
            exec: () => {
              console.log("alt + j");
            }
          }
        ]}
      />
    </Wrapper>
  );
};

const setModeByLang = lang => {
  const mode = lang.length === 0 ? "plain_text" : lang[0].value;
  return mode;
};

const mapStateToProps = state => ({
  isVim: state.get("isVim"),
  itemIdAddedManually: state.get("itemIdAddedManually")
});

export default connect(mapStateToProps, { setItemText })(TextDetail);
