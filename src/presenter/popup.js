import PopupView from '../view/film-details-popup.js';
import {UserAction, UpdateType} from '../utils/const.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import CommentsPresenter from './comments.js';

class PopupPresenter {
  constructor(moviesModel, commentsModel) {
    this._container = document.body;
    this._popupComponent = null;
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;

    this._handleIsFavoriteClick = this._handleIsFavoriteClick.bind(this);
    this._handleIsWatchedClick = this._handleIsWatchedClick.bind(this);
    this._handleIsInWatchListClick = this._handleIsInWatchListClick.bind(this);
    this._escHandler = this._escHandler.bind(this);
    this._closeBtnHandler = this._closeBtnHandler.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
  }

  init(movie, changeData) {
    this._movie = movie;
    this._changeData = changeData;
    this._prevPopupComponent = this._popupComponent;
    this._popupComponent = new PopupView(movie);
    const counter = this._popupComponent.getElement().querySelector(`.film-details__comments-count`);
    const commentsWrap = this._popupComponent.getElement().querySelector(`.film-details__comments-wrap`);
    this._emojiesComponent = new CommentsPresenter(
        commentsWrap,
        counter,
        this._changeData,
        this._moviesModel,
        this._popupComponent
    );

    this._setPopupHandlers();
    this._container.classList.add(`hide-overflow`);
    document.addEventListener(`keydown`, this._escHandler);

    if (this._prevPopupComponent !== null) {
      remove(this._prevPopupComponent);
    }
    render(this._container, this._popupComponent, RenderPosition.BEFOREEND);
    this._emojiesComponent.init(movie);
  }

  _handleModelEvent(...rest) {
    const [, newMovie] = rest;
    this._movie = newMovie;
  }

  _setPopupHandlers() {
    this._popupComponent.setIsInWatchListClickHandler(this._handleIsInWatchListClick);
    this._popupComponent.setIsWatchedClickHandler(this._handleIsWatchedClick);
    this._popupComponent.setIsFavoriteClickHandler(this._handleIsFavoriteClick);
    this._popupComponent.setCloseBtnClickHandler(this._closeBtnHandler);
  }

  _closePopup() {
    remove(this._popupComponent);
    this._popupComponent = null;
    document.body.classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, this._escHandler);
  }

  _closeBtnHandler() {
    this._closePopup();
  }

  _escHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._closePopup();
    }
  }

  _handleIsFavoriteClick() {
    this._changeData(
        UserAction.UPDATE,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._movie, // false
            {
              isFavorite: !this._movie.isFavorite
            }
        )
    );
  }
  _handleIsWatchedClick() {
    this._changeData(
        UserAction.UPDATE,
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
  _handleIsInWatchListClick() {
    this._changeData(
        UserAction.UPDATE,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._movie,
            {
              isInWatchList: !this._movie.isInWatchList
            }
        )
    );
  }

  // destroy() {
  //   remove(this._popupComponent);
  //   document.body.classList.remove(`hide-overflow`);
  //   document.removeEventListener(`keydown`, this._escHandler);
  // }
}

export default PopupPresenter;
