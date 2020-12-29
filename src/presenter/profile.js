import ProfileView from '../view/profile.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';

export default class Profile {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._profileComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
  }

  init() {
    const count = this._moviesModel.movies.filter((element) => element.isWatched).length;
    this._prevProfileComponent = this._profileComponent;
    this._profileComponent = new ProfileView(count);

    if (this._prevProfileComponent === null) {
      render(this._container, this._profileComponent, RenderPosition.BEFOREEND);
      return;
    }
    if (this._container.contains(this._prevProfileComponent.getElement())) {
      replace(this._profileComponent.getElement(), this._prevProfileComponent.getElement());
    }
    remove(this._prevProfileComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
