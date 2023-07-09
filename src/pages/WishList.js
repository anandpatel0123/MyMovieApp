import { Lightning, Utils, Router } from "@lightningjs/sdk";
import Background from "../Background";
import { ListDIY as List } from "./List";
import { MenuItemDIY as MenuItem } from "./MenuItem";

export default class WishList extends Lightning.Component {
	static _template() {
		return {
			Background: {
				type: Background,
			},
			Lists: {
				x: 150,
				y: 80,
				zIndex: 3,
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
			// 	src: Utils.asset("./images/menu/profile.png"),
			// },
			// Text: {
			// 	x: 200,
			// 	y: 500,

			// 	text: { text: "My List", fontSize: 40 },
			// },
			Menu: { x: 20, y: 80, visible: true, type: List, spacing: 30 },
		};
	}

	_init() {
		this._setState("Lists");
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
			},
			class Lists extends this {
				$exit() {
					this.tag("Lists");
				}
				_getFocused() {
					return this.tag("Lists").children[this._index];
				}
				_handleUp() {
					this._setState("Menu");
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
