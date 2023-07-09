import { Lightning } from "@lightningjs/sdk/index";
import { KeyItem } from "./KeyItem";

export class KeyList extends Lightning.Component {
	set items(items) {
		let keyWidth = 60;
		this.children = items.map((item) => {
			if (item.label === "Space" || item.label === "⌫") {
				keyWidth = 190;
			} else {
				keyWidth = 60;
			}
			return {
				type: KeyItem,
				action: item.label,
				x: item.x * 65,
				y: item.y * 65,
				w: keyWidth,
				item,
			};
		});
	}
	_init() {
		this.index = 0;
	}
	_handleDown() {
		if (this.index <= 1) {
			this.index = 2;
		} else if (this.index >= 2 && this.index < 32) {
			this.index += 6;
		}
	}
	_handleUp() {
		if (this.index >= 8) {
			this.index -= 6;
		} else if (this.index <= 1) {
			this.index = 0;
		} else if (this.index < 8) {
			this.index = 1;
		}
	}
	_handleRight() {
		if (this.index < 38) {
			if (
				this.index == 1 ||
				this.index == 7 ||
				this.index == 13 ||
				this.index == 19 ||
				this.index == 25 ||
				this.index == 31 ||
				this.index == 37
			) {
				this.fireAncestors("$changeMessage", 0);
			} else {
				this.index++;
			}
			//console.log("Right", this.index);
		}
	}
	_handleLeft() {
		if (this.index > 0) {
			this.index--;
		} else {
			this.index = 0;
		}
	}
	_getFocused() {
		return this.children[this.index];
	}
}
