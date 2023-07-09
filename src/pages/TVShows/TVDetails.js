import { Img, Lightning, Router, Utils } from "@lightningjs/sdk";
import Button from "../../components/Button";
import Background from "../../Background";
import Page from "../Page";
import ImageCell from "../ImageCell";
import { List } from "@lightningjs/ui";

var MovieTitle;
export default class Details extends Page {
	static _template() {
		return {
			// x: 68,
			// y: 300,
			Background: {
				type: Background,
			},
			flex: { direction: "column" },
			Header: {
				x: 68,
				y: 300,
				flex: {},
				// Poster: {
				//   flexItem: { marginRight: 40 },
				//   w: 300,
				//   h: 450,
				//   shader: { type: Lightning.shaders.RoundedRectangle, radius: 16 },
				//   // Image: {
				//   //   w: (w) => w,
				//   //   h: (h) => h,
				//   // },
				// },
				Details: {
					flex: { direction: "column" },
					x: 90,
					y:-200,
					transitions: {
						x: {
							duration: 1,
							timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)",
						},
					},
					Year: {
						text: { fontSize: 32, fontFace: "SourceSansPro-Regular" },
					},
					Title: {
						text: {
							fontSize: 64,
							fontFace: "SourceSansPro-Bold",
							wordWrapWidth: 600,
							maxLines: 2,
							lineHeight: 74,
						},
					},
					Overview: {
						color: 0xff7b7b7b,
						text: {
							fontSize: 24,
							fontFace: "SourceSansPro-Regular",
							wordWrapWidth: 960,
							lineHeight: 38,
						},
					},
					Button: {
						flexItem: { marginTop: 30 },
						type: Button,
						label: "Season1",
					},
					Button1: {
						flexItem: { marginTop: 50 },
						x:300,
						y:-122,
						type: Button,
						label: "Season2",
					},
					Content: {
						// Text123: {
						// 	x: 150,
						// 	y: 1200,
						// 	text: { text: "Watch In Your Language", fontSize: 40 },
						// },
						visible: false,
						Text: {
							x: 50,
							y: 0,
							text: { text: "Episodes 1-8", fontSize: 40 },
						},
						List: { x: 0, y: 100, w: 1740, type: List, direction: "row" },
						
					},
					Content1: {
						// Text123: {
						// 	x: 150,
						// 	y: 1200,
						// 	text: { text: "Watch In Your Language", fontSize: 40 },
						// },
						visible: false,
						Text1: {
							x: 50,
							y: 0,
							text: { text: "Episodes 1-8", fontSize: 40 },
						},
						List1: { x: 0, y: 100, w: 1740, type: List, direction: "row" },
						
					},
				},
			},
		};
	}

	_setup() {
		const items1 = [];
		for (let i = 0; i < 6; i++) {
			items1.push({
				margin: 15,
				src: Utils.asset(`images/season/${i}.jpg`),
				type: ImageCell,
			});
		}
		this.tag("List").add(items1);

		const items = [];
		for (let i = 0; i < 6; i++) {
			items.push({
				margin: 15,
				src: Utils.asset(`images/season2/${i}.jpg`),
				type: ImageCell,
			});
		}
		this.tag("List1").add(items);
	}

	_active() {
		// this.widgets.Menu1.visible = true;
		this.application.emit("setItem", this._details);

		this.patch({
			Header: {
				Details: {
					smooth: { x: 40 },
				},
			},
		});

		this._refocus();
	}
	_init(){
		this._setState("Button");
	}

	// _inactive() {
	//   this.tag("Details").setSmooth("x", 90);
	// }

	set details(v) {
		this._details = v;
		// const image = getImgUrl(this._details.poster, 500);
		MovieTitle = this._details.title;
		this.patch({
			Header: {
				// Poster: {
				//   Image: {
				//     texture: Img(image).contain(300, 450),
				//   },
				// },
				Details: {
					Year: {
						text: { text: this._details.releaseDate.getFullYear() },
					},
					Title: {
						text: { text: this._details.title },
					},
					Overview: {
						text: { text: this._details.overview },
					},
				},
			},
		});
	}
	// _getFocused() {
	// 	return this.tag("Button");
	// }
	_focus() {
		this.patch({
			Button: {
				smooth: {
					y: [
						560,
						{
							duration: 0.2,
							timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)",
						},
					],
				},
			},
		});
	}

	_unfocus() {
		this.patch({
			Button: {
				smooth: {
					y: [
						600,
						{
							duration: 0.4,
							timingFunction: "cubic-bezier(0.20, 1.00, 0.80, 1.00)",
						},
					],
				},
			},
		});
	}
	static _states() {
		return [
			class Button extends this {
				_getFocused() {
					return this.tag("Button");
				}
				_handleRight() {
					this._setState("Button1");
				}
				_handleEnter() {
					this.tag("Content").visible = true
					this.tag("Content1").visible = false
					this._setState("List");
				}
				// _handleRight() {
				// 	this._setState("List");
				// }
			},
			class Button1 extends this {
				_getFocused() {
					return this.tag("Button1")
				}
				_handleLeft() {
					this._setState("Button");
				}
				_handleEnter() {
					this.tag("Content").visible = false
					this.tag("Content1").visible = true
					this._setState("List1");
				}
				
			},
			class List extends this {
				_getFocused() {
					this.tag("Content").visible = true;
					return this.tag("List");
				}
				_handleEnter() {
					Router.navigate("simple", false);
				}
				_handleUp() {
					// this.tag("Content").visible = false;
					this._setState("Button");
				}
			},

			class List1 extends this {
				_getFocused() {
					this.tag("Content").visible = true;
					return this.tag("List1");
				}
				_handleEnter() {
					Router.navigate("simple", false);
				}
				_handleUp() {
					// this.tag("Content").visible = false;
					this._setState("Button1");
				}
			},

			// class List extends this {
			// 	_getFocused() {
			// 		return this.tag("List");
			// 	}
			// 	_handleLeft() {
			// 		this._setState("Menu");
			// 	}
			// 	_handleEnter() {
			// 		Router.navigate("tv",false);
			// 	}
			// 	_handleDown() {
			// 		this._setState("Lists");
			// 	}
			// },
		];
	}


	// _handleUp() {
	// 	this.tag("Button");
	// }
	// _handleDown() {
	// 	this.tag("Button1");
	// }

	// _handleEnter() {
	// 	Router.navigate("simple", false);
	// }

	
}

export { MovieTitle };
