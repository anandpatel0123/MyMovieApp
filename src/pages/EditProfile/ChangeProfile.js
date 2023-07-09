import { Lightning, Utils, Router, Colors } from "@lightningjs/sdk";

export default class ChangeProfile extends Lightning.Component {
	static getFonts() {
		return [
			{ family: "Regular", url: Utils.asset("fonts/Roboto-Regular.ttf") },
		];
	}

	static _template() {
		return {
			ChangeProfile: {
				y: 160,
				x: 1020,
				w: 51,
				h: 51,
				smooth: { alpha: 0.7 },
				src: Utils.asset("profile/pen.png"),
			},
		};
	}

	_focus() {
		this.tag("ChangeProfile").patch({
			smooth: { alpha: 1, scale: 1.2 },
		});
	}

	_unfocus() {
		this.tag("ChangeProfile").patch({
			smooth: { alpha: 0.7, scale: 1 },
		});
	}
}
