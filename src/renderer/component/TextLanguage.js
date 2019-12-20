import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  margin-right: 3px;
  line-height: 1.5;
  display: ${props => (props.langName === "" ? "none" : "inline-block")};
`;
const LanguageTag = styled.div`
  font-family: sans-serif;
  display: inline-block;
  color: #ffffff;
  padding: 1px 8px 1px 6px;
  margin: 0;
  font-size: 8.5px;
  border-radius: 10px;
  background-color: ${props => {
    switch (props.langName) {
      case "c_cpp":
        return "#0273B8";
      case "csharp":
        return "#652076";
      case "css":
        return "#1E5FA9";
      case "dockerfile":
        return "#005d90";
      case "elm":
        return "#3b5f12";
      case "erlang":
        return "#A40532";
      case "gitignore":
        return "#E9423E";
      case "golang":
        return "#208390";
      case "haskell":
        return "#5B4C84";
      case "html":
        return "#DE4B25";
      case "java":
        return "#1462BB";
      case "javascript":
        return "#948823";
      case "json":
        return "#ad9140";
      case "jsx":
        return "#4a2e5d";
      case "kotlin":
        return "#ce5e1b";
      case "latex":
        return "#488aa7";
      case "lua":
        return "#00007F";
      case "markdown":
        return "#5e7384";
      case "mysql":
        return "#007A9B";
      case "ocaml":
        return "#c77303";
      case "perl":
        return "#003E61";
      case "php":
        return "#7377AE";
      case "powershell":
        return "#0273BE";
      case "python":
        return "#af8921";
      case "ruby":
        return "#DF3734";
      case "rust":
        return "#BD3429";
      case "tsx":
        return "#B072DA";
      case "svg":
        return "#C8527C";
      case "swift":
        return "#F74015";
      case "xml":
        return "#4AB0A6";
      case "yaml":
        return "#ABAF2A";
      default:
        return "gray";
    }
  }};
`;

const IconWrapper = styled.span`
  display: inline-block;
  margin-right: 3px;
`;
const LangName = styled.span`
  color: #efefef;
  font-weight: lighter;
`;

const TextLanguage = props => {
  const { lang } = props;
  return (
    <Wrapper langName={lang}>
      <LanguageTag langName={lang}>
        <IconWrapper>
          <FontAwesomeIcon icon={faCode} size="sm" />
        </IconWrapper>
        <LangName>{lang}</LangName>
      </LanguageTag>
    </Wrapper>
  );
};

export default TextLanguage;
