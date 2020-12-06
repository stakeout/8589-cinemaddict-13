import {render, RenderPosition} from './utils/render.js';
import UserProfileView from './view/profile.js';
import MainNavContainerView from './view/main-navigation.js';
import FiltersView from './view/filters.js';
import StatsView from './view/stats.js';
import SortView from './view/sort.js';
import FilmsContainerView from './view/films-wrapper.js';
import CardView from './view/card.js';
import MoviesView from './view/all-movies.js';
import ShowMoreButtonView from './view/show-more-btn.js';
import TopRatedView from './view/top-rated.js';
import MostCommentedView from './view/most-commented.js';
import FooterStatsView from './view/footer-stats.js';
import PopupView from './view/film-details-popup.js';
import NoMoviesView from './view/no-movies.js';

import {generateMovieObject} from './mocks/card.js';
import {generateFilter} from "./mocks/filter.js";

const CARDS_AMOUNT = 17;
const CARDS_EXTRA_AMOUNT = 2;
const CARDS_COUNT_PER_STEP = 5;

const data = new Array(CARDS_AMOUNT).fill().map(generateMovieObject);
const filters = generateFilter(data);
const historyCount = filters.find((element) => element.name === `history`).count;
// console.log(data);

// additional sections
const isCommentedMovies = data.some((movie) => movie.comments.length > 0);
const isRatedMovies = data.some((movie) => movie.totalRating > 0);

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

const filmsContainerComponent = new FilmsContainerView();
const allMoviesComponent = new MoviesView();
// const popupComponent = new PopupView(data);

render(headerElement, new UserProfileView(historyCount), RenderPosition.BEFOREEND);
render(mainElement, new MainNavContainerView(), RenderPosition.BEFOREEND);

const mainNav = mainElement.querySelector(`.main-navigation`);

render(mainNav, new FiltersView(filters), RenderPosition.BEFOREEND);
render(mainNav, new StatsView(), RenderPosition.BEFOREEND);

const renderMovieCard = (moviesListElement, movieObject) => {
  const movieCardComponent = new CardView(movieObject);

  movieCardComponent.setMovieCardClickHandler(new PopupView(data).init);

  render(moviesListElement, movieCardComponent, RenderPosition.BEFOREEND);
};

if (data.length > 0) {
  render(mainElement, new SortView(), RenderPosition.BEFOREEND);
  render(mainElement, filmsContainerComponent, RenderPosition.BEFOREEND);
  render(filmsContainerComponent, allMoviesComponent, RenderPosition.BEFOREEND);
  const filmListContainer = allMoviesComponent.getElement().querySelector(`.films-list__container`);

  for (let i = 0; i < Math.min(data.length, CARDS_COUNT_PER_STEP); i += 1) {
    renderMovieCard(filmListContainer, data[i]);
  }

  if (data.length > CARDS_COUNT_PER_STEP) {
    const loadMoreButton = new ShowMoreButtonView();

    render(allMoviesComponent, loadMoreButton, RenderPosition.BEFOREEND);
    let renderTemplateCardCount = CARDS_COUNT_PER_STEP;

    loadMoreButton.setClickHandler(() => {
      data
        .slice(renderTemplateCardCount, renderTemplateCardCount + CARDS_COUNT_PER_STEP)
        .forEach((card) => renderMovieCard(filmListContainer, card));

      renderTemplateCardCount += CARDS_COUNT_PER_STEP;

      if (renderTemplateCardCount >= data.length) {
        loadMoreButton.getElement().remove();
        loadMoreButton.removeElement();
      }
    });
  }

  if (isRatedMovies) {
    const topRatedComponent = new TopRatedView(data);
    render(filmsContainerComponent, topRatedComponent, RenderPosition.BEFOREEND);
    for (let i = 0; i < CARDS_EXTRA_AMOUNT; i += 1) {
      renderMovieCard(topRatedComponent.getElement().querySelector(`.films-list__container`), data[i]);
    }

  }
  if (isCommentedMovies) {
    const moviesWithComments = data.filter((movie) => movie.comments.length > 0);
    const mostCommentedComponent = new MostCommentedView(moviesWithComments);
    render(filmsContainerComponent, mostCommentedComponent, RenderPosition.BEFOREEND);

    for (let i = 0; i < CARDS_EXTRA_AMOUNT; i += 1) {
      renderMovieCard(mostCommentedComponent.getElement().querySelector(`.films-list__container`), data[i]);
    }
  }

} else {
  render(mainElement, filmsContainerComponent, RenderPosition.BEFOREEND);
  render(filmsContainerComponent, new NoMoviesView(), RenderPosition.BEFOREEND);
}

const footerStats = document.querySelector(`.footer__statistics`);
render(footerStats, new FooterStatsView(data.length), RenderPosition.BEFOREEND);
