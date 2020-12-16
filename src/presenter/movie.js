import MovieView from '../view/card.js';
// import PopupView from '../view/film-details-popup.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';

// import CommentsPresenter from './comments.js';
import PopupPresenter from './popup.js';

// const Mode = {
//   DEFAULT: `default`,
//   POPUP: `popup`,
// };
const popupPresenter = new PopupPresenter();

class Movie {
  constructor(container, changeData) {
    this._container = container;
    this._changeData = changeData;

    // this._changeMode = changeMode;
    this._movieComponent = null;
    // this._mode = Mode.DEFAULT;

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
  }
  movieUpdate(updatedMovie) {
    this._movie = updatedMovie;
    this._prevMovieComponent = this._movieComponent;
    this._movieComponent = new MovieView(updatedMovie);

    this._setMovieCardHandlers();

    if (this._container.querySelector(`.films-list__container`).contains(this._prevMovieComponent.getElement())) {
      replace(this._movieComponent, this._prevMovieComponent);
    }
    remove(this._prevMovieComponent);
    // update popup
    popupPresenter.updatePopup(updatedMovie);
  }
  _handlePopupOpenClick() {
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

export default Movie;
