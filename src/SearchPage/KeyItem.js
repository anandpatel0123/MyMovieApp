import { Lightning } from "@lightningjs/sdk/index";

var message = [];

export class KeyItem extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      w: 70,
      h: 60,
      color: 0xff474747,
      alpha: 1,
      Label: {
        x: 15,
        y: 8,
      },
    };
  }
  _init() {
    this.patch({
      Label: {
        text: {
          text: this.item.label,
          fontSize: 28,
          // textColor: 0xffffffff,
        },
      },
    });
  }
  _focus() {
    this.color = 0xffffffff;
    this.tag("Label").color = 0xff474747;
    // this.tag("Label").children[0].textColor = 0xffffffff;
  }
  _unfocus() {
    this.color = 0xff474747;
    this.tag("Label").color = 0xffffffff;
    // this.tag("Label").children[0].textColor = 0xff000000;
  }
  _getFocused() {
    return this.tag("Keys");
  }
  _handleEnter() {
    switch (this.item.label) {
      case "⌫":
        var edited = message.slice(0, -1);
        message = edited;

        break;
      case "↲":
        // TODO store entered data here
        console.log("Saved");
        break;
      default:
        message.push(this.item.label);
    }
    this.fireAncestors("$changeText", message.join().replace(/,/g, ""));
  }
}
