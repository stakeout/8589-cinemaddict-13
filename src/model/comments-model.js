import Observer from "../utils/observer";

export default class CommentsModel extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(updateType, comments) {
    this._comments = comments;

    this._notify(updateType);
  }

  getComments() {
    return this._comments;
  }

  addComment(update) {
    this._comments = [
      ...this._comments.slice(),
      update
    ];
  }

  deleteComment(id) {
    const index = this._comments.findIndex((comment) => id === comment.id);
    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1)
    ];
  }
}
