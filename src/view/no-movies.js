import AbstractView from './abstract.js';

const createNoMoviesTemplate = () => {
  return `
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
  `.trim();
};

export default class NoMovies extends AbstractView {

  _getTemplate() {
    return createNoMoviesTemplate();
  }
}
