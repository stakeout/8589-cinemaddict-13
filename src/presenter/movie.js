import MovieView from '../view/card.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../utils/const.js';

import PopupPresenter from './popup.js';

class Movie {
  constructor(container, changeData, moviesModel, commentsModel) {
    this._container = container;
    this._changeData = changeData;
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;
    this._movieComponent = null;

    this._handlePopupOpenClick = this._handlePopupOpenClick.bind(this);
    this._handleIsFavoriteClick = this._handleIsFavoriteClick.bind(this);
    this._handleIsWatchedClick = this._handleIsWatchedClick.bind(this);
    this._handleIsInWatchListClick = this._handleIsInWatchListClick.bind(this);
  }

  init(movie) {
    this._movie = movie;
    this._prevMovieComponent = this._movieComponent;
    this._movieComponent = new MovieView(movie);

    this._setMovieCardHandlers();

    if (this._prevMovieComponent === null) {
      render(this._container.querySelector(`.films-list__container`), this._movieComponent, RenderPosition.BEFOREEND);
      return;
    }
    if (this._container.querySelector(`.films-list__container`).contains(this._prevMovieComponent.getElement())) {
      replace(this._movieComponent, this._prevMovieComponent);
    }
    remove(this._prevMovieComponent);
  }

  _handlePopupOpenClick() {
    const popupPresenter = new PopupPresenter(this._moviesModel, this._commentsModel);
    popupPresenter.init(this._movie, this._changeData);
  }

  _setMovieCardHandlers() {
    this._movieComponent.setMovieCardClickHandler(this._handlePopupOpenClick);

    this._movieComponent.setIsInWatchListClickHandler(this._handleIsInWatchListClick);
    this._movieComponent.setIsWatchedClickHandler(this._handleIsWatchedClick);
    this._movieComponent.setIsFavoriteClickHandler(this._handleIsFavoriteClick);
  }

  _handleIsFavoriteClick() {
    this._changeData(
        UserAction.UPDATE,
        UpdateType.PATCH,
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

  destroy() {
    remove(this._movieComponent);
  }
}

export default Movie;
