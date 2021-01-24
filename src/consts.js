const emotions = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`,
];

const WatchedFilmsCount = {
  MIN: 10,
  MIDDLE: 20,
};

const SortType = {
  DEFAULT: `default`,
  DATE: `sort-by-date`,
  RATING: `sort-by-rating`,
};

const UserAction = {
  UPDATE_FILM: `UPDATE_FILM`,
  ADD_COMMENT: `ADD_COMMENT`,
  DELETE_COMMENT: `DELETE_COMMENT`,
};

const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  INIT: `INIT`,
};

const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
};

const MenuStats = {
  MOVIES: `MOVIES`,
  STATISTICS: `STATISTICS`,
};
const StoreKey = {
  FILMS_KEY: `cinema-films-localstorage`,
  COMMENTS_KEY: `cinema-comments-localstorage`,
  VERSION: `v13.0`,
};

const FilmListHeader = {
  NO_MOVIES: {
    title: `There are no movies in our database`,
    isExtra: false,
    isHidden: false,
  },
  LOADING: {
    title: `Loading...`,
    isExtra: false,
    isHidden: false,
  },
  ALL_MOVIES: {
    title: `All movies. Upcoming`,
    isExtra: false,
    isHidden: true,
  },
  TOP_RATED: {
    title: `Top rated`,
    isExtra: true,
    isHidden: false,
  },
  MOST_COMMENTED: {
    title: `Most commented`,
    isExtra: true,
    isHidden: false,
  },
};

const FilmCount = {
  PER_STEP: 5,
  EXTRA_MIN: 0,
  EXTRA_MAX: 2,
};

export {SortType, UserAction, UpdateType, FilterType, MenuStats, WatchedFilmsCount, StoreKey, FilmListHeader, FilmCount, emotions};
