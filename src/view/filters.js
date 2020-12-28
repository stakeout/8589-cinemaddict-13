import AbstractView from './abstract.js';

const createFilterItemTemplate = ({name, count}, currentFilterType) => {
  const upperName = name[0].toUpperCase() + name.slice(1);
  const isDefaulFilter = name === `all` ? true : false;
  const filterName = isDefaulFilter ? `${upperName} movies` : upperName;
  const counterElement = `<span class="main-navigation__item-count">${count}</span>`;

  return `<a
            href="#${name}"
            class="main-navigation__item ${name === currentFilterType ? `main-navigation__item--active` : ``}">
              ${filterName}
              ${!isDefaulFilter ? counterElement : ``}
            </a>`;
};

const createFiltersTemplate = (filters, currentFilterType) => {
  const filterItems = filters.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join(``);
  return `
    <div class="main-navigation__items">
      ${filterItems}
    </div>
  `.trim();
};

export default class Filters extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  _getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.hash);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
  }
}
