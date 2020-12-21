import AbstractView from './abstract.js';
import {SortType} from "../utils/const.js";

const createSortTemplate = (currentSortType) => {
  return `
    <ul class="sort">
      <li><a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? `sort__button--active` : ``}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button ${currentSortType === SortType.DATE ? `sort__button--active` : ``}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button ${currentSortType === SortType.RATING ? `sort__button--active` : ``}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
    </ul>
  `.trim();
};

export default class Sort extends AbstractView {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }
  _getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    const {target} = evt;
    if (target.tagName !== `A`) {
      return;
    }
    evt.preventDefault();

    const currentActiveElem = this.getElement().querySelector(`.sort__button--active`);

    this._callback.sortTypeChange(target.dataset.sortType);

    if (!target.classList.contains(`.sort__button--active`)) {
      currentActiveElem.classList.remove(`sort__button--active`);
      target.classList.add(`sort__button--active`);
    }
  }

  setSortTypeChangeHandler(cb) {
    this._callback.sortTypeChange = cb;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
