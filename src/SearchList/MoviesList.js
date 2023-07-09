import { Lightning } from "@lightningjs/sdk";
import MovieListItem from "./MoviesListItem.js";

export default class MovieList extends Lightning.Component {
  static _template() {
    return {};
  }

  set items(items) {
    this.children = items.map((item, index) => {
      return {
        type: MovieListItem,
        item: item,
      };
    });
  }

  _construct() {
    this._changeX = 0;
  }
  _init() {
    this.index = 0;
  }

  _active() {}

  _handleLeft() {
    if (this.index > 0) {
      this.index--;
    } else {
      this.fireAncestors("$changeMessage", 1);
    }
  }
  _handleUp() {
    this.fireAncestors("$changeMessage", 2);
  }
  _handleDown() {
    this.fireAncestors("$changeMessage", 0);
  }
  // _handleEnter() {
  //   console.log(this.current);
  //   // console.log(this.current[2].title);
  //   // this.fireAncestors("$changeMessage", "");
  // }

  _handleRight() {
    if (this.index < this.children.length - 1) {
      this.index++;
    }
  }

  _getActiveItem() {
    return this.children[this.index];
  }

  _changeLeftDirection() {
    this._changeX += 220;
  }

  _changeRightDirection() {
    this._changeX -= 220;
  }

  _getFocused() {
    // this._focusedLabel = this.childList.getAt(
    //   this.index
    // ).item.label;
    // this._focusedGenres = this.childList.getAt(this.index)
    //   .item.genres.join(" | ");
    // let backdrop = this.childList.getAt(this.index).item.backdrop;
    // let arrList = [this._focusedLabel, this._focusedGenres, backdrop];
    // console.log('arrlist....',arrList);
    // this.application.emit("whenFocused", arrList);
    return this.children[this.index];
  }
}
