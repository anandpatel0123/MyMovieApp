import { Lightning, Utils,Router } from "@lightningjs/sdk";
import { MenuItemDIY as MenuItem } from "../pages/MenuItem";
import { ListDIY as List1 } from "../pages/List";
import { List } from "@lightningjs/ui";
import { KeyList } from "./KeyList";
import MoviesList from "../SearchList/MoviesList";
import { series } from "./series.json";
import { fallbackCachedFilms } from "./fallbackCachedFilms.json";
import RecentList from "../Recent/RecentList";
export default class Search extends Lightning.Component {
  static _template() {
    return {
        Background: {
            w: 1920, h: 1080, colorBottom: 0xff000000, scale: 1.2,
            src: Utils.asset("images/background.png"),
            transitions: {
                scale: {duration: 1, timingFunction: 'cubic-bezier(0.20, 1.00, 0.80, 1.00)'}
            },
            visible:true,
        },
        Logo: {
            x: 20,
            y: 10,
            w: 70,
            h: 70,
            src: Utils.asset("./images/logo.png"),
        },
      Keyboard: {
        rect: true,
        x: 250,
        y: 142,
        w: 625,
        h: 320,
        color: 0x00d2d2d2,
        Keys: { type: KeyList, y: 20, x: 20, mount: 0.5 },
      },
      RecentLists: {
        x: 280,
        y: 740,
        type: RecentList,
        items: [],
      },
      HistoryText: {
        x: 280,
        y: 690,
        text: {
          text: "Recent searches",
          fontSize: 40,
          FontFace: "Bold",
          textColor: 0xffffffff,
        },
      },
      Text: {
        x: 740,
        y: 125,
        text: {
          text: "Today's top searches",
          fontSize: 40,
          FontFace: "Bold",
          textColor: 0xffffffff,
        },
      },
      SearchText: {
        x: 740,
        y: 75,
        text: {
          text: "",
          fontSize: 30,
          FontFace: "Bold",
          textColor: 0xffffffff,
        },
      },
      List: {
        type: MoviesList,
        x: 750,
        y: 200,
        flex: { direction: "row", padding: 0, wrap: true },
        w: 1200,
      },
      SearchList: {
        type: MoviesList,
        x: 750,
        y: 150,
        flex: { direction: "row", padding: 0, wrap: true },
        w: 1200,
        alpha: 0,
      },
      Menu: {
        x: 20,
        y: 80,
        visible: true,
        type: List,
        spacing: 30,
        direction: "column",
    },
      // InputField: {
      //   rect: true,
      //   x: 400,
      //   y: 380,
      //   w: 1130,
      //   h: 75,
      //   color: 0xffd2d2d2,
      // },
      // Text: {
      //   mount: 0.5,
      //   x: 960,
      //   y: 420,
      //   text: {
      //     text: "Enter your text please",
      //     fontFace: "Regular",
      //     fontSize: 44,
      //     textColor: 0xffffffff,
      //   },
      // },
    };
  }
  _active() {}
  _init() {
    this.recent = [{ label: "Champions Leauge" }];
    this.tag("RecentLists").patch({
      items: this.recent.slice(Math.max(this.recent.length - 5, 0)),
    });

    this.tag("Keys").items = [
      { label: "Space", x: 0, y: 0 },
      { label: "⌫", x: 3, y: 0 },
      { label: "A", x: 0, y: 1 },
      { label: "B", x: 1, y: 1 },
      { label: "C", x: 2, y: 1 },
      { label: "D", x: 3, y: 1 },
      { label: "E", x: 4, y: 1 },
      { label: "F", x: 5, y: 1 },
      { label: "G", x: 0, y: 2 },
      { label: "H", x: 1, y: 2 },
      { label: "I", x: 2, y: 2 },
      { label: "J", x: 3, y: 2 },
      { label: "K", x: 4, y: 2 },
      { label: "L", x: 5, y: 2 },
      { label: "M", x: 0, y: 3 },
      { label: "N", x: 1, y: 3 },
      { label: "O", x: 2, y: 3 },
      { label: "P", x: 3, y: 3 },
      { label: "Q", x: 4, y: 3 },
      { label: "R", x: 5, y: 3 },
      { label: "S", x: 0, y: 4 },
      { label: "T", x: 1, y: 4 },
      { label: "U", x: 2, y: 4 },
      { label: "V", x: 3, y: 4 },
      { label: "W", x: 4, y: 4 },
      { label: "X", x: 5, y: 4 },
      { label: "Y", x: 0, y: 5 },
      { label: "Z", x: 1, y: 5 },
      { label: "0", x: 2, y: 5 },
      // { label: "↲", x: 5, y: 4 },
      { label: "1", x: 3, y: 5 },
      { label: "2", x: 4, y: 5 },
      { label: "3", x: 5, y: 5 },
      { label: "4", x: 0, y: 6 },
      { label: "5", x: 1, y: 6 },
      { label: "6", x: 2, y: 6 },
      { label: "7", x: 3, y: 6 },
      { label: "8", x: 4, y: 6 },
      { label: "9", x: 5, y: 6 },
    ];

    this.tag("Menu").items = [
        // {
        // 	type: MenuItem,
        // 	item: {
        // 		path: "profile",
        // 		displayColor: 0xffffffff,
        // 	},
        // },
        {
            type: MenuItem,
            item: {
                path: "home",
                lbl: "main",
                displayColor: 0xffffffff,
            },
        },
        // {
        // 	type: MenuItem,
        // 	item: {
        // 		path: "profile",
        // 	},
        // },
        {
            type: MenuItem,
            item: { path: "Movies", lbl: "movies", displayColor: 0xffffffff },
        },
        {
            type: MenuItem,
            item: { path: "TV", lbl: "tv", displayColor: 0xffffffff },
        },
        {
            type: MenuItem,
            item: { path: "Search", lbl: "search", displayColor: 0xffffffff },
        },
        {
            type: MenuItem,
            item: { path: "MyList", lbl: "wishlist", displayColor: 0xffffffff },
        },
        {
          type: MenuItem,
          item: { path: "Sports", lbl: "sports", displayColor: 0xffffffff },
        },
        {
            type: MenuItem,
            item: { path: "Premium", lbl: "premium", displayColor: 0xffffffff },
        },
        {
            type: MenuItem,
            item: { path: "Settings", lbl: "settings", displayColor: 0xffffffff },
        },
    ];
    // console.log(this.getFilmsFromAPI);
    // this.getFilmsFromAPI();
    this.getFilmsFromAPI((data) => {
      this.tag("List").items = data.map((result) => {
        let label = result.title;
        return {
          label: label,
          // genres: result.genres,
          src: result.poster_path,
          // itemType: result.type,
          // itemId: result.id,
          backdrop: result.background,
          // average: result.vote_average,
        };
      });
    });
    this.getSearch((data) => {
      this.tag("SearchList").items = data.slice(0, 12).map((result) => {
        let label = result.title;
        return {
          label: label,
          // genres: result.genres,
          src: result.poster_path,
          // itemType: result.type,
          // itemId: result.id,
          //   backdrop: result.background,
          // average: result.vote_average,
        };
      });
    });
  }
  getFilmsFromAPI = (callback) => {
    this.films = series;
    callback(series);
  };
  getSearch = (callback) => {
    this.searchResult = fallbackCachedFilms;
    callback(fallbackCachedFilms);
  };
  films = [];
  searchResult = [];

