import { Lightning, Utils, Router, Colors } from "@lightningjs/sdk";
import Button from "../../../lib/Button";
import { KeyList } from "./KeyList";
let Name, Path, Pin, Pin1;
export default class VarifyPin extends Lightning.Component {
	static getFonts() {
		return [
			{ family: "Regular", url: Utils.asset("fonts/Roboto-Regular.ttf") },
		];
	}

	static _template() {
		return {
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
			Text: {
				w: 1920,
				y: 100,
				text: {
					text: "Enter PIN to proceed",
					fontSize: 45,
					fontStyle: "bold",
					textAlign: "center",
				},
			},
			Profile: {
				x: 20,
				ProfileIMG: {
					x: 835,
					y: 250,
					w: 200,
					h: 200,
					src: Utils.asset("profile/profile1.png"),
				},
				NameText: {
					x: 870,
					y: 500,
					text: { text: "ANAND", fontSize: 37 },
				},
				PinText: {
					w: 1850,
					y: 600,
					text: {
						text: "Enter 4 Digit Parental Control PIN",
						fontSize: 30,
						textAlign: "center",
					},
				},
				PinLines: {
					x: -10,
					y: -100,
					Pin1: {
						x: 650,
						y: 900,
						w: 100,
						h: 5,
						rect: true,
						color: Colors("#919499").get(),
					},
					Pin2: {
						x: 800,
						y: 900,
						w: 100,
						h: 5,
						rect: true,
						color: Colors("#919499").get(),
					},
					Pin3: {
						x: 950,
						y: 900,
						w: 100,
						h: 5,
						rect: true,
						color: Colors("#919499").get(),
					},
					Pin4: {
						x: 1100,
						y: 900,
						w: 100,
						h: 5,
						rect: true,
						color: Colors("#919499").get(),
					},
				},
				Button: {
					x: 775,
					y: 930,
					someData: "Get In",
					type: Button,
				},
				Keyboard: {
					rect: true,
					x: 30,
					y: 600,
					w: 625,
					h: 320,
					color: 0x00d2d2d2,
					Keys: { type: KeyList, y: 30, x: 50, mount: 0.5 },
				},
				Pin1Text: {
					y: 730,
					x: 680,
					text: {
						text: "",
						fontSize: 80,
						FontFace: "Bold",
						textColor: 0xffffffff,
						textAlign: "center",
					},
				},
			},
		};
	}

	set params(args) {
		Name = args.Name;
		Path = args.Path;
		Pin = args.Pin;
		console.log("MYPIN", args);
	}

	_init() {
		Pin1 = "";
		this.tag("Keys").items = [
			{ label: "⌫", x: 1, y: 0 },
			{ label: "0", x: 1, y: 1 },
			{ label: "1", x: 2, y: 1 },
			{ label: "2", x: 3, y: 1 },
			{ label: "3", x: 4, y: 1 },
			{ label: "4", x: 5, y: 1 },
			{ label: "5", x: 1, y: 2 },
			{ label: "6", x: 2, y: 2 },
			{ label: "7", x: 3, y: 2 },
			{ label: "8", x: 4, y: 2 },
			{ label: "9", x: 5, y: 2 },
		];
		this._setState("Pin1");
	}
	$changeMessage(signal) {
		switch (signal) {
			case 0:
				this._setState("Pin1");
				break;
			case 1:
				this.focusKeyboard = true;

				break;
			default:
				this.focusKeyboard = true;
		}
	}
	$changeText(message, myText) {
		this.MyPin1Text = myText;
		Pin1 = message;
		if (myText == undefined) {
			this.tag("Pin1Text").patch({
				text: { text: "" },
			});
		} else {
			this.tag("Pin1Text").patch({
				text: { text: this.MyPin1Text + "   " },
			});
		}
	}
	focusKeyboard = true;

	static _states() {
		return [
			class Keyboard extends this {
				_getFocused() {
					if (this.focusKeyboard) {
						return this.tag("Keys");
					}
				}
			},
			class Pin1 extends this {
				_getFocused() {
					this.tag("PinLines").children[0].color = Colors("white").get();
					this.tag("PinLines").children[1].color = Colors("white").get();
					this.tag("PinLines").children[2].color = Colors("white").get();
					this.tag("PinLines").children[3].color = Colors("white").get();
				}
				_handleEnter() {
					this._setState("Keyboard");
				}
				_handleDown() {
					this.tag("PinLines").children[0].color = Colors("#919499").get();
					this.tag("PinLines").children[1].color = Colors("#919499").get();
					this.tag("PinLines").children[2].color = Colors("#919499").get();
					this.tag("PinLines").children[3].color = Colors("#919499").get();
					this._setState("SubmitButton");
				}
			},
			class SubmitButton extends this {
				_getFocused() {
					return this.tag("Button");
				}
				_handleUp() {
					this._setState("Pin1");
				}
				_handleEnter() {
					console.log("Pin1 --> ", Pin1);
					console.log("Pin --> ", Pin);

					if (Pin1 == Pin) {
						Router.navigate("main", {});
					} else {
						this.tag("PinLines").children[0].color = Colors("yellow").get();
						this.tag("PinLines").children[1].color = Colors("yellow").get();
						this.tag("PinLines").children[2].color = Colors("yellow").get();
						this.tag("PinLines").children[3].color = Colors("yellow").get();
					}
				}
			},
		];
	}
}
