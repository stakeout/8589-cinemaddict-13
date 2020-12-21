import {render, RenderPosition, remove} from '../utils/render.js';
import SortView from '../view/sort.js';
import FilmsContainerView from '../view/films-wrapper.js';
import AllMoviesView from '../view/all-movies.js';
import ShowMoreButtonView from '../view/show-more-btn.js';
import NoMoviesView from '../view/no-movies.js';

import TopRatedView from '../view/top-rated.js';
import MostCommentedView from '../view/most-commented.js';

import MoviePresenter from './movie.js';
import {updateItem, sortMoviesByDate, sortMoviesByRating} from "../utils/common.js";
import {SortType} from "../utils/const.js";

const CARDS_COUNT_PER_STEP = 5;
const CARDS_EXTRA_AMOUNT = 2;

export default class MoviesList {
  constructor(parentContainer, moviesModel) {
    this._containerElement = parentContainer;
    this._moviesModel = moviesModel;
    this._fimsContainerComponent = new FilmsContainerView();
    this._allMoviesComponent = new AllMoviesView();
    this._sortComponent = new SortView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._renderedCardsCount = CARDS_COUNT_PER_STEP;
    this._moviePresenter = {};
    this._currentSortType = SortType.DEFAULT;
    // this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
    this._handleMovieChange = this._handleMovieChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(data) {
    this._data = data.slice();
    this._defaultData = data.slice();
    this._isCommentedMovies = data.filter((movie) => movie.comments.length > 0);
    this._isRatedMovies = data.filter((movie) => movie.totalRating > 0);
    this._renderBoard();
  }
  _getMovies() {
    return this._moviesModel.movies;
  }
  _handleMovieChange(updatedMovie) {
    this._data = updateItem(this._data, updatedMovie);
    this._moviePresenter[updatedMovie.id].movieUpdate(updatedMovie); // ???
  }

  _renderMovieCard(container, movie) {
    const moviePresenter = new MoviePresenter(container, this._handleMovieChange);
    moviePresenter.init(movie);
    this._moviePresenter[movie.id] = moviePresenter;
  }

  _renderMoviesList() {
    // render(this._fimsContainerComponent, this._allMoviesComponent, RenderPosition.BEFOREEND);
    const length = this._data.length;
    for (let i = 0; i < Math.min(length, this._renderedCardsCount); i += 1) {
      this._renderMovieCard(this._allMoviesComponent.getElement(), this._data[i]);
    }
    this._renderShowMoreBtn();
  }

  // _handleModeChange() {
  //   Object
  //     .values(this._moviePresenter)
  //     .forEach((presenter) => presenter.resetView());
  // }

  _clearMoviesList() {
    Object
      .values(this._moviePresenter)
      .forEach((presenter) => presenter.destroy());
    this._moviePresenter = {};
    this._renderedCardsCount = CARDS_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
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
  _sortMovies(sortType) {

    switch (sortType) {
      case SortType.DATE:
        this._data.sort(sortMoviesByDate);
        break;
      case SortType.RATING:
        this._data.sort(sortMoviesByRating);
        break;
      default:
        this._data = this._defaultData.slice();
    }

    this._currentSortType = sortType;
  }
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortMovies(sortType);
    this._clearMoviesList();
    this._renderMoviesList();
  }
  _renderSort() {
    render(this._containerElement, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
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
      render(this._fimsContainerComponent, this._allMoviesComponent, RenderPosition.BEFOREEND);
      this._renderMoviesList();
      // this._renderTopRated();
      // this._renderMostCommented();
    } else {
      render(this._containerElement, this._fimsContainerComponent, RenderPosition.BEFOREEND);
      this._renderNoMovies();
    }
  }
}
