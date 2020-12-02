import {createElement} from '../utils/render.js';

const createFilmsContainerTemplate = () => (
  `<section class="films"></section>`
);

export default class FilmsContainer {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createFilmsContainerTemplate();
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
