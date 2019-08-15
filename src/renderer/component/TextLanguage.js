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
  display: inline-block;
  color: #ffffff;
  padding: 0px 8px 1px 6px;
  font-size: 10px;
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
        return "#0998E6";
      case "elm":
        return "#89D135";
      case "erlang":
        return "#A40532";
      case "gitignore":
        return "#E9423E";
      case "golang":
        return "#4CC9DA";
      case "haskell":
        return "#5B4C84";
      case "html":
        return "#DE4B25";
      case "java":
        return "#1462BB";
      case "javascript":
        return "#b3a320";
      case "json":
        return "#F7D573";
      case "jsx":
        return "#B072DA";
      case "kotlin":
        return "#EB7833";
      case "latex":
        return "#7CCFF3";
      case "lua":
        return "#00007F";
      case "markdown":
        return "#7E98AD";
      case "mysql":
        return "#007A9B";
      case "ocaml":
        return "#EB8702";
      case "perl":
        return "#003E61";
      case "php":
        return "#7377AE";
      case "powershell":
        return "#0273BE";
      case "python":
        return "#F1C13B";
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
  color: #dcdcdc;
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
