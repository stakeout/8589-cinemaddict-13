import Observer from "../utils/observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._movies = [];
  }

  addComment(updateType, newMovieObject) {
    this._notify(updateType, newMovieObject);
  }

  deleteComment(updateType, update) {
    const index = this._comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting comment`);
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1)
    ];

    this._notify(updateType);
  }

  set movies(movies) {
    this._movies = movies.slice();

    // this._notify(updateType);

  }

  get comments() {
    return this._comments;
  }
}
