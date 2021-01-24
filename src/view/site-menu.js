import AbstractView from "./abstract";
import {FilterType, MenuStats} from "../consts";
const createFilterTemplate = ({name, count}, currentFilterType, currentStatusPage) => {
  const nameUpperLetter = name[0].toUpperCase() + name.slice(1);
  const filterName = name === FilterType.ALL
    ? `${nameUpperLetter} movies`
    : nameUpperLetter;
  const isCount = (name !== FilterType.ALL)
    ? `<span class="main-navigation__item-count">${count}</span>`
    : ``;
  return `<a
            href="#${name}"
            class="main-navigation__item ${name === currentFilterType && currentStatusPage === MenuStats.MOVIES ? `main-navigation__item--active` : ``}"
            data-type="${name}">
              ${filterName} ${isCount}
          </a>`;
};

const createSiteMenuTemplate = (filterItems, currentFilterType, currentStatusPage) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterTemplate(filter, currentFilterType, currentStatusPage))
    .join(``);

  return `
    <nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterItemsTemplate}
      </div>
      <a
        href="#stats"
        class="main-navigation__additional ${currentStatusPage === MenuStats.STATISTICS ? `main-navigation__additional--active` : ``}">
          Stats
      </a>
    </nav>
  `.trim();
};

export default class SiteMenu extends AbstractView {
  constructor(filters, currentFilterType, currentStatusPage) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._currentStatusPage = currentStatusPage;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._statsClickHandler = this._statsClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filters, this._currentFilter, this._currentStatusPage);
  }

  _filterTypeChangeHandler(evt) {
    const {target} = evt;
    if (target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(target.dataset.type);
  }

  _statsClickHandler(evt) {
    evt.preventDefault();
    this._callback.statsClick();
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelector(`.main-navigation__items`).addEventListener(`click`, this._filterTypeChangeHandler);
  }

  setStatsClickHandler(callback) {
    this._callback.statsClick = callback;
    this.getElement().querySelector(`[href="#stats"]`).addEventListener(`click`, this._statsClickHandler);
  }
}
