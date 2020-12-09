import MovieView from '../view/card.js';
import PopupView from '../view/film-details-popup.js';
import {render, RenderPosition} from '../utils/render.js';

export default class Movie {
  constructor(container) {
    this._container = container;
    this._movieComponent = null;
    this._popupComponent = null;
    this._handlePopupOpenClick = this._handlePopupOpenClick.bind(this);
  }

  init(movie) {
    this._movie = movie;
    this._movieComponent = new MovieView(movie);
    this._popupComponent = new PopupView(movie);

    this._movieComponent.setMovieCardClickHandler(this._handlePopupOpenClick);
    render(this._container.querySelector(`.films-list__container`), this._movieComponent, RenderPosition.BEFOREEND);
  }

  _handlePopupOpenClick() {
    this._popupComponent.renderPopup();
  }
}
