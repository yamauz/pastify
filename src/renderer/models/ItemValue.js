import { Record } from "immutable";
import shortid from "shortid";
const { DEFAULT_ITEM_HEIGHT } = require("../../common/settings");

const ItemValueRecord = Record({
  id: shortid.generate(),
  removeFlg: false,
  date: new Date().getTime(),
  mainFormat: "TEXT",
  textData: "",
  lang: "",
  tag: [],
  key: "",
  isFaved: false,
  isTrashed: false,
  itemHeight: DEFAULT_ITEM_HEIGHT,
  itemTagHeight: 0
});

class ItemValue extends ItemValueRecord {
  constructor(itemValue) {
    const valueSuper = Object.keys(itemValue).reduce((x, y) => {
      return { ...x, [y]: itemValue[y] };
    }, {});
    super(valueSuper);
  }
}

export default ItemValue;
