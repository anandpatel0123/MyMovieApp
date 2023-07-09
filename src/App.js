import { Utils, Router } from "@lightningjs/sdk";
import routes from "./lib/routes";
import { init as initApi } from "./lib/api";
import { Menu, SubtitleMenu, SettingsMenu } from "./widgets";
export default class App extends Router.App {
	static getFonts() {
		return [
			{ family: "Regular", url: Utils.asset("fonts/Roboto-Regular.ttf") },
			{ family: "Fresca", url: Utils.asset("fonts/Fresca-Regular.ttf") },
			{
				family: "Londrina",
				url: Utils.asset("fonts/LondrinaSolid-Regular.ttf"),
			},
			{
				family: "SourceSansPro",
				url: Utils.asset("fonts/SourceSansPro-Regular.ttf"),
			},
		];
	}
	_setup() {
		initApi(this.stage);
		Router.startRouter(routes, this);
	}

	static _template() {
		return {
			...super._template(),
			Widgets: {
				// this hosts all the widgets
				Menu: {
					type: Menu,
				},
				SubtitleMenu: {
					type: SubtitleMenu,
				},
				SettingsMenu: {
					type: SettingsMenu,
				},
			},
		};
	}
}
