import AbstractView from "./abstract";
import {SortType} from "../consts";
const createSortTemplate = (currentSortType) => {
  return `
    <ul class="sort">
      <li>
        <a
          href="#"
          class="sort__button ${currentSortType === SortType.DEFAULT ? `sort__button--active` : ``}"
          data-type="${SortType.DEFAULT}">
            Sort by default
        </a>
      </li>
      <li>
        <a
          href="#"
          class="sort__button ${currentSortType === SortType.DATE ? `sort__button--active` : ``}"
          data-type="${SortType.DATE}">
            Sort by date
        </a>
      </li>
      <li>
        <a
          href="#"
          class="sort__button ${currentSortType === SortType.RATING ? `sort__button--active` : ``}"
          data-type="${SortType.RATING}">
            Sort by rating
        </a>
      </li>
    </ul>
  `.trim();
};

export default class Sort extends AbstractView {

  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    const {target} = evt;
    if (target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(target.dataset.type);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}

