import {createElement} from '../utils/render.js';

const createShowMoreBtnTemplate = () => (
  `<button class="films-list__show-more">Show more</button>`
);

export default class ShowMoreButton {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createShowMoreBtnTemplate();
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
