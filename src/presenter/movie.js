import MovieView from '../view/card.js';
import PopupPresenter from './popup.js';
import {render, RenderPosition, remove} from '../utils/render.js';

const popup = new PopupPresenter();

export default class Movie {
  constructor(container) {
    this._container = container;
    this._movieComponent = null;
    this._handlePopupOpenClick = this._handlePopupOpenClick.bind(this);
  }

  init(movie) {
    this._movie = movie;
    this._movieComponent = new MovieView(movie);

    this._movieComponent.setMovieCardClickHandler(this._handlePopupOpenClick);
    render(this._container.querySelector(`.films-list__container`), this._movieComponent, RenderPosition.BEFOREEND);
  }

  _handlePopupOpenClick() {
    popup.init(this._movie);
  }

  destroy() {
    remove(this._movieComponent);
  }
}
