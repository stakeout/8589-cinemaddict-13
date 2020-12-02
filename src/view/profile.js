const showUserStatus = (num) => {
  if (num === 0) {
    return false;
  } else if (num <= 10) {
    return `Novice`;
  } else if (num <= 20) {
    return `Fan`;
  } else {
    return `Movie Buff`;
  }
};

import {createElement} from '../utils/render.js';

const createProfileTemplate = (historyCount) => {
  const userRating = showUserStatus(historyCount);

  return `
    <section class="header__profile profile">
      ${userRating ? `<p class="profile__rating">${userRating}</p>` : ``}
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `.trim();
};

export default class UserProfile {
  constructor(whatchedFilmsCount) {
    this._element = null;
    this._whatchedFilmsCount = whatchedFilmsCount;
  }

  _getTemplate() {
    return createProfileTemplate(this._whatchedFilmsCount);
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
