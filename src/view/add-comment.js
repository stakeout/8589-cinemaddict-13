import SmartView from './smart.js';

const emojies = [`smile`, `sleeping`, `puke`, `angry`];

const emojiTemplate = (emoji) => {
  return `
    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="${emoji}">
    </label>
  `.trim();
};

const createEmojiesTemplate = (arrayOfEmojies) => {
  return arrayOfEmojies.map(emojiTemplate).join(``);
};

const createAddCommentTemplate = () => {
  const emojieTemplate = createEmojiesTemplate(emojies);

  return `
    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label"></div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
      </label>

      <div class="film-details__emoji-list">
        ${emojieTemplate}
      </div>
    </div>
  `.trim();
};

export default class Comment extends SmartView {
  constructor() {
    super();
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._messageInputHandler = this._messageInputHandler.bind(this);
    this._addCommentHandler = this._addCommentHandler.bind(this);

  }

  _getTemplate() {
    return createAddCommentTemplate();
  }

  _emojiClickHandler(evt) {
    evt.preventDefault();
    this._callback.emojiClick(evt);
  }
  _messageInputHandler(evt) {
    evt.preventDefault();
    this._callback.messageInput(evt);
  }
  _addCommentHandler(evt) {
    this._callback.addComment(evt);
  }
  setEmojiClickHandler(cb) {
    this._callback.emojiClick = cb;
    this.getElement()
    .querySelector(`.film-details__emoji-list`)
    .addEventListener(`change`, this._emojiClickHandler);
  }
  setMessageInputHandler(cb) {
    this._callback.messageInput = cb;
    this.getElement()
        .querySelector(`.film-details__comment-input`)
        .addEventListener(`input`, this._messageInputHandler);
  }
  setAddCommentHandler(cb) {
    this._callback.addComment = cb;
    this.getElement()
        .querySelector(`.film-details__comment-input`)
        .addEventListener(`keydown`, this._addCommentHandler);
  }
}
