import SmartView from './smart.js';
import {dayjs, formatDurationTime} from '../utils/common.js';

const createGenreTemplate = (genre) => {
  return `<span class="film-details__genre">${genre}</span>`;
};

const createGenres = (genresArray) => {
  return genresArray.map(createGenreTemplate).join(``);
};

const createFilmDetailsPopupTemplate = (movieObject) => {
  const {
    title,
    poster,
    genre,
    totalRating,
    releaseDate,
    duration,
    description,
    ageRating,
    originalTitle,
    producer,
    screenwriters,
    country,
    isInWatchList,
    isWatched,
    isFavorite,
  } = movieObject;

  const writers = screenwriters.join(`, `);
  const genres = createGenres(genre);
  const formatedReleaseDate = dayjs(releaseDate).format(`DD MMMM YYYY`);

  return `
    <section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="${title}">

              <p class="film-details__age">${ageRating}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${originalTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${producer}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${formatedReleaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${formatDurationTime(duration)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row" data-type="genres">
                  <td class="film-details__term">${genre.length > 1 ? `Genres` : `Genre`}</td>
                  <td class="film-details__cell">
                    ${genres}
                  </td>
                </tr>
              </table>
              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isInWatchList ? `checked` : ``}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments
              <span class="film-details__comments-count">0</span>
            </h3>
            <ul class="film-details__comments-list"></ul>
          </section>
        </div>
      </form>
    </section>
  `.trim();
};

export default class Popup extends SmartView {
  constructor(movie) {
    super();
    this._movie = movie;
    this._closeBtnClickHandler = this._closeBtnClickHandler.bind(this);
    this._isInWatchListClickHandler = this._isInWatchListClickHandler.bind(this);
    this._isWatchedClickHandler = this._isWatchedClickHandler.bind(this);
    this._isFavoriteClickHandler = this._isFavoriteClickHandler.bind(this);
  }

  _getTemplate() {
    return createFilmDetailsPopupTemplate(this._movie);
  }

  _closeBtnClickHandler() {
    this._callback.closeBtnClick();
  }
  _isInWatchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.isInWatchListClick();
  }

  _isWatchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.isWatchedClick();
  }

  _isFavoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.isFavoriteClick();
  }

  setIsInWatchListClickHandler(cb) {
    this._callback.isInWatchListClick = cb;
    this.getElement().querySelector(`#watchlist`).addEventListener(`change`, this._isInWatchListClickHandler);
  }

  setIsWatchedClickHandler(cb) {
    this._callback.isWatchedClick = cb;
    this.getElement().querySelector(`#watched`).addEventListener(`change`, this._isWatchedClickHandler);
  }
  setIsFavoriteClickHandler(cb) {
    this._callback.isFavoriteClick = cb;
    this.getElement().querySelector(`#favorite`).addEventListener(`change`, this._isFavoriteClickHandler);
  }
  setCloseBtnClickHandler(cb) {
    this._callback.closeBtnClick = cb;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeBtnClickHandler);
  }
}
