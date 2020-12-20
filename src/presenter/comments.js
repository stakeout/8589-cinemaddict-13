import CommentView from '../view/comment.js';
import EmojiesComponent from '../view/add-comment.js';
import {render, RenderPosition} from '../utils/render.js';

export default class CommentsPresenter {
  constructor(commentsWrap, commentsCounter) {
    this._container = commentsWrap;
    this._commentsCounter = commentsCounter;
  }
  init(comments) {
    this._comments = comments.slice();
    this._commentsCounter.textContent = comments.length;
    this._renderCommentsList();
    this._renderEmojies();
  }
  _renderComment(comment) {
    this._commentComponent = new CommentView(comment, this._commentsCounter);
    render(this._container.querySelector(`.film-details__comments-list`), this._commentComponent, RenderPosition.BEFOREEND);
    this._commentComponent.setCommentDeleteHandler();
  }
  _renderCommentsList() {
    this._comments.forEach((comment) => this._renderComment(comment));
  }
  _renderEmojies() {
    this._emojiesComponent = new EmojiesComponent();
    this._emojiesComponent.restoreHandlers();
    render(this._container, this._emojiesComponent, RenderPosition.BEFOREEND);
  }
}
