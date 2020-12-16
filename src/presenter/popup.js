import PopupView from '../view/film-details-popup.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';

export default class PopupPresenter {
  constructor(changeData, currentMode) {
    this._container = document.body;
    this._changeData = changeData;
    this._popupComponent = null;

    this._handleIsFavoriteClick = this._handleIsFavoriteClick.bind(this);
    this._handleIsWatchedClick = this._handleIsWatchedClick.bind(this);
    this._handleIsInWatchListClick = this._handleIsInWatchListClick.bind(this);
    this._escHandler = this._escHandler.bind(this);
    this._closeBtnHandler = this._closeBtnHandler.bind(this);
  }

  init(movie) {
    console.log(`ini popup`);
    this._movie = movie;
    this._prevPopupComponent = this._popupComponent;
    this._popupComponent = new PopupView(movie);

    this._setPopupHandlers();
    this._container.classList.add(`hide-overflow`);
    document.addEventListener(`keydown`, this._escHandler);

    if (this._prevPopupComponent === null) {
      render(this._container, this._popupComponent, RenderPosition.BEFOREEND);
      // console.log(`render popup`);
      return;
    }
  }
  _setPopupHandlers() {
    this._popupComponent.setIsInWatchListClickHandler(this._handleIsInWatchListClick);
    this._popupComponent.setIsWatchedClickHandler(this._handleIsWatchedClick);
    this._popupComponent.setIsFavoriteClickHandler(this._handleIsFavoriteClick);
    this._popupComponent.setCloseBtnClickHandler(this._closeBtnHandler);
  }

  updatePopup(updatedMovie) {
    console.log(`popup updating`);
    this._movie = updatedMovie;
    this._prevPopupComponent = this._popupComponent;
    this._popupComponent = new PopupView(updatedMovie);

    this._setPopupHandlers();

    if (document.body.contains(this._prevPopupComponent.getElement())) {
      replace(this._popupComponent, this._prevPopupComponent);
    }
    remove(this._prevPopupComponent);
    console.log(`popup updated`);
  }

  _closePopup() {
    remove(this._popupComponent);
    document.body.classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, this._escHandler);
    // this._mode = Mode.DEFAULT;
  }
  _closeBtnHandler() {
    this._closePopup();
  }
  _escHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this.destroy();
    }
  }
  _closeBtnHandler() {
    this.destroy();
  }

  _handleIsFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._movie,
            {
              isFavorite: !this._movie.isFavorite
            }
        )
    );
  }
  _handleIsWatchedClick() {
    this._changeData(
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
        Object.assign(
            {},
            this._movie,
            {
              isInWatchList: !this._movie.isInWatchList
            }
        )
    );
  }

  destroy() {
    remove(this._popupComponent);
    document.body.classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, this._escHandler);
  }
}
