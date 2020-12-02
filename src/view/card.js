import {dayjs, formatDurationTime} from '../utils/common.js';
import AbstractView from './abstract.js';

const MAX_STR_LENGTH = 140;

const replaceStrEndWithDots = (str) => {
  return (str.length > MAX_STR_LENGTH) ? str.substring(0, MAX_STR_LENGTH - 1).trim() + `...` : str;
};

const createCardTemplate = (movieObject) => {
  const {
    title,
    poster,
    genre,
    totalRating,
    releaseDate,
    duration,
    description,
    comments,
    isInWatchList,
    isWatched,
    isFavorite,
  } = movieObject;

  const descriptionText = replaceStrEndWithDots(description);
  const formatedReleaseDate = dayjs(releaseDate).format(`YYYY`);

  return `
    <article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${formatedReleaseDate}</span>
        <span class="film-card__duration">${formatDurationTime(duration)}</span>
        <span class="film-card__genre">${genre.slice(0, 1)}</span>
      </p>
      <img src="./images/posters/${poster}" alt="${title}" class="film-card__poster">
      <p class="film-card__description">${descriptionText}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isInWatchList ? `film-card__controls-item--active` : ``}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isWatched ? `film-card__controls-item--active` : ``}" type="button">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavorite ? `film-card__controls-item--active` : ``}" type="button">Mark as favorite</button>
      </div>
    </article>
  `.trim();
};

export default class Card extends AbstractView {
  constructor(cardObject) {
    super();
    this._card = cardObject;
  }

  _getTemplate() {
    return createCardTemplate(this._card);
  }
}
