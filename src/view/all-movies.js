import {createElement} from '../utils/render.js';

const createAllMoviesTemplate = () => {
  return `
    <section class="films-list films-list--all-movies">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>
  `.trim();
};

export default class Movies {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createAllMoviesTemplate();
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
