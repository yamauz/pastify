export const ascOptions = [
  {
    label: "Time",
    value: "asctime",
    key: "date",
    isDisabled: false,
    order: "asc"
  },
  {
    label: "Status",
    value: "ascstatus",
    key: "isFaved",
    isDisabled: false,
    order: "asc"
  },
  {
    label: "Datatype",
    value: "ascdatatype",
    key: "mainFormat",
    isDisabled: false,
    order: "asc"
  },
  {
    label: "Text",
    value: "asctext",
    key: "textData",
    isDisabled: false,
    order: "asc"
  },
  {
    label: "Hotkey",
    value: "aschotkey",
    key: "key",
    isDisabled: false,
    order: "asc"
  },
  {
    label: "Language",
    value: "asclanguage",
    key: "lang",
    isDisabled: false,
    order: "asc"
  },
  {
    label: "Tag",
    value: "asctag",
    key: "tag",
    isDisabled: false,
    order: "asc"
  }
];

export const descOptions = [
  {
    label: "Time",
    value: "desctime",
    key: "date",
    isDisabled: false,
    order: "desc"
  },
  {
    label: "Status",
    value: "descstatus",
    key: "isFaved",
    isDisabled: false,
    order: "desc"
  },
  {
    label: "Datatype",
    value: "descdatatype",
    key: "mainFormat",
    isDisabled: false,
    order: "desc"
  },
  {
    label: "Text",
    value: "desctext",
    key: "textData",
    isDisabled: false,
    order: "desc"
  },
  {
    label: "Hotkey",
    value: "deschotkey",
    key: "key",
    isDisabled: false,
    order: "desc"
  },
  {
    label: "Language",
    value: "desclanguage",
    key: "lang",
    isDisabled: false,
    order: "desc"
  },
  {
    label: "Tag",
    value: "desctag",
    key: "tag",
    isDisabled: false,
    order: "desc"
  }
];

export const groupedOptions = [
  {
    label: "Ascending",
    options: ascOptions
  },
  {
    label: "Descending",
    options: descOptions
  }
];
