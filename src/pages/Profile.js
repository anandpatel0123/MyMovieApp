import { Lightning, Utils, Router, Colors } from "@lightningjs/sdk";
import UserProfile from "./UserProfile";
import Button from "../lib/Button";
let Pin, Path, Name;
export default class Profile extends Lightning.Component {
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
			Text: {
				y: 100,
				w: 1920,
				text: { text: "Who's Watching?", textAlign: "center" },
			},
			Text1: {
				w: 1920,
				h: 1080,
				y: 225,

				text: {
					text: "You can setup up to 5 Profiles for your family or friends.",
					textAlign: "center",
					textColor: Colors("#9ea19c").get(),
					fontSize: 25,
				},
			},
			Profiles: {
				y: 100,
				Profile1: {
					y: 225,
					x: 600,
					Inner1: {
						x: 9,
						y: 9,
						w: 195,
						h: 195,
						visible: true,
						src: Utils.asset("profile/profile1.png"),
						Text: {
							visible: true,

							w: 195,
							y: 225,
							text: { text: "ANAND", textAlign: "center", fontSize: 35 },
						},
					},
					Inner2: {
						w: 75,
						h: 75,
						x: 60,
						y: 40,
						visible: false,
						src: Utils.asset("profile/plus.png"),
						Text: {
							x: -5,
							y: 100,
							text: {
								text: "Add Profile",
								fontSize: 18,
								textAlign: "center",
								textColor: Colors("#696963").get(),
							},
						},
					},
					type: UserProfile,
				},
				Profile2: {
					y: 225,
					x: 850,
					Inner1: {
						x: 9,
						y: 9,
						w: 195,
						h: 195,
						visible: false,
						src: Utils.asset("profile/profile.png"),
						Text: {
							visible: true,
							w: 195,
							y: 225,
							text: { text: "", textAlign: "center", fontSize: 35 },
						},
					},
					Inner2: {
						w: 75,
						h: 75,
						x: 65,
						y: 40,
						visible: true,
						src: Utils.asset("profile/plus.png"),
						Text: {
							x: -5,
							y: 100,
							text: {
								text: "Add Profile",
								fontSize: 18,
								textAlign: "center",
								textColor: Colors("#696963").get(),
							},
						},
					},
					type: UserProfile,
				},
				Profile3: {
					y: 225,
					x: 1100,
					Inner1: {
						x: 9,
						y: 9,
						w: 195,
						h: 195,
						visible: false,
						src: Utils.asset("profile/profile.png"),
						Text: {
							visible: true,
							w: 195,
							y: 225,
							text: { text: "", textAlign: "center", fontSize: 35 },
						},
					},
					Inner2: {
						w: 75,
						h: 75,
						x: 65,
						y: 40,
						visible: true,
						src: Utils.asset("profile/plus.png"),
						Text: {
							x: -5,
							y: 100,
							text: {
								text: "Add Profile",
								fontSize: 18,
								textAlign: "center",
								textColor: Colors("#696963").get(),
							},
						},
					},
					type: UserProfile,
				},
				Profile4: {
					y: 525,
					x: 725,
					Inner1: {
						x: 9,
						y: 9,
						w: 195,
						h: 195,
						visible: false,
						src: Utils.asset("profile/profile.png"),
						Text: {
							visible: true,
							w: 195,
							y: 225,
							text: { text: "", textAlign: "center", fontSize: 35 },
						},
					},
					Inner2: {
						w: 75,
						h: 75,
						x: 65,
						y: 40,
						visible: true,
						src: Utils.asset("profile/plus.png"),
						Text: {
							x: -5,
							y: 100,
							text: {
								text: "Add Profile",
								fontSize: 18,
								textAlign: "center",
								textColor: Colors("#696963").get(),
							},
						},
					},
					type: UserProfile,
				},
				Profile5: {
					y: 525,
					x: 975,
					Inner1: {
						x: 9,
						y: 9,
						w: 195,
						h: 195,
						visible: false,
						src: Utils.asset("profile/profile.png"),
						Text: {
							visible: true,
							w: 195,
							y: 225,
							text: { text: "", textAlign: "center", fontSize: 35 },
						},
					},
					Inner2: {
						w: 75,
						h: 75,
						x: 65,
						y: 40,
						visible: true,
						src: Utils.asset("profile/plus.png"),
						Text: {
							x: -5,
							y: 100,
							text: {
								text: "Add Profile",
								fontSize: 18,
								textAlign: "center",
								textColor: Colors("#696963").get(),
							},
						},
					},
					type: UserProfile,
				},
			},
			Buttons: {
				x: 800,
				y: 900,
				someData: "Edit",
				type: Button,
			},
		};
	}

	set params(args) {
		if (args.path != undefined) {
			this.tag("Profiles").children[this.profileIndex].children[1].patch({
				src: Utils.asset(args.path),
			});
		}
		if (args.Pin != undefined) {
			Pin = args.Pin;
			Name = args.Name;
			Path = args.path;
		}

		if (args.Name != undefined) {
			if (args.Name.length > 0) {
				this.tag("Profiles").children[
					this.profileIndex
				].children[1].visible = true;
				this.tag("Profiles").children[
					this.profileIndex
				].children[2].visible = false;
				this.tag("Profiles").children[
					this.profileIndex
				].children[1].children[0].text.text = args.Name;
			}
		}
	}
	_init() {
		this.profileIndex = 0;
		this.buttonIndex = 0;

		this._setState("Profiles");
	}

	_handleDown() {
		this._setState("Buttons");
	}
	_handleUp() {
		this._setState("Profiles");
	}

	static _states() {
		return [
			class Profiles extends this {
				_handleLeft() {
					if (this.profileIndex > 0) {
						this.profileIndex--;
					}
				}
				_handleRight() {
					if (this.profileIndex < 4) {
						this.profileIndex++;
					}
				}
				_handleEnter() {
					if (
						this.tag("Profiles").children[this.profileIndex].children[1]
							.visible == false
					) {
						Router.navigate("editprofile");
					} else if (Pin != undefined) {
						Router.navigate("varifypin", { Name, Path, Pin });
					} else {
						Router.navigate("main");
					}
				}
				_getFocused() {
					return this.tag("Profiles").children[this.profileIndex];
				}
			},
			class Buttons extends this {
				_getFocused() {
					return this.tag("Buttons");
				}
				_handleEnter() {
					Router.navigate("editprofile", {
						PIndex: "profile/profile" + (this.profileIndex + 1) + ".png",
						Name: this.tag("Profiles").children[this.profileIndex].children[1]
							.children[0].text.text,
					});
				}
			},
		];
	}
}
