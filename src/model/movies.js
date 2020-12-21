import Observer from "../utils/observer.js";

export default class Movies extends Observer {
  constructor() {
    super();
    this._movies = [];
  }

  updateMovie(updateType, update) {
    const index = this._movies.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting movie`);
    }
    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  set movies(movies) {
    this._movies = movies.slice();
  }

  get movies() {
    return this._movies;
  }
}
