import he from "he";
import SmartView from "./smart";
import {emotions} from "../consts";

const getEmotion = (emotion) => {
  return emotion !== ``
    ? createEmotionTemplate(emotion)
    : ``;
};

const createEmotionTemplate = (emotion) => `<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">`;

const createInputEmotionTemplate = emotions.map((emotion) => `
  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}">
  <label class="film-details__emoji-label" for="emoji-${emotion}">
    <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
  </label>`).join(``);

const createUserMessageTemplate = (messageUser) => {
  const {emotion, comment} = messageUser;
  return `
    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">${getEmotion(emotion)}</div>
      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(comment)}</textarea>
      </label>
      <div class="film-details__emoji-list">
        ${createInputEmotionTemplate}
      </div>
    </div>
  `.trim();
};

export default class MessageUser extends SmartView {
  constructor() {
    super();

    this._data = {
      emotion: ``,
      comment: ``,
      date: null,
    };

    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._emojiListClickHandler = this._emojiListClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
  }

  getTemplate() {
    return createUserMessageTemplate(this._data);
  }

  getNewDate() {
    return Object.assign(
        {},
        this._data,
        {
          date: new Date().toISOString()
        }
    );
  }

  getMessageUserTextarea() {
    return this.getElement().querySelector(`.film-details__comment-input`);
  }

  _commentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      comment: evt.target.value
    }, true);
  }

  _emojiListClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      emotion: evt.target.value
    });
  }

  _formSubmitHandler(evt) {
    if (evt.ctrlKey && evt.key === `Enter`) {
      evt.preventDefault();
      this._callback.formSubmit(this._data);
    }
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`keydown`, this._formSubmitHandler);
  }

  restoreHandlers() {
    const element = this.getElement();
    element.querySelector(`.film-details__comment-input`).addEventListener(`input`, this._commentInputHandler);
    element.querySelector(`.film-details__emoji-list`).addEventListener(`change`, this._emojiListClickHandler);
    element.addEventListener(`keydown`, this._formSubmitHandler);
  }
}

