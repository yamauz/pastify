import React, { useState, useEffect } from "react";
import { applyLangFilter, setIdsFromDatastore } from "../actions";
import { connect } from "react-redux";
import styled from "@emotion/styled";
const LangName = styled.span`
  cursor: pointer;
  font-family: sans-serif;
  display: inline-block;
  color: #dddddd;
  padding: 1px 6px 0px 6px;
  margin: 2px 4px 10px 0;
  font-size: 9px;
  border-radius: 10px;
  line-height: 1.5;
  &:hover {
    text-decoration: underline;
    color: white;
  }
  &:before {
    cursor: pointer;
    display: inline-block;
    content: " ";
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20640%20512%22%20fill%3D%22%23dddddd%22%3E%3Cpath%20d%3D%22M278.9%20511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2%208.7c1.8-6.4%208.5-10%2014.9-8.2l61%2017.7c6.4%201.8%2010%208.5%208.2%2014.9L293.8%20503.3c-1.9%206.4-8.5%2010.1-14.9%208.2zm-114-112.2l43.5-46.4c4.6-4.9%204.3-12.7-.8-17.2L117%20256l90.6-79.7c5.1-4.5%205.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8%20247.2c-5.1%204.7-5.1%2012.8%200%2017.5l144.1%20135.1c4.9%204.6%2012.5%204.4%2017-.5zm327.2.6l144.1-135.1c5.1-4.7%205.1-12.8%200-17.5L492.1%20112.1c-4.8-4.5-12.4-4.3-17%20.5L431.6%20159c-4.6%204.9-4.3%2012.7.8%2017.2L523%20256l-90.6%2079.7c-5.1%204.5-5.5%2012.3-.8%2017.2l43.5%2046.4c4.5%204.9%2012.1%205.1%2017%20.6z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    vertical-align: middle;
    margin-right: 2px;
    width: 12px;
    height: 12px;
  }
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

const Component = props => {
  const { lang, applyLangFilter, setIdsFromDatastore } = props;
  // return (
  //   !!lang && (
  //     <LangName
  //       langName={lang.value}
  //       onClick={e => {
  //         e.stopPropagation();
  //         applyLangFilter(lang);
  //         setIdsFromDatastore();
  //       }}
  //     >
  //       {lang.value}
  //     </LangName>
  //   )
  // );
  return lang.map((ln, index) => (
    <LangName
      langName={ln.value}
      key={index}
      onClick={e => {
        e.stopPropagation();
        applyLangFilter(ln);
        setIdsFromDatastore();
      }}
    >
      {ln.value}
    </LangName>
  ));
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {
  applyLangFilter,
  setIdsFromDatastore
})(Component);
