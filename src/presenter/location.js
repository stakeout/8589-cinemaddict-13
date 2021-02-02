import SortView from "../view/sort";
import FilmsView from "../view/films";
import FilmsListView from "../view/films-list";
import FilmsContainerView from "../view/films-list-container";
import ButtonShowView from "../view/button-show-more";
import ListEmptyView from "../view/list-empty";
import LoadingView from "../view/loading";
import {render, RenderPosition, remove} from "../utils/render";
import {filter} from "../utils/filter";
import MoviePresenter from "./movie";
import TopRatedPresenter from "./top-rated";
import MostCommentedPresenter from "./most-commented";
import {sortDate, sortRating} from "../utils/helper";
import {SortType, UpdateType, UserAction, FilmCount, FilmListHeader} from "../consts";

export default class Location {
  constructor(locationContainer, filmsModel, filterModel, commentsModel, api) {
    this._locationContainer = locationContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;
    this._renderedCardCount = FilmCount.PER_STEP;
    this._moviePresenter = {};
    this._topRatedPresenter = null;
    this._mostCommentedPresenter = null;
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;
    this._api = api;
    this._sortComponent = null;
    this._filmsComponent = new FilmsView();

    this._filmsListComponent = new FilmsListView(FilmListHeader.ALL_MOVIES);
    this._filmsContainerComponent = new FilmsContainerView();
    this._listEmptyComponent = new ListEmptyView(FilmListHeader.NO_MOVIES);
    this._showMoreButtonComponent = null;


    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._renderLocation();
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort(sortDate);

      case SortType.RATING:
        return filtredFilms.sort(sortRating);
    }
    return filtredFilms;
  }

  destroy() {
    this._clearLocation({resetRenderedFilmCount: true, resetSortType: true});

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearLocation({resetRenderedFilmCount: true});
    this._destroyTopRatedPresenter();
    this._destroyMostCommentedPresenter();
    this._renderLocation();
  }

  _renderSortFilms() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._locationContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsListWrap() {
    render(this._locationContainer, this._filmsComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsListAll() {
    render(this._filmsComponent, this._filmsListComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsListContainer() {
    render(this._filmsListComponent, this._filmsContainerComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsCard(card, containerComponent) {
    const moviePresenter = new MoviePresenter(containerComponent, this._handleViewAction, this._filmsModel, this._filterModel, this._commentsModel, this._api);
    moviePresenter.init(card);
    this._moviePresenter[card.id] = moviePresenter;
  }

  _renderFilmsCards(films) {
    films.forEach((film) => this._renderFilmsCard(film, this._filmsContainerComponent));
  }

  _renderListEmpty() {
    render(this._filmsListComponent, this._listEmptyComponent, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    this._loadingComponent = new LoadingView(FilmListHeader.LOADING);
    render(this._filmsListComponent, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _handleViewAction(actionType, updateType, update, typeFilter) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        const newUpdateType = this._filterModel.getFilter() === typeFilter ?
          UpdateType.MINOR : updateType;
        this._api.updateMovie(update).then((response) => {
          this._filmsModel.updateFilm(newUpdateType, response);
        });
        break;
    }
  }

  _handleModelEvent(updateType, updatedMovie) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._destroyTopRatedPresenter();
        this._destroyMostCommentedPresenter();
        if (this._moviePresenter[updatedMovie.id] !== undefined) {
          this._moviePresenter[updatedMovie.id].init(updatedMovie);
        }
        this._renderTopRated();
        this._renderMostCommented();
        break;

      case UpdateType.MINOR:
        this._clearLocation();
        this._renderLocation();
        break;

      case UpdateType.MAJOR:
        this._clearLocation({resetRenderedFilmCount: true, resetSortType: true});
        this._renderLocation();
        break;

      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderLocation();
        break;
    }
  }

  _handleShowMoreButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedCardCount = Math.min(filmCount, this._renderedCardCount + FilmCount.PER_STEP);
    const films = this._getFilms().slice(this._renderedCardCount, newRenderedCardCount);
    this._renderFilmsCards(films);
    this._renderedCardCount = newRenderedCardCount;
    if (this._renderedCardCount >= filmCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ButtonShowView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _destroyTopRatedPresenter() {
    if (this._topRatedPresenter !== null) {
      this._topRatedPresenter.destroy();
      this._topRatedPresenter = null;
    }
  }

  _destroyMostCommentedPresenter() {
    if (this._mostCommentedPresenter !== null) {
      this._mostCommentedPresenter.destroy();
      this._mostCommentedPresenter = null;
    }
  }

  _clearLocation({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._moviePresenter)
      .forEach((presenter) => presenter.destroy());
    this._moviePresenter = {};
    this._destroyTopRatedPresenter();
    this._destroyMostCommentedPresenter();
    remove(this._sortComponent);
    // remove(this._filmsComponent);
    // remove(this._filmsListComponent);
    // remove(this._filmsContainerComponent);
    remove(this._listEmptyComponent);
    remove(this._loadingComponent);
    remove(this._showMoreButtonComponent);

    if (resetRenderedFilmCount) {
      this._renderedCardCount = FilmCount.PER_STEP;
    } else {
      this._renderedCardCount = Math.min(filmCount, this._renderedCardCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderComponents() {
    this._renderFilmsListWrap();
    this._renderFilmsListAll();
  }

  _renderLocation() {
    const films = this._getFilms();
    const filmCount = this._getFilms().length;

    if (this._isLoading) {
      this._renderComponents();
      this._renderLoading();
      return;
    }

    if (!this._getFilms().length) {
      this._renderComponents();
      this._renderListEmpty();
      return;
    }

    this._renderSortFilms();
    this._renderFilmsListWrap();

    this._renderFilmsListAll();
    this._renderFilmsListContainer();

    this._renderFilmsCards(films.slice(0, Math.min(filmCount, this._renderedCardCount)));
    if (filmCount > this._renderedCardCount) {
      this._renderShowMoreButton();
    }
    this._renderTopRated();
    this._renderMostCommented();
  }

  _renderTopRated() {
    this._topRatedPresenter = new TopRatedPresenter(this._filmsComponent, this._filmsModel, this._api, this._commentsModel, this._filterModel);
    this._topRatedPresenter.init();
  }

  _renderMostCommented() {
    this._mostCommentedPresenter = new MostCommentedPresenter(this._filmsComponent, this._filmsModel, this._api, this._commentsModel, this._filterModel);
    this._mostCommentedPresenter.init();
  }
}
