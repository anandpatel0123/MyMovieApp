import { Lightning, Router, Utils } from "@lightningjs/sdk";
import { MenuItemDIY as MenuItem } from "./MenuItem";
// import { ListDIY as List1 } from "./List";
import Background from "../Background";
import Page from "./Page";
import { List } from "@lightningjs/ui";
import ImageCell from "./ImageCell.js";

export default class Sports extends Page {
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

			Lists: {
				x: 100,
				y: 600,
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
			Background: {
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
			},
			Text123: {
				x: 150,
				y: 600,
				text: { text: "Sports List", fontSize: 40 },
			},
			Logo: {
				x: 20,
				y: 10,
				w: 70,
				h: 70,
				src: Utils.asset("./images/logo.png"),
			},
			Content: {
				// visible:false,
				List: { x: 100, y: 700, w: 1740, type: List, direction: "row" },
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

	_getFocused() {
		return this.tag("Menu");
	}

	_setup() {
		const items = [];
		for (let i = 0; i < 10; i++) {
			items.push({
				margin: 15,
				src: Utils.asset(`images/sports/${i}.jpg`),
				type: ImageCell,
				number: i + 1,
			});
		}
		this.tag("List").add(items);
	}

	_init() {
		this._index = 0;
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
					path: "Home",
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
				item: { path: "Movies", lbl: "main", displayColor: 0xffffffff },
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
				item: { path: "Mylist", lbl: "mylist", displayColor: 0xffffffff },
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
				item: { path: "Settings", lbl: "main", displayColor: 0xffffffff },
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
				_handleRight() {
					this._setState("List");
				}
			},
			class Lists extends this {
				$exit() {
					this.tag("Lists");
				}
				_getFocused() {
					return this.tag("Lists").children[this._index];
				}
				_handleUp() {
					this._setState("List");
				}
				_handleLeft() {
					this._setState("Menu");
				}
			},

			class List extends this {
				_getFocused() {
					return this.tag("List");
				}
				_handleLeft() {
					this._setState("Menu");
				}
				_handleEnter() {
					Router.navigate("main", false);
				}
				_handleDown() {
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
	static get header() {
		return "List displayed as Row";
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
