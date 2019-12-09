import { Record } from "immutable";
import shortid from "shortid";

const FilterValueRecord = Record({
  id: shortid.generate(),
  filterName: "",
  filterShortcutKeyOpt: null,
  sortOpt: [],
  dataTypeFilterOpt: [],
  keywordFilterOpt: [],
  idFilterOpt: [],
  statusFilterOpt: [],
  hotKeyFilterOpt: [],
  hashTagFilterOpt: [],
  languageFilterOpt: []
});

class FilterValue extends FilterValueRecord {
  constructor(FilterValue) {
    const valueSuper = Object.keys(FilterValue).reduce((x, y) => {
      return { ...x, [y]: FilterValue[y] };
    }, {});
    super(valueSuper);
  }
}

export default FilterValue;
