import FilterView from "../view/site-menu";
import {render, RenderPosition, replace, remove} from "../utils/render";
import {filter} from "../utils/filter";
import {FilterType, UpdateType, MenuStats} from "../consts";

export default class Filter {
  constructor(filterContainer, filterModel, filmsModel, changeMenuState) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._changeMenuState = changeMenuState;
    this._currentFilter = null;
    this._filterComponent = null;

    this._currentStatusPage = MenuStats.MOVIES;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleStatsClick = this._handleStatsClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._currentFilter, this._currentStatusPage);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    this._filterComponent.setStatsClickHandler(this._handleStatsClick);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType && this._currentStatusPage === MenuStats.MOVIES) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
    this._changeMenuState(MenuStats.MOVIES);
    this._currentStatusPage = MenuStats.MOVIES;
    this.init();
  }

  _handleStatsClick() {
    this._changeMenuState(MenuStats.STATISTICS);
    this._currentStatusPage = MenuStats.STATISTICS;
    this.init();
  }


  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        name: FilterType.ALL,
      },
      {
        name: FilterType.WATCHLIST,
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        name: FilterType.HISTORY,
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        name: FilterType.FAVORITES,
        count: filter[FilterType.FAVORITES](films).length,
      },

    ];
  }
}
