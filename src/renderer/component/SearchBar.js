import React, { useState, useEffect, useRef } from "react";
import path from "path";
import { connect } from "react-redux";
import { setSearchInputValue, setSearchOpt, favItem } from "../actions";
import debounce from "debounce-promise";
import AsyncCreatableSelect from "react-select/async-creatable";
import reactStringReplace from "react-string-replace";
import _ from "lodash";
import moment from "moment";
import Select, { components } from "react-select";
import Highlighter from "react-highlight-words";
import keycode from "keycode";

import "semantic-ui-css/semantic.min.css";
import styled from "@emotion/styled";
import Message from "../models/Message";

import Star from "../../icon/editbutton/star.svg";
import StarSolid from "../../icon/editbutton/star-solid.svg";

// Common
import { MAX_SEARCH_RESULT_SHOW } from "../../common/settings";
const APP_PATH = window.require("electron").remote.app.getAppPath();

const Wrapper = styled.div`
  background-color: #2f3129;
  padding: 5px 5px;
  width: 100vw;
`;

const TextWrapper = styled.span`
  /* display: -webkit-box; */
  /* -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; */
  /* overflow: hidden; */
  /* width: calc(100vw-1px); */
  color: ${props => {
    switch (props.mainFormat) {
      case "TEXT":
        return "#bfd7de";
      case "IMAGE":
        return "#c3bfde";
      case "SHEET":
        return "#bfdebf";
      case "FILE":
        return "#dddebf";
    }
  }};
`;

const KeyTag = styled.span`
  font-family: sans-serif;
  display: inline-block;
  color: #dddddd;
  padding: 1px 6px 0px 6px;
  margin: 2px 4px 10px 0;
  font-size: 9px;
  border-radius: 10px;
  line-height: 1.5;
  background-color: #670d15e0;
  &:before {
    display: inline-block;
    content: " ";
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20448%20512%22%20fill%3D%22%23ffffff%22%3E%3Cpath%20d%3D%22M400%2032H48C21.49%2032%200%2053.49%200%2080v352c0%2026.51%2021.49%2048%2048%2048h352c26.51%200%2048-21.49%2048-48V80c0-26.51-21.49-48-48-48zm-6%20400H54a6%206%200%200%201-6-6V86a6%206%200%200%201%206-6h340a6%206%200%200%201%206%206v340a6%206%200%200%201-6%206zm-50-292v232c0%206.627-5.373%2012-12%2012h-24c-6.627%200-12-5.373-12-12v-92H152v92c0%206.627-5.373%2012-12%2012h-24c-6.627%200-12-5.373-12-12V140c0-6.627%205.373-12%2012-12h24c6.627%200%2012%205.373%2012%2012v92h144v-92c0-6.627%205.373-12%2012-12h24c6.627%200%2012%205.373%2012%2012z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    vertical-align: top;
    margin-right: 2px;
    width: 12px;
    height: 12px;
  }
`;

const LangName = styled.span`
  font-family: sans-serif;
  display: inline-block;
  color: #dddddd;
  padding: 1px 6px 0px 6px;
  margin: 2px 4px 10px 0;
  font-size: 9px;
  border-radius: 10px;
  line-height: 1.5;
  &:before {
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

const HashTag = styled.span`
  font-family: sans-serif;
  display: inline-block;
  color: #dddddd;
  padding: 1px 6px 0px 6px;
  margin: 2px 4px 10px 0;
  font-size: 9px;
  border-radius: 10px;
  line-height: 1.5;
  background-color: #154030;
  &:before {
    display: inline-block;
    content: " ";
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20448%20512%22%20fill%3D%22%23dddddd%22%3E%3Cpath%20d%3D%22M440.667%20182.109l7.143-40c1.313-7.355-4.342-14.109-11.813-14.109h-74.81l14.623-81.891C377.123%2038.754%20371.468%2032%20363.997%2032h-40.632a12%2012%200%200%200-11.813%209.891L296.175%20128H197.54l14.623-81.891C213.477%2038.754%20207.822%2032%20200.35%2032h-40.632a12%2012%200%200%200-11.813%209.891L132.528%20128H53.432a12%2012%200%200%200-11.813%209.891l-7.143%2040C33.163%20185.246%2038.818%20192%2046.289%20192h74.81L98.242%20320H19.146a12%2012%200%200%200-11.813%209.891l-7.143%2040C-1.123%20377.246%204.532%20384%2012.003%20384h74.81L72.19%20465.891C70.877%20473.246%2076.532%20480%2084.003%20480h40.632a12%2012%200%200%200%2011.813-9.891L151.826%20384h98.634l-14.623%2081.891C234.523%20473.246%20240.178%20480%20247.65%20480h40.632a12%2012%200%200%200%2011.813-9.891L315.472%20384h79.096a12%2012%200%200%200%2011.813-9.891l7.143-40c1.313-7.355-4.342-14.109-11.813-14.109h-74.81l22.857-128h79.096a12%2012%200%200%200%2011.813-9.891zM261.889%20320h-98.634l22.857-128h98.634l-22.857%20128z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    vertical-align: top;
    margin-right: 2px;
    width: 11px;
    height: 11px;
  }
