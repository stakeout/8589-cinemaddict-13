import AbstractView from './abstract.js';

const createTopRatedTemplate = () => {
  return `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container">
      </div>
    </section>
  `.trim();
};

export default class TopRated extends AbstractView {
  constructor(data) {
    super();
    this._data = data.slice();
  }
  _getTemplate() {
    return createTopRatedTemplate();
  }
}
