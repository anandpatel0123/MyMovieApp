import { Lightning } from "@lightningjs/sdk";

export default class Item extends Lightning.Component {
  static _template() {
    return {
      alpha: 0.7,

      text: { text: "", fontFace: "pixel", fontSize: 30 },
    };
  }

  set label(v) {
    this.text.text = v;
  }
  _focus() {
    this.alpha = 1;
    // this.tag("Label").children[0].textColor = 0xffffffff;
  }
  _unfocus() {
    this.alpha = 0.7;
    // this.tag("Label").children[0].textColor = 0xff000000;
  }
  // set action(v) {
  //   this._action = v;
  // }

  // get action() {
  //   return this._action;
  // }
}
