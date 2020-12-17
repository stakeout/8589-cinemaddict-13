import SmartView from './abstract.js';

const emojies = [`smile`, `sleeping`, `puke`, `angry`];

const emojiTemplate = (emoji) => {
  return `
    <input class="film-details__emoji-item visually-hidden" name="comment-${emoji}" type="radio" id="emoji-${emoji}" value="${emoji}">
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

  _getTemplate() {
    return createAddCommentTemplate(this._comment);
  }
}
