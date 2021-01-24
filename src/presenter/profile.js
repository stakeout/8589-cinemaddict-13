import ProfileView from "../view/profile";
import {render, replace, remove, RenderPosition} from '../utils/render';

export default class Profile {
  constructor(profileContainer, filmsModel) {
    this._profileContainer = profileContainer;
    this._filmsModel = filmsModel;
    this._profileComponent = null;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevProfileComponent = this._profileComponent;
    this._profileComponent = new ProfileView(this._filmsModel.getFilms());

    if (prevProfileComponent === null) {
      render(this._profileContainer, this._profileComponent, RenderPosition.BEFOREEND);
      return;
    }
    replace(this._profileComponent, prevProfileComponent);
    remove(prevProfileComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
