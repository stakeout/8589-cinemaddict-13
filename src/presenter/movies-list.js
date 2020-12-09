import {render, RenderPosition} from '../utils/render.js';
import SortView from '../view/sort.js';
import FilmsContainerView from '../view/films-wrapper.js';
import AllMoviesView from '../view/all-movies.js';
import MovieView from '../view/card.js';
import ShowMoreButtonView from '../view/show-more-btn.js';
import NoMoviesView from '../view/no-movies.js';
import PopupView from '../view/film-details-popup.js';

import TopRatedView from '../view/top-rated.js';
import MostCommentedView from '../view/most-commented.js';

const CARDS_COUNT_PER_STEP = 5;
const CARDS_EXTRA_AMOUNT = 2;

export default class MoviesList {
  constructor(parentContainer) {
    this._containerElement = parentContainer;
    this._fimsContainerComponent = new FilmsContainerView();
    this._allMoviesComponent = new AllMoviesView();
    this._sortComponent = new SortView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._renderedCardsCount = CARDS_COUNT_PER_STEP;
    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
  }

  init(data) {
    this._data = data.slice();
    this._isCommentedMovies = data.filter((movie) => movie.comments.length > 0);
    this._isRatedMovies = data.filter((movie) => movie.totalRating > 0);
    this._renderBoard();
  }

  _renderMovieCard(container, movie) {
    const movieComponent = new MovieView(movie);
    const popupComponent = new PopupView(movie);

    movieComponent.setMovieCardClickHandler(popupComponent.renderPopup.bind(popupComponent));
    render(container.querySelector(`.films-list__container`), movieComponent, RenderPosition.BEFOREEND);
  }

  _renderMoviesList() {
    render(this._fimsContainerComponent, this._allMoviesComponent, RenderPosition.BEFOREEND);
    for (let i = 0; i < Math.min(this._data.length, this._renderedCardsCount); i += 1) {
      this._renderMovieCard(this._allMoviesComponent.getElement(), this._data[i]);
    }
    this._renderShowMoreBtn();
  }

  _handleShowMoreBtnClick() {
    this._data
    .slice(this._renderedCardsCount, this._renderedCardsCount + CARDS_COUNT_PER_STEP)
    .forEach((movie) => this._renderMovieCard(this._allMoviesComponent.getElement(), movie));

    this._renderedCardsCount += CARDS_COUNT_PER_STEP;

    if (this._renderedCardsCount >= this._data.length) {
      this._showMoreButtonComponent.getElement().remove();
      this._showMoreButtonComponent.removeElement();
    }
  }

  _renderShowMoreBtn() {
    if (this._data.length > CARDS_COUNT_PER_STEP) {
      render(this._allMoviesComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

      this._showMoreButtonComponent.setClickHandler(this._handleShowMoreBtnClick);
    }
  }

  _renderSort() {
    render(this._containerElement, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderNoMovies() {
    render(this._fimsContainerComponent, new NoMoviesView(), RenderPosition.BEFOREEND);
  }

  _renderMostCommented() {
    if (!this._isCommentedMovies.length) {
      return;
    }
    const mostCommentedComponent = new MostCommentedView(this._isCommentedMovies);
    render(this._fimsContainerComponent, mostCommentedComponent, RenderPosition.BEFOREEND);
    mostCommentedComponent
      .getSortedData()
      .slice(0, CARDS_EXTRA_AMOUNT)
      .forEach((movie) => {
        this._renderMovieCard(mostCommentedComponent.getElement(), movie);
      });
  }

  _renderTopRated() {
    if (!this._isRatedMovies.length) {
      return;
    }
    const topRatedComponent = new TopRatedView(this._isRatedMovies);
    render(this._fimsContainerComponent, topRatedComponent, RenderPosition.BEFOREEND);
    topRatedComponent
      .getSortedData()
      .slice(0, CARDS_EXTRA_AMOUNT)
      .forEach((movie) => {
        this._renderMovieCard(topRatedComponent.getElement(), movie);
      });
  }

  _renderBoard() {
    if (this._data.length > 0) {
      this._renderSort();
      render(this._containerElement, this._fimsContainerComponent, RenderPosition.BEFOREEND);
      this._renderMoviesList();
      this._renderTopRated();
      this._renderMostCommented();
    } else {
      render(this._containerElement, this._fimsContainerComponent, RenderPosition.BEFOREEND);
      this._renderNoMovies();
    }
  }
}
