import CommentView from '../view/comment.js';
import {render, RenderPosition} from '../utils/render.js';

export default class CommentsPresenter {
  constructor(commetsContainer, commentsCounter) {
    this._container = commetsContainer;
    this._commentsCounter = commentsCounter;
  }
  init(comments) {
    this._comments = comments.slice();
    this._commentsCounter.textContent = comments.length;
    this._renderCommentsList();
  }
  _renderComment(comment) {
    this._commentComponent = new CommentView(comment, this._commentsCounter);
    render(this._container, this._commentComponent, RenderPosition.BEFOREEND);
    this._commentComponent.setCommentDeleteHandler();
  }
  _renderCommentsList() {
    this._comments.forEach((comment) => this._renderComment(comment));
  }
}
