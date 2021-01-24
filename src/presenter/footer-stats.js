import FooterStatisticsView from "../view/footer-statistics";
import {render, replace, remove, RenderPosition} from "../utils/render";

export default class FooterStats {
  constructor(footerStatisticsContainer, filmsModel) {
    this._footerStatisticsContainer = footerStatisticsContainer;
    this._filmsModel = filmsModel;

    this._footerStatisticsComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevFooterStatisticsComponent = this._footerStatisticsComponent;


    this._footerStatisticsComponent = new FooterStatisticsView(this._filmsModel.getFilms());

    if (prevFooterStatisticsComponent === null) {
      render(this._footerStatisticsContainer, this._footerStatisticsComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._footerStatisticsComponent, prevFooterStatisticsComponent);
    remove(prevFooterStatisticsComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
