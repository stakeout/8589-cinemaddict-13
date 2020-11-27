import {createElement} from '../utils/render.js';

const createTopRatedTemplate = () => {
  return `
    <section class="films-list films-list--extra films-list--top-rated">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container">
      </div>
    </section>
  `.trim();
};

export default class TopRated {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createTopRatedTemplate();
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
