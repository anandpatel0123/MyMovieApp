import { Lightning } from "@lightningjs/sdk";
import Item from "./Item.js";

export default class RecentList extends Lightning.Component {
  static _template() {
    return {
      Items: {
        x: 0,
      },
    };
  }

  _init() {
    // create animation

    // start the animation

    // current focused menu index
    this._index = 0;
  }

  set items(v) {
    // create children by handing over an array of
    // object to the objectList
    this.tag("Items").children = v.map((el, idx) => {
      return { type: Item, label: el.label, y: idx * 45 };
    });
  }

  get items() {
    return this.tag("Items").children;
  }

  get activeItem() {
    return this.items[this._index];
  }
  _getFocused() {
    return this.items[this._index];
  }
  _handleUp() {
    if (this._index == 0) {
      this.fireAncestors("$changeMessage", 1);
    } else {
      this._setIndex(Math.max(0, --this._index));
    }
  }

  _handleDown() {
    console.log("fbsehbvksebvesbjvjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
    this._setIndex(Math.min(++this._index, this.items.length - 1));
  }

  _setIndex(idx) {
    console.log(idx);
    // since it's a one time transition we use smooth
    // store new index
    this._index = idx;
  }
}
