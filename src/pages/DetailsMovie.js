import { Img, Lightning, Router, Utils } from "@lightningjs/sdk";
import Button from "../components/Button";
import Background from "../Background";
import { List } from "@lightningjs/ui";

var MovieTitle;
export default class DetailsMovie extends Lightning.Component {
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
					y:-250,
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
					SimilarContent:{
						y:0,
						Text123: {
							x: 1350,
							y: 350,
							text: { text: "Similar Content", fontSize: 45, fontStyle:"bold" },
						},
						Lists: {
							x: 0,
							y: 230,
							zIndex: 3,
							visible:true
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
						x:1400,
						y:-100,
						type: Button,
						label: "Watch Now",
					},
					// Button1: {
					// 	flexItem: { marginTop: 50 },
					// 	type: Button,
					// 	label: "Add to wishlist",
					// },
				},
			},
		};
	}

	_active() {
		this._setState("Button");
		Router.focusPage();
		// this.widgets.menu.visible = true;
		this.application.emit("setItem", this._details);

		this.patch({
			Header: {
				Details: {
					smooth: { x: 40 },
				},
			},
		});

		// this._refocus();
	}

	_init(){
		this._setState("Button");
		this.tag("SimilarContent").y += 700;
		this._index = 0;
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

	set main1(v) {
		this.tag("Lists").children = v;
		let y = 0;
		this.tag("Lists").children.forEach((child) => {
			child.y = y;
			y += child.constructor.height;
		});
	}
	_focus() {
		this.patch({
			Lists: {
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
			Lists: {
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
				_handleUp() {
					this._setState("Lists");
				}
				_handleEnter(){
					Router.navigate("simple",false)
				}
			},
			class Lists extends this {
				_getFocused() {
					this.tag("SimilarContent").y = 0;
					return this.tag("Lists").children[this._index];
				}
				_handleUp() {
					this._setState("Button");
				}
				_handleEnter() {
					Router.navigate(`details/${item.type}/${item.id}`, false);
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
	$firstItemCreated() {
		this._refocus();
	}

	// _getFocused() {
	// 	return this.tag("Lists").children[this._index];
	// }

	// _handleUp() {
	// 	Router.navigate("main", false);
	// }

	// _handleEnter() {
	// 	Router.navigate("simple", false);
	// }

	// _getFocused() {
	// 	return this.tag("Button");
	// }
}

export { MovieTitle };
