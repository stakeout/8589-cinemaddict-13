import AbstractView from "./abstract";
import {helpersDate, getDurationMovie} from "../utils/helper";

const MAX_STR_LENGTH = 140;

const replaceStrEndWithDots = (str) => {
  return (str.length > MAX_STR_LENGTH)
    ? str.substring(0, MAX_STR_LENGTH - 1).trim() + `...`
    : str;
};

const getActiveClass = (key) => {
  return key
    ? `film-card__controls-item--active`
    : ``;
};

const createCardTemplate = (card) => {
  const {title, rating, releaseDate, runtime, genres, poster, description, comments, isWatchlist, isWatched, isFavorites} = card;

  const watchlistClassName = getActiveClass(isWatchlist);
  const watchedClassName = getActiveClass(isWatched);
  const favoriteClassName = getActiveClass(isFavorites);
  const releaseDateYear = helpersDate.releaseTrimmdDate(releaseDate);
  const durationMovie = getDurationMovie(runtime);

  return `
    <article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDateYear}</span>
        <span class="film-card__duration">${durationMovie}</span>
        <span class="film-card__genre">${genres.join(`, `)}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${replaceStrEndWithDots(description)}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
      </div>
    </article>
  `.trim();
};

export default class Card extends AbstractView {
  constructor(card) {
    super();
    this._card = card;

    this._elementClickHandler = this._elementClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createCardTemplate(this._card);
  }

  _elementClickHandler(evt) {
    evt.preventDefault();
    this._callback.elementClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setElementClickHandler(callback) {
    this._callback.elementClick = callback;
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._elementClickHandler);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._elementClickHandler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._elementClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }
}
