import { Lightning, Utils, Router, Colors, Pin } from "@lightningjs/sdk";
import ParentalProfile from "./ParentalProfile";
import Button from "../../../lib/Button";
import { KeyList } from "./KeyList";
let Yes = false;
let No = true;
let Pin1,
	Pin2 = "";
let myname = "";
let mypath = "";
export default class Parental extends Lightning.Component {
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
			ParentalProfile: {
				Text: {
					w: 1920,
					y: 125,
					text: {
						text: "Parental Control",
						fontSize: 45,
						fontStyle: "bold",
						textAlign: "center",
					},
				},
				NoPerentalText: {
					x: 820,
					y: 275,
					text: {
						text: "No",
						fontSize: 42,
						textColor: Colors("#696963").get(),
					},
					// text1: { text: "Kids", fontSize: 40 },
				},
				YesPerentalText: {
					x: 1020,
					y: 275,
					text: {
						text: "Yes",
						fontSize: 42,
						textColor: Colors("white").get(),
					},
				},
				SelectRoundRectPerental: {
					x: 900,
					y: 280,
					type: ParentalProfile,
				},
				SelectPerental: {
					x: 940,
					y: 273,
					w: 60,
					h: 60,
					src: Utils.asset("profile/dot.png"),
				},
				SetupPin: {
					w: 1920,
					y: 425,
					text: {
						text: "Set up a 4 digit PIN that will be asked while using any non Kids profile.",
						fontSize: 32,
						fontStyle: "normal",
						textAlign: "center",
						textColor: Colors("#696963").get(),
					},
				},

				PinLines: {
					x: 20,
					y: -100,
					Pin1: {
						x: 650,
						y: 700,
						w: 100,
						h: 5,
						rect: true,
						color: Colors("#919499").get(),
					},
					Pin2: {
						x: 800,
						y: 700,
						w: 100,
						h: 5,
						rect: true,
						color: Colors("#919499").get(),
					},
					Pin3: {
						x: 950,
						y: 700,
						w: 100,
						h: 5,
						rect: true,
						color: Colors("#919499").get(),
					},
					Pin4: {
						x: 1100,
						y: 700,
						w: 100,
						h: 5,
						rect: true,
						color: Colors("#919499").get(),
					},
				},
				ConfirmPin: {
					w: 1875,
					y: 660,
					text: {
						text: "Confirm 4 digit PIN",
						fontSize: 32,
						fontStyle: "normal",
						textAlign: "center",
						textColor: Colors("#696963").get(),
					},
				},
				PinLinesConfirm: {
					x: 20,
					y: 120,
					Pin1: {
						x: 650,
						y: 700,
						w: 100,
						h: 5,
						rect: true,
						color: Colors("#919499").get(),
					},
					Pin2: {
						x: 800,
						y: 700,
						w: 100,
						h: 5,
						rect: true,
						color: Colors("#919499").get(),
					},
					Pin3: {
						x: 950,
						y: 700,
						w: 100,
						h: 5,
						rect: true,
						color: Colors("#919499").get(),
					},
					Pin4: {
						x: 1100,
						y: 700,
						w: 100,
						h: 5,
						rect: true,
						color: Colors("#919499").get(),
					},
				},
				Button: {
					x: 800,
					y: 930,
					someData: "Submit",
					type: Button,
				},
				Pin1: {
					w: 1920,
					h: 1080,

					y: 550,

					text: {
						text: "",
						fontSize: 30,
						FontFace: "Bold",
						textColor: 0xffffffff,
						textAlign: "center",
					},
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
					y: 525,
					x: 708,
					text: {
						text: "",
						fontSize: 50,
						FontFace: "Bold",
						textColor: 0xffffffff,
						textAlign: "center",
					},
				},
				Pin2Text: {
					y: 745,
					x: 708,
					text: {
						text: "",
						fontSize: 50,
						FontFace: "Bold",
						textColor: 0xffffffff,
						textAlign: "center",
					},
				},
			},
		};
	}

	set params(args) {
		myname = args.Name;
		mypath = args.path;
	}
	_init() {
		this.MyPin1Text = "";
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
	$changeText(message, myText, flag) {
		this.MyPin1Text = myText;

		if (flag == false) {
			Pin1 = message;
			this.tag("Pin1Text").patch({
				text: { text: this.MyPin1Text },
			});
		} else if (flag == true) {
			Pin2 = message;
			this.tag("Pin2Text").patch({
				text: { text: this.MyPin1Text },
			});
		} else {
			this.tag("Pin2Text").patch({
				text: { text: "" },
			});
			this.tag("Pin1Text").patch({
				text: { text: "" },
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
			class SubmitButton extends this {
				_getFocused() {
					return this.tag("Button");
				}
				_handleUp() {
					this._setState("Pin2");
				}
				_handleEnter() {
					console.log("Pin1 --> ", Pin1);
					console.log("Pin2 --> ", Pin2);
					if (Pin1 == Pin2 && Pin1.length != 0 && Pin2.length != 0) {
						Router.navigate("editprofile", {
							PIN: Pin1,
							myname,
							mypath,
							flag: true,
						});
					} else {
						this.tag("PinLines").children[0].color = Colors("yellow").get();
						this.tag("PinLines").children[1].color = Colors("yellow").get();
						this.tag("PinLines").children[2].color = Colors("yellow").get();
						this.tag("PinLines").children[3].color = Colors("yellow").get();
						this.tag("PinLinesConfirm").children[0].color =
							Colors("yellow").get();
						this.tag("PinLinesConfirm").children[1].color =
							Colors("yellow").get();
						this.tag("PinLinesConfirm").children[2].color =
							Colors("yellow").get();
						this.tag("PinLinesConfirm").children[3].color =
							Colors("yellow").get();
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
					this._setState("Pin2");
				}
			},
			class Pin2 extends this {
				_getFocused() {
					this.tag("PinLinesConfirm").children[0].color = Colors("white").get();
					this.tag("PinLinesConfirm").children[1].color = Colors("white").get();
					this.tag("PinLinesConfirm").children[2].color = Colors("white").get();
					this.tag("PinLinesConfirm").children[3].color = Colors("white").get();
				}
				_handleEnter() {
					this._setState("Keyboard");
				}
				_handleUp() {
					this.tag("PinLinesConfirm").children[0].color =
						Colors("#919499").get();
					this.tag("PinLinesConfirm").children[1].color =
						Colors("#919499").get();
					this.tag("PinLinesConfirm").children[2].color =
						Colors("#919499").get();
					this.tag("PinLinesConfirm").children[3].color =
						Colors("#919499").get();
					this._setState("Pin1");
				}
				_handleDown() {
					this.tag("PinLinesConfirm").children[0].color =
						Colors("#919499").get();
					this.tag("PinLinesConfirm").children[1].color =
						Colors("#919499").get();
					this.tag("PinLinesConfirm").children[2].color =
						Colors("#919499").get();
					this.tag("PinLinesConfirm").children[3].color =
						Colors("#919499").get();
					this._setState("SubmitButton");
				}
			},
		];
	}
}
