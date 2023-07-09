import { Lightning, Router, Utils } from "@lightningjs/sdk";
import MenuItem from "./MenuItem";

export default class Menu extends Lightning.Component {
	static _template() {
		return {
			rect: true,
			w: 500,
			h: 1920,
			color: 0xff212121,
			x: -550,
			alpha: 0.9,
			transitions: {
				x: {
					duration: 0.3,
					timingFunction: "cubic-bezier(0.17, 0.9, 0.32, 1.3)",
				},
				w: {
					duration: 0.3,
					timingFunction: "cubic-bezier(0.17, 0.9, 0.32, 1.3)",
				},
			},
			Logo: {
				x: 113,
				y: 23,
				w: 100,
				h: 100,
				src: Utils.asset("./images/logo.png"),
			},
			Items: {
				y: 550,
				mountY: 0.5,
				flex: { direction: "column" },
				Home: {
					x: 200,
					type: MenuItem,
					label: "Home",
					pageId: "main",
					SRC: {
						x: -80,
						y: 15,
						w: 50,
						h: 50,
						src: Utils.asset("./images/menu/home.png"),
					},
				},
				Movies: {
					x: 200,
					type: MenuItem,
					label: "Movies",
					pageId: "movies",
					SRC: {
						x: -80,
						y: 15,
						w: 50,
						h: 50,
						src: Utils.asset("./images/menu/movies.png"),
					},
				},
				TV_Shows: {
					x: 200,
					type: MenuItem,
					label: "TV Shows",
					pageId: "tv",
					SRC: {
						x: -80,
						y: 15,
						w: 50,
						h: 50,
						src: Utils.asset("./images/menu/tv.png"),
					},
				},
				Search: {
					x: 200,
					type: MenuItem,
					label: "Search",
					pageId: "search",
					SRC: {
						x: -80,
						y: 15,
						w: 50,
						h: 50,
						src: Utils.asset("./images/menu/search.png"),
					},
				},
				Sports: {
					x: 200,
					type: MenuItem,
					label: "Sports",
					pageId: "sports",
					SRC: {
						x: -80,
						y: 15,
						w: 50,
						h: 50,
						src: Utils.asset("./images/menu/sports.png"),
					},
				},
				Mylist: {
					x: 200,
					type: MenuItem,
					label: "My List",
					pageId: "wishlist",
					SRC: {
						x: -80,
						y: 15,
						w: 50,
						h: 50,
						src: Utils.asset("./images/menu/mylist.png"),
					},
				},
				Membership: {
					x: 200,
					type: MenuItem,
					label: "Premium",
					pageId: "premium",
					SRC: {
						x: -80,
						y: 15,
						w: 50,
						h: 50,
						src: Utils.asset("./images/menu/premium.png"),
					},
				},
				Settings: {
					x: 200,
					type: MenuItem,
					label: "Settings",
					pageId: "settings",
					SRC: {
						x: -80,
						y: 15,
						w: 50,
						h: 50,
						src: Utils.asset("./images/menu/settings.png"),
					},
				},
			},
		};
	}

	_init() {
		this._index = 0;
	}

	_focus() {
		this.patch({
			smooth: {
				x: -100,
			},
		});

		this.application.emit("blurContent", { amount: 3, scale: 1.2 });
	}

	_unfocus() {
		this.patch({
			smooth: {
				x: -550,
			},
		});

		this.application.emit("blurContent", { amount: 0, scale: 1 });
	}

	_handleUp() {
		if (this._index > 0) {
			this._index--;
		}
	}

	_handleDown() {
		if (this._index < this.tag("Items").children.length - 1) {
			this._index++;
		}
	}

	_handleRight() {
		Router.focusPage();
	}

	_handleEnter() {
		Router.restoreFocus();
		Router.navigate(this.activeItem.pageId);
	}

	get activeItem() {
		return this.tag("Items").children[this._index];
	}

	_getFocused() {
		return this.activeItem;
	}
}
