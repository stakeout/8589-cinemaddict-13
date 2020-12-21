import Observer from "../utils/observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  set comments(comments) {
    this._comments = comments.slice();
  }

  get comments() {
    return this._comments;
  }
}
