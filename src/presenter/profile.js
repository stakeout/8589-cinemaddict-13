import ProfileView from '../view/profile.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
// import {UserAction, UpdateType} from '../utils/const.js';


export default class Profile {
  constructor(container, updateType = ``) {
    this._container = container;
    this._updateType = updateType;
    this._profileComponent = null;
  }

  init(count) {
    this._prevProfileComponent = this._profileComponent;
    this._profileComponent = new ProfileView(count);

    if (this._prevProfileComponent === null) {
      render(this._container, this._profileComponent, RenderPosition.BEFOREEND);
      return;
    }
  }

  update(count, update) {
    this._updateType = update;
    this._currentProfileComponent = this._profileComponent;
    this._profileComponent = new ProfileView(count);

    if (this._updateType !== ``) {
      replace(this._profileComponent, this._currentProfileComponent);
    }
    remove(this._prevProfileComponent);
  }
}
