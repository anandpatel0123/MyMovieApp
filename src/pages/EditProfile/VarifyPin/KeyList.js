import { Lightning } from "@lightningjs/sdk/index";
import { KeyItem } from "./KeyItem";

export class KeyList extends Lightning.Component {
	set items(items) {
		let keyWidth = 60;
		this.children = items.map((item) => {
			if (item.label === "⌫") {
				keyWidth = 260;
			} else {
				keyWidth = 60;
			}
			return {
				type: KeyItem,
				action: item.label,
				x: item.x * 50,
				y: item.y * 50,
				w: keyWidth,
				item,
			};
		});
	}
	_init() {
		this.index = 0;
	}
	_handleDown() {
		if (this.index <= 0) {
			this.index = 1;
		} else if (this.index >= 1) {
			this.index = 6;
		}
	}
	_handleUp() {
		if (this.index == 6) {
			this.index = 1;
		} else if (this.index == 1) {
			this.index = 0;
		}
	}
	_handleRight() {
		if (this.index >= 0) {
			if (this.index == 5 || this.index == 10 || this.index == 0) {
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
