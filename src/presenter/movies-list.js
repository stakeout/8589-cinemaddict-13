import {render, RenderPosition, remove} from '../utils/render.js';
import SortView from '../view/sort.js';
import FilmsContainerView from '../view/films-wrapper.js';
import AllMoviesView from '../view/all-movies.js';
import ShowMoreButtonView from '../view/show-more-btn.js';
import NoMoviesView from '../view/no-movies.js';

import TopRatedView from '../view/top-rated.js';
import MostCommentedView from '../view/most-commented.js';

import MoviePresenter from './movie.js';
// import ProfilePresenter from './profile.js';

import {sortMoviesByDate, sortMoviesByRating} from '../utils/common.js';
import {SortType, UpdateType, UserAction} from '../utils/const.js';
import {filter} from "../utils/filter.js";

const CARDS_COUNT_PER_STEP = 5;
const CARDS_EXTRA_AMOUNT = 2;

// const headerElement = document.querySelector(`.header`);

export default class MoviesList {
  constructor(parentContainer, moviesModel, filtersModel, commentsModel) {
    this._containerElement = parentContainer;
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;
    this._filtersModel = filtersModel;
    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._fimsContainerComponent = new FilmsContainerView();
    this._allMoviesComponent = new AllMoviesView();
    this._noMoviesComponent = new NoMoviesView();
    this._renderedCardsCount = CARDS_COUNT_PER_STEP;
    this._moviePresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
    // this._handleMovieChange = this._handleMovieChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderBoard();
  }

  _getMovies() {
    const filterType = this._filtersModel.getFilter();
    const movies = this._moviesModel.movies;
    const filtredMovies = filter[filterType](movies);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredMovies.sort(sortMoviesByDate);
      case SortType.RATING:
        return filtredMovies.sort(sortMoviesByRating);
    }

    return filtredMovies;
  }

  _handleViewAction(actionType, updateType, updatedObject) {
    // console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE:
        this._moviesModel.updateMovie(updateType, updatedObject);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, updatedObject);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, updatedObject);
        break;
    }
  }

  _handleModelEvent(updateType, updatedMovieObject) {
    // console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._moviePresenter[updatedMovieObject.id].init(updatedMovieObject);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this._clearMoviesList();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this._clearMoviesList({resetRenderedCardsCount: true, resetSortType: true});
        this._renderBoard();
        break;
    }
  }
  _renderMovie(container, movie) {
    const moviePresenter = new MoviePresenter(container, this._handleViewAction, this._moviesModel);
    moviePresenter.init(movie);
    this._moviePresenter[movie.id] = moviePresenter;
  }

  _renderMoviesList(movies) {
    movies.forEach((movie) => this._renderMovie(this._allMoviesComponent.getElement(), movie));
  }

  _handleShowMoreBtnClick() {
    const moviesCount = this._getMovies().length;
    const newRenderedMoviesCount = Math.min(moviesCount, this._renderedCardsCount + CARDS_COUNT_PER_STEP);
    const movies = this._getMovies().slice(this._renderedCardsCount, newRenderedMoviesCount);

    this._renderMoviesList(movies);
    this._renderedCardsCount = newRenderedMoviesCount;

    if (this._renderedCardsCount >= moviesCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreBtn() {
    if (this._loadMoreButtonComponent !== null) {
      this._loadMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreBtnClick);
    render(this._allMoviesComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearMoviesList();
    this._renderBoard();
  }
  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._containerElement, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderNoMovies() {
    render(this._fimsContainerComponent, this._noMoviesComponent, RenderPosition.BEFOREEND);
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
        this._renderMovie(mostCommentedComponent.getElement(), movie);
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
        this._renderMovie(topRatedComponent.getElement(), movie);
      });
  }

  _clearMoviesList({resetRenderedCardsCount = false, resetSortType = false} = {}) {
    const moviesAmount = this._getMovies().length;

    Object
      .values(this._moviePresenter)
      .forEach((presenter) => presenter.destroy());

    this._moviePresenter = {};

    remove(this._sortComponent);
    remove(this._allMoviesComponent);
    remove(this._noMoviesComponent);
    remove(this._showMoreButtonComponent);

    if (resetRenderedCardsCount) {
      this._renderedCardsCount = CARDS_COUNT_PER_STEP;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this._renderedCardsCount = Math.min(moviesAmount, this._renderedCardsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard() {
    const movies = this._getMovies();
    const moviesAmount = movies.length;

    if (moviesAmount === 0) {
      render(this._containerElement, this._fimsContainerComponent, RenderPosition.BEFOREEND);
      this._renderNoMovies();
      return;
    }

    this._renderSort();
    render(this._containerElement, this._fimsContainerComponent, RenderPosition.BEFOREEND);
    render(this._fimsContainerComponent, this._allMoviesComponent, RenderPosition.BEFOREEND);
    this._renderMoviesList(movies.slice(0, Math.min(moviesAmount, this._renderedCardsCount)));

    if (moviesAmount > this._renderedCardsCount) {
      this._renderShowMoreBtn();
    }
    // this._renderTopRated();
    // this._renderMostCommented();
  }
}
