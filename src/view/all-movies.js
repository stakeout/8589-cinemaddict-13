import AbstractView from './abstract.js';

const createAllMoviesTemplate = () => {
  return `
    <section class="films-list films-list--all-movies">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>
  `.trim();
};

export default class Movies extends AbstractView {

  _getTemplate() {
    return createAllMoviesTemplate();
  }
}
