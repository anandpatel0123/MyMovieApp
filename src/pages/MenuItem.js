import { Lightning, Utils, Router } from "@lightningjs/sdk";

export default class MenuItem extends Lightning.Component {
  static _template() {
    return {
      w: 70,
      h: 70,
      //rect: true,
      //color: 0xff090909,
      flexItem: { marginBottom: 30 },
      Icon: { x: 15, y: 15 },
    };
  }

  set item(obj) {
    this._item = obj;
  }

  set label(str) {
    this._item.label = str;
    this._update();
  }

  set displayColor(argb) {
    this._item.displayColor = argb;
    this._update();
  }

  _update() {
    if (this.active && this._item) {
      const { path = "Void", displayColor = 0xff212121 } = this._item;
      const color = this.hasFocus() ? 0xffffffff : displayColor;

      this.patch({
        // color: this.hasFocus() ? displayColor : 0xff212121,
        Icon: {
          color,
          src: Utils.asset(`images/menu/${path.toLowerCase()}.png`),
        },
      });
    }
  }

  _firstActive() {
    this._update();
  }

  _focus() {
    this.patch({
      smooth: { color: this._item.displayColor },
      Icon: { smooth: { color: 0xffffff21 } },
      Label: { smooth: { color: 0xff212121 } },
    });
  }

  _unfocus() {
    const color = this._item.displayColor;
    this.patch({
      smooth: { color: 0xffffffff },
      Icon: { smooth: { color } },
      Label: { smooth: { color } },
    });
  }

  _handleEnter() {
    const { lbl } = this._item;
    Router.navigate(`${lbl}`, false);
  }
}

export class MenuItemDIY extends MenuItem {
  static get width() {
    return 70;
  }

  static get height() {
    return 70;
  }
}
