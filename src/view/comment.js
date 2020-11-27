import {createElement} from '../utils/render.js';

const createCommentItemTemplate = (comment) => {
  const {author, emoji, dateCreation, comment: text} = comment;
  return `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${dateCreation}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>
  `.trim();
};

const createCommentsListTemplate = (commentsArray) => {
  return commentsArray.map(createCommentItemTemplate).join(``);
};

export default class Comments {
  constructor(commentsArray) {
    this._element = null;
    this._comments = commentsArray;
  }

  _getTemplate() {
    return createCommentsListTemplate(this._comments);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

