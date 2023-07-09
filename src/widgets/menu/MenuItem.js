import { Lightning } from "@lightningjs/sdk";

export default class MenuItem extends Lightning.Component {
  static _template() {
    return {
      h: 100,
      alpha: 0.5,
      // Profile: {
			// 	x: 1830,
			// 	y: 30,
			// 	w: 60,
			// 	h: 60,
			// 	src: Utils.asset("./images/profile.png"),
			// },
      Label: {
        mountY: 0.5,
        y: 50,
        text: { fontFace: "Regular", fontSize: 35 },
      },
    };
  }

  set label(v) {
    this.tag("Label").text = v;
  }

  set pageId(v) {
    this._pageId = v;
  }

  get pageId() {
    return this._pageId;
  }

  _focus() {
    this.alpha = 1;
  }

  _unfocus() {
    this.alpha = 0.5;
  }
}
