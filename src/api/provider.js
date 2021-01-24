import FilmsModel from "../model/films-model";
import {isOnline} from "../utils/helper";
import {StoreKey} from "../consts";

const STORE_FILMS_NAME = `${StoreKey.FILMS_KEY}-${StoreKey.VERSION}`;
const STORE_COMMENTS_NAME = `${StoreKey.COMMENTS_KEY}-${StoreKey.VERSION}`;
const getSyncedFilms = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.film);
};

/*
const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};
*/

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

/*
export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._store.setItems(items);
          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());

    return Promise.resolve(storeFilms.map(FilmsModel.adaptToClient));
  }

  getAllComments() {
    const storeFilms = Object.values(this._store.getItems());
    return Promise.all(storeFilms.map((film) => this.getComments(film)));
  }

  updateFilm(film) {
    if (isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setItem(updatedFilm.id, FilmsModel.adaptToServer(updatedFilm));
          return updatedFilm;
        });
    }

    this._store.setItem(film.id, FilmsModel.adaptToServer(Object.assign({}, film)));

    return Promise.resolve(film);
  }

  addTask(task) {
    if (isOnline()) {
      return this._api.addTask(task)
        .then((newTask) => {
          this._store.setItem(newTask.id, TasksModel.adaptToServer(newTask));
          return newTask;
        });
    }

    return Promise.reject(new Error(`Add task failed`));
  }

  deleteTask(task) {
    if (isOnline()) {
      return this._api.deleteTask(task)
        .then(() => this._store.removeItem(task.id));
    }

    return Promise.reject(new Error(`Delete task failed`));
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const createdFilms = getSyncedFilms(response.created);
          const updatedFilms = getSyncedFilms(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdFilms, ...updatedFilms]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
*/
}