`;

const OptionWrapper = styled.div`
  display: flex;
`;

const RightContents = styled.div`
  width: 18px;
  min-width: 18px;
  max-width: 18px;
  padding-top: 2px;
`;

const LeftContents = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ImageWrapper = styled.div`
  margin-top: 5px;
`;
const Image = styled.img`
  max-width: 100%;
  max-height: 60px;
  height: 100%;
  border-radius: 5px;
  display: block;
`;

const MacroText = styled.span`
  background-color: #0a4a20;
  color: #ddd;
`;

const renderStarIcon = isFaved => {
  if (isFaved) {
    return (
      <StarSolid
        style={{
          fill: "#bab586",
          width: "12px"
        }}
      />
    );
  } else {
    return (
      <Star
        style={{
          fill: "gray",
          width: "12px"
        }}
      />
    );
  }
};

const createInputKeys = inputValue => {
  return inputValue
    .toLowerCase()
    .split(" ")
    .filter(key => key !== "");
};

const createOptions = searchOpt => {
  let clips = [];
  let searchBy;
  const conditions = ["LABEL", "STATUS", "DATATYPE"];
  const condSelect = new Map();
  conditions.forEach(cond => {
    const opt = searchOpt.get(cond).first();
    const type = opt !== undefined ? opt.label : null;
    condSelect.set(cond, type);
  });
  switch (condSelect.get("LABEL")) {
    case "HOTKEY":
      searchBy = "key";
      break;
    case "LANGUAGE":
      searchBy = "lang";
      break;
    case "HASHTAG":
      searchBy = "tag";
      break;
    default:
      searchBy = "label";
      break;
  }
  clips = new Message("dataStore", "readHasHotKey", {
    condSelect: Array.from(condSelect)
  }).dispatch();

  const options = clips.map(clip => {
    return {
      label: clip.textData,
      value: clip.textData,
      id: clip.id,
      mainFormat: clip.mainFormat,
      key: clip.key,
      lang: clip.lang,
      tag: clip.tag
    };
  });
  return { options, searchBy };
};

const filterOptions = (inputValue, searchOpt) => {
  const { options, searchBy } = createOptions(searchOpt);
  const inputKeys = createInputKeys(inputValue);
  let _options;
  if (inputKeys.length === 1 && inputKeys[0] === "*") {
    _options = options;
  } else {
    switch (searchBy) {
      case "key":
        _options = options.filter(i => {
          return inputKeys.every(key => i.key.toLowerCase().includes(key));
        });
        break;
      case "lang":
        _options = options.filter(i => {
          return inputKeys.every(key => i.lang.toLowerCase().includes(key));
        });
        break;
      case "tag":
        _options = options.filter(i => {
          const tagsJoined = i.tag.map(t => t.value).join("");
          return inputKeys.every(key => tagsJoined.toLowerCase().includes(key));
        });
        break;
      default:
        _options = options.filter(i => {
          return inputKeys.every(key => i.label.toLowerCase().includes(key));
        });
        break;
    }
  }
  return _.take(_options, MAX_SEARCH_RESULT_SHOW);
};

const promiseOpt = (inputValue, searchOpt) => {
  return new Promise(resolve => {
    resolve(filterOptions(inputValue, searchOpt));
  });
};

const promiseOptions = searchOpt => {
  const wait = 200;
  const loadOptions = inputValue => promiseOpt(inputValue, searchOpt);
  return debounce(loadOptions, wait);
  // return loadOptions;
};

const renderImage = id => {
  const distDir = process.env.PORTABLE_EXECUTABLE_DIR || APP_PATH;
  const imagePath = `file:///${distDir}/resource/temp/images/${id}`;
  return (
    <ImageWrapper>
      <Image src={imagePath} />
    </ImageWrapper>
  );
};

