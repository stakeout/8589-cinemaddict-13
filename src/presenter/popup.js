import PopupView from '../view/film-details-popup.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';

class PopupPresenter {
  constructor() {
    this._container = document.body;
    this._popupComponent = null;

    this._handleIsFavoriteClick = this._handleIsFavoriteClick.bind(this);
    this._handleIsWatchedClick = this._handleIsWatchedClick.bind(this);
    this._handleIsInWatchListClick = this._handleIsInWatchListClick.bind(this);
    this._escHandler = this._escHandler.bind(this);
    this._closeBtnHandler = this._closeBtnHandler.bind(this);
  }

  init(movie, changeData) {
    this._movie = movie;
    this._changeData = changeData;
    this._prevPopupComponent = this._popupComponent;
    this._popupComponent = new PopupView(movie);

    this._setPopupHandlers();
    this._container.classList.add(`hide-overflow`);
    document.addEventListener(`keydown`, this._escHandler);

    if (this._prevPopupComponent !== null) {
      remove(this._prevPopupComponent);
    }
    render(this._container, this._popupComponent, RenderPosition.BEFOREEND);
  }

  _setPopupHandlers() {
    this._popupComponent.setIsInWatchListClickHandler(this._handleIsInWatchListClick);
    this._popupComponent.setIsWatchedClickHandler(this._handleIsWatchedClick);
    this._popupComponent.setIsFavoriteClickHandler(this._handleIsFavoriteClick);
    this._popupComponent.setCloseBtnClickHandler(this._closeBtnHandler);
  }

  updatePopup(updatedMovie) {
    // debugger
    if (this._popupComponent === null) {
      return;
    }
    this._movie = updatedMovie;
    this._currentPopup = this._popupComponent;
    this._popupComponent = new PopupView(updatedMovie);

    this._setPopupHandlers();

    if (this._container.contains(this._currentPopup.getElement())) {
      replace(this._popupComponent, this._currentPopup);
    }
    remove(this._currentPopup);
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

  // destroy() {
  //   remove(this._popupComponent);
  //   document.body.classList.remove(`hide-overflow`);
  //   document.removeEventListener(`keydown`, this._escHandler);
  // }
}

export default PopupPresenter;