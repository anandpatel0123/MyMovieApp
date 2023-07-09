import {
	Splash,
	Main,
	Details,
	Simple,
	Sports,
	Movies,
	Tv,
	Premium,
	WishList,
	TVDetails,
	DetailsMovie,
	Profile,
	EditProfile,
	Settings,
	ChangeAvatar,
	Parental,
	VarifyPin,
} from "../pages";
import { getDetails, getMovies, getTv, getPremium, getPremium1 } from "./api";
import Search from "../SearchPage/SearchPage1";

// import { Tv } from "./models";

export default {
	root: "splash",
	routes: [
		{
			path: "splash",
			component: Splash,
		},
		{
			path: "profile",
			component: Profile,
		},
		{
			path: "editprofile",
			component: EditProfile,
		},
		{
			path: "settings",
			component: Settings,
		},
		{
			path: "changeavatar",
			component: ChangeAvatar,
		},
		{
			path: "parentalControl",
			component: Parental,
		},
		{
			path: "varifypin",
			component: VarifyPin,
		},
		{
			path: "wishlist",
			component: WishList,
			before: async (page) => {
				const main = await getPremium();
				page.main = main;
			},
			widgets: ["Menu"],
		},
		{
			path: "main",
			component: Main,
			before: async (page) => {
				const main = await getMovies();
				const Popular = await getPremium1();
				const Popular1 = await getPremium();
				page.main = main;
				page.popular = Popular;
				page.Popular1 = Popular1;
			},
			widgets: ["Menu"],
		},
		{
			path: "movies",
			component: Movies,
			before: async (page) => {
				const main = await getPremium1();
				page.main = main;
			},
			widgets: ["Menu"],
		},
		{
			path: "sports",
			component: Sports,
			// before: async (page) => {
			//   const main = await getMovies();
			//   page.main = main;
			// },
			widgets: ["Menu"],
		},
		{
			path: "tv",
			component: Tv,
			before: async (page) => {
				const main = await getTv();
				page.main = main;
			},
			widgets: ["Menu"],
		},
		{
			path: "details/:itemType/:itemId",
			component: Details,
			before: async (page, { itemType, itemId }) => {
				const details = await getDetails(itemType, itemId);
				// const main1 = await getPremium1();
				// page.main1 = main1;
				page.details = details;
			},
		},
		{
			path: "detailsmovie/:itemType/:itemId",
			component: DetailsMovie,
			before: async (page, { itemType, itemId }) => {
				const details = await getDetails(itemType, itemId);
				const main1 = await getPremium1();
				page.main1 = main1;
				page.details = details;
			},
		},
		{
			path: "tvdetails/:itemType/:itemId",
			component: TVDetails,
			before: async (page, { itemType, itemId }) => {
				const details = await getDetails(itemType, itemId);
				page.details = details;
			},
		},
		{
			path: "premium",
			component: Premium,
			before: async (page) => {
				const main = await getPremium();
				page.main = main;
			},
			widgets: ["Menu"],
		},

		{
			path: "search",
			component: Search,
			widgets: ["Menu"],
		},
		{
			path: "simple",
			component: Simple,
			widgets: ["Menu", "PlayerMenu", "SubtitleMenu", "SettingsMenu"],
		},
	],
};
