import {render, RenderPosition} from './utils/render.js';
import MainNavContainerView from './view/main-navigation.js';
import StatsView from './view/stats.js';
import FooterStatsView from './view/footer-stats.js';

import {generateMovieObject} from './mocks/card.js';

import MoviesBoardPresenter from './presenter/movies-list.js';
import FilterPresenter from './presenter/filter.js';
import ProfilePresenter from './presenter/profile.js';

import MoviesModel from './model/movies.js';
import FilterModel from './model/filter.js';
import CommentsModel from './model/comments.js';

const CARDS_AMOUNT = 5;

const data = new Array(CARDS_AMOUNT).fill().map(generateMovieObject);

// console.log(data);
const moviesModel = new MoviesModel();
const filtersModel = new FilterModel();
const commentsModel = new CommentsModel();
moviesModel.movies = data;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

new ProfilePresenter(headerElement, moviesModel).init();
render(mainElement, new MainNavContainerView(), RenderPosition.BEFOREEND);

const mainNav = mainElement.querySelector(`.main-navigation`);

new FilterPresenter(mainNav, filtersModel, moviesModel).init();
render(mainNav, new StatsView(), RenderPosition.BEFOREEND);

new MoviesBoardPresenter(mainElement, moviesModel, filtersModel, commentsModel).init();

const footerStats = document.querySelector(`.footer__statistics`);
render(footerStats, new FooterStatsView(data.length), RenderPosition.BEFOREEND);
