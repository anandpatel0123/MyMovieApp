import { Lightning, Utils } from "@lightningjs/sdk";
import { MenuItemDIY as MenuItem } from "./MenuItem";
import { ListDIY as List } from "./List";
import Button from "../lib/Button";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfUse from "./TemsOfUse";

export default class Settings extends Lightning.Component {
	static getFonts() {
		return [
			{ family: "Regular", url: Utils.asset("fonts/Roboto-Regular.ttf") },
		];
	}

	static _template() {
		return {
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
				visible: true,
			},
			Logo: {
				x: 20,
				y: 10,
				w: 70,
				h: 70,
				src: Utils.asset("./images/logo.png"),
			},
			PrivacyButton: {
				x: 120,
				y: 150,
				someData: "Privacy Policy",
				height: 100,
				width: 350,
				txtColor: 0xff151515,
				myLabel: "settings",
				type: Button,
			},
			TermsButton: {
				x: 120,
				y: 300,
				someData: "Terms and Conditions",
				height: 100,
				width: 350,
				txtColor: 0xff151515,
				myLabel: "terms",
				type: Button,
			},

			PrivacyPolicy: {
				visible: true,
				type: PrivacyPolicy,
			},
			TermsOfUse: {
				visible: false,
				type: TermsOfUse,
			},
			Menu: { x: 20, y: 80, type: List, spacing: 30 },
		};
	}

	_init() {
		this._setState("privacy");
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

	static _states() {
		return [
			class Menu extends this {
				_getFocused() {
					return this.tag("Menu");
				}
				_handleRight() {
					this._setState("privacy");
				}
			},
			class privacy extends this {
				_getFocused() {
					this.tag("PrivacyPolicy").visible = true;
					this.tag("TermsOfUse").visible = false;
					return this.tag("PrivacyButton");
				}
				_handleRight() {
					this._setState("PrivacyPolicy");
				}
				_handleDown() {
					this._setState("TermsButton");
				}
				_handleLeft() {
					this._setState("Menu");
				}
			},
			class TermsButton extends this {
				_getFocused() {
					this.tag("PrivacyPolicy").visible = false;
					this.tag("TermsOfUse").visible = true;
					return this.tag("TermsButton");
				}
				_handleRight() {
					this._setState("TermsOfUse");
				}
				_handleUp() {
					this._setState("privacy");
				}
				_handleLeft() {
					this._setState("Menu");
				}
			},
			class PrivacyPolicy extends this {
				_getFocused() {
					return this.tag("PrivacyPolicy");
				}
				_handleLeft() {
					this._setState("privacy");
				}
			},
			class TermsOfUse extends this {
				_getFocused() {
					return this.tag("TermsOfUse");
				}
				_handleLeft() {
					this._setState("TermsButton");
				}
			},
		];
	}
}
