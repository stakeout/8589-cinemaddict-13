// import {nanoid} from 'nanoid';
import SmartView from '../view/smart.js';
import CommentView from '../view/comment.js';
import EmojiesComponent from '../view/add-comment.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {UpdateType, UserAction} from '../utils/const.js';

export default class CommentsPresenter extends SmartView {
  constructor(commentsWrap, commentsCounter, changeData, commentsModel, popup) {
    super();
    this._popupComponent = popup;
    this._container = commentsWrap;
    this._commentsCounter = commentsCounter;
    this._changeData = changeData;
    this._commentsModel = commentsModel;
    this._emojiesComponent = new EmojiesComponent();

    this._handleAddComment = this._handleAddComment.bind(this);
    this._handleDeleteComment = this._handleDeleteComment.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._messageInputHandler = this._messageInputHandler.bind(this);
    this.restoreHandlers = this.restoreHandlers.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._commentsModel.addObserver(this._handleModelEvent);
  }

  init(comments, id) {
    this._data.id = id;
    this._data.date = new Date();
    this._comments = comments.slice();
    this._commentsCounter.textContent = comments.length;
    this._renderCommentsList();
    this._renderEmojies();
  }

  _renderComment(comment) {
    this._commentComponent = new CommentView(comment);
    render(this._container.querySelector(`.film-details__comments-list`), this._commentComponent, RenderPosition.BEFOREEND);
    this._commentComponent.setCommentDeleteHandler(this._handleDeleteComment);
  }

  _clearCommentsList() {
    this._popupComponent.getElement().querySelector(`.film-details__comments-list`).innerHTML = ``;
  }

  _renderCommentsList() {
    this._comments.forEach((comment) => this._renderComment(comment));
  }

  _renderEmojies() {
    this.restoreHandlers();
    render(this._container, this._emojiesComponent, RenderPosition.BEFOREEND);
  }

  _renderEmojiIcon() {
    const container = this._emojiesComponent.getElement().querySelector(`.film-details__add-emoji-label`);
    const iconTemplate = `<img src="images/emoji/${this._data.emotion}.png" width="55" height="55" alt="emoji-${this._data.emoji}">`;
    container.innerHTML = iconTemplate;
  }

  _handleModelEvent(updateType, updatedMovieObject) {
    const {comments, movie: {id}} = updatedMovieObject;
    switch (updateType) {
      case UpdateType.PATCH_COMMENT:
        this._clearCommentsList();
        this.init(comments, id);
        break;
      case UpdateType.MINOR:
        break;
    }
  }

  _emojiClickHandler(evt) {
    const emotion = evt.target.value;
    evt.preventDefault();
    this.updateData({
      emotion,
    });
    if (this._data.emotion) {
      this._renderEmojiIcon();
    }
  }

  _messageInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      comment: evt.target.value,
    });
  }

  restoreHandlers() {
    this._emojiesComponent.setEmojiClickHandler(this._emojiClickHandler);
    this._emojiesComponent.setMessageInputHandler(this._messageInputHandler);
    this._emojiesComponent.setAddCommentHandler(this._handleAddComment);
  }

  _handleAddComment(evt) {
    if (evt.ctrlKey && evt.key === `Enter`) {
      this._changeData(
          UserAction.ADD_COMMENT,
          UpdateType.PATCH_COMMENT,
          this._data
      );
    }
  }
  _removeComment() {
    this._commentsModel.removeObserver(this._handleModelEvent);
    this._commentsCounter.textContent -= 1;
    remove(this._commentComponent);
  }

  _handleDeleteComment({target}) {
    const id = target.dataset.id;
    this._removeComment();
    this._changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.INIT,
        id
    );
  }
}
