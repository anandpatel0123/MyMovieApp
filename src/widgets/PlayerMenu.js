import { Lightning, Router, Utils } from "@lightningjs/sdk";
import MenuItem from "./MenuItem";

export default class PlayerMenu extends Lightning.Component {
  static _template() {
    return {
      // rect: true,
      // w: 1920,
      // h: 500,
      // color: 0xff212121,
      // alpha: 1,
      y: -500,

      transitions: {
        y: {
          duration: 0.7,
          timingFunction: "cubic-bezier(0.17, 0.9, 0.9, 1)",
        },
        h: {
          duration: 0.7,
          timingFunction: "cubic-bezier(0.17, 0.9, 0.32, 1.3)",
        },
      },

      Items: {
        // mountY: 0.5,

        flex: { direction: "row" },
        Back: {
          x: 100,
          y: 200,
          type: MenuItem,
          w: 50,
          h: 50,
          src: Utils.asset("./icons/back.png"),
        },

        Replay: {
          x: 200,
          y: 200,
          type: MenuItem,
          w: 55,
          h: 55,
          src: Utils.asset("./icons/replay.png"),
        },
        Subtitles: {
          x: 1450,
          y: 180,
          type: MenuItem,
          w: 80,
          h: 80,
          src: Utils.asset("./icons/subtitle.png"),
        },
        Settings: {
          x: 1550,
          y: 195,
          type: MenuItem,
          w: 50,
          h: 50,
          src: Utils.asset("./icons/settings.png"),
        },
      },
      BackText: {
        x: 233,
        y: 260,
        visible: false,
        text: { fontSize: 20, lineHeight: 30, text: "Play From\nBeginning" },
      },
      SubtitleText: {
        x: 1525,
        y: 260,
        visible: false,
        text: { fontSize: 20, lineHeight: 30, text: "Subtitle & Audio" },
      },
      SettingsText: {
        x: 1725,
        y: 260,
        visible: false,
        text: { fontSize: 20, lineHeight: 30, text: "Settings" },
      },

      Text: {
        x: 550,
        y: 150,
        visible: true,
        text: {
          textAlign: "center",
          text: "Money Hiest\nS5 E2 Do You Believe in Reincarnation?",
          lineHeight: 70,
        },
      },
    };
  }

  _init() {
    this._index = 0;
  }

  _focus() {
    this.patch({
      smooth: {
        y: -100,
      },
    });
  }

  _unfocus() {
    this.patch({
      smooth: {
        y: -500,
      },
    });
  }

  _handleLeft() {
    if (this._index > 0) {
      this._index--;
    }
    if (this._index === 0) {
      this.tag("BackText").visible = false;
      this.tag("SubtitleText").visible = false;
      this.tag("SettingsText").visible = false;
    } else if (this._index == 1) {
      this.tag("BackText").visible = true;
      this.tag("SubtitleText").visible = false;
      this.tag("SettingsText").visible = false;
    } else if (this._index == 2) {
      this.tag("BackText").visible = false;
      this.tag("SubtitleText").visible = true;
      this.tag("SettingsText").visible = false;
    } else if (this._index == 3) {
      this.tag("BackText").visible = false;
      this.tag("SubtitleText").visible = false;
      this.tag("SettingsText").visible = true;
    }
  }

  _handleRight() {
    if (this._index < this.tag("Items").children.length - 1) {
      this._index++;
    }
    if (this._index === 0) {
      this.tag("BackText").visible = false;
      this.tag("SubtitleText").visible = false;
      this.tag("SettingsText").visible = false;
    } else if (this._index == 1) {
      this.tag("BackText").visible = true;
      this.tag("SubtitleText").visible = false;
      this.tag("SettingsText").visible = false;
    } else if (this._index == 2) {
      this.tag("BackText").visible = false;
      this.tag("SubtitleText").visible = true;
      this.tag("SettingsText").visible = false;
    } else if (this._index == 3) {
      this.tag("BackText").visible = false;
      this.tag("SubtitleText").visible = false;
      this.tag("SettingsText").visible = true;
    }
  }

  _handleDown() {
    Router.focusPage();
  }
  
  _handleEnter() {
    // Router.restoreFocus();
    if(this._index == 0) {
      Router.navigate("main");
    }
    if(this._index == 2){
      Router.focusWidget("SubtitleMenu");
    }
    else if(this._index == 3){
      Router.focusWidget("SettingsMenu");
    }
  }

  get activeItem() {
    return this.tag("Items").children[this._index];
  }

  _getFocused() {
    return this.activeItem;
  }
}
