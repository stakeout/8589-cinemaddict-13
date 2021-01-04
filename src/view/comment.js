import AbstractView from './abstract.js';
import {remove} from '../utils/render.js';
import {dayjs} from '../utils/common.js';

const createCommentItemTemplate = (commentItem) => {
  const {author, emotion, date, comment} = commentItem;
  return `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${dayjs(date).fromNow()}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>
  `.trim();
};

export default class Comment extends AbstractView {
  constructor(comment, counter) {
    super();
    this._comment = comment;
    this._commentsCounter = counter;
    this._deleteHandler = this._deleteHandler.bind(this);
  }

  _getTemplate() {
    return createCommentItemTemplate(this._comment);
  }

  _deleteHandler(evt) {
    evt.preventDefault();
    remove(this);
    this._commentsCounter.textContent -= 1;
  }

  setCommentDeleteHandler(cb) {
    this._callback.deleteClick = cb;
    this.getElement()
        .querySelector(`.film-details__comment-delete`)
        .addEventListener(`click`, this._deleteHandler);
  }
}

