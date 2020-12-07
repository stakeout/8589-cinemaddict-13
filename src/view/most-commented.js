import AbstractView from './abstract.js';

const createMostCommentedTemplate = () => {
  return `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container"></div>
    </section>
  `.trim();
};

export default class MostCommented extends AbstractView {
  constructor(data) {
    super();
    this._data = data.slice();
  }
  _getSortedData() {
    const moviesSortedByCommentsCount = this._data.sort((a, b) => b.comments.length - a.comments.length);
    return moviesSortedByCommentsCount;
  }
  _getTemplate() {
    return createMostCommentedTemplate();
  }
}
