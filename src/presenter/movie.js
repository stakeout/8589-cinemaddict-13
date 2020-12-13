import MovieView from '../view/card.js';
import PopupPresenter from './popup.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';

export default class Movie {
  constructor(container, changeData) {
    this._container = container.querySelector(`.films-list__container`);
    this._changeData = changeData;
    this._movieComponent = null;

    this._handlePopupOpenClick = this._handlePopupOpenClick.bind(this);
    this._handleIsFavoriteClick = this._handleIsFavoriteClick.bind(this);
    this._handleIsWatchedClick = this._handleIsWatchedClick.bind(this);
    this._handleIsInWatchListClick = this._handleIsInWatchListClick.bind(this);
  }

  init(movie) {
    this._movie = movie;
    const prevMovieComponent = this._movieComponent;
    this._movieComponent = new MovieView(movie);

    this._movieComponent.setMovieCardClickHandler(this._handlePopupOpenClick);

    this._movieComponent.setIsInWatchListClickHandler(this._handleIsInWatchListClick);
    this._movieComponent.setIsWatchedClickHandler(this._handleIsWatchedClick);
    this._movieComponent.setIsFavoriteClickHandler(this._handleIsFavoriteClick);

    if (prevMovieComponent === null) {
      render(this._container, this._movieComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._container.contains(prevMovieComponent.getElement())) {
      replace(this._movieComponent, prevMovieComponent);
    }

    remove(prevMovieComponent);
  }

  _handlePopupOpenClick() {
    this._popupPresenter = new PopupPresenter(this._changeData);
    this._popupPresenter.init(this._movie);
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
  }
}
