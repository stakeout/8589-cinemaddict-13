import {createElement} from '../utils/render.js';

const createMainNavTemplate = () => {
  return `<nav class="main-navigation"></nav>`;
};

export default class MainNavContainer {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createMainNavTemplate();
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
