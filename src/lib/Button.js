import { Lightning } from "@lightningjs/sdk";

export default class Button extends Lightning.Component {
	static _template() {
		return {
			flex: {},
			Background: {
				w: 300,
				h: 100,
				flex: {},
				rtt: true,
				shader: { type: Lightning.shaders.RoundedRectangle, radius: 14 },
				rect: true,
				color: 0xff404249,

				transitions: {
					color: {
						duration: 0.6,
						timingFunction: "cubic-bezier(0.20, 1.00, 0.30, 1.00)",
					},
					scale: {
						duration: 0.6,
						timingFunction: "cubic-bezier(0.20, 1.00, 0.30, 1.00)",
					},
				},
				Label: {
					// flexItem: {
					// 	//marginLeft: 80,
					// 	marginRight: 80,
					// 	marginTop: 15,
					// 	marginBottom: 10,
					// },
					w: 300,
					text: {
						text: "Edit",
						fontFace: "SourceSansPro-Regular",
						fontSize: 32,
						textAlign: "center",
						// textColor: 0xff151515,
					},
					transitions: {
						color: {
							duration: 0.6,
							timingFunction: "cubic-bezier(0.20, 1.00, 0.30, 1.00)",
						},
						scale: {
							duration: 0.6,
							timingFunction: "cubic-bezier(0.20, 1.00, 0.30, 1.00)",
						},
					},
				},
			},
		};
	}

	_focus() {
		this.patch({
			Background: {
				smooth: { color: 0xffffffff },
				Label: {
					smooth: { color: 0xff151515 },
				},
			},
		});
	}

	_unfocus() {
		this.patch({
			Background: {
				smooth: { color: 0xff404249 },
				Label: {
					smooth: { color: 0xffffffff },
				},
			},
		});
	}
	_init() {
		this.tag("Label").text.text = this.someData;
		if (this.myLabel == "settings") {
			this.tag("Background").w = this.width;
			this.tag("Background").h = this.height;
			// this.tag("Background").color = 0xffffffff;
			// this.tag("Label").text.textColor = 0xff151515;
			this.tag("Label").w = this.width;
			this.tag("Label").text.fontSize = 37;
			this.tag("Label").flexItem.marginTop = 20;
		} else {
			this.tag("Background").w = this.width;
			this.tag("Background").h = this.height;
			// this.tag("Background").color = 0xffffffff;
			// this.tag("Label").text.textColor = 0xff151515;
			this.tag("Label").w = this.width;
			this.tag("Label").text.fontSize = 35;
			this.tag("Label").flexItem.marginTop = 10;
		}
	}
}
