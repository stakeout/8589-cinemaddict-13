import {render} from './utils/render.js';
import {createProfileTemplate} from './view/profile.js';
import {createMainNavTemplate} from './view/main-navigation.js';
import {createFilterItemsTemplate} from './view/filters.js';
import {createStatsTemplate} from './view/stats.js';
import {createSortTemplate} from './view/sort.js';
import {createFilmsContainerTemplate} from './view/films-wrapper.js';
import {createAllMoviesTemplate} from './view/all-movies.js';
import {createShowMoreBtnTemplate} from './view/show-more-btn.js';
import {createCardTemplate} from './view/card.js';
import {createTopRatedTemplate} from './view/top-rated.js';
import {createMostCommentedTemplate} from './view/most-commented.js';
import {createFooterStatsTemplate} from './view/footer-stats.js';

import {generateMovieObject} from './mocks/card.js';

const CARDS_AMOUNT = 12;
const CARDS_EXTRA_AMOUNT = 2;

const data = new Array(CARDS_AMOUNT).fill().map(generateMovieObject);

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);

render(header, createProfileTemplate(), `beforeend`);
render(main, createMainNavTemplate(), `beforeend`);

const mainNav = main.querySelector(`.main-navigation`);

render(mainNav, createFilterItemsTemplate(), `beforeend`);
render(mainNav, createStatsTemplate(), `beforeend`);
render(main, createSortTemplate(), `beforeend`);
render(main, createFilmsContainerTemplate(), `beforeend`);

const filmsWrapper = main.querySelector(`.films`);
render(filmsWrapper, createAllMoviesTemplate(), `beforeend`);
const allMovies = filmsWrapper.querySelector(`.films-list--all-movies`);
render(allMovies, createShowMoreBtnTemplate(), `beforeend`);

data.forEach((movie) => {
  render(allMovies.querySelector(`.films-list__container`), createCardTemplate(movie), `beforeend`);
});

render(filmsWrapper, createTopRatedTemplate(), `beforeend`);
render(filmsWrapper, createMostCommentedTemplate(), `beforeend`);

const topRated = filmsWrapper.querySelector(`.films-list--top-rated`);
const mostCommented = filmsWrapper.querySelector(`.films-list--most-commented`);

for (let i = 0; i < CARDS_EXTRA_AMOUNT; i += 1) {
  render(topRated.querySelector(`.films-list__container`), createCardTemplate(data[i]), `beforeend`);
  render(mostCommented.querySelector(`.films-list__container`), createCardTemplate(data[i]), `beforeend`);
}

const footerStats = document.querySelector(`.footer__statistics`);
render(footerStats, createFooterStatsTemplate(), `beforeend`);
