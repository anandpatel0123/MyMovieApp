import { Lightning, Utils, Router, Colors } from "@lightningjs/sdk";
import SelectAvatar from "./SelectAvatar";
import Button from "../../lib/Button";
let path = "profile/profile1.png";
export default class ChangeAvatar extends Lightning.Component {
	static getFonts() {
		return [
			{ family: "Regular", url: Utils.asset("fonts/Roboto-Regular.ttf") },
		];
	}

	static _template() {
		return {
			Choose: {
				w: 1920,
				y: 100,
				text: {
					text: "Choose Your Avatar",
					textAlign: "center",
					fontSize: 40,
					fontStyle: "bold",
				},
			},
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

			ChangeAvatar: {
				x: 250,
				Profile1: {
					x: 200,
					y: 250,
					w: 150,
					h: 150,
					type: SelectAvatar,
					src: Utils.asset("profile/profile1.png"),
				},
				Profile2: {
					x: 400,
					y: 250,
					w: 150,
					h: 150,
					type: SelectAvatar,
					src: Utils.asset("profile/profile2.png"),
				},
				Profile3: {
					x: 600,
					y: 250,
					w: 150,
					h: 150,
					type: SelectAvatar,
					src: Utils.asset("profile/profile3.png"),
				},
				Profile4: {
					x: 800,
					y: 250,
					w: 150,
					h: 150,
					type: SelectAvatar,
					src: Utils.asset("profile/profile4.png"),
				},
				Profile5: {
					x: 1000,
					y: 250,
					w: 150,
					h: 150,
					type: SelectAvatar,
					src: Utils.asset("profile/profile5.png"),
				},
				Profile6: {
					x: 200,
					y: 450,
					w: 150,
					h: 150,
					type: SelectAvatar,
					src: Utils.asset("profile/profile6.png"),
				},
				Profile7: {
					x: 400,
					y: 450,
					w: 150,
					h: 150,
					type: SelectAvatar,
					src: Utils.asset("profile/profile7.png"),
				},
				Profile8: {
					x: 600,
					y: 450,
					w: 150,
					h: 150,
					type: SelectAvatar,
					src: Utils.asset("profile/profile8.png"),
				},
				Profile9: {
					x: 800,
					y: 450,
					w: 150,
					h: 150,
					type: SelectAvatar,
					src: Utils.asset("profile/profile9.png"),
				},
				Profile10: {
					x: 1000,
					y: 450,
					w: 150,
					h: 150,
					type: SelectAvatar,
					src: Utils.asset("profile/profile10.png"),
				},
				Profile11: {
					x: 200,
					y: 650,
					w: 150,
					h: 150,
					type: SelectAvatar,
					src: Utils.asset("profile/profile11.png"),
				},
				Profile12: {
					x: 400,
					y: 650,
					w: 150,
					h: 150,
					type: SelectAvatar,
					src: Utils.asset("profile/profile12.png"),
				},
				Profile13: {
					x: 600,
					y: 650,
					w: 150,
					h: 150,
					type: SelectAvatar,
					src: Utils.asset("profile/profile13.png"),
				},
				Profile14: {
					x: 800,
					y: 650,
					w: 150,
					h: 150,
					type: SelectAvatar,
					src: Utils.asset("profile/profile14.png"),
				},
				Profile15: {
					x: 1000,
					y: 650,
					w: 150,
					h: 150,
					type: SelectAvatar,
					src: Utils.asset("profile/profile15.png"),
				},
			},
			AddButton: {
				x: 775,
				y: 900,
				someData: "Add",
				type: Button,
			},
		};
	}

	_init() {
		this._index = 0;
		this._setState("ChangeAvatar");
		//console.log(this.tag("ChangeAvatar").children[this._index]);
	}

	static _states() {
		return [
			class ChangeAvatar extends this {
				_getFocused() {
					return this.tag("ChangeAvatar").children[this._index];
				}
				_handleLeft() {
					if (this._index != 0) {
						this._index -= 1;
						return this.tag("ChangeAvatar").children[this._index];
					}
				}
				_handleRight() {
					if (this._index != 14) {
						this._index += 1;
						return this.tag("ChangeAvatar").children[this._index];
					}
				}
				_handleDown() {
					this._setState("AddButton");
				}
			},
			class AddButton extends this {
				_getFocused() {
					this.PIndex = "Profile" + (this._index + 1);

					this.tag(this.PIndex).patch({
						smooth: { alpha: 1 },
					});
					return this.tag("AddButton");
				}
				_handleUp() {
					this._setState("ChangeAvatar");
				}
				_handleEnter() {
					path = "profile/profile";
					path = path + (this._index + 1 + ".png");
					console.log(path);
					Router.navigate("editprofile", { path });
				}
			},
		];
	}
}
export { path };
