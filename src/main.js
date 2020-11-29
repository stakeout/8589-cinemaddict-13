import {render, RenderPosition} from './utils/render.js';
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
import PopupView from './view/film-details-popup.js';
import NoMoviesView from './view/no-movies.js';
import CommentView from './view/comment.js';


import {generateMovieObject} from './mocks/card.js';
import {generateFilter} from "./mocks/filter.js";

const CARDS_AMOUNT = 17;
const CARDS_EXTRA_AMOUNT = 2;
const CARDS_COUNT_PER_STEP = 5;

const data = new Array(CARDS_AMOUNT).fill().map(generateMovieObject);
const filters = generateFilter(data);
const historyCount = filters.find((element) => element.name === `history`).count;
// console.log(data);
const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);

const filmsContainerComponent = new FilmsContainerView();
const AllMoviesComponent = new MoviesView();
const topRatedComponent = new TopRatedView();
const mostCommentedComponent = new MostCommentedView();

render(headerElement, new UserProfileView(historyCount).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new MainNavContainerView().getElement(), RenderPosition.BEFOREEND);

const mainNav = mainElement.querySelector(`.main-navigation`);

render(mainNav, new FiltersView(filters).getElement(), RenderPosition.BEFOREEND);
render(mainNav, new StatsView().getElement(), RenderPosition.BEFOREEND);

const closePopup = () => {
  const popupElement = mainElement.querySelector(`.film-details`);
  if (mainElement.contains(popupElement)) {
    mainElement.removeChild(popupElement);
  }
  document.body.classList.remove(`hide-overflow`);
  document.removeEventListener(`keydown`, popupEscPressHandler);
};

const popupEscPressHandler = (evt) => {
  if (evt.key === `Escape` || evt.key === `Esc`) {
    closePopup();
  }
};

const popupCloseBtnClickHandler = () => {
  closePopup();
};

const renderCommentsList = (popupElement, comments) => {
  comments.forEach((comment) => {
    const commentComponent = new CommentView(comment);
    render(popupElement.getElement().querySelector(`.film-details__comments-list`), commentComponent.getElement(), RenderPosition.BEFOREEND);
  });
};

const renderPopup = (movie) => {
  return () => {
    const popupComponent = new PopupView(movie);
    mainElement.appendChild(popupComponent.getElement());
    document.body.classList.add(`hide-overflow`);
    const closeBtn = popupComponent.getElement().querySelector(`.film-details__close-btn`);

    renderCommentsList(popupComponent, movie.comments);
    closeBtn.addEventListener(`click`, popupCloseBtnClickHandler);
    document.addEventListener(`keydown`, popupEscPressHandler);
  };
};

const renderMovieCard = (moviesListElement, movieObject) => {
  const movieCardComponent = new CardView(movieObject);
  const movieTitle = movieCardComponent.getElement().querySelector(`.film-card__title`);
  const movieComments = movieCardComponent.getElement().querySelector(`.film-card__comments`);
  const moviePoster = movieCardComponent.getElement().querySelector(`.film-card__poster`);

  moviePoster.addEventListener(`click`, renderPopup(movieObject));
  movieTitle.addEventListener(`click`, renderPopup(movieObject));
  movieComments.addEventListener(`click`, renderPopup(movieObject));

  render(moviesListElement, movieCardComponent.getElement(), RenderPosition.BEFOREEND);
};

if (data.length > 0) {
  render(mainElement, new SortView().getElement(), RenderPosition.BEFOREEND);
  render(mainElement, filmsContainerComponent.getElement(), RenderPosition.BEFOREEND);
  render(filmsContainerComponent.getElement(), AllMoviesComponent.getElement(), RenderPosition.BEFOREEND);
  const filmListContainer = AllMoviesComponent.getElement().querySelector(`.films-list__container`);

  for (let i = 0; i < Math.min(data.length, CARDS_COUNT_PER_STEP); i += 1) {
    renderMovieCard(filmListContainer, data[i]);
  }

  if (data.length > CARDS_COUNT_PER_STEP) {
    render(AllMoviesComponent.getElement(), new ShowMoreButtonView().getElement(), RenderPosition.BEFOREEND);
    const loadMoreButton = AllMoviesComponent.getElement().querySelector(`.films-list__show-more`);
    let renderTemplateedCardCount = CARDS_COUNT_PER_STEP;

    loadMoreButton.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      data
        .slice(renderTemplateedCardCount, renderTemplateedCardCount + CARDS_COUNT_PER_STEP)
        .forEach((card) => render(filmListContainer, new CardView(card).getElement(), RenderPosition.BEFOREEND));

      renderTemplateedCardCount += CARDS_COUNT_PER_STEP;

      if (renderTemplateedCardCount >= data.length) {
        loadMoreButton.remove();
      }
    });
  }

  render(filmsContainerComponent.getElement(), topRatedComponent.getElement(), RenderPosition.BEFOREEND);
  render(filmsContainerComponent.getElement(), mostCommentedComponent.getElement(), RenderPosition.BEFOREEND);

  for (let i = 0; i < CARDS_EXTRA_AMOUNT; i += 1) {
    renderMovieCard(topRatedComponent.getElement().querySelector(`.films-list__container`), data[i]);
    renderMovieCard(mostCommentedComponent.getElement().querySelector(`.films-list__container`), data[i]);
  }
} else {
  render(mainElement, filmsContainerComponent.getElement(), RenderPosition.BEFOREEND);
  render(filmsContainerComponent.getElement(), new NoMoviesView().getElement(), RenderPosition.BEFOREEND);
}

const footerStats = document.querySelector(`.footer__statistics`);
render(footerStats, new FooterStatsView(data.length).getElement(), RenderPosition.BEFOREEND);
