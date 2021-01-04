import {render, RenderPosition} from './utils/render.js';
import {UpdateType} from './utils/const.js';
import MainNavContainerView from './view/main-navigation.js';
import StatsView from './view/stats.js';
import FooterStatsView from './view/footer-stats.js';

import MoviesBoardPresenter from './presenter/movies-list.js';
import FilterPresenter from './presenter/filter.js';
import ProfilePresenter from './presenter/profile.js';

import MoviesModel from './model/movies.js';
import FilterModel from './model/filter.js';
// import CommentsModel from './model/comments.js';

import Api from './api.js';

// const AUTHORIZATION = `Basic fgh7et5kb90ga8`;
// const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;

const api = new Api();

const moviesModel = new MoviesModel();
const filtersModel = new FilterModel();
// const commentsModel = new CommentsModel();

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

new ProfilePresenter(headerElement, moviesModel).init();
render(mainElement, new MainNavContainerView(), RenderPosition.BEFOREEND);

const mainNav = mainElement.querySelector(`.main-navigation`);

new FilterPresenter(mainNav, filtersModel, moviesModel).init();
render(mainNav, new StatsView(), RenderPosition.BEFOREEND);

new MoviesBoardPresenter(mainElement, moviesModel, filtersModel).init();

const footerStats = document.querySelector(`.footer__statistics`);
render(footerStats, new FooterStatsView(moviesModel.movies.length), RenderPosition.BEFOREEND);

api.movies
  .then((movies) => {
    // console.log(movies);
    moviesModel.setMovies(UpdateType.INIT, movies);
  })
  .catch(() => {
    moviesModel.setMovies(UpdateType.INIT, []);
  });
