import {nanoid} from 'nanoid';
// import {dayjs} from '../utils/common.js';
import SmartView from '../view/smart.js';
import CommentView from '../view/comment.js';
import EmojiesComponent from '../view/add-comment.js';
import {render, RenderPosition} from '../utils/render.js';
import {UpdateType, UserAction} from '../utils/const.js';

export default class CommentsPresenter extends SmartView {
  constructor(commentsWrap, commentsCounter, changeData, commentsModel, popup) {
    super();
    this._popupComponent = popup;
    this._container = commentsWrap;
    this._commentsCounter = commentsCounter;
    this._changeData = changeData;
    this._commentsModel = commentsModel; // вместо коментс модели здесь сейчас мувис модель
    this._emojiesComponent = new EmojiesComponent();

    this._handleAddComment = this._handleAddComment.bind(this);
    this._handleDeleteComment = this._handleDeleteComment.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._messageInputHandler = this._messageInputHandler.bind(this);
    this.restoreHandlers = this.restoreHandlers.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._commentsModel.addObserver(this._handleModelEvent);
  }

  init(movie) {
    this._movie = movie;
    this._comments = movie.comments.slice();
    this._commentsCounter.textContent = movie.comments.length;
    this._renderCommentsList();
    this._renderEmojies();
  }

  _renderComment(comment) {
    this._commentComponent = new CommentView(comment, this._commentsCounter);
    render(this._container.querySelector(`.film-details__comments-list`), this._commentComponent, RenderPosition.BEFOREEND);
    this._commentComponent.setCommentDeleteHandler();
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
    const iconTemplate = `<img src="images/emoji/${this._data.emoji}.png" width="55" height="55" alt="emoji-${this._data.emoji}">`;
    container.innerHTML = iconTemplate;
  }

  _handleModelEvent(updateType, updatedMovieObject) {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        // this._moviePresenter[updatedMovieObject.id].init(updatedMovieObject);
        console.log(`came back to _handleModelEvent`);
        this._clearCommentsList();
        this.init(updatedMovieObject);
        break;
      case UpdateType.MINOR:
        break;
    }
  }

  _emojiClickHandler(evt) {
    console.log(`emoji click`);
    const emoji = evt.target.value;
    evt.preventDefault();
    this.updateData({
      emoji,
    });
    if (this._data.emoji) {
      this._renderEmojiIcon();
    }
  }

  _messageInputHandler(evt) {
    console.log(`input message`);
    evt.preventDefault();
    this.updateData({
      comment: evt.target.value,
    });
  }

  restoreHandlers() {
    console.log(`set handlers`);
    this._emojiesComponent.setEmojiClickHandler(this._emojiClickHandler);
    this._emojiesComponent.setMessageInputHandler(this._messageInputHandler);
    this._emojiesComponent.setAddCommentHandler(this._handleAddComment);
  }

  _handleAddComment(evt) {
    if (evt.ctrlKey && evt.key === `Enter`) {
      this._changeData(
          UserAction.UPDATE,
          UpdateType.PATCH,
          Object.assign(
              {},
              this._movie,
              this._movie.comments.unshift(
                  Object.assign(
                      {},
                      this._data,
                      {
                        id: nanoid(3),
                        author: `Vadim`,
                        dateCreation: new Date()
                      }
                  )
              )
          ));
    }
  }

  _handleDeleteComment() {
    this._changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._movie,
            {
              isWatched: !this._movie.isWatched
            }
        )
    );
  }
}
