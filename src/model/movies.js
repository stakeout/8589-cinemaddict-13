import Observer from "../utils/observer.js";

export default class Movies extends Observer {
  constructor() {
    super();
    this._movies = [];
  }

  set movies(movies) {
    this._movies = movies.slice();
  }

  get movies() {
    return this._movies;
  }
}
