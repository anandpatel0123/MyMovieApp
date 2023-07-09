import { Lightning, VideoPlayer, Router, Utils } from "@lightningjs/sdk";
// import ErrorScreen from "@/components/player/ErrorScreen.js";
import { videos } from "@/lib/helpers";
import Button from "@/components/player/Button";
import ProgressBar from "@/components/player/ProgressBar";
import MenuItem from "../widgets/MenuItem";
import { MovieTitle } from "./Details";
const bgColor = 0xff212121;
const buttons = [
	{
		icon: "play",
		action: "$playPause",
		ref: "PlayPause",
	},
];
const interfaceTimeout = 5000;

export default class Simple extends Lightning.Component {
	static _template() {
		return {
			w: 1920,
			h: 1080,
			color: bgColor,
			rect: true,
			// Text: {
			//   x: (w) => w / 2,
			//   y: (h) => h / 2,
			//   mount: 0.5,
			//   // text: {
			//   //   text: "Simple example",
			//   //   textColor: 0xffffffff,
			//   // },
			// },
			// ErrorScreen: {
			//   type: ErrorScreen,
			//   alpha: 0,
			// },

			Ui: {
				x: 100,
				//y: 950,
				w: (w) => w - 250,
				//mountY: 1,
				Items: {
					// mountY: 0.5,
					y: -1000,
					flex: { direction: "row" },
					Back: {
						y: 200,
						type: MenuItem,
						w: 50,
						h: 50,
						src: Utils.asset("./icons/back.png"),
					},

					Replay: {
						x: 100,
						y: 200,
						type: MenuItem,
						w: 55,
						h: 55,
						src: Utils.asset("./icons/replay.png"),
					},
					Subtitles: {
						x: 1350,
						y: 180,
						type: MenuItem,
						w: 80,
						h: 80,
						src: Utils.asset("./icons/subtitle.png"),
					},
					Settings: {
						x: 1450,
						y: 195,
						type: MenuItem,
						w: 50,
						h: 50,
						src: Utils.asset("./icons/settings.png"),
					},
				},
				BackText: {
					x: 130,
					y: -730,
					visible: false,
					text: { fontSize: 20, lineHeight: 30, text: "Play From\nBeginning" },
				},
				SubtitleText: {
					x: 1425,
					y: -730,
					visible: false,
					text: { fontSize: 20, lineHeight: 30, text: "Subtitle & Audio" },
				},
				SettingsText: {
					x: 1625,
					y: -730,
					visible: false,
					text: { fontSize: 20, lineHeight: 30, text: "Settings" },
				},
				Text: {
					x: 550,

					y: -800,
					text: {
						textAlign: "center",
						verticalAlign: "top",
						lineHeight: 70,
					},
				},
				Buttons: {
					//w: (w) => w - 250,
					y: 45,
				},
				ProgressBar: {
					w: (w) => w - 250,
					x: 100,
					y: 70,
					type: ProgressBar,
				},
			},
		};
	}

	_init() {
		this._index = 0;
		this._index1 = 0;
		this._videoIndex = 0;
		// Initially video control interface is visible
		this._interfaceVisible = true;
		// This variable will store timeout id for the interface hide functionality
		this._timeout = null;
		// Fill Ui.Buttons tag with buttons from the buttons array
		this.tag("Ui.Buttons").children = buttons.map((button, index) => ({
			type: Button,
			icon: button.icon,
			action: button.action,
			ref: button.ref || "Button" + index,
			flexItem: { marginRight: 20 },
		}));
	}

	_handleEnter() {
		// Router.restoreFocus();
		if (this._index1 == 0) {
			Router.navigate("main");
		} else if (this._index1 == 2) {
			Router.focusWidget("SubtitleMenu");
		} else if (this._index1 == 3) {
			Router.focusWidget("SettingsMenu");
		} else if (this._index1 == 1) {
			VideoPlayer.seek(0);
		}
	}

	get activeItem() {
		return this.tag("Items").children[this._index1];
	}

	_handleUp() {
		this._setState("MyItems");
	}
	_handleDown() {
		this._index1 = 0;
		this._setState("MyProgress");
	}

	static _states() {
		return [
			class MyItems extends this {
				_getFocused() {
					return this.activeItem;
				}

				_handleLeft() {
					if (this._index1 > 0) {
						this._index1--;
					}
					if (this._index1 === 0) {
						this.tag("Ui.BackText").visible = false;
						this.tag("Ui.SubtitleText").visible = false;
						this.tag("Ui.SettingsText").visible = false;
					} else if (this._index1 == 1) {
						this.tag("Ui.BackText").visible = true;
						this.tag("Ui.SubtitleText").visible = false;
						this.tag("Ui.SettingsText").visible = false;
					} else if (this._index1 == 2) {
						this.tag("Ui.BackText").visible = false;
						this.tag("Ui.SubtitleText").visible = true;
						this.tag("Ui.SettingsText").visible = false;
					} else if (this._index1 == 3) {
						this.tag("Ui.BackText").visible = false;
						this.tag("Ui.SubtitleText").visible = false;
						this.tag("Ui.SettingsText").visible = true;
					}
				}

				_handleRight() {
					if (this._index1 < this.tag("Items").children.length - 1) {
						this._index1++;
					}

					if (this._index1 === 0) {
						this.tag("Ui.BackText").visible = false;
						this.tag("Ui.SubtitleText").visible = false;
						this.tag("Ui.SettingsText").visible = false;
					} else if (this._index1 == 1) {
						this.tag("Ui.BackText").visible = true;
						this.tag("Ui.SubtitleText").visible = false;
						this.tag("Ui.SettingsText").visible = false;
					} else if (this._index1 == 2) {
						this.tag("Ui.BackText").visible = false;
						this.tag("Ui.SubtitleText").visible = true;
						this.tag("Ui.SettingsText").visible = false;
					} else if (this._index1 == 3) {
						this.tag("Ui.BackText").visible = false;
						this.tag("Ui.SubtitleText").visible = false;
						this.tag("Ui.SettingsText").visible = true;
					}
				}
			},
			class MyProgress extends this {
				_getFocused() {
					this.tag("Ui.BackText").visible = false;
					this.tag("Ui.SubtitleText").visible = false;
					this.tag("Ui.SettingsText").visible = false;
					return this.tag("Ui.Buttons").children[this._index];
				}
				_handleRight() {
					VideoPlayer.skip(5);
				}
				_handleLeft() {
					VideoPlayer.skip(-5);
				}
			},
		];
	}

