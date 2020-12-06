import AbstractView from './abstract.js';

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

export default class Comment extends AbstractView {
  constructor(comment) {
    super();
    this._comment = comment;
    this._deleteHandler = this._deleteHandler.bind(this);
  }

  _getTemplate() {
    return createCommentItemTemplate(this._comment);
  }

  _deleteHandler({target}) {
    const counter = document.querySelector(`.film-details__comments-count`);
    const commentItem = target.closest(`.film-details__comment`);
    commentItem.remove();
    counter.textContent -= 1;
  }

  setCommentDeleteHandler() {
    // this._callback.delete = cb;
    this.getElement()
        .querySelector(`.film-details__comment-delete`)
        .addEventListener(`click`, this._deleteHandler);
    this.removeElement();
  }
}