const expandTextMacro = (textData, searchInputValue, itemsTimeLine) => {
  const replacer = (match, i) => {
    console.log(match);
    console.log(match.slice(1));
    let _obj;
    eval("_obj=" + match.slice(1));
    const [macroKey] = Object.keys(_obj);
    let _text;
    if (macroKey === "ID") {
      if (itemsTimeLine.get(_obj.ID) !== undefined) {
        _text = itemsTimeLine.get(_obj.ID).textData;
      } else {
        _text = "";
      }
    } else {
      _text = moment().format(_obj.DT);
    }
    return <MacroText key={i}>{_text}</MacroText>;
  };

  const macroProps = ["ID", "DT", "CB"].join("|");
  const regStr = `(\\$\\{\\s*(?:${macroProps})\\s*:\\s*["'].+?["']\\s*\\})`;
  const regex = new RegExp(regStr, "gm");
  const strReplaced = reactStringReplace(textData, regex, replacer);

  const textMacroExpanded = strReplaced.map((str, i) => {
    if (typeof str === "string") {
      return (
        <Highlighter
          key={i}
          highlightClassName="highlighter-text"
          searchWords={createInputKeys(searchInputValue)}
          autoEscape={true}
          textToHighlight={str}
        />
      );
    } else {
      return str;
    }
  });

  return textMacroExpanded;
};

const convertFileName = (textData, mainFormat) => {
  switch (mainFormat) {
    case "FILE": {
      const fileList = textData.split("\n");
      const fileNames = fileList.map(f => path.basename(f));
      return fileNames.join("  ");
    }
    default:
      return textData;
  }
};

const createOptionComponent = (props, _searchOpt) => {
  const { searchInputValue, itemsTimeLine } = props;
  const _optLabel = _searchOpt.map(opt => opt.value);

  return optProps => {
    if (optProps.data.label === "Add New Item By Input Value") {
      return (
        <components.Option {...optProps}>
          {optProps.data.label}
        </components.Option>
      );
    } else {
      const {
        isFaved,
        textData,
        key,
        lang,
        tag,
        mainFormat
      } = itemsTimeLine.get(optProps.data.id);
      const _textData = convertFileName(textData, mainFormat);

      return (
        <components.Option {...optProps}>
          <OptionWrapper>
            <RightContents>{renderStarIcon(isFaved)}</RightContents>
            <LeftContents>
              {!!key && (
                <KeyTag>
                  {_optLabel.includes("_HOT_") ? (
                    <Highlighter
                      highlightClassName="highlighter-hotkey"
                      searchWords={createInputKeys(searchInputValue)}
                      autoEscape={true}
                      textToHighlight={key}
                    />
                  ) : (
                    key
                  )}
                </KeyTag>
              )}
              {!!lang && (
                <LangName langName={lang}>
                  {_optLabel.includes("_LANG_") ? (
                    <Highlighter
                      highlightClassName="highlighter-lang"
                      searchWords={createInputKeys(searchInputValue)}
                      autoEscape={true}
                      textToHighlight={lang}
                    />
                  ) : (
                    lang
                  )}
                </LangName>
              )}
              {tag.map((tg, index) => (
                <HashTag key={index}>
                  {_optLabel.includes("_HASH_") ? (
                    <Highlighter
                      highlightClassName="highlighter-hashtag"
                      searchWords={createInputKeys(searchInputValue)}
                      autoEscape={true}
                      textToHighlight={tg.value}
                    />
                  ) : (
                    tg.value
                  )}
                </HashTag>
              ))}
              <TextWrapper mainFormat={mainFormat}>
                {expandTextMacro(_textData, searchInputValue, itemsTimeLine)}
              </TextWrapper>
              {(mainFormat === "IMAGE" || mainFormat === "SHEET") &&
                renderImage(optProps.data.id)}
            </LeftContents>
          </OptionWrapper>
        </components.Option>
      );
    }
  };
};

const MultiValueLabel = props => {
  return (
    <components.MultiValueLabel {...props}>
      {props.data.labelShow}
    </components.MultiValueLabel>
  );
};

