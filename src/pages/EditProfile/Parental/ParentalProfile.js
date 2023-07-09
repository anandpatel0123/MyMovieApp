import { Lightning, Utils, Router, Colors } from "@lightningjs/sdk";

export default class ParentalProfile extends Lightning.Component {
	static getFonts() {
		return [
			{ family: "Regular", url: Utils.asset("fonts/Roboto-Regular.ttf") },
		];
	}

	static _template() {
		return {
			ParentalProfile: {
				texture: Lightning.Tools.getRoundRect(
					80,
					40,
					18,
					4,
					Colors("#696963").get(),
					true,
					Colors("#696963").get()
				),
			},
		};
	}

	_focus() {
		this.tag("ParentalProfile").patch({
			texture: Lightning.Tools.getRoundRect(
				80,
				35,
				18,
				4,
				0xffffffff,
				true,
				Colors("#696963").get()
			),
		});
	}

	_unfocus() {
		this.tag("ParentalProfile").patch({
			texture: Lightning.Tools.getRoundRect(
				80,
				35,
				18,
				4,
				Colors("#696963").get(),
				true,
				Colors("#696963").get()
			),
		});
	}
}