  $changeMessage(signal) {
    console.log("signal == " + signal);
    switch (signal) {
      case 0:
        this.focusList = true;
        this.focusKeyboard = false;
        this.focusSearchList = false;
        this.focusSearchHistory = false;

        break;
      case 1:
        this.focusKeyboard = true;
        this.focusList = false;
        this.focusSearchList = false;
        this.focusSearchHistory = false;

        break;
      case 2:
        // if (this.searchText.length >= 3) {
        this.focusList = false;
        this.focusKeyboard = false;
        this.focusSearchList = true;
        this.focusSearchHistory = false;

        break;

      case 3:
        // if (this.searchText.length >= 3) {
        this.focusList = false;
        this.focusKeyboard = false;
        this.focusSearchList = false;
        this.focusSearchHistory = true;

        // }
        break;
      default:
        this.focusKeyboard = true;
      // code block
    }
  }
  $changeText(message) {
    this.searchText = message;
    if (message.length >= 3) {
      this.tag("List").y = 680;
      this.tag("Text").y = 620;
      this.tag("SearchList").alpha = 1;
    } else {
      this.tag("List").y = 200;
      this.tag("Text").y = 125;
      this.tag("SearchList").alpha = 0;
    }
    this.tag("SearchText").patch({
      text: { text: message },
    });
  }
  $addSearch(message) {
    const checkUsername = (obj) => obj.label == message;
    if (this.recent.some(checkUsername)) {
      console.log("dubbb");
    } else {
      this.recent.unshift({ label: message });
    }
    this.recent.forEach(function (entry) {
      console.log(entry);
    });

    this.tag("RecentLists").patch({
      items: this.recent.slice(0, 5),
    });
  }
  focusKeyboard = true;
  focusList = false;
  focusSearchList = false;
  focusSearchHistory = false;
  searchText = "";
  _getFocused() {
    this._setState("Menu");
    // console.log("focuskey" + this.focusKeyboard);
    // console.log("focuslist" + this.focusList);
    // console.log("focussearch" + this.focusSearchList);
    // console.log("focussearchhistory" + this.focusSearchHistory);
    // if (this.focusKeyboard) {
    //   console.log("lofeufbasjbf");
    //   return this.tag("Keys");
    // }
    // if (this.focusList) {
    //   return this.tag("List");
    // }
    // if (this.focusSearchList) {
    //   return this.tag("SearchList");
    // }
    // if (this.focusSearchHistory) {
    //   console.log("holllladdddddddddddddaaa");
    //   return this.tag("RecentLists");
    // }
  }
  static _states(){
    return[
      class Menu extends this{
        _getFocused(){
            this.tag("Menu").visible = true;
            return this.tag("Menu");
        }
        _handleRight(){
          this._setState("Keyboard")
        }
        _handleLeft() {
            this.tag("Menu").visible = false;
            Router.focusWidget("Menu");
        }
      },
      class Keyboard extends this{
        _getFocused(){
          if (this.focusKeyboard) {
            console.log("lofeufbasjbf");
            return this.tag("Keys");
          }
          if (this.focusList) {
            return this.tag("List");
          }
          if (this.focusSearchList) {
            return this.tag("SearchList");
          }
          if (this.focusSearchHistory) {
            console.log("holllladdddddddddddddaaa");
            return this.tag("RecentLists");
          }
          // return this.tag("Keys");
        }
        _handleBack(){
          this._setState("Menu")
        }
      }
    ]
  }
}
