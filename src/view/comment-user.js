import he from "he";
import AbstractView from "./abstract";
import {helpersDate} from "../utils/helper";
const createCommentUserTemplate = (message) => {
  const {author, emotion, comment, date} = message;

  const commentDate = helpersDate.releaseCommentDate(date);
  return `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${commentDate}</span>
          <button type="button" class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>
  `.trim();
};

export default class CommentUser extends AbstractView {
  constructor(comment) {
    super();
    this._comment = comment;
    this._commentDeleteBtnHandler = this._commentDeleteBtnHandler.bind(this);
  }

  getTemplate() {
    return createCommentUserTemplate(this._comment);
  }

  getCommentText() {
    return this.getElement().querySelector(`.film-details__comment-text`);
  }

  _commentDeleteBtnHandler(evt) {
    evt.preventDefault();
    evt.target.textContent = `Deleting...`;
    evt.target.disabled = true;
    this._comment.delete = true;
    this._comment.deletion = `deletion`;
    this._callback.commentDeleteBtn();
  }

  setCommentDeleteBtnHandler(callback) {
    this._callback.commentDeleteBtn = callback;
    this.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, this._commentDeleteBtnHandler);
  }
}
