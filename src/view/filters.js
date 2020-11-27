import {createElement} from '../utils/render.js';

const createFilterItemTemplate = ({name, count}) => {
  return `<a href="#${name}" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`;
};

const createFiltersTemplate = (filters) => {
  const filterItems = filters.map(createFilterItemTemplate).join(``);
  return `
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${filterItems}
    </div>
  `.trim();
};

export default class Filters {
  constructor(filters) {
    this._element = null;
    this._filters = filters;
  }

  _getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
