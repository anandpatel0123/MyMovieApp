import { Lightning, Router, Utils } from "@lightningjs/sdk";

export default class MoviesListItem extends Lightning.Component {
  static _template() {
    return {
      flexItem: { margin: 14 },
      shader: { type: Lightning.shaders.RoundedRectangle, radius: 10 },
      rect: true,
      w: 150,
      h: 200,
      alpha: 0.8,
    };
  }

  _init() {
    this.patch({ src: this.item.src });
    const itemAverage = this.item.average * 10;
  }

  _active() {
    this.application.on("setBackground", (val) => {
      if (val) {
        this.patch({
          colorTop: 0xff717171,
          colorBottom: 0xff000000,
        });
      } else {
        this.patch({
          colorTop: 0xffffffff,
          colorBottom: 0xffffffff,
        });
      }
    });
  }
  _handleEnter() {
    console.log(this.item.label);
    Router.navigate("simple",false)

    // console.log(this.current[2].title);
    this.fireAncestors("$addSearch", this.item.label);
  }
  _focus() {
    this.patch({ smooth: { scale: 1.2, alpha: 1 } });
  }

  _unfocus() {
    this.patch({ smooth: { scale: 1, alpha: 0.8 } });
  }

  // _handleEnter() {
  //   const itemId = this.item.itemId;
  //   const itemType = this.item.itemType;
  //   Router.navigate(`detail/${itemType}/${itemId}`, true);
  // }

  pageTransition() {
    return "up";
  }
}