	_handleRight() {
		VideoPlayer.skip(5);
	}
	_handleLeft() {
		VideoPlayer.skip(-5);
	}

	_toggleInterface(visible) {
		this.patch({
			Ui: {
				smooth: {
					y: [visible ? 910 : 960],
					alpha: [visible ? 1 : 0],
				},
			},
		});
		this.tag("Ui")
			.transition("y")
			.on("finish", () => {
				this._interfaceVisible = visible;
			});
		if (visible) {
			this._setInterfaceTimeout();
		}
		// Router.focusWidget("PlayerMenu");
	}

	_setInterfaceTimeout() {
		// Clear timeout if it already exists
		if (this._timeout) {
			clearTimeout(this._timeout);
		}

		this._timeout = setTimeout(() => {
			this._toggleInterface(false);
			Router.focusPage();
		}, interfaceTimeout);
	}

	_active() {
		//this.tag("text").text = MovieTitle;
		// this.patch({
		// 	Text: { text: { text: MovieTitle } },
		// });
		if (MovieTitle != undefined) {
			this.tag("Text").text.text = MovieTitle;
		}
		// Show video interface
		//Router.focusWidget("PlayerMenu");
		this._toggleInterface(true);

		// Set this object to receive VideoPlayer events
		VideoPlayer.consumer(this);
	}

	_inactive() {
		// this.patch({
		// 	Text: { text: { text: MovieTitle } },
		// });
		// Cleanup player and ui

		VideoPlayer.clear();
		this.patch({
			color: bgColor,
			Text: {
				alpha: 1,
			},
			ErrorScreen: {
				alpha: 0,
			},
		});
		this.playing = false;
		this.tag("Ui.ProgressBar").duration = 0;
		this.tag("Ui.ProgressBar").currentTime = 0;
	}

	_focus() {
		// Show video interface

		this._toggleInterface(true);
	}

	// Capture every key and toggle interface. If it is visible, pass event to event handlers
	_captureKey() {
		this._toggleInterface(true);

		return !this._interfaceVisible;
	}

	// _handleLeft() {
	//   this._index = Math.max(0, this._index - 1);
	// }

	// _handleRight() {
	//   this._index = Math.min(
	//     this.tag("Ui.Buttons").children.length - 1,
	//     this._index + 1
	//   );
	// }

	// _handleUp() {
	// 	Router.focusWidget("PlayerMenu");
	// }

	_getFocused() {
		return this.tag("Ui.Buttons").children[this._index];
	}

	set playing(v) {
		this.tag("Ui.Buttons.PlayPause").icon = v === true ? "pause" : "play";
	}

	// Button actions
	$playPause(next = false) {
		// If next is true, clear VideoPlayer (which also sets src to null)
		next === true && VideoPlayer.clear();
		if (!VideoPlayer.src || VideoPlayer.src === "error-video-url") {
			// Player first or second video of the videos list, with a chance of 33% to show error screen
			this._videoIndex = (this._videoIndex + 1) % 2;
			const nextVideo =
				Math.random() > 0.66 ? "error-video-url" : videos[this._videoIndex];
			VideoPlayer.open(nextVideo);
		} else {
			VideoPlayer.playPause();
		}
	}

	$stop() {
		VideoPlayer.clear();
	}

	// Hooks for VideoPlayer events
	$videoPlayerPlaying() {
		this.patch({
			smooth: {
				color: [0x00000000],
			},
			Text: {
				smooth: {
					alpha: [0],
				},
			},
			ErrorScreen: {
				smooth: {
					alpha: [0],
				},
			},
		});
		this.playing = true;
	}

	$videoPlayerPause() {
		this.playing = false;
	}

	$videoPlayerAbort() {
		this.patch({
			smooth: {
				color: [bgColor],
			},
			Text: {
				smooth: {
					alpha: [1],
				},
			},
		});
		this.playing = false;
		this.tag("Ui.ProgressBar").duration = 0;
		this.tag("Ui.ProgressBar").currentTime = 0;
	}

	$videoPlayerEnded() {
		// When current video ends, open next video
		this.$playPause(true);
	}

	$videoPlayerTimeUpdate() {
		this.tag("Ui.ProgressBar").currentTime = VideoPlayer.currentTime;
	}

	$videoPlayerLoadedMetadata() {
		this.tag("Ui.ProgressBar").duration = VideoPlayer.duration;
	}

	$videoPlayerError() {
		this.patch({
			ErrorScreen: {
				smooth: {
					alpha: [1],
				},
			},
			// Text: {
			//   smooth: {
			//     alpha: [0],
			//   },
			// },
		});
	}
}
