import { Lightning, Router, Utils } from "@lightningjs/sdk";
import Settings from "./Settings";

export default class SettingsMenu extends Lightning.Component {
	static _template() {
		return {
			rect: true,
			w: 500,
			h: 1920,
			color: 0xff212121,
			alpha: 0.8,
			x: 1920,
			transitions: {
				x: {
					duration: 0.3,
					timingFunction: "cubic-bezier(0.17, 0.9, 0.9, 1)",
				},
				w: {
					duration: 0.3,
					timingFunction: "cubic-bezier(0.17, 0.9, 0.9, 1)",
				},
			},
			SubItems: {
				color: 0xffffffff,
				y: 300,
				flex: { direction: "column" },
				Auto: {
					x: 130,

					type: Settings,
					text: {
						fontFace: "Regular",
						fontSize: 40,
						textColor: 0xffffffff,
						text: "Auto",
					},
					SRC: {
						x: -60,
						w: 50,
						h: 50,
						visible: false,
						src: Utils.asset("./icons/tick.png"),
					},
				},
				High: {
					x: 130,
					type: Settings,
					// mountY: 0.5,
					//y: 50,
					text: { fontFace: "Regular", fontSize: 40, text: "High" },
					SRC: {
						x: -60,
						w: 50,
						h: 50,
						visible: false,
						src: Utils.asset("./icons/tick.png"),
					},
					pageId: "Off",
				},
				Good: {
					x: 130,

					type: Settings,
					// mountY: 0.5,
					//y: 50,
					text: { fontFace: "Regular", fontSize: 40, text: "Good" },
					pageId: "Off",
					SRC: {
						x: -60,
						w: 50,
						h: 50,
						visible: false,
						src: Utils.asset("./icons/tick.png"),
					},
				},
				Data_Saver: {
					x: 130,

					type: Settings,
					// mountY: 0.5,
					//y: 50,
					text: { fontFace: "Regular", fontSize: 40, text: "Data Saver" },
					pageId: "Off",
					SRC: {
						x: -60,
						w: 50,
						h: 50,
						visible: false,
						src: Utils.asset("./icons/tick.png"),
					},
				},
			},
			Subtitles: {
				x: 100,
				y: 180,

				text: { fontFace: "Regular", fontSize: 50, text: "Video Quality" },
			},
		};
	}

	_init() {
		this._indexS = 0;
	}

	_focus() {
		this.patch({
			smooth: {
				x: 1420,
			},
		});

		//this.application.emit("blurContent", { amount: 3, scale: 1.2 });
	}

	_unfocus() {
		this.patch({
			smooth: {
				x: 1920,
			},
		});

		//this.application.emit("blurContent", { amount: 0, scale: 1 });
	}

	_handleUp() {
		if (this._indexS > 0) {
			this._indexS--;
		}
		//console.log("Acive ", this.activeSubItem);
	}

	_handleDown() {
		if (this._indexS < this.tag("SubItems").children.length - 1) {
			this._indexS++;
		}
	}

	_handleRight() {
		Router.focusPage();
	}

	_handleEnter() {
		if (this._indexS == 0) {
			this.tag("SubItems").children[0].children[0].visible = true;
			this.tag("SubItems").children[1].children[0].visible = false;
			this.tag("SubItems").children[2].children[0].visible = false;
			this.tag("SubItems").children[3].children[0].visible = false;
		} else if (this._indexS == 1) {
			this.tag("SubItems").children[0].children[0].visible = false;
			this.tag("SubItems").children[1].children[0].visible = true;
			this.tag("SubItems").children[2].children[0].visible = false;
			this.tag("SubItems").children[3].children[0].visible = false;
		} else if (this._indexS == 2) {
			this.tag("SubItems").children[0].children[0].visible = false;
			this.tag("SubItems").children[1].children[0].visible = false;
			this.tag("SubItems").children[2].children[0].visible = true;
			this.tag("SubItems").children[3].children[0].visible = false;
		} else if (this._indexS == 3) {
			this.tag("SubItems").children[0].children[0].visible = false;
			this.tag("SubItems").children[1].children[0].visible = false;
			this.tag("SubItems").children[2].children[0].visible = false;
			this.tag("SubItems").children[3].children[0].visible = true;
		}

		Router.focusPage();
		// Router.navigate(this.activeSubItem.pageId);
	}

	get activeSubItem() {
		return this.tag("SubItems").children[this._indexS];
	}

	_getFocused() {
		return this.activeSubItem;
	}
}
