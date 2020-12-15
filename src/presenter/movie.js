import MovieView from '../view/card.js';
import PopupView from '../view/film-details-popup.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';

import CommentsPresenter from './comments.js';

// const Mode = {
//   DEFAULT: `DEFAULT`,
//   POPUP: `POPUP`,
// };

export default class Movie {
  constructor(container, changeData) {
    this._container = container;
    this._changeData = changeData;
    // this._changeMode = changeMode;
    this._movieComponent = null;
    this._popupComponent = null;
    // this._mode = Mode.DEFAULT;

    this._handlePopupOpenClick = this._handlePopupOpenClick.bind(this);
    this._handleIsFavoriteClick = this._handleIsFavoriteClick.bind(this);
    this._handleIsWatchedClick = this._handleIsWatchedClick.bind(this);
    this._handleIsInWatchListClick = this._handleIsInWatchListClick.bind(this);
    this._escHandler = this._escHandler.bind(this);
    this._closeBtnHandler = this._closeBtnHandler.bind(this);
  }

  init(movie) {
    this._movie = movie;
    this._comments = movie.comments;
    const prevMovieComponent = this._movieComponent;
    const prevPopupComponent = this._popupComponent;
    this._movieComponent = new MovieView(movie);
    this._popupComponent = new PopupView(movie);

    this._movieComponent.setMovieCardClickHandler(this._handlePopupOpenClick);

    this._movieComponent.setIsInWatchListClickHandler(this._handleIsInWatchListClick);
    this._movieComponent.setIsWatchedClickHandler(this._handleIsWatchedClick);
    this._movieComponent.setIsFavoriteClickHandler(this._handleIsFavoriteClick);
    this._popupComponent.setIsInWatchListClickHandler(this._handleIsInWatchListClick);
    this._popupComponent.setIsWatchedClickHandler(this._handleIsWatchedClick);
    this._popupComponent.setIsFavoriteClickHandler(this._handleIsFavoriteClick);
    this._popupComponent.setCloseBtnClickHandler(this._closeBtnHandler);

    if (prevMovieComponent === null || prevPopupComponent === null) {
      render(this._container.querySelector(`.films-list__container`), this._movieComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._container.querySelector(`.films-list__container`).contains(prevMovieComponent.getElement())) {
      replace(this._movieComponent, prevMovieComponent);
    }
    if (document.body.contains(prevPopupComponent.getElement())) {
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevMovieComponent);
    remove(prevPopupComponent);
  }

  _handlePopupOpenClick() {
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

  // resetView() {
  //   if (this._mode !== Mode.DEFAULT) {
  //     this._renderPopup();
  //   }
  // }

  _renderPopup() {
    document.body.classList.add(`hide-overflow`);
    render(document.body, this._popupComponent, RenderPosition.BEFOREEND);
    this._popupComponent.setIsInWatchListClickHandler(this._handleIsInWatchListClick);
    this._popupComponent.setIsWatchedClickHandler(this._handleIsWatchedClick);
    this._popupComponent.setIsFavoriteClickHandler(this._handleIsFavoriteClick);
    this._popupComponent.setCloseBtnClickHandler(this._closeBtnHandler);
    document.addEventListener(`keydown`, this._escHandler);
    // this._changeMode();
    // this._mode = Mode.POPUP;
    const commentsContainer = this._popupComponent.getElement().querySelector(`.film-details__comments-list`);
    const commentsCounter = this._popupComponent.getElement().querySelector(`.film-details__comments-count`);
    new CommentsPresenter(commentsContainer, commentsCounter).init(this._comments);
  }

  _closePopup() {
    remove(this._popupComponent);
    document.body.classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, this._escHandler);
    // this._mode = Mode.DEFAULT;
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
    remove(this._movieComponent);
    // remove(this._popupComponent);
  }
}
