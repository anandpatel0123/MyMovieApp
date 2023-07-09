import { Lightning, Utils, Router, Colors } from "@lightningjs/sdk";

export default class SelectAvatar extends Lightning.Component {
	static getFonts() {
		return [
			{ family: "Regular", url: Utils.asset("fonts/Roboto-Regular.ttf") },
		];
	}

	static _template() {
		return {
			smooth: { alpha: 0.5 },
		};
	}

	_focus() {
		this.patch({
			smooth: { alpha: 1, scale: 1.2 },
		});
	}

	_unfocus() {
		this.patch({
			smooth: { alpha: 0.5, scale: 1 },
		});
	}
}
