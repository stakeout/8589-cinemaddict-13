import {render, RenderPosition} from './utils/render.js';
import UserProfileView from './view/profile.js';
import MainNavContainerView from './view/main-navigation.js';
import FiltersView from './view/filters.js';
import StatsView from './view/stats.js';
import FooterStatsView from './view/footer-stats.js';

import {generateMovieObject} from './mocks/card.js';
import {generateFilter} from './mocks/filter.js';

import MoviesBoardPresenter from './presenter/movies-list.js';

const CARDS_AMOUNT = 12;
const CARDS_EXTRA_AMOUNT = 2;

const data = new Array(CARDS_AMOUNT).fill().map(generateMovieObject);
const filters = generateFilter(data);
const historyCount = filters.find((element) => element.name === `history`).count;
// console.log(data);

// additional sections
const isCommentedMovies = data.some((movie) => movie.comments.length > 0);
const isRatedMovies = data.some((movie) => movie.totalRating > 0);

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

// const popupComponent = new PopupView(data);

render(headerElement, new UserProfileView(historyCount), RenderPosition.BEFOREEND);
render(mainElement, new MainNavContainerView(), RenderPosition.BEFOREEND);

const mainNav = mainElement.querySelector(`.main-navigation`);

render(mainNav, new FiltersView(filters), RenderPosition.BEFOREEND);
render(mainNav, new StatsView(), RenderPosition.BEFOREEND);

new MoviesBoardPresenter(mainElement).init(data);
// if (isRatedMovies) {
//   const topRatedComponent = new TopRatedView(data);
//   render(filmsContainerComponent, topRatedComponent, RenderPosition.BEFOREEND);
//   for (let i = 0; i < CARDS_EXTRA_AMOUNT; i += 1) {
//     renderMovieCard(topRatedComponent.getElement().querySelector(`.films-list__container`), data[i]);
//   }

// }
// if (isCommentedMovies) {
//   const moviesWithComments = data.filter((movie) => movie.comments.length > 0);
//   const mostCommentedComponent = new MostCommentedView(moviesWithComments);
//   render(filmsContainerComponent, mostCommentedComponent, RenderPosition.BEFOREEND);

//   for (let i = 0; i < CARDS_EXTRA_AMOUNT; i += 1) {
//     renderMovieCard(mostCommentedComponent.getElement().querySelector(`.films-list__container`), data[i]);
//   }
// }
const footerStats = document.querySelector(`.footer__statistics`);
render(footerStats, new FooterStatsView(data.length), RenderPosition.BEFOREEND);
