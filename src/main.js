import {render} from './utils/render.js';
import UserProfileView from './view/profile.js';
import MainNavContainerView from './view/main-navigation.js';
import FiltersView from './view/filters.js';
import StatsView from './view/stats.js';
import SortView from './view/sort.js';
import FilmsContainerView from './view/films-wrapper.js';
import MoviesView from './view/all-movies.js';
import ShowMoreButtonView from './view/show-more-btn.js';
import CardView from './view/card.js';
import TopRatedView from './view/top-rated.js';
import MostCommentedView from './view/most-commented.js';
import FooterStatsView from './view/footer-stats.js';
// import PopupView from './view/film-details-popup.js';


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

const filmsContainerComponent = new FilmsContainerView();
const AllMoviesViewComponent = new MoviesView();

render(header, new UserProfileView(historyCount).getElement(), `beforeend`);
render(main, new MainNavContainerView().getElement(), `beforeend`);

const mainNav = main.querySelector(`.main-navigation`);

render(mainNav, new FiltersView(filters).getElement(), `beforeend`);
render(mainNav, new StatsView().getElement(), `beforeend`);
render(main, new SortView().getElement(), `beforeend`);
render(main, filmsContainerComponent.getElement(), `beforeend`);

render(filmsContainerComponent.getElement(), AllMoviesViewComponent.getElement(), `beforeend`);
const filmListContainer = AllMoviesViewComponent.getElement().querySelector(`.films-list__container`);

const renderMovieCard = (moviesListElement, movieObject) => {
  const movieCardComponent = new CardView(movieObject);

  render(moviesListElement, movieCardComponent.getElement(), `beforeend`);
};


for (let i = 0; i < Math.min(data.length, CARDS_COUNT_PER_STEP); i += 1) {
  renderMovieCard(filmListContainer, data[i]);
}

// render(document.body, new PopupView(data[0]).getElement(), `beforeend`);

if (data.length > CARDS_COUNT_PER_STEP) {
  render(AllMoviesViewComponent.getElement(), new ShowMoreButtonView().getElement(), `beforeend`);
  const loadMoreButton = AllMoviesViewComponent.getElement().querySelector(`.films-list__show-more`);
  let renderTemplateedCardCount = CARDS_COUNT_PER_STEP;

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    data
      .slice(renderTemplateedCardCount, renderTemplateedCardCount + CARDS_COUNT_PER_STEP)
      .forEach((card) => render(filmListContainer, new CardView(card).getElement(), `beforeend`));

    renderTemplateedCardCount += CARDS_COUNT_PER_STEP;

    if (renderTemplateedCardCount >= data.length) {
      loadMoreButton.remove();
    }
  });
}

render(filmsContainerComponent.getElement(), new TopRatedView().getElement(), `beforeend`);
render(filmsContainerComponent.getElement(), new MostCommentedView().getElement(), `beforeend`);

const topRated = filmsContainerComponent.getElement().querySelector(`.films-list--top-rated`);
const mostCommented = filmsContainerComponent.getElement().querySelector(`.films-list--most-commented`);

for (let i = 0; i < CARDS_EXTRA_AMOUNT; i += 1) {
  renderMovieCard(topRated.querySelector(`.films-list__container`), data[i]);
  renderMovieCard(mostCommented.querySelector(`.films-list__container`), data[i]);
}

const footerStats = document.querySelector(`.footer__statistics`);
render(footerStats, new FooterStatsView(data.length).getElement(), `beforeend`);
