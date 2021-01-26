import FilmsModel from "../model/films-model";
import {isOnline} from "../utils/helper";
import {StoreKey} from "../consts";

const STORE_FILMS_NAME = `${StoreKey.FILMS_KEY}-${StoreKey.VERSION}`;
const STORE_COMMENTS_NAME = `${StoreKey.COMMENTS_KEY}-${StoreKey.VERSION}`;
const getSyncedFilms = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.film);
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
        .then((films) => {
          this._store.setItem(STORE_FILMS_NAME, films);
          return films;
        });
    }

    const storedFilms = this._store.getData(STORE_FILMS_NAME) || [];
    this._isSynchronized = false;
    return Promise.resolve(storedFilms);
  }

  getAllComments() {
    const storedFilms = this._store.getData(STORE_FILMS_NAME) || [];
    return Promise.all(storedFilms.map((film) => this.getComments(film)));
  }

  getComments(film) {
    if (isOnline()) {
      return this._api.getComments(film)
        .then((comments) => {
          const storedComments = this._store.getData(STORE_COMMENTS_NAME);
          this._store.setItem(STORE_COMMENTS_NAME, Object.assign({}, storedComments, {[film.id]: comments}));
          return comments;
        });
    }

    const storedComments = this._store.getCommentsByFilmId(STORE_COMMENTS_NAME, film.id) || [];
    return Promise.resolve(storedComments);
  }

  updateMovie(movie) {

    if (isOnline()) {
      return this._api.updateMovie(movie)
        .then((updatedFilm) => {
          this._store.setItem(STORE_FILMS_NAME, [...this._store.getData(STORE_FILMS_NAME), updatedFilm]);
          return updatedFilm;
        });
    }

    const localUpdatedFilm = movie;

    this._isSynchronized = false;

    const allFilms = [...this._store.getData(STORE_FILMS_NAME), Object.assign({}, FilmsModel.adaptToServer(localUpdatedFilm), {offline: true})];

    this._store.setItem(STORE_FILMS_NAME, allFilms);

    return Promise.resolve(localUpdatedFilm);
  }

  addComment(movie, comment) {

    if (isOnline()) {
      return this._api.addComment(movie, comment)
        .then((comments) => {
          this._store.setItem(STORE_COMMENTS_NAME, Object.assign({}, this._store.getData(STORE_COMMENTS_NAME), {movieId: movie.id}));
          return comments;
        });
    }

    return Promise.reject(new Error(`Add comment failed`));
  }


  deleteComment(id) {
    if (isOnline()) {
      return this._api.deleteComment(id)
        .then(() => {
          this._store.remove(STORE_COMMENTS_NAME, id);
        });
    }

    return Promise.reject(new Error(`Delete comment failed`));
  }

  sync() {
    if (isOnline()) {

      const storedFilms = this._store.getData(STORE_FILMS_NAME);

      return this._api.sync(storedFilms)
        .then((response) => {
          storedFilms
            .filter((film) => film.offline)
            .forEach((film) => {
              this._store.remove(STORE_FILMS_NAME, film.id);
            });

          const updatedFilms = getSyncedFilms(response.updated).forEach(FilmsModel.adaptToClient);

          this._store.setItem(STORE_FILMS_NAME, updatedFilms);

          this._isSynchronized = true;

          return Promise.resolve();
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  isSynchronized() {
    return this._isSynchronized;
  }
}
