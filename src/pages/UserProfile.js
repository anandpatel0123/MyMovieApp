import { Lightning, Utils, Router, Colors } from "@lightningjs/sdk";

export default class UserProfile extends Lightning.Component {
	static getFonts() {
		return [
			{ family: "Regular", url: Utils.asset("fonts/Roboto-Regular.ttf") },
		];
	}

	static _template() {
		return {
			Profile: {
				texture: Lightning.Tools.getRoundRect(
					205,
					205,
					25,
					6,
					0xff212121,
					false,
					0xff212121
				),
			},
		};
	}

	_focus() {
		this.tag("Profile").patch({
			texture: Lightning.Tools.getRoundRect(
				205,
				205,
				25,
				6,
				0xffffffff,
				true,
				0xff212121
			),
		});
	}

	_unfocus() {
		this.tag("Profile").patch({
			texture: Lightning.Tools.getRoundRect(
				205,
				205,
				25,
				6,
				0xff212121,
				true,
				0xff212121
			),
		});
	}
}
