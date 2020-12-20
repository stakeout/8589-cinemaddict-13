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
    this._setInnerHandlers();
  }

  _getTemplate() {
    return createAddCommentTemplate();
  }

  _emojiClickHandler(evt) {
    const emoji = evt.target.value;
    evt.preventDefault();
    this.updateData({
      emoji,
    });
    if (this._data.emoji) {
      this._renderEmojiIcon();
    }
  }

  _messageInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      commentText: evt.target.value,
    });
  }
  _renderEmojiIcon() {
    const container = this.getElement().querySelector(`.film-details__add-emoji-label`);
    const iconTemplate = `<img src="images/emoji/${this._data.emoji}.png" width="55" height="55" alt="emoji-${this._data.emoji}">`;
    container.innerHTML = iconTemplate;
  }
  _setInnerHandlers() {
    this.getElement()
        .querySelector(`.film-details__emoji-list`)
        .addEventListener(`change`, this._emojiClickHandler);
    this.getElement()
        .querySelector(`.film-details__comment-input`)
        .addEventListener(`input`, this._messageInputHandler);
  }
  restoreHandlers() {
    delete this._data.emoji;
    delete this._data.commentText;
    this._setInnerHandlers();
  }
}
