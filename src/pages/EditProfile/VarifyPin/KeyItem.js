import { Lightning } from "@lightningjs/sdk/index";

var message1 = [];

var myText1 = "";

export class KeyItem extends Lightning.Component {
	static _template() {
		return {
			rect: true,
			w: 70,
			h: 60,
			color: 0xff474747,
			alpha: 1,
			Label: {
				x: 15,
				y: 15,
			},
		};
	}
	_init() {
		this.patch({
			Label: {
				text: {
					text: this.item.label,
					fontSize: 28,
					textColor: 0xffffffff,
				},
			},
		});
	}
	_focus() {
		this.color = 0xffffffff;
		this.tag("Label").color = 0xff474747;
	}
	_unfocus() {
		this.color = 0xff474747;
		this.tag("Label").color = 0xffffffff;
	}
	_getFocused() {
		return this.tag("Keys");
	}
	_handleEnter() {
		switch (this.item.label) {
			case "⌫":
				message1 = [];

				myText1 = "";

				this.fireAncestors("$changeText", message1.join().replace(/,/g, ""));
				break;
			case "Space":
				if (message1.length <= 12) {
					message1.push(" ");
				}
				break;
			default:
				if (message1.length <= 3) {
					message1.push(this.item.label);
					myText1 += "*" + "     ";

					this.fireAncestors(
						"$changeText",
						message1.join().replace(/,/g, ""),
						myText1,
						false
					);
				}
		}
	}
}