const customStyles = {
  indicatorSeparator: (styles, { data }) => ({
    ...styles,
    display: "none"
  }),
  clearIndicator: (styles, { data }) => ({
    ...styles,
    color: "#bbbbbb",
    padding: 2,
    "&:hover": { color: "#ffffff" }
  }),
  option: (provided, state) => ({
    ...provided,
    color: "#dddddd",
    backgroundColor: state.isFocused ? "#354154" : "none",
    "&:hover": { backgroundColor: "#2F353D" },
    fontSize: "11px",
    padding: "5px"
  }),
  menu: (provided, state) => ({
    ...provided,
    zIndex: 9999
  }),
  menuList: (provided, state) => ({
    ...provided,
    borderRadius: "0px",
    backgroundColor: "#333335"
  }),
  control: (styles, state) => ({
    ...styles,
    backgroundColor: "#ececec",
    "&:hover": { border: state.isFocused ? "solid 1px blue" : "none" },
    border: state.isFocused ? "solid 1px blue" : "none",
    boxShadow: "none", // no box-shadow
    borderRadius: "15px",
    height: "25px",
    minHeight: "25px"
  }),
  valueContainer: base => ({
    ...base,
    padding: "0px 6px"
  }),
  multiValue: (styles, state) => ({
    ...styles,
    display: state.data.origType === "SURROUND" ? "block" : "inherit",
    backgroundColor: state.data.color,
    borderRadius: "8px",
    width: 30,
    textAlign: "center",
    height: 18,
    fontSize: 12,
    lineHeight: 1,
    color: "#dddddd",
    // paddingLeft: state.data.origType === "SURROUND" ? -2 : 0,
    ":before": {
      backgroundColor: "#eeeeee",
      content: state.data.origType === "SURROUND" ? "none" : "''",
      display: "inline-block",
      marginLeft: 8,
      marginTop: 3,
      maskImage: `url(${state.data.icon})`,
      maskSize: "13px 13px",
      height: "13px",
      width: "13px"
    }
  }),
  input: (styles, { data }) => ({
    ...styles,
    paddingLeft: 10
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: "#dddddd"
  })
};

const createSearchOptions = searchOpt => {
  const _searchOpt = [];
  searchOpt.forEach(map => {
    map.forEach(opt => {
      _searchOpt.push(opt);
    });
  });
  return _searchOpt;
};

const SearchBar = props => {
  const selectRef = useRef(null);
  const {
    searchInputValue,
    setSearchInputValue,
    searchOpt,
    setSearchOpt,
    favItem
  } = props;
  const _searchOpt = createSearchOptions(searchOpt);
  return (
    <Wrapper>
      <AsyncCreatableSelect
        ref={selectRef}
        name="seacrhbar"
        isClearable
        isMulti
        placeholder={null}
        menuIsOpen={!!searchInputValue}
        isClearable
        inputId={"searchbar"}
        formatCreateLabel={inputValue => "Add New Item By Input Value"}
        defaultOptions
        loadOptions={promiseOptions(searchOpt)}
        components={{
          Option: createOptionComponent(props, _searchOpt),
          MultiValueLabel,
          DropdownIndicator: () => null,
          MultiValueRemove: () => null
        }}
        value={_searchOpt}
        onChange={value => {
          const _value = value === null ? [] : value;
          setSearchOpt("onChange", _value);
        }}
        inputValue={searchInputValue}
        styles={customStyles}
        onInputChange={value => {
          setSearchInputValue(value);
        }}
        onBlur={() => {
          setSearchOpt("onChange", []);
        }}
        onKeyDown={e => {
          if (searchInputValue === "") {
            switch (keycode(e)) {
              case "space":
                setSearchOpt("onKeyDown", keycode(e));
                break;
              // case "f":
              // case "t":
              // case "l":
              //   if (e.ctrlKey) setSearchOpt("onKeyDown", keycode(e));
              //   break;
              case "tab":
                e.preventDefault();
                document.getElementById("item-list").focus();
                break;
              default:
                break;
            }
          } else {
            switch (keycode(e)) {
              case "f":
                if (e.ctrlKey) {
                  const {
                    focusedOption
                  } = selectRef.current.select.select.select.state;
                  favItem(focusedOption.id);
                }
                break;
              case "enter":
                e.preventDefault();
                console.log("enterrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
                break;
              default:
                break;
            }
          }
        }}
      />
    </Wrapper>
  );
};

const mapStateToProps = state => ({
  itemsTimeLine: state.get("itemsTimeLine"),
  searchInputValue: state.get("searchInputValue"),
  searchOpt: state.get("searchOpt")
});

export default connect(mapStateToProps, {
  setSearchInputValue,
  setSearchOpt,
  favItem
})(SearchBar);
