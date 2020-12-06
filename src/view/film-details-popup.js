import AbstractView from './abstract.js';
import {dayjs, formatDurationTime} from '../utils/common.js';
import {render, RenderPosition} from '../utils/render.js';
import CommentView from './comment.js';

const mainElement = document.querySelector(`.main`);

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
    comments,
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
              <img class="film-details__poster-img" src="./images/posters/${poster}" alt="${title}">

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
              <span class="film-details__comments-count">${comments.length}</span>
            </h3>
            <ul class="film-details__comments-list"></ul>
            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>
  `.trim();
};

export default class Popup extends AbstractView {
  constructor(data) {
    super();
    this._data = data.slice();
    this._escHandler = this._escHandler.bind(this);
    this._closeBtnClickHandler = this._closeBtnClickHandler.bind(this);
    this.init = this.init.bind(this);
  }

  _getTemplate() {
    return createFilmDetailsPopupTemplate(this._movie);
  }
  _closePopup() {
    const popupElement = mainElement.querySelector(`.film-details`);
    if (mainElement.contains(popupElement)) {
      mainElement.removeChild(popupElement);
    }
    document.body.classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, this._escHandler);
  }
  _escHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._closePopup();
    }
  }
  _closeBtnClickHandler() {
    this._closePopup();
  }
  _getCloseBtn() {
    return this.getElement().querySelector(`.film-details__close-btn`);
  }
  _renderCommentsList() {
    const comments = this._movie.comments;
    const counter = document.querySelector(`.film-details__comments-count`);
    counter.textContent = comments.length;
    const commentsListElement = this.getElement().querySelector(`.film-details__comments-list`);
    commentsListElement.innerHTML = ``;

    comments.forEach((comment) => {
      const commentComponent = new CommentView(comment);
      render(commentsListElement, commentComponent, RenderPosition.BEFOREEND);
      commentComponent.setCommentDeleteHandler();
    });
  }
  _renderPopup({target}) {
    const isPopup = mainElement.querySelector(`.film-details`);

    if (mainElement.contains(isPopup)) {
      mainElement.removeChild(isPopup);
      this.removeElement();
    }

    const id = target.closest(`.film-card`).dataset.id;
    this._movie = this._data.find((elem) => elem.id === `${id}`);

    mainElement.appendChild(this.getElement());
    document.body.classList.add(`hide-overflow`);


    this._renderCommentsList();
    this._getCloseBtn().addEventListener(`click`, this._closeBtnClickHandler);
    document.addEventListener(`keydown`, this._escHandler);
  }

  init(evt) {
    this._renderPopup(evt);
  }
}
