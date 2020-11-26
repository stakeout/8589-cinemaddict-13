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
import {createFilmDetailsPopupTemplate} from './view/film-details-popup.js';


import {generateMovieObject} from './mocks/card.js';
import {generateFilter} from "./mocks/filter.js";

const CARDS_AMOUNT = 27;
const CARDS_EXTRA_AMOUNT = 2;
const CARDS_COUNT_PER_STEP = 5;

const data = new Array(CARDS_AMOUNT).fill().map(generateMovieObject);
const filters = generateFilter(data);
const historyCount = filters.find((element) => element.name === `history`).count;
// console.log(historyCount);
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);

render(header, createProfileTemplate(historyCount), `beforeend`);
render(main, createMainNavTemplate(), `beforeend`);

const mainNav = main.querySelector(`.main-navigation`);

render(mainNav, createFilterItemsTemplate(filters), `beforeend`);
render(mainNav, createStatsTemplate(), `beforeend`);
render(main, createSortTemplate(), `beforeend`);
render(main, createFilmsContainerTemplate(), `beforeend`);

const filmsWrapper = main.querySelector(`.films`);
render(filmsWrapper, createAllMoviesTemplate(), `beforeend`);
const allMovies = filmsWrapper.querySelector(`.films-list--all-movies`);

for (let i = 1; i <= Math.min(data.length, CARDS_COUNT_PER_STEP); i += 1) {
  render(allMovies.querySelector(`.films-list__container`), createCardTemplate(data[i]), `beforeend`);
}

render(document.body, createFilmDetailsPopupTemplate(data[0]), `beforeend`);

if (data.length > CARDS_COUNT_PER_STEP) {
  render(allMovies, createShowMoreBtnTemplate(), `beforeend`);
  const loadMoreButton = allMovies.querySelector(`.films-list__show-more`);
  let renderedCardCount = CARDS_COUNT_PER_STEP;

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    data
      .slice(renderedCardCount, renderedCardCount + CARDS_COUNT_PER_STEP)
      .forEach((card) => render(allMovies.querySelector(`.films-list__container`), createCardTemplate(card), `beforeend`));

    renderedCardCount += CARDS_COUNT_PER_STEP;

    if (renderedCardCount >= data.length) {
      loadMoreButton.remove();
    }
  });
}

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
