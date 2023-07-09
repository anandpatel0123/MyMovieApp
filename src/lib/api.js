import { Container, Details } from "./models";
import { Item, List } from "../components";

const apiKey = `7aae88a20d41b4f84ff26c4c22f60738`;
const listComponents = new Map();
const itemComponents = new Map();

let stage;
let genres;

listComponents.set("movie", List);
listComponents.set("tv", List);

itemComponents.set("movie", Item);
itemComponents.set("tv", Item);

export const init = (stageInstance) => {
  stage = stageInstance;
};

export const getMovies = async () => {
  const movies = await _getLatest("movie");
  const models = [movies];
  console.log("list of movies",models);
  return _lists(models);
};

export const getTv = async () => {
  const tv = await _getLatest("tv");
  const models = [tv];
  return _lists(models);
};
export const getPremium = async () => {
	const movies = await _getPremium("movie");

	const models = [movies];
  // console.log("list of movies",models);
	return _lists(models);
};
export const getPremium1 = async () => {
	const movies = await _getPremium1("movie");

	const models = [movies];
	return _lists(models);
};

export const getDetails = (type, id) => {
  return _get(`/${type}/${id}`).then((response) => {
    return new Details(response);
  });
};

const _getGenres = async () => {
  const movie = await _get(`/genre/movie/list`).then((response) => {
    return response.genres;
  });

  const tv = await _get(`/genre/tv/list`).then((response) => {
    return response.genres;
  });

  return [...movie, ...tv];
};

export const setGenres = (data) => {
  genres = data;
};

const _getLatest = async (type) => {
  if (!genres) {
    genres = await _getGenres();
  }

  return _get(`/${type}/top_rated`).then((response) => {
    return new Container(response, type, genres);
  });
};

const _getPremium = async (type) => {
	if (!genres) {
		genres = await _getGenres();
	}

	return _get(`/${type}/upcoming`).then((response) => {
		return new Container(response, type, genres);
	});
};

const _getPremium1 = async (type) => {
	if (!genres) {
		genres = await _getGenres();
	}

	return _get(`/${type}/now_playing`).then((response) => {
		return new Container(response, type, genres);
	});
};

const _get = (url, params) => {
  let params_str = `?api_key=${apiKey}`;

  for (let key in params) {
    if (params.hasOwnProperty(key)) {
      params_str += "&" + key + "=" + encodeURIComponent(params[key]);
    }
  }

  return fetch(`https://api.themoviedb.org/3${url}${params_str}`, {
    Accept: "application/json",
  })
    .then((response) => {
      if (!response.ok) throw "Response not ok";
      return response.json();
    })
    .catch((error) => {
      console.error("Error loading " + url, error);
      throw error;
    });
};

const _lists = (models = []) => {
  if (!Array.isArray(models)) {
    models = [models];
  }
  return models.map((list) => {
    return stage.c({
      type: listComponents.get(list.type),
      itemConstruct: itemComponents.get(list.type),
      items: list.items,
    });
  });
};
