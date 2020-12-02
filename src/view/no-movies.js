import {createElement} from '../utils/render.js';

const createNoMoviesTemplate = () => {
  return `
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
  `.trim();
};

export default class NoMovies {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createNoMoviesTemplate();
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
