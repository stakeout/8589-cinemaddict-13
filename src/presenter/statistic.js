import StatsView from "../view/stats";
import {render, remove, RenderPosition} from "../utils/render";

export default class Statistic {
  constructor(statsContainer, filmsModel) {
    this._statsContainer = statsContainer;
    this._filmsModel = filmsModel;

    this._statsComponent = null;
    this._renderStats = this._renderStats.bind(this);
  }

  init() {
    const films = this._filmsModel.getFilms();

    if (this._statsComponent === null) {
      this._statsComponent = new StatsView(films);
      this._renderStats();
      this._statsComponent.restoreHandlers();

    } else {
      remove(this._statsComponent);
      this._statsComponent = null;
    }
  }

  destroy() {
    remove(this._statsComponent);
  }

  _renderStats() {
    render(this._statsContainer, this._statsComponent, RenderPosition.BEFOREEND);
  }
}
