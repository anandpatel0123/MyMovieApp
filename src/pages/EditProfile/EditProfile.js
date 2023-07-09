import { Lightning, Utils, Router, Colors } from "@lightningjs/sdk";
import Button from "../../lib/Button";
import { KeyList } from "../KeyList";
import KidsProfile from "./KidsProfile";
import ParentalProfile from "./ParentalProfile";
import ChangeProfile from "./ChangeProfile";
let path = "profile/profile1.png";
let Name = "";
let SelectKids = false;
let SelectAdults = true;
let SeletParentalYes = false;
let SeletParentalNo = true;
let Pin;
let flag;
export default class EditProfile extends Lightning.Component {
	static getFonts() {
		return [
			{ family: "Regular", url: Utils.asset("fonts/Roboto-Regular.ttf") },
		];
	}

	static _template() {
		return {
			w: 1920,
			h: 1080,
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
			TextProfile: {
				w: 1920,
				h: 1080,
				y: 50,
				text: { text: "Add Profile", textAlign: "center", fontSize: 45 },
			},

			ProfileImg: {
				y: 175,
				w: 200,
				h: 200,
				x: 850,
				src: Utils.asset(path),
			},
			EditProfile: {
				type: ChangeProfile,
			},

			Text2: {
				w: 1920,
				h: 1080,
				y: 475,
				text: {
					text: "Enter name",
					fontSize: 25,
					textAlign: "center",
					textColor: Colors("#919499").get(),
				},
			},
			InputField: {
				w: 450,
				h: 2,
				x: 725,
				y: 600,
				color: Colors("#919499").get(),
				rect: true,
			},
			SearchText: {
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

			AdultsText: {
				x: 775,
				y: 675,
				Adults: true,
				text: {
					text: "Adults",
					fontSize: 40,
					textColor: Colors("white").get(),
				},
				// text1: { text: "Kids", fontSize: 40 },
			},
			KidsText: {
				x: 1025,
				y: 675,

				text: {
					text: "Kids",
					fontSize: 40,
					textColor: Colors("#696963").get(),
				},
				// text1: { text: "Kids", fontSize: 40 },
			},

			SelectRoundRectKids: {
				x: 915,
				y: 685,
				type: KidsProfile,
			},

			SelectAdultKids: {
				x: 915,
				y: 685,
				w: 40,
				h: 40,
				src: Utils.asset("profile/dot.png"),
			},

			ParentalControl: {
				w: 1870,
				h: 1080,
				y: 775,
				text: {
					text: "Enable Parental Control?",
					textAlign: "center",
					fontSize: 30,
					textColor: Colors("#696963").get(),
				},
			},

			NoPerentalText: {
				x: 800,
				y: 850,
				text: {
					text: "No",
					fontSize: 35,
					textColor: Colors("white").get(),
				},
				// text1: { text: "Kids", fontSize: 40 },
			},
			YesPerentalText: {
				x: 1000,
				y: 850,
				text: {
					text: "Yes",
					fontSize: 35,
					textColor: Colors("#696963").get(),
				},
			},

			SelectRoundRectPerental: {
				x: 880,
				y: 860,
				type: ParentalProfile,
			},

			SelectAdultKidsPerental: {
				x: 880,
				y: 860,
				w: 40,
				h: 40,
				src: Utils.asset("profile/dot.png"),
			},

			AddButton: {
				visible: true,
				x: 775,
				y: 950,
				someData: "Add",
				type: Button,
			},
			NextButton: {
				visible: false,
				x: 775,
				y: 950,
				someData: "Next",
				type: Button,
			},

			Keyboard: {
				rect: true,
				x: 200,
				y: 142,
				w: 625,
				h: 320,
				color: 0x00d2d2d2,
				Keys: { type: KeyList, y: 20, x: 20, mount: 0.5 },
			},
		};
	}
	set params(args) {
		if (args.flag != undefined) {
			flag = args.flag;
			this._setState("AddButton");
		}
		if (args.path != undefined) {
			path = args.path;
			this.tag("ProfileImg").patch({
				src: Utils.asset(path),
			});
		} else {
			this.tag("ProfileImg").patch({
				src: Utils.asset(args.PIndex),
			});
			this.tag("SearchText").patch({
				text: { text: args.Name },
			});
			Name = args.Name;
		}
		if (args.PIN != undefined) {
			Pin = args.PIN;
			Name = args.myname;
			path = args.Path;
			this.tag("ProfileImg").patch({
				src: Utils.asset(args.mypath),
			});
			this.tag("SearchText").patch({
				text: { text: args.myname },
			});
		}
	}

	_init() {
		this.tag("ProfileImg").patch({
			src: Utils.asset(path),
		});
		this.tag("Keys").items = [
			{ label: "Space", x: 0, y: 0 },
			{ label: "⌫", x: 3, y: 0 },
			{ label: "A", x: 0, y: 1 },
			{ label: "B", x: 1, y: 1 },
			{ label: "C", x: 2, y: 1 },
			{ label: "D", x: 3, y: 1 },
			{ label: "E", x: 4, y: 1 },
			{ label: "F", x: 5, y: 1 },
			{ label: "G", x: 0, y: 2 },
			{ label: "H", x: 1, y: 2 },
			{ label: "I", x: 2, y: 2 },
			{ label: "J", x: 3, y: 2 },
			{ label: "K", x: 4, y: 2 },
			{ label: "L", x: 5, y: 2 },
			{ label: "M", x: 0, y: 3 },
			{ label: "N", x: 1, y: 3 },
			{ label: "O", x: 2, y: 3 },
			{ label: "P", x: 3, y: 3 },
			{ label: "Q", x: 4, y: 3 },
			{ label: "R", x: 5, y: 3 },
			{ label: "S", x: 0, y: 4 },
			{ label: "T", x: 1, y: 4 },
			{ label: "U", x: 2, y: 4 },
			{ label: "V", x: 3, y: 4 },
			{ label: "W", x: 4, y: 4 },
			{ label: "X", x: 5, y: 4 },
			{ label: "Y", x: 0, y: 5 },
			{ label: "Z", x: 1, y: 5 },
			{ label: "0", x: 2, y: 5 },
			{ label: "1", x: 3, y: 5 },
			{ label: "2", x: 4, y: 5 },
			{ label: "3", x: 5, y: 5 },
			{ label: "4", x: 0, y: 6 },
			{ label: "5", x: 1, y: 6 },
			{ label: "6", x: 2, y: 6 },
			{ label: "7", x: 3, y: 6 },
			{ label: "8", x: 4, y: 6 },
			{ label: "9", x: 5, y: 6 },
		];
		this._setState("Keyboard");
	}
	$changeMessage(signal) {
		switch (signal) {
			case 0:
				this._setState("EditProfile");
				break;
			case 1:
				this.focusKeyboard = true;

				break;
			default:
				this.focusKeyboard = true;
		}
	}
	$changeText(message) {
		Name = message;
		this.searchText = message;

		this.tag("SearchText").patch({
			text: { text: message },
		});
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
			class EditProfile extends this {
				_getFocused() {
					return this.tag("EditProfile");
				}
				_handleDown() {
					this._setState("AdultKids");
				}
				_handleLeft() {
					this._setState("Keyboard");
				}
				_handleEnter() {
					Router.navigate("changeavatar", false);
				}
			},
			class AdultKids extends this {
				_getFocused() {
					return this.tag("SelectRoundRectKids");
				}
				_handleUp() {
					this._setState("EditProfile");
				}

				_handleDown() {
					this._setState("ParentalControl");
				}
				_handleEnter() {
					if (SelectKids == false) {
						this.tag("SelectAdultKids").setSmooth("x", 960);
						this.tag("AdultsText").text.textColor = Colors("#696963").get();
						this.tag("KidsText").text.textColor = Colors("white").get();
						SelectKids = true;
						SelectAdults = false;
					} else if (SelectAdults == false) {
						this.tag("SelectAdultKids").setSmooth("x", 915);
						this.tag("AdultsText").text.textColor = Colors("white").get();
						this.tag("KidsText").text.textColor = Colors("#696963").get();
						SelectKids = false;
						SelectAdults = true;
					}
				}
			},
			class ParentalControl extends this {
				_getFocused() {
					return this.tag("SelectRoundRectPerental");
				}
				_handleUp() {
					this._setState("AdultKids");
				}
				_handleDown() {
					if (SeletParentalNo == false) {
						this._setState("NextButton");
					} else {
						this._setState("AddButton");
					}
				}
				_handleEnter() {
					if (SeletParentalYes == false) {
						this.tag("SelectAdultKidsPerental").setSmooth("x", 930);
						this.tag("NoPerentalText").text.textColor = Colors("#696963").get();
						this.tag("YesPerentalText").text.textColor = Colors("white").get();
						SeletParentalYes = true;
						SeletParentalNo = false;
						this.tag("AddButton").visible = false;
						this.tag("NextButton").visible = true;
					} else if (SeletParentalNo == false) {
						this.tag("SelectAdultKidsPerental").setSmooth("x", 880);
						this.tag("NoPerentalText").text.textColor = Colors("white").get();
						this.tag("YesPerentalText").text.textColor =
							Colors("#696963").get();
						SeletParentalYes = false;
						SeletParentalNo = true;
						this.tag("AddButton").visible = true;
						this.tag("NextButton").visible = false;
					}
				}
			},
			class AddButton extends this {
				_getFocused() {
					this.tag("AddButton").visible = true;
					this.tag("NextButton").visible = false;
					return this.tag("AddButton");
				}
				_handleUp() {
					this.tag("InputField").color = Colors("#919499").get();
					this._setState("ParentalControl");
				}
				_handleEnter() {
					if (Name.length == 0) {
						this.tag("InputField").color = Colors("red").get();
					} else {
						console.log("PIN = ", Pin);
						Router.navigate("profile", { Name, path, Pin });
					}
				}
			},
			class NextButton extends this {
				_getFocused() {
					this.tag("AddButton").visible = false;
					this.tag("NextButton").visible = true;
					return this.tag("NextButton");
				}
				_handleUp() {
					this.tag("InputField").color = Colors("#919499").get();
					this._setState("ParentalControl");
				}
				_handleEnter() {
					if (Name.length == 0) {
						this.tag("InputField").color = Colors("red").get();
					} else {
						console.log("Name = ", Name.length);
						Router.navigate("parentalControl", { Name, path });
					}
				}
			},
		];
	}
}
