import {createElement} from '../utils/render.js';

const createMostCommentedTemplate = () => {
  return `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container"></div>
    </section>
  `.trim();
};

export default class MostCommented {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createMostCommentedTemplate();
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
