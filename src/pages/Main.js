import { Lightning, Router, Utils, Registry } from "@lightningjs/sdk";
import { MenuItemDIY as MenuItem } from "./MenuItem";
// import { ListDIY as List1 } from "./List";
import Background from "../Background";
import Page from "./Page";
import { List } from "@lightningjs/ui";
import ImageCell from "./ImageCell.js";
import ImageCell1 from "./ImageCell1";

export default class Main extends Page {
	static getFonts() {
		return [
			{ family: "Regular", url: Utils.asset("fonts/Roboto-Regular.ttf") },
		];
	}

	static _template() {
		return {
			// rect: true,

			w: 1920,
			h: 1080,
			// color: 0xff0b63f6,
			Background1: {
				w: 1920,
				h: 1080,
				colorBottom: 0xff000000,
				scale: 1.2,
				src: Utils.asset("images/background.png"),
				transitions: {
					scale: {
						duration: 1,
						timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)",
					},
				},
				visible: true,
			},
			Background: {
				visible: true,
				type: Background,
			},

			Blur: {
				rtt: true,
				w: 1920,
				h: 1080,
				type: Lightning.components.FastBlurComponent,
				amount: 0,
				transitions: {
					amount: { duration: 0.3 },
					scale: { duration: 0.3 },
				},
			},

			Home: {
				y: 0,
				Lists: {
					x: 150,
					y: 600,
					zIndex: 3,
				},
				Lists1: {
					x: 150,
					y: 1800,
					zIndex: 3,
				},
				Lists2: {
					x: 150,
					y: 2400,
					zIndex: 3,
				},

				// IMG: {
				//   // color: 0xffc0392b,
				//   // mountX: 0.5,
				//   // mountY: 0.4,
				//   w: 1920,
				//   h: 670,
				//   src: Utils.asset("./images/content/home_img.png"),
				//   // Content: {
				//   //   x: 10,
				//   //   y: 90,
				//   //   w: 1600,
				//   //   h: 470,
				//   //   rect: true,
				//   // },
				// },

				Content: {
					Text123: {
						x: 150,
						y: 1200,
						text: { text: "Watch In Your Language", fontSize: 40 },
					},
					visible: true,
					List: { x: 150, y: 1300, w: 1740, type: List, direction: "row" },
				},
				List123: { x: 0, y: 0, w: 1900, type: List, direction: "row" },
			},
			Logo: {
				x: 20,
				y: 10,
				w: 70,
				h: 70,
				src: Utils.asset("./images/logo.png"),
			},

			// Profile: {
			// 	x: 1830,
			// 	y: 30,
			// 	w: 60,
			// 	h: 60,
			// 	src: Utils.asset("./images/profile.png"),
			// },

			Menu: {
				x: 20,
				y: 80,
				visible: true,
				type: List,
				spacing: 30,
				direction: "column",
			},
		};
	}

	// _getFocused() {
	// 	return this.tag("Menu");
	// }

	_setup() {
		const items1 = [];
		for (let i = 0; i < 7; i++) {
			items1.push({
				w: 1950,
				h: 575,
				src: Utils.asset(`images/banner_new/banner/${i}.png`),
				type: ImageCell1,
			});
		}
		this.tag("List123").add(items1);

		const items = [];
		for (let i = 0; i < 4; i++) {
			items.push({
				margin: 15,
				src: Utils.asset(`images/${i}.jpg`),
				type: ImageCell,
			});
		}
		this.tag("List").add(items);
	}

	_init() {
		Registry.setInterval(() => {
			this.tag("List123").right();
		}, 5000),
			(this._index = 0);
		this.tag("Home").y = 0;
		this._setState("Lists");

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

		this._setState("Lists");
	}

	set main(v) {
		this.tag("Lists").children = v;

		let y = 0;
		this.tag("Lists").children.forEach((child) => {
			child.y = y;
			y += child.constructor.height;
		});
	}
	set popular(v) {
		this.tag("Lists1").children = v;

		let y = 0;
		this.tag("Lists1").children.forEach((child) => {
			child.y = y;
			y += child.constructor.height;
		});
	}
	set Popular1(v) {
		this.tag("Lists2").children = v;

		let y = 0;
		this.tag("Lists2").children.forEach((child) => {
			child.y = y;
			y += child.constructor.height;
		});
	}
	_focus() {
		this.patch({
			Lists: {
				smooth: {
					y: [
						560,
						{
							duration: 0.2,
							timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)",
						},
					],
				},
			},
		});
	}

	_unfocus() {
		this.patch({
			Lists: {
				smooth: {
					y: [
						600,
						{
							duration: 0.4,
							timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)",
						},
					],
				},
			},
		});
	}

	// $changeContent({ lbl }) {
	//   // this.tag("IMG").patch({
	//   //   IMG: {
	//   //     w: 1920,
	//   //     h: 670,
	//   //     src: Utils.asset(`images/content/${path.toLowerCase()}_img.png`),
	//   //   },
	//   // });
	//   Router.navigate(`${lbl}`, false);
	// }

	static _states() {
		return [
			class Menu extends this {
				_getFocused() {
					this.tag("Background1").visible = true;
					this.tag("Menu").visible = true;
					return this.tag("Menu");
				}
				_handleLeft() {
					this.tag("Menu").visible = false;
					Router.focusWidget("Menu");
				}
				_handleDown() {
					this._setState("Lists");
				}
			},
			class Lists extends this {
				$exit() {
					this.tag("Lists");
				}
				_getFocused() {
					this.tag("Background1").visible = true;
					this.tag("Background").visible = false;
					this.tag("Home").y = 0;
					return this.tag("Lists").children[this._index];
				}
				_handleUp() {
					this._setState("List123");
				}
				_handleLeft() {
					this._setState("Menu");
				}
				_handleDown() {
					this.tag("Home").y -= 600;
					this._setState("List");
				}
			},

			class Lists1 extends this {
				_getFocused() {
					this.tag("Background1").visible = true;
					this.tag("Background").visible = false;

					this.tag("Content").visible = true;
					return this.tag("Lists1").children[this._index];
				}
				_handleUp() {
					this.tag("Home").y += 400;
					this._setState("List");
				}
				_handleDown() {
					this.tag("Home").y -= 800;
					this._setState("Lists2");
				}
				_handleLeft() {
					this._setState("Menu");
				}
			},
			class Lists2 extends this {
				_getFocused() {
					this.tag("Background1").visible = true;
					this.tag("Background").visible = false;

					this.tag("Content").visible = false;
					return this.tag("Lists2").children[this._index];
				}
				_handleUp() {
					this.tag("Home").y += 800;
					this._setState("Lists1");
				}
				_handleLeft() {
					this._setState("Menu");
				}
				_handleDown() {}
			},

			class List extends this {
				_getFocused() {
					this.tag("Content").visible = true;
					this.tag("Background1").visible = true;
					this.tag("Background").visible = false;
					return this.tag("List");
				}
				_handleLeft() {
					``;
					this._setState("Menu");
				}
				_handleEnter() {
					Router.navigate("tv", false);
				}
				_handleDown() {
					this.tag("Home").y -= 600;
					this._setState("Lists1");
				}
				_handleUp() {
					this.tag("Home").y += 800;
					this._setState("Lists");
				}
			},
			class List123 extends this {
				_getFocused() {
					this.tag("Background1").visible = true;
					this.tag("Background").visible = false;
					return this.tag("List123");
				}
				// _handleLeft() {
				// 	``;
				// 	this._setState("Menu");
				// }
				// _handleEnter() {
				// 	Router.navigate("tv", false);
				// }
				_handleDown() {
					// this.tag("Home").y -= 600;
					this._setState("Lists");
				}
			},
		];
	}

	// _handleLeft() {
	//   Router.focusWidget("Menu");
	// }

	$firstItemCreated() {
		this._refocus();
	}

	_getFocused() {
		return this.tag("Lists").children[this._index];
	}

	static get icon() {
		return "images/list.png";
	}
	// _firstActive() {
	//     this.tag('Assets').items = [
	//         {type: AssetItem, item: {thumb: 'one', colors: {colorBottom: 0xff93e0fa, colorTop: 0xfffcc214}}},
	//         {type: AssetItem, item: {thumb: 'two', colors: {colorBottom: 0xfffcc214, colorTop: 0xff321e78}}},
	//         {type: AssetItem, item: {thumb: 'three', colors: {colorBottom: 0xffd69c09, colorTop: 0xffb03302}}},
	//         {type: AssetItem, item: {thumb: 'four', colors: {colorBottom: 0xff822c0a, colorTop: 0xffbbfafc}}},
	//         {type: AssetItem, item: {thumb: 'five', colors: {colorLeft: 0xfff2fab6, colorRight: 0xff042066}}}
	//     ];
	// }
}
