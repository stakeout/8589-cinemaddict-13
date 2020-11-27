import {createElement} from '../utils/render.js';

const createFooterStatsTemplate = (count) => {
  return `<p>${count} movies inside</p>`;
};

export default class FooterStats {
  constructor(filmsLength) {
    this._element = null;
    this._filmsAmount = filmsLength;
  }

  _getTemplate() {
    return createFooterStatsTemplate(this._filmsAmount);
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
