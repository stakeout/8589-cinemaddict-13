import {render, RenderPosition} from './utils/render.js';
import UserProfileView from './view/profile.js';
import MainNavContainerView from './view/main-navigation.js';
import FiltersView from './view/filters.js';
import StatsView from './view/stats.js';
import FooterStatsView from './view/footer-stats.js';

import {generateMovieObject} from './mocks/card.js';
// import {generateFilter} from './mocks/filter.js';

import MoviesBoardPresenter from './presenter/movies-list.js';

import MoviesModel from './model/movies.js';
import FilterModel from './model/filter.js';
import CommentsModel from './model/comments.js';

const CARDS_AMOUNT = 12;

const data = new Array(CARDS_AMOUNT).fill().map(generateMovieObject);
// const filters = generateFilter(data);
const filters = [
  {
    name: `all`
  },
  {
    name: `watchlist`,
    count: 10
  },
  {
    name: `history`,
    count: 4
  },
  {
    name: `favorites`,
    count: 3
  }
];
// const historyCount = filters.find((element) => element.name === `history`).count;
// console.log(data);
const moviesModel = new MoviesModel();
const filterModel = new FilterModel();
const commentsModel = new CommentsModel();
moviesModel.movies = data;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

render(headerElement, new UserProfileView(15), RenderPosition.BEFOREEND);
render(mainElement, new MainNavContainerView(), RenderPosition.BEFOREEND);

const mainNav = mainElement.querySelector(`.main-navigation`);

render(mainNav, new FiltersView(filters, filters[1].name), RenderPosition.BEFOREEND);
render(mainNav, new StatsView(), RenderPosition.BEFOREEND);

new MoviesBoardPresenter(mainElement, moviesModel, commentsModel).init();

const footerStats = document.querySelector(`.footer__statistics`);
render(footerStats, new FooterStatsView(data.length), RenderPosition.BEFOREEND);
