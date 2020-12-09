import PopupView from '../view/film-details-popup.js';
import CommentView from '../view/comment.js';
import {render, RenderPosition} from '../utils/render.js';

export default class PopupPresenter {
  constructor() {
    this._container = document.body;
    this._popupComponent = null;
    this._escHandler = this._escHandler.bind(this);
    this._closeBtnHandler = this._closeBtnHandler.bind(this);
  }

  init(movie) {
    this._movie = movie;

    if (this._popupComponent !== null) {
      this._closePopup();
    }
    this._popupComponent = new PopupView(movie);
    this._renderPopup();
  }

  _escHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._closePopup();
    }
  }

  _closeBtnHandler() {
    this._closePopup();
  }

  _renderPopup() {

    this._container.appendChild(this._popupComponent.getElement());
    document.body.classList.add(`hide-overflow`);

    this._renderCommentsList();
    this._popupComponent.setCloseBtnClickHandler(this._closeBtnHandler);
    document.addEventListener(`keydown`, this._escHandler);
  }

  _closePopup() {
    this._container.removeChild(this._popupComponent.getElement());
    document.body.classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, this._escHandler);
    this._popupComponent = null;
  }

  _renderCommentsList() {
    const comments = this._movie.comments;
    const counter = this._popupComponent.getElement().querySelector(`.film-details__comments-count`);
    counter.textContent = comments.length;
    const commentsListElement = this._popupComponent.getElement().querySelector(`.film-details__comments-list`);
    commentsListElement.innerHTML = ``;

    comments.forEach((comment) => {
      const commentComponent = new CommentView(comment);
      render(commentsListElement, commentComponent, RenderPosition.BEFOREEND);
      commentComponent.setCommentDeleteHandler();
    });
  }
}
